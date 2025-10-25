const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

// Geçici JSON dosyası ile çalışma
const USERS_FILE = path.join(__dirname, '../data/users.json');

// Kullanıcıları dosyadan oku
const readUsers = async () => {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Users file read error:', error);
    return [];
  }
};

// Kullanıcıları dosyaya yaz
const writeUsers = async (users) => {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Users file write error:', error);
    return false;
  }
};

// En yüksek ID'yi bul
const getNextUserId = async () => {
  const users = await readUsers();
  if (users.length === 0) return '1';
  const maxId = Math.max(...users.map(u => parseInt(u._id) || 0));
  return (maxId + 1).toString();
};
const router = express.Router();

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
    const { email, password, fullName } = req.body;

    // Gerekli alanları kontrol et
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'E-posta, şifre ve ad soyad gerekli'
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

    // Dosyadan kullanıcıları oku
    const users = await readUsers();

    // Kullanıcı var mı kontrol et
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Bu e-posta adresi zaten kullanılıyor'
      });
    }

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Yeni kullanıcı oluştur
    const newUserId = await getNextUserId();
    const newUser = {
      _id: newUserId,
      email,
      password: hashedPassword,
      fullName: fullName,
      bio: '',
      avatar: '',
      isVerified: false,
      createdAt: new Date().toISOString()
    };

    // Kullanıcıyı listeye ekle ve dosyaya kaydet
    users.push(newUser);
    await writeUsers(users);

    console.log('✅ Yeni kullanıcı kaydedildi:', email);

    // Token oluştur
    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      message: 'Kayıt başarılı',
      token,
      user: {
        _id: newUser._id,
        username: newUser.fullName,
        email: newUser.email,
        fullName: newUser.fullName,
        bio: newUser.bio || '',
        avatar: newUser.avatar || '',
        followers: 0,
        following: 0,
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
    console.log('🔐 Login attempt:', { email });

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'E-posta ve şifre gerekli'
      });
    }

    // Dosyadan kullanıcıları oku
    const users = await readUsers();

    // Kullanıcıyı bul
    const user = users.find(u => u.email === email);

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Geçersiz e-posta veya şifre'
      });
    }

    console.log('👤 Found user:', user.fullName || user.email);

    // Şifre kontrolü
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(401).json({
        success: false,
        message: 'Geçersiz e-posta veya şifre'
      });
    }

    // Token oluştur
    const token = generateToken(user._id);
    console.log('✅ Login successful for:', user.fullName || user.email);

    const responseData = {
      success: true,
      message: 'Giriş başarılı',
      token,
      user: {
        _id: user._id,
        username: user.fullName,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio || '',
        avatar: user.avatar || '',
        followers: 0,
        following: 0,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    };

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

    // Token'dan user ID'yi al
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_in_production');
    
    // Dosyadan kullanıcıları oku
    const users = await readUsers();
    
    // Kullanıcıyı bul
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
        username: user.fullName,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio || '',
        avatar: user.avatar || '',
        followers: 0,
        following: 0,
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

    // Token'dan user ID'yi al
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_in_production');
    
    // Dosyadan kullanıcıları oku
    const users = await readUsers();
    
    // Kullanıcıyı bul
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
    
    // Token'dan user ID'yi al
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_in_production');
    
    // Dosyadan kullanıcıları oku
    const users = await readUsers();
    
    // Kullanıcıyı bul
    const user = users.find(u => u._id === decoded.userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz doğrulama linki'
      });
    }

    // isVerified'ı güncelle
    user.isVerified = true;
    await writeUsers(users);

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
