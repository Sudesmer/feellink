const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { mockUsers, mockCategories, mockWorks, mockComments } = require('../mock-data');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://feellink.io', 'https://www.feellink.io', 'https://feellink.com', 'https://www.feellink.com', 'https://feellink.vercel.app']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mock database
let users = [...mockUsers];
let categories = [...mockCategories];
let works = [...mockWorks];
let comments = [...mockComments];
let currentUserId = 1;

// Routes
app.use('/auth', require('../routes/auth'));
app.use('/users', require('../routes/users'));
app.use('/works', require('../routes/works'));
app.use('/categories', require('../routes/categories'));

// Yorum endpoint'leri
app.get('/comments/:workId', (req, res) => {
  try {
    const { workId } = req.params;
    const workComments = comments.filter(comment => 
      comment.workId === workId && comment.isApproved
    );
    
    res.json({
      success: true,
      data: workComments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Yorumlar yüklenirken hata oluştu'
    });
  }
});

app.post('/comments', (req, res) => {
  try {
    const { workId, content } = req.body;
    
    if (!workId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Gerekli alanlar eksik'
      });
    }
    
    const newComment = {
      _id: Date.now().toString(),
      workId,
      userId: 'temp_user_' + Date.now(),
      username: 'Kullanıcı',
      userAvatar: '',
      content: content.trim(),
      createdAt: new Date(),
      isApproved: false, // Admin onayı bekliyor
      likes: 0
    };
    
    comments.push(newComment);
    
    res.json({
      success: true,
      message: 'Yorumunuz gönderildi! Admin onayından sonra görünecek.',
      data: newComment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Yorum gönderilirken hata oluştu'
    });
  }
});

// Admin yorum yönetimi endpoint'leri
app.get('/admin/comments', (req, res) => {
  try {
    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Yorumlar yüklenirken hata oluştu'
    });
  }
});

app.put('/admin/comments/:commentId/approve', (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = comments.find(c => c._id === commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Yorum bulunamadı'
      });
    }
    
    comment.isApproved = true;
    
    res.json({
      success: true,
      message: 'Yorum onaylandı',
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Yorum onaylanırken hata oluştu'
    });
  }
});

app.put('/admin/comments/:commentId/reject', (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = comments.find(c => c._id === commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Yorum bulunamadı'
      });
    }
    
    comment.isApproved = false;
    
    res.json({
      success: true,
      message: 'Yorum reddedildi',
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Yorum reddedilirken hata oluştu'
    });
  }
});

app.delete('/admin/comments/:commentId', (req, res) => {
  try {
    const { commentId } = req.params;
    const commentIndex = comments.findIndex(c => c._id === commentId);
    
    if (commentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Yorum bulunamadı'
      });
    }
    
    comments.splice(commentIndex, 1);
    
    res.json({
      success: true,
      message: 'Yorum silindi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Yorum silinirken hata oluştu'
    });
  }
});

// Test endpoint'i
app.get('/test', (req, res) => {
  res.json({ message: 'Test başarılı', works: works.length });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Feellink API çalışıyor',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Sunucu hatası',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Bir hata oluştu'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint bulunamadı'
  });
});

module.exports = app;
