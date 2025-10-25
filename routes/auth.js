const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Mock database (imported from server.js)
let users, categories, works, currentUserId;

// Initialize mock data
router.use((req, res, next) => {
  const { mockUsers, mockCategories, mockWorks } = require('../mock-data');
  users = users || [...mockUsers];
  categories = categories || [...mockCategories];
  works = works || [...mockWorks];
  currentUserId = currentUserId || 1;
  next();
});

// Simple token generation
const generateToken = (userId) => {
  return jwt.sign(
    { userId: userId },
    process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_in_production',
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Kullanıcı kaydı
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Gerekli alanları kontrol et
    if (!username || !email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Tüm alanlar gerekli'
      });
    }

    // E-posta formatını kontrol et
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir e-posta adresi girin'
      });
    }

    // Şifre uzunluğunu kontrol et
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Şifre en az 6 karakter olmalı'
      });
    }

    // Kullanıcı adı ve e-posta benzersizliğini kontrol et
    const existingUser = users.find(u => u.email === email || u.username === username);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? 'Bu e-posta adresi zaten kullanılıyor'
          : 'Bu kullanıcı adı zaten alınmış'
      });
    }

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Yeni kullanıcı oluştur
    const newUser = {
      _id: (++currentUserId).toString(),
      username,
      email,
      fullName,
      password: hashedPassword, // Hashlenmiş şifre
      bio: '',
      avatar: '',
      followers: [],
      following: [],
      savedWorks: [],
      isVerified: false,
      createdAt: new Date()
    };

    users.push(newUser);

    // Token oluştur
    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      message: 'Kayıt başarılı',
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        fullName: newUser.fullName,
        bio: newUser.bio,
        avatar: newUser.avatar,
        followers: newUser.followers.length,
        following: newUser.following.length,
        isVerified: newUser.isVerified,
        createdAt: newUser.createdAt
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Kayıt sırasında hata oluştu'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Kullanıcı girişi
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'E-posta ve şifre gerekli'
      });
    }

    // Kullanıcıyı bul
    const user = users.find(u => u.email === email);
    console.log('Found user:', user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz e-posta veya şifre'
      });
    }

    // Şifre kontrolü
    if (!user.password) {
      console.log('User has no password hash');
      return res.status(401).json({
        success: false,
        message: 'Geçersiz e-posta veya şifre'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(401).json({
        success: false,
        message: 'Geçersiz e-posta veya şifre'
      });
    }

    // Token oluştur
    const token = generateToken(user._id);
    console.log('Token generated:', token);

    const responseData = {
      success: true,
      message: 'Giriş başarılı',
      token,
      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        bio: user.bio,
        avatar: user.avatar,
        followers: user.followers.length,
        following: user.following.length,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    };

    console.log('Sending response:', responseData);
    res.json(responseData);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Giriş sırasında hata oluştu'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Mevcut kullanıcı bilgilerini getir
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token gerekli'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_in_production');
    const user = users.find(u => u._id === decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        bio: user.bio,
        avatar: user.avatar,
        followers: user.followers.length,
        following: user.following.length,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı bilgileri alınırken hata oluştu'
    });
  }
});

// @route   POST /api/auth/refresh
// @desc    Token yenileme
// @access  Private
router.post('/refresh', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token gerekli'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_in_production');
    const user = users.find(u => u._id === decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    const newToken = generateToken(user._id);
    
    res.json({
      success: true,
      token: newToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Token yenilenirken hata oluştu'
    });
  }
});

// @route   POST /api/auth/verify-email
// @desc    E-posta doğrulama
// @access  Private
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    
    // Basit token doğrulama (production'da daha güvenli olmalı)
    // Şimdilik kullanıcı ID'sini token olarak kullanıyoruz
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_in_production');
    const user = users.find(u => u._id === decoded.userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz doğrulama linki'
      });
    }

    user.isVerified = true;

    res.json({
      success: true,
      message: 'E-posta başarıyla doğrulandı'
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: 'E-posta doğrulanırken hata oluştu'
    });
  }
});

module.exports = router;
