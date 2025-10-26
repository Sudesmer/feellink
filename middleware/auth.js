const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT token doğrulama middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Erişim token\'ı gerekli'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_in_production');
    
    // Önce MongoDB'den arama yap (ObjectId ile)
    let user = null;
    try {
      user = await User.findById(decoded.userId).select('-password');
    } catch (mongoError) {
      console.log('MongoDB User.findById hatası:', mongoError.message);
    }
    
    // MongoDB'de bulunamazsa JSON dosyasından arama yap
    if (!user) {
      try {
        const fs = require('fs').promises;
        const usersData = await fs.readFile('./data/users.json', 'utf8');
        const users = JSON.parse(usersData);
        user = users.find(u => u._id === decoded.userId);
      } catch (jsonError) {
        console.log('JSON dosyası okuma hatası:', jsonError.message);
      }
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz token'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token süresi dolmuş'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Opsiyonel authentication (token varsa kullanıcıyı set et, yoksa devam et)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Mock data'dan kullanıcıyı bul
        const fs = require('fs').promises;
        const path = require('path');
        const USERS_FILE = path.join(__dirname, '../data/users.json');
        
        try {
          const data = await fs.readFile(USERS_FILE, 'utf8');
          const users = JSON.parse(data);
          const user = users.find(u => u._id === decoded.userId);
          
          if (user) {
            req.user = user;
          }
        } catch (fileError) {
          console.log('Optional auth file read error:', fileError.message);
        }
      } catch (tokenError) {
        // Token geçersizse sessizce devam et
        console.log('Optional auth token error:', tokenError.message);
      }
    }
    
    next();
  } catch (error) {
    // Opsiyonel auth'da hata durumunda devam et
    console.log('Optional auth error:', error.message);
    next();
  }
};

// Admin yetkisi kontrolü
const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Admin yetkisi gerekli'
    });
  }
  next();
};

// Token oluşturma fonksiyonu
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin,
  generateToken
};
















