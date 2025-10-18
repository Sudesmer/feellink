const express = require('express');
const cors = require('cors');
const { mockUsers, mockCategories, mockWorks } = require('./mock-data');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json());

// Mock data
let users = [...mockUsers];
let categories = [...mockCategories];
let works = [...mockWorks];
let currentUserId = 1;

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Feellink API çalışıyor',
    timestamp: new Date().toISOString()
  });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'E-posta ve şifre gerekli'
    });
  }

  const user = users.find(u => u.email === email);
  
  if (!user || password !== '123456') {
    return res.status(401).json({
      success: false,
      message: 'Geçersiz e-posta veya şifre'
    });
  }

  const token = 'mock-token-' + user._id;
  
  res.json({
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
  });
});

app.post('/api/auth/register', (req, res) => {
  const { username, email, password, fullName } = req.body;
  
  if (!username || !email || !password || !fullName) {
    return res.status(400).json({
      success: false,
      message: 'Tüm alanlar gerekli'
    });
  }

  const existingUser = users.find(u => u.email === email || u.username === username);
  
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: existingUser.email === email 
        ? 'Bu e-posta adresi zaten kullanılıyor'
        : 'Bu kullanıcı adı zaten alınmış'
    });
  }

  const newUser = {
    _id: (++currentUserId).toString(),
    username,
    email,
    fullName,
    bio: '',
    avatar: '',
    followers: [],
    following: [],
    savedWorks: [],
    isVerified: false,
    createdAt: new Date()
  };

  users.push(newUser);
  const token = 'mock-token-' + newUser._id;

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
});

app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token gerekli'
    });
  }

  const userId = token.replace('mock-token-', '');
  const user = users.find(u => u._id === userId);

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
});

// Works routes
app.get('/api/works', (req, res) => {
  const { featured } = req.query;
  
  let filteredWorks = works.filter(work => work.isPublished);
  
  if (featured === 'true') {
    filteredWorks = filteredWorks.filter(work => work.isFeatured);
  }

  res.json({
    success: true,
    works: filteredWorks,
    pagination: {
      current: 1,
      pages: 1,
      total: filteredWorks.length
    }
  });
});

app.get('/api/works/:id', (req, res) => {
  const work = works.find(w => w._id === req.params.id);
  
  if (!work || !work.isPublished) {
    return res.status(404).json({
      success: false,
      message: 'Eser bulunamadı'
    });
  }

  work.views += 1;

  res.json({
    success: true,
    work
  });
});

// Categories routes
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    categories
  });
});

// Like and save routes
app.post('/api/works/:id/like', (req, res) => {
  const work = works.find(w => w._id === req.params.id);
  
  if (!work) {
    return res.status(404).json({
      success: false,
      message: 'Eser bulunamadı'
    });
  }

  work.likeCount += 1;
  
  res.json({
    success: true,
    message: 'Eser beğenildi',
    isLiked: true,
    likeCount: work.likeCount
  });
});

app.post('/api/works/:id/save', (req, res) => {
  const work = works.find(w => w._id === req.params.id);
  
  if (!work) {
    return res.status(404).json({
      success: false,
      message: 'Eser bulunamadı'
    });
  }

  res.json({
    success: true,
    message: 'Eser kaydedildi',
    isSaved: true
  });
});

app.get('/api/works/saved', (req, res) => {
  res.json({
    success: true,
    works: [],
    pagination: {
      current: 1,
      pages: 0,
      total: 0
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Feellink server ${PORT} portunda çalışıyor`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
  console.log(`📊 Mock data: ${users.length} kullanıcı, ${works.length} eser, ${categories.length} kategori`);
});

