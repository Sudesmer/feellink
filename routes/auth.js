const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');
const nodemailer = require('nodemailer');

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

// Email gönderme fonksiyonu
const sendWelcomeEmail = async (email, fullName) => {
  try {
    // Nodemailer transporter oluştur (Gmail için örnek)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });

    // Email içeriği
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: '🎨 Feellink\'e Hoş Geldiniz!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🎨 Feellink</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 40px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Merhaba ${fullName}!</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Feellink ailesine katıldığınız için çok mutluyuz! 🎉
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Artık yaratıcı dünyanızdaki eserleri paylaşabilir, diğer sanatçılardan ilham alabilir 
              ve harika bir topluluk oluşturabilirsiniz.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000" 
                 style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); 
                        color: white; 
                        padding: 15px 40px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block;
                        font-weight: bold;">
                Keşfetmeye Başla →
              </a>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 30px;">
              <h3 style="color: #333; margin-top: 0;">✨ Neler yapabilirsiniz:</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li>Eserlerinizi paylaşın ve sergileyin</li>
                <li>Diğer sanatçıları keşfedin ve takip edin</li>
                <li>Beğeniler toplayın ve yorumlar alın</li>
                <li>Öne çıkan içeriklere ulaşın</li>
              </ul>
            </div>
            
            <p style="color: #999; font-size: 14px; margin-top: 30px; text-align: center;">
              Sorularınız için: <a href="mailto:support@feellink.io" style="color: #FF6B35;">support@feellink.io</a>
            </p>
            
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
              © 2024 Feellink. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      `
    };

    // Email gönder
    await transporter.sendMail(mailOptions);
    console.log('✅ Hoş geldin email gönderildi:', email);
    
    return true;
  } catch (error) {
    console.error('❌ Email gönderme hatası:', error);
    // Email hatası kayıt işlemini engellemesin
    return false;
  }
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

    // Email'i normalize et (küçük harfe çevir ve trim yap)
    const normalizedEmail = email.toLowerCase().trim();

    // Dosyadan kullanıcıları oku
    const users = await readUsers();

    // Kullanıcı var mı kontrol et (email case-insensitive kontrol)
    const existingUser = users.find(u => u.email.toLowerCase().trim() === normalizedEmail);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Bu e-posta adresi ile zaten bir hesap bulunmaktadır. Lütfen farklı bir e-posta adresi kullanın veya giriş yapın.',
        errorType: 'EMAIL_ALREADY_EXISTS'
      });
    }

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Yeni kullanıcı oluştur (normalize edilmiş email ile)
    const newUserId = await getNextUserId();
    const newUser = {
      _id: newUserId,
      email: normalizedEmail, // Normalize edilmiş email kullan
      password: hashedPassword,
      fullName: fullName.trim(),
      bio: '',
      avatar: '',
      website: '',
      location: '',
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('📝 Kayıt denemesi - Email:', normalizedEmail);
    console.log('📋 Mevcut kullanıcılar:', users.map(u => u.email));
    console.log('🔍 Var mı?', existingUser ? 'EVET' : 'HAYIR');

    // Kullanıcıyı listeye ekle ve dosyaya kaydet
    users.push(newUser);
    await writeUsers(users);

    console.log('✅ Yeni kullanıcı kaydedildi:', email);

    // Hoş geldin email gönder (asenkron, hata kayıt işlemini etkilemesin)
    sendWelcomeEmail(email, fullName).catch(err => {
      console.error('Email gönderme hatası (kayıt tamamlandı):', err);
    });

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

    // Email'i normalize et
    const normalizedEmail = email.toLowerCase().trim();

    // Dosyadan kullanıcıları oku
    const users = await readUsers();

    // Kullanıcıyı bul (case-insensitive email ile)
    const user = users.find(u => u.email.toLowerCase().trim() === normalizedEmail);

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

// @route   PUT /api/auth/profile
// @desc    Profil bilgilerini güncelle
// @access  Private
router.put('/profile', async (req, res) => {
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
    
    const { bio, website, location, avatar } = req.body;
    
    // Dosyadan kullanıcıları oku
    const users = await readUsers();
    
    // Kullanıcıyı bul
    const userIndex = users.findIndex(u => u._id === decoded.userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Profil bilgilerini güncelle
    if (bio !== undefined) users[userIndex].bio = bio;
    if (website !== undefined) users[userIndex].website = website;
    if (location !== undefined) users[userIndex].location = location;
    if (avatar !== undefined) users[userIndex].avatar = avatar;
    
    users[userIndex].updatedAt = new Date().toISOString();

    // Dosyaya yaz
    await writeUsers(users);

    // Yedek dosyaya da yaz
    const backupPath = path.join(__dirname, '../data/backups');
    try {
      await fs.mkdir(backupPath, { recursive: true });
      const backupFile = path.join(backupPath, `users_backup_${Date.now()}.json`);
      await fs.copyFile(USERS_FILE, backupFile);
    } catch (backupError) {
      console.error('Backup error:', backupError);
    }

    res.json({
      success: true,
      message: 'Profil başarıyla güncellendi',
      user: {
        _id: users[userIndex]._id,
        email: users[userIndex].email,
        fullName: users[userIndex].fullName,
        bio: users[userIndex].bio,
        website: users[userIndex].website,
        location: users[userIndex].location,
        avatar: users[userIndex].avatar
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Profil güncellenirken hata oluştu'
    });
  }
});

module.exports = router;
