const express = require('express');
const User = require('../models/User');
const Work = require('../models/Work');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

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
    const users = await readUsers();
    
    // Map to public user info
    const publicUsers = users.map(user => ({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatar || '',
      isVerified: user.isVerified || false,
      createdAt: user.createdAt
    }));
    
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
    const { page = 1, limit = 12 } = req.query;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Kullanıcının eserlerini getir
    const works = await Work.find({ 
      author: user._id, 
      isPublished: true 
    })
    .populate('category', 'name color')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const totalWorks = await Work.countDocuments({ 
      author: user._id, 
      isPublished: true 
    });

    res.json({
      success: true,
      user: user.getPublicProfile(),
      works: works.map(work => work.getPublicData()),
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(totalWorks / limit),
        total: totalWorks
      }
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

// @route   POST /api/users/follow/:userId
// @desc    Kullanıcıyı takip et
// @access  Private
router.post('/follow/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Kendinizi takip edemezsiniz'
      });
    }

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Zaten takip ediliyor mu kontrol et
    if (req.user.following.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Bu kullanıcıyı zaten takip ediyorsunuz'
      });
    }

    // Takip et
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { following: userId }
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { followers: req.user._id }
    });

    res.json({
      success: true,
      message: 'Kullanıcı takip edildi'
    });

  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Takip işlemi sırasında hata oluştu'
    });
  }
});

// @route   DELETE /api/users/unfollow/:userId
// @desc    Kullanıcı takibini bırak
// @access  Private
router.delete('/unfollow/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Takip ediliyor mu kontrol et
    if (!req.user.following.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Bu kullanıcıyı takip etmiyorsunuz'
      });
    }

    // Takibi bırak
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { following: userId }
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { followers: req.user._id }
    });

    res.json({
      success: true,
      message: 'Takip bırakıldı'
    });

  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Takip bırakma işlemi sırasında hata oluştu'
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

    const user = await User.findById(userId)
      .populate({
        path: 'followers',
        select: 'username fullName avatar isVerified',
        options: {
          limit: limit * 1,
          skip: (page - 1) * limit
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    res.json({
      success: true,
      followers: user.followers,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(user.followers.length / limit),
        total: user.followers.length
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

    const user = await User.findById(userId)
      .populate({
        path: 'following',
        select: 'username fullName avatar isVerified',
        options: {
          limit: limit * 1,
          skip: (page - 1) * limit
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    res.json({
      success: true,
      following: user.following,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(user.following.length / limit),
        total: user.following.length
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















