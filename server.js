const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { mockUsers, mockCategories, mockWorks, mockComments } = require('./mock-data');
require('dotenv').config({ path: './config.env' });

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
    ? ['https://feellink.com', 'https://www.feellink.com']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Mock database
let users = [...mockUsers];
let categories = [...mockCategories];
let works = [...mockWorks];
let comments = [...mockComments];
let currentUserId = 1;

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/works', require('./routes/works'));
app.use('/api/categories', require('./routes/categories'));

// Yorum endpoint'leri
app.get('/api/comments/:workId', (req, res) => {
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

app.post('/api/comments', (req, res) => {
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
app.get('/api/admin/comments', (req, res) => {
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

app.put('/api/admin/comments/:commentId/approve', (req, res) => {
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

app.put('/api/admin/comments/:commentId/reject', (req, res) => {
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

app.delete('/api/admin/comments/:commentId', (req, res) => {
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
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test başarılı', works: works.length });
});

// Test DM endpoint'i
app.get('/api/test-dm', (req, res) => {
  res.json({ 
    message: 'DM test başarılı', 
    users: users.length,
    conversations: conversations.length,
    firstUser: users[0]
  });
});

// DM (Direct Message) endpoint'leri
// Mock conversations data
let conversations = [
  {
    id: '1',
    participants: ['1', '2'],
    lastMessage: {
      text: 'Bu eser gerçekten etkileyici!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 saat önce
      senderId: '2'
    },
    unreadCount: 2
  },
  {
    id: '2',
    participants: ['1', '3'],
    lastMessage: {
      text: 'Teşekkürler! Senin çalışman da harika.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 gün önce
      senderId: '3'
    },
    unreadCount: 0
  },
  {
    id: '3',
    participants: ['1', '4'],
    lastMessage: {
      text: 'Yeni projende nasıl gidiyor?',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 gün önce
      senderId: '4'
    },
    unreadCount: 1
  }
];

// Mock messages data
let messages = {
  '1': [
    {
      id: '1',
      text: 'Merhaba! Eserini çok beğendim.',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      senderId: '2',
      isRead: true
    },
    {
      id: '2',
      text: 'Teşekkürler! Senin çalışman da harika.',
      timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
      senderId: '1',
      isRead: true
    },
    {
      id: '3',
      text: 'Bu eser gerçekten etkileyici!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      senderId: '2',
      isRead: false
    }
  ],
  '2': [
    {
      id: '1',
      text: 'Yeni teknikler hakkında konuşalım mı?',
      timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000),
      senderId: '3',
      isRead: true
    },
    {
      id: '2',
      text: 'Tabii ki! Hangi konuda?',
      timestamp: new Date(Date.now() - 24.5 * 60 * 60 * 1000),
      senderId: '1',
      isRead: true
    },
    {
      id: '3',
      text: 'Teşekkürler! Senin çalışman da harika.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      senderId: '3',
      isRead: true
    }
  ],
  '3': [
    {
      id: '1',
      text: 'Yeni projende nasıl gidiyor?',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      senderId: '4',
      isRead: false
    }
  ]
};

// GET /api/messages - Kullanıcının konuşmalarını getir
app.get('/api/messages', (req, res) => {
  try {
    // Basit mock data döndür
    const mockConversations = [
      {
        id: '1',
        user: {
          id: '2',
          username: 'admin',
          fullName: 'Admin User',
          avatar: ''
        },
        lastMessage: {
          text: 'Bu eser gerçekten etkileyici!',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        unreadCount: 2
      },
      {
        id: '2',
        user: {
          id: '3',
          username: 'designer',
          fullName: 'Designer User',
          avatar: ''
        },
        lastMessage: {
          text: 'Teşekkürler! Senin çalışman da harika.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        unreadCount: 0
      }
    ];
    
    res.json({
      success: true,
      conversations: mockConversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Konuşmalar yüklenirken hata oluştu'
    });
  }
});

// GET /api/messages/:conversationId - Belirli konuşmanın mesajlarını getir
app.get('/api/messages/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversationMessages = messages[conversationId] || [];
    
    res.json({
      success: true,
      messages: conversationMessages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Mesajlar yüklenirken hata oluştu'
    });
  }
});

// POST /api/messages/:conversationId - Yeni mesaj gönder
app.post('/api/messages/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;
    const senderId = '1'; // Mock user ID
    
    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Mesaj metni gerekli'
      });
    }
    
    const newMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      timestamp: new Date(),
      senderId: senderId,
      isRead: false
    };
    
    // Mesajı ekle
    if (!messages[conversationId]) {
      messages[conversationId] = [];
    }
    messages[conversationId].push(newMessage);
    
    // Konuşmanın son mesajını güncelle
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.lastMessage = {
        text: newMessage.text,
        timestamp: newMessage.timestamp,
        senderId: newMessage.senderId
      };
    }
    
    res.json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Mesaj gönderilirken hata oluştu'
    });
  }
});

// Museum API endpoints
// Mock museum data
let museums = [
  {
    id: 'museum_1',
    email: 'muzesahibi@feellink.com',
    password: 'muzesahibi123',
    name: 'İstanbul Modern Sanat Müzesi',
    type: 'museum',
    works: [],
    stats: {
      totalWorks: 24,
      totalViews: 15420,
      totalLikes: 892,
      totalComments: 156
    }
  }
];

// POST /api/museum/login - Museum login
app.post('/api/museum/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'E-posta ve şifre gerekli'
      });
    }

    const museum = museums.find(m => m.email === email && m.password === password);

    if (!museum) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz müze sahibi bilgileri'
      });
    }

    res.json({
      success: true,
      message: 'Müze girişi başarılı',
      museum: {
        id: museum.id,
        email: museum.email,
        name: museum.name,
        type: museum.type
      }
    });
  } catch (error) {
    console.error('Museum login error:', error);
    res.status(500).json({
      success: false,
      message: 'Müze girişi sırasında hata oluştu'
    });
  }
});

// GET /api/museum/dashboard - Museum dashboard data
app.get('/api/museum/dashboard', (req, res) => {
  try {
    const museumId = 'museum_1'; // Mock museum ID
    const museum = museums.find(m => m.id === museumId);

    if (!museum) {
      return res.status(404).json({
        success: false,
        message: 'Müze bulunamadı'
      });
    }

    res.json({
      success: true,
      museum: {
        id: museum.id,
        name: museum.name,
        stats: museum.stats
      }
    });
  } catch (error) {
    console.error('Museum dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Müze dashboard verileri alınırken hata oluştu'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Feellink server ${PORT} portunda çalışıyor`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
});
