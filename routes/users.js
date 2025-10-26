const express = require('express');
const { mockUsers, mockWorks } = require('../mock-data');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const fs = require('fs').promises;
const path = require('path');
const User = require('../models/User');
const router = express.Router();

console.log('🔍 routes/users.js yüklendi, mockUsers sayısı:', mockUsers.length);
console.log('🔍 mockUsers array:', mockUsers);

// Read users from JSON file
const readUsers = async () => {
  try {
    const filePath = path.join(__dirname, '../data/users.json');
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
};

// @route   GET /api/users
// @desc    Tüm kullanıcıları getir (public info only)
// @access  Public
router.get('/', async (req, res) => {
  try {
    let users = [];
    
    console.log('🔍 /api/users endpoint çağrıldı');
    console.log('🔍 mockUsers array:', mockUsers);
    console.log('🔍 mockUsers length:', mockUsers.length);
    
    // MongoDB'den kullanıcıları çek
    try {
      users = await User.find({}, '-password').lean();
      console.log('📊 MongoDB\'den kullanıcılar alındı:', users.length);
      
      // MongoDB'de kullanıcı yoksa mock data kullan
      if (users.length === 0) {
        console.log('⚠️ MongoDB\'de kullanıcı yok, mock data kullanılıyor');
        users = mockUsers;
        console.log('📊 Mock data kullanıcı sayısı:', users.length);
      }
    } catch (mongoError) {
      console.log('⚠️ MongoDB hatası, mock data kullanılıyor:', mongoError.message);
      users = mockUsers;
      console.log('📊 Mock data kullanıcı sayısı:', users.length);
    }
    
    // Map to public user info
    const publicUsers = users.map(user => ({
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatar || '',
      isVerified: user.isVerified || false,
      isActive: user.isActive !== false, // isActive field'ı ekle
      followers: user.followers || [],
      following: user.following || [],
      createdAt: user.createdAt
    }));
    
    console.log('📊 Public users sayısı:', publicUsers.length);
    
    res.json({
      success: true,
      users: publicUsers
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcılar alınırken hata oluştu'
    });
  }
});

// @route   GET /api/users/profile/:username
// @desc    Kullanıcı profilini getir
// @access  Public
router.get('/profile/:username', optionalAuth, async (req, res) => {
  try {
    const { username } = req.params;
    
    // Mock data'dan kullanıcıyı bul
    const users = mockUsers;
    let user = users.find(u => u.username === username);
    
    // Username yoksa email'den türet
    if (!user) {
      user = users.find(u => {
        const emailUsername = u.email?.split('@')[0];
        return emailUsername === username || u.email === username;
      });
    }
    
    // ID ile ara
    if (!user && /^\d+$/.test(username)) {
      user = users.find(u => u._id === username);
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }
    
    // Kullanıcının eserlerini getir
    const userWorks = mockWorks.filter(work => work.author._id === user._id);
    
    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio || '',
        avatar: user.avatar || '',
        followers: user.followers || [],
        following: user.following || [],
        savedWorks: user.savedWorks || [],
        isVerified: user.isVerified || false,
        createdAt: user.createdAt
      },
      works: userWorks
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Profil bilgileri alınırken hata oluştu'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Profil güncelle
// @access  Private
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { fullName, bio, location, website, socialLinks } = req.body;
    
    const updateData = {};
    
    if (fullName) updateData.fullName = fullName;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (website !== undefined) updateData.website = website;
    if (socialLinks) updateData.socialLinks = { ...req.user.socialLinks, ...socialLinks };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profil güncellendi',
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Profil güncellenirken hata oluştu'
    });
  }
});

// @route   GET /api/users/followers/:userId
// @desc    Kullanıcının takipçilerini getir
// @access  Public
router.get('/followers/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const user = mockUsers.find(u => u._id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Followers array'inden kullanıcı bilgilerini getir
    const followerIds = user.followers || [];
    const followers = followerIds.map(id => {
      const follower = mockUsers.find(u => u._id === id);
      if (follower) {
        return {
          _id: follower._id,
          username: follower.username,
          fullName: follower.fullName,
          avatar: follower.avatar || '',
          isVerified: follower.isVerified || false
        };
      }
      return null;
    }).filter(Boolean);

    res.json({
      success: true,
      followers,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(followers.length / limit),
        total: followers.length
      }
    });

  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({
      success: false,
      message: 'Takipçiler alınırken hata oluştu'
    });
  }
});

// @route   GET /api/users/following/:userId
// @desc    Kullanıcının takip ettiklerini getir
// @access  Public
router.get('/following/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const user = mockUsers.find(u => u._id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Following array'inden kullanıcı bilgilerini getir
    const followingIds = user.following || [];
    const following = followingIds.map(id => {
      const followedUser = mockUsers.find(u => u._id === id);
      if (followedUser) {
        return {
          _id: followedUser._id,
          username: followedUser.username,
          fullName: followedUser.fullName,
          avatar: followedUser.avatar || '',
          isVerified: followedUser.isVerified || false
        };
      }
      return null;
    }).filter(Boolean);

    res.json({
      success: true,
      following,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(following.length / limit),
        total: following.length
      }
    });

  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({
      success: false,
      message: 'Takip edilenler alınırken hata oluştu'
    });
  }
});

module.exports = router;















