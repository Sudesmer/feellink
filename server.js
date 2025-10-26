const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const { mockUsers, mockCategories, mockWorks, mockComments } = require('./mock-data');
const connectDB = require('./config/database');
const Notification = require('./models/Notification');
const FollowRequest = require('./models/FollowRequest');
const Message = require('./models/Message');
const ChatRoom = require('./models/ChatRoom');
const User = require('./models/User');
const Follow = require('./models/Follow');
require('dotenv').config({ path: './config.env' });

// Test bildirimleri ekle
const testNotifications = [
  {
    _id: 'test1',
    userId: new mongoose.Types.ObjectId(), // Sude Esmer için ObjectId
    type: 'follow_request',
    fromUserId: new mongoose.Types.ObjectId(), // Zeynep Esmer için ObjectId
    fromUserName: 'Zeynep Esmer',
    fromUserAvatar: '/can.jpg',
    message: 'Zeynep Esmer sizi takip etmek istiyor',
    relatedId: 'test_request_1', // Test takip isteği ID'si
    status: 'unread',
    createdAt: new Date()
  },
  {
    _id: 'test2',
    userId: new mongoose.Types.ObjectId(),
    type: 'like',
    fromUserId: new mongoose.Types.ObjectId(),
    fromUserName: 'Admin User',
    fromUserAvatar: '/zeynep.jpg',
    message: 'Admin User gönderinizi beğendi',
    status: 'unread',
    createdAt: new Date(Date.now() - 300000) // 5 dakika önce
  },
  {
    _id: 'test3',
    userId: new mongoose.Types.ObjectId(),
    type: 'comment',
    fromUserId: new mongoose.Types.ObjectId(),
    fromUserName: 'Test User',
    fromUserAvatar: '/sude.jpg',
    message: 'Test User gönderinize yorum yaptı',
    status: 'read',
    createdAt: new Date(Date.now() - 600000) // 10 dakika önce
  }
];

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://192.168.1.29:3000"],
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
// CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? ['https://feellink.com', 'https://www.feellink.com']
  : [
      'http://localhost:3000', 
      'http://localhost:3001',
      'http://192.168.1.29:3000',
      /^http:\/\/192\.168\./,
      /^http:\/\/10\./,
      /^http:\/\/172\./
    ];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Mock database
let users = [...mockUsers];
// Username eksik olan kullanıcılara ekle
users = users.map(user => {
  if (!user.username && user.email) {
    user.username = user.email.split('@')[0];
  }
  return user;
});
let categories = [...mockCategories];
let works = [...mockWorks];
let comments = [...mockComments];
let currentUserId = 1;

// Instagram tarzı Follow Requests & Notifications
let followRequests = [
  {
    _id: 'test_request_1',
    senderId: '2', // Admin User
    receiverId: '1', // Sude Esmer
    senderName: 'Admin User',
    senderAvatar: '/images/default-avatar.png',
    status: 'pending',
    createdAt: new Date()
  },
  {
    _id: 'test_request_2',
    senderId: '6', // Zeynep Esmer
    receiverId: '1', // Sude Esmer
    senderName: 'Zeynep Esmer',
    senderAvatar: '/can.jpg',
    status: 'pending',
    createdAt: new Date()
  }
]; // Takip istekleri
let notifications = [
  {
    _id: 'test_notification_1',
    userId: '1', // Sude Esmer
    fromUserId: '2', // Admin User
    type: 'follow_request',
    message: 'Admin User sizi takip etmek istiyor',
    relatedId: 'test_request_1',
    status: 'unread',
    createdAt: new Date()
  },
  {
    _id: 'test_notification_2',
    userId: '1', // Sude Esmer
    fromUserId: '6', // Zeynep Esmer
    type: 'follow_request',
    message: 'Zeynep Esmer sizi takip etmek istiyor',
    relatedId: 'test_request_2',
    status: 'unread',
    createdAt: new Date()
  }
]; // Bildirimler

// Routes
// Custom profile endpoint before users routes to avoid conflicts

// GET /api/users/search - Kullanıcı arama
app.get('/api/users/search', (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.json({
        success: true,
        users: []
      });
    }
    
    const query = q.toLowerCase().trim();
    
    // Kullanıcıları ara: isim, username, email'de
    const matchingUsers = users.filter(user => {
      const fullName = (user.fullName || '').toLowerCase();
      const username = (user.username || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      
      return fullName.includes(query) || 
             username.includes(query) || 
             email.includes(query);
    });
    
    // Sadece public bilgileri gönder
    const publicUsers = matchingUsers.map(user => ({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar || '',
      bio: user.bio || '',
      isVerified: user.isVerified || false,
      followers: user.followers?.length || 0,
      following: user.following?.length || 0
    }));
    
    console.log(`🔍 Kullanıcı arama: "${query}" - ${publicUsers.length} sonuç`);
    
    res.json({
      success: true,
      users: publicUsers,
      count: publicUsers.length
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı arama sırasında hata oluştu'
    });
  }
});

// Takip durumu kontrol endpoint'i
app.get('/api/users/follow-status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.headers['x-user-id'];
    
    if (!currentUserId || !userId) {
      return res.json({ success: true, isFollowing: false });
    }
    
    // MongoDB'de takip durumunu kontrol et
    try {
      // Hem accepted hem de pending durumundaki takip isteklerini kontrol et
      const followRequest = await FollowRequest.findOne({
        senderId: currentUserId,
        receiverId: userId,
        status: { $in: ['accepted', 'pending'] }
      });
      
      console.log(`🔍 Takip durumu kontrol: ${currentUserId} -> ${userId}, durum: ${followRequest?.status || 'yok'}`);
      
      res.json({ 
        success: true, 
        isFollowing: !!followRequest,
        status: followRequest?.status || 'none'
      });
    } catch (mongoError) {
      // MongoDB hatası durumunda mock data kullan
      console.log('MongoDB hatası, mock data kullanılıyor:', mongoError.message);
      
      // Mock data'da takip durumunu kontrol et
      const currentUser = users.find(u => u._id === currentUserId);
      const targetUser = users.find(u => u._id === userId);
      
      if (currentUser && targetUser) {
        const isFollowing = currentUser.following?.includes(userId) || false;
        console.log(`🔍 Mock data takip durumu: ${currentUserId} -> ${userId}, durum: ${isFollowing ? 'takip ediyor' : 'takip etmiyor'}`);
        res.json({ 
          success: true, 
          isFollowing,
          status: isFollowing ? 'accepted' : 'none'
        });
      } else {
        res.json({ success: true, isFollowing: false, status: 'none' });
      }
    }
  } catch (error) {
    console.error('Takip durumu kontrol hatası:', error);
    res.status(500).json({ success: false, message: 'Takip durumu kontrol edilemedi' });
  }
});

app.get('/api/users/profile/:username', (req, res) => {
  try {
    const { username } = req.params;
    
    // Kullanıcıyı bul
    const user = users.find(u => u.username === username || u.email === username);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }
    
    // Kullanıcının eserlerini getir
    const userWorks = works.filter(work => work.author._id === user._id);
    
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
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Profil bilgileri alınırken hata oluştu'
    });
  }
});

// POST /api/users/follow/:userId - Kullanıcıyı doğrudan takip et (bildirimli)
app.post('/api/users/follow/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const senderId = req.headers['x-user-id'] || '1'; // Mock: Giriş yapmış kullanıcı ID
    
    if (senderId === userId) {
      return res.status(400).json({
        success: false,
        message: 'Kendinizi takip edemezsiniz'
      });
    }

    const sender = users.find(u => u._id === senderId);
    const receiver = users.find(u => u._id === userId);

    if (!sender || !receiver) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Zaten takip ediliyor mu kontrol et
    if (sender.following.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Bu kullanıcıyı zaten takip ediyorsunuz'
      });
    }

    // Takip et
    sender.following.push(userId);
    if (!receiver.followers.includes(senderId)) {
      receiver.followers.push(senderId);
    }

    // ANLIK BİLDİRİM OLUŞTUR
    const newNotification = {
      _id: Date.now().toString() + '_follow',
      userId: userId, // Bildirimi alacak kişi
      fromUserId: senderId, // Takip eden kişi
      type: 'follow',
      message: 'sizi takip etti',
      status: 'unread',
      createdAt: new Date()
    };

    notifications.push(newNotification);

    // GERÇEK ZAMANLI BİLDİRİM GÖNDER
    const receiverSocketId = global.connectedUsers.get(userId);
    if (receiverSocketId && global.io) {
      global.io.to(receiverSocketId).emit('new_notification', {
        type: 'follow',
        message: `${sender.fullName} sizi takip etti`,
        notification: newNotification,
        timestamp: new Date()
      });
      console.log(`📡 Gerçek zamanlı bildirim gönderildi: ${receiver.fullName}`);
    }

    console.log(`👤 Takip: ${sender.fullName} -> ${receiver.fullName}`);
    console.log(`🔔 Bildirim gönderildi: ${receiver.fullName} için`);

    res.json({
      success: true,
      message: 'Kullanıcı takip edildi',
      notification: newNotification
    });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Takip işlemi sırasında hata oluştu'
    });
  }
});

// POST /api/users/unfollow/:userId - Takibi bırak
app.post('/api/users/unfollow/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const senderId = req.headers['x-user-id'] || '1';

    if (senderId === userId) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz işlem'
      });
    }

    const sender = users.find(u => u._id === senderId);
    const receiver = users.find(u => u._id === userId);

    if (!sender || !receiver) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Takip ediliyor mu kontrol et
    if (!sender.following.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Bu kullanıcıyı takip etmiyorsunuz'
      });
    }

    // Takibi bırak
    sender.following = sender.following.filter(id => id !== userId);
    receiver.followers = receiver.followers.filter(id => id !== senderId);

    console.log(`👋 Takip bırakıldı: ${sender.fullName} - ${receiver.fullName}`);

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

// Beğeni sistemi endpoint'leri
app.post('/api/works/:workId/like', (req, res) => {
  try {
    const { workId } = req.params;
    const { userId } = req.body;
    
    // Mock works'tan work'u bul
    const work = mockWorks.find(w => w._id === workId);
    if (!work) {
      return res.status(404).json({
        success: false,
        message: 'Eser bulunamadı'
      });
    }
    
    // Kullanıcı daha önce beğenmiş mi?
    const alreadyLiked = work.likes && work.likes.includes(userId);
    
    if (alreadyLiked) {
      // Beğeniyi kaldır
      work.likes = work.likes.filter(id => id !== userId);
      work.likeCount = Math.max(0, work.likeCount - 1);
      
      res.json({
        success: true,
        message: 'Beğeni kaldırıldı',
        liked: false,
        likeCount: work.likeCount
      });
    } else {
      // Beğeni ekle
      if (!work.likes) work.likes = [];
      work.likes.push(userId);
      work.likeCount = (work.likeCount || 0) + 1;
      
      res.json({
        success: true,
        message: 'Eser beğenildi',
        liked: true,
        likeCount: work.likeCount
      });
    }
  } catch (error) {
    console.error('Beğeni hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Beğeni işlemi sırasında hata oluştu'
    });
  }
});

// Yorum sistemi endpoint'leri
app.post('/api/works/:workId/comments', (req, res) => {
  try {
    const { workId } = req.params;
    const { userId, content, userName, userAvatar } = req.body;
    
    // Mock works'tan work'u bul
    const work = mockWorks.find(w => w._id === workId);
    if (!work) {
      return res.status(404).json({
        success: false,
        message: 'Eser bulunamadı'
      });
    }
    
    // Yeni yorum oluştur
    const newComment = {
      _id: Date.now().toString(),
      userId,
      userName,
      userAvatar,
      content,
      createdAt: new Date(),
      likes: [],
      likeCount: 0
    };
    
    // Work'a yorum ekle
    if (!work.comments) work.comments = [];
    work.comments.push(newComment);
    work.commentCount = (work.commentCount || 0) + 1;
    
    // Socket.IO ile admin paneline real-time bildirim gönder
    io.emit('comment_added', {
      _id: newComment._id,
      workId: workId,
      workTitle: work.title,
      userId: userId,
      userName: userName,
      content: content,
      commentCount: work.commentCount,
      timestamp: new Date()
    });
    
    res.json({
      success: true,
      message: 'Yorum eklendi',
      comment: newComment,
      commentCount: work.commentCount
    });
  } catch (error) {
    console.error('Yorum hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Yorum ekleme sırasında hata oluştu'
    });
  }
});

// Gizli hesap takip isteği endpoint'leri
app.post('/api/users/:userId/follow-request', (req, res) => {
  try {
    const { userId } = req.params;
    const { senderId, senderName, senderAvatar } = req.body;
    
    // Gönderen ve alan kullanıcıları bul
    const sender = mockUsers.find(u => u._id === senderId);
    const receiver = mockUsers.find(u => u._id === userId);
    
    if (!sender || !receiver) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }
    
    // Zaten takip ediyor mu kontrol et
    if (sender.following && sender.following.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Bu kullanıcıyı zaten takip ediyorsunuz'
      });
    }
    
    // Zaten istek gönderilmiş mi kontrol et
    const existingRequest = followRequests.find(req => 
      req.senderId === senderId && req.receiverId === userId && req.status === 'pending'
    );
    
    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Bu kullanıcıya zaten takip isteği gönderdiniz'
      });
    }
    
    // Yeni takip isteği oluştur
    const newRequest = {
      _id: Date.now().toString(),
      senderId,
      receiverId: userId,
      senderName: sender.fullName,
      senderAvatar: sender.avatar,
      status: 'pending',
      createdAt: new Date()
    };
    
    followRequests.push(newRequest);
    
    // Bildirim oluştur
    const newNotification = {
      _id: Date.now().toString(),
      userId,
      type: 'follow_request',
      fromUserId: senderId,
      fromUserName: sender.fullName,
      fromUserAvatar: sender.avatar,
      message: `${sender.fullName} sizi takip etmek istiyor`,
      relatedId: newRequest._id, // Takip isteği ID'si
      status: 'unread',
      createdAt: new Date()
    };
    
    notifications.push(newNotification);
    
    // Gerçek zamanlı bildirim gönder
    const receiverSocketId = global.connectedUsers.get(userId);
    if (receiverSocketId && global.io) {
      global.io.to(receiverSocketId).emit('new_notification', {
        type: 'follow_request',
        message: `${sender.fullName} sizi takip etmek istiyor`,
        notification: newNotification,
        timestamp: new Date()
      });
      console.log(`📡 Takip isteği bildirimi gönderildi: ${receiver.fullName}`);
    }
    
    res.json({
      success: true,
      message: 'Takip isteği gönderildi',
      request: newRequest
    });
  } catch (error) {
    console.error('Takip isteği hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Takip isteği gönderme sırasında hata oluştu'
    });
  }
});

// Takip isteği kabul etme endpoint'i
app.post('/api/follow-requests/:requestId/accept', (req, res) => {
  try {
    const { requestId } = req.params;
    
    // İsteği bul
    const request = followRequests.find(req => req._id === requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Takip isteği bulunamadı'
      });
    }
    
    // İsteği kabul et
    request.status = 'accepted';
    
    // Gönderen ve alan kullanıcıları bul
    const sender = mockUsers.find(u => u._id === request.senderId);
    const receiver = mockUsers.find(u => u._id === request.receiverId);
    
    if (sender && receiver) {
      // Takip ilişkisini oluştur
      if (!sender.following) sender.following = [];
      if (!receiver.followers) receiver.followers = [];
      
      sender.following.push(receiver._id);
      receiver.followers.push(sender._id);
      
      // Kabul bildirimi oluştur
      const acceptNotification = {
        _id: Date.now().toString(),
        userId: request.senderId,
        type: 'follow_accepted',
        fromUserId: request.receiverId,
        fromUserName: receiver.fullName,
        fromUserAvatar: receiver.avatar,
        message: `${receiver.fullName} takip isteğinizi kabul etti`,
        status: 'unread',
        createdAt: new Date()
      };
      
      notifications.push(acceptNotification);
      
      // Gerçek zamanlı bildirim gönder
      const senderSocketId = global.connectedUsers.get(request.senderId);
      if (senderSocketId && global.io) {
        global.io.to(senderSocketId).emit('new_notification', {
          type: 'follow_accepted',
          message: `${receiver.fullName} takip isteğinizi kabul etti`,
          notification: acceptNotification,
          timestamp: new Date()
        });
        console.log(`📡 Takip kabul bildirimi gönderildi: ${sender.fullName}`);
      }
    }
    
    res.json({
      success: true,
      message: 'Takip isteği kabul edildi',
      request
    });
  } catch (error) {
    console.error('Takip isteği kabul hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Takip isteği kabul etme sırasında hata oluştu'
    });
  }
});

// Takip isteği reddetme endpoint'i
app.post('/api/follow-requests/:requestId/reject', (req, res) => {
  try {
    const { requestId } = req.params;
    
    // İsteği bul ve reddet
    const requestIndex = followRequests.findIndex(req => req._id === requestId);
    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Takip isteği bulunamadı'
      });
    }
    
    followRequests[requestIndex].status = 'rejected';
    
    res.json({
      success: true,
      message: 'Takip isteği reddedildi'
    });
  } catch (error) {
    console.error('Takip isteği reddetme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Takip isteği reddetme sırasında hata oluştu'
    });
  }
});

// Bekleyen takip isteklerini getirme endpoint'i
app.get('/api/follow-requests/pending/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    const pendingRequests = followRequests.filter(req => 
      req.receiverId === userId && req.status === 'pending'
    );
    
    res.json({
      success: true,
      requests: pendingRequests
    });
  } catch (error) {
    console.error('Takip istekleri getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Takip istekleri getirme sırasında hata oluştu'
    });
  }
});

// Yorum beğeni endpoint'i
app.post('/api/comments/:commentId/like', (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;
    
    // Tüm works'larda yorumu bul
    let foundComment = null;
    let foundWork = null;
    
    for (const work of mockWorks) {
      if (work.comments) {
        const comment = work.comments.find(c => c._id === commentId);
        if (comment) {
          foundComment = comment;
          foundWork = work;
          break;
        }
      }
    }
    
    if (!foundComment) {
      return res.status(404).json({
        success: false,
        message: 'Yorum bulunamadı'
      });
    }
    
    // Kullanıcı daha önce beğenmiş mi?
    const alreadyLiked = foundComment.likes && foundComment.likes.includes(userId);
    
    if (alreadyLiked) {
      // Beğeniyi kaldır
      foundComment.likes = foundComment.likes.filter(id => id !== userId);
      foundComment.likeCount = Math.max(0, foundComment.likeCount - 1);
      
      res.json({
        success: true,
        message: 'Yorum beğenisi kaldırıldı',
        liked: false,
        likeCount: foundComment.likeCount
      });
    } else {
      // Beğeni ekle
      if (!foundComment.likes) foundComment.likes = [];
      foundComment.likes.push(userId);
      foundComment.likeCount = (foundComment.likeCount || 0) + 1;
      
      res.json({
        success: true,
        message: 'Yorum beğenildi',
        liked: true,
        likeCount: foundComment.likeCount
      });
    }
  } catch (error) {
    console.error('Yorum beğeni hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Yorum beğeni işlemi sırasında hata oluştu'
    });
  }
});

// Ana sayfa endpoint'i - HTML sayfa
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Feellink - Modern Sanat Platformu</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 0;
                background: linear-gradient(135deg, #FF6B35 0%, #F7931E 25%, #FFFFFF 50%, #FFF8F5 75%, #FF6B35 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .container {
                text-align: center;
                background: white;
                padding: 40px;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                max-width: 600px;
                margin: 20px;
            }
            .logo {
                font-size: 3rem;
                font-weight: bold;
                color: #FF6B35;
                margin-bottom: 20px;
            }
            .subtitle {
                font-size: 1.2rem;
                color: #666;
                margin-bottom: 30px;
            }
            .api-info {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
            }
            .endpoint {
                display: inline-block;
                background: #FF6B35;
                color: white;
                padding: 8px 16px;
                margin: 5px;
                border-radius: 20px;
                text-decoration: none;
                font-weight: 500;
            }
            .endpoint:hover {
                background: #e55a2b;
            }
            .frontend-link {
                display: inline-block;
                background: #28a745;
                color: white;
                padding: 15px 30px;
                border-radius: 25px;
                text-decoration: none;
                font-weight: bold;
                font-size: 1.1rem;
                margin-top: 20px;
            }
            .frontend-link:hover {
                background: #218838;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">🎨 Feellink</div>
            <div class="subtitle">Modern Sanat Platformu</div>
            
            <div class="api-info">
                <h3>🚀 Backend API Aktif</h3>
                <p>Version: 1.0.0</p>
                <p>Mevcut Endpoint'ler:</p>
                <a href="/api/auth" class="endpoint">/api/auth</a>
                <a href="/api/users" class="endpoint">/api/users</a>
                <a href="/api/works" class="endpoint">/api/works</a>
                <a href="/api/categories" class="endpoint">/api/categories</a>
            </div>
            
            <a href="http://localhost:3000" class="frontend-link">
                🌐 Web Sitesine Git
            </a>
        </div>
    </body>
    </html>
  `);
});

app.use('/api/auth', require('./routes/auth'));
console.log('🔍 routes/users.js import ediliyor...');
app.use('/api/users', require('./routes/users'));
console.log('✅ routes/users.js import edildi');

// Kullanıcı tanıma ve admin paneline kaydetme endpoint'i
app.post('/api/users/recognize', async (req, res) => {
  try {
    const { email, fullName, source } = req.body;
    
    console.log('🔍 Kullanıcı tanıma isteği:', { email, fullName, source });
    
    // Email formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli bir email adresi girin'
      });
    }
    
    const normalizedEmail = email.toLowerCase().trim();
    
    // MongoDB'de kullanıcı var mı kontrol et
    let existingUser = null;
    try {
      existingUser = await User.findOne({ email: normalizedEmail });
    } catch (mongoError) {
      console.log('⚠️ MongoDB hatası, mock data kontrol ediliyor:', mongoError.message);
    }
    
    // MongoDB'de yoksa mock data'da kontrol et
    if (!existingUser) {
      const fs = require('fs');
      const usersData = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
      existingUser = usersData.find(u => u.email.toLowerCase().trim() === normalizedEmail);
    }
    
    if (existingUser) {
      console.log('✅ Mevcut kullanıcı tanındı:', existingUser.fullName);
      
      // Admin paneline bildirim gönder
      if (io) {
        io.emit('user_recognized', {
          _id: existingUser._id,
          email: existingUser.email,
          fullName: existingUser.fullName,
          source: source || 'manual',
          timestamp: new Date(),
          action: 'existing_user_found'
        });
      }
      
      return res.json({
        success: true,
        message: 'Kullanıcı başarıyla tanındı',
        user: {
          _id: existingUser._id,
          email: existingUser.email,
          fullName: existingUser.fullName,
          isVerified: existingUser.isVerified,
          isActive: existingUser.isActive !== false
        },
        isNewUser: false
      });
    } else {
      // Yeni kullanıcı oluştur
      const newUserId = Date.now().toString();
      const newUser = {
        _id: newUserId,
        email: normalizedEmail,
        fullName: fullName || email.split('@')[0],
        bio: '',
        avatar: '',
        website: '',
        location: '',
        isVerified: false,
        isActive: true,
        followers: [],
        following: [],
        savedWorks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: source || 'manual_recognition'
      };
      
      // MongoDB'ye kaydet
      try {
        const savedUser = await User.create(newUser);
        console.log('✅ Yeni kullanıcı MongoDB\'ye kaydedildi:', savedUser.fullName);
      } catch (mongoError) {
        console.log('⚠️ MongoDB kayıt hatası, mock data\'ya kaydediliyor:', mongoError.message);
        
        // Mock data'ya kaydet
        const fs = require('fs');
        const usersData = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
        usersData.push(newUser);
        fs.writeFileSync('./data/users.json', JSON.stringify(usersData, null, 2));
        console.log('✅ Yeni kullanıcı mock data\'ya kaydedildi:', newUser.fullName);
      }
      
      // Admin paneline bildirim gönder
      if (io) {
        io.emit('user_registered', {
          _id: newUser._id,
          email: newUser.email,
          fullName: newUser.fullName,
          source: source || 'manual_recognition',
          createdAt: newUser.createdAt,
          timestamp: new Date(),
          action: 'new_user_created'
        });
      }
      
      return res.json({
        success: true,
        message: 'Yeni kullanıcı oluşturuldu ve admin paneline kaydedildi',
        user: {
          _id: newUser._id,
          email: newUser.email,
          fullName: newUser.fullName,
          isVerified: newUser.isVerified,
          isActive: newUser.isActive
        },
        isNewUser: true
      });
    }
    
  } catch (error) {
    console.error('❌ Kullanıcı tanıma hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı tanıma sırasında hata oluştu'
    });
  }
});

// Toplu kullanıcı tanıma endpoint'i
app.post('/api/users/recognize-bulk', async (req, res) => {
  try {
    const { users } = req.body;
    
    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Kullanıcı listesi gerekli'
      });
    }
    
    console.log('📋 Toplu kullanıcı tanıma isteği:', users.length, 'kullanıcı');
    
    const results = [];
    let newUsersCount = 0;
    
    for (const userData of users) {
      const { email, fullName, source } = userData;
      
      if (!email) {
        results.push({
          email: email || 'N/A',
          success: false,
          message: 'Email adresi gerekli'
        });
        continue;
      }
      
      const normalizedEmail = email.toLowerCase().trim();
      
      // MongoDB'de kontrol et
      let existingUser = null;
      try {
        existingUser = await User.findOne({ email: normalizedEmail });
      } catch (mongoError) {
        // MongoDB hatası, mock data'da kontrol et
        const fs = require('fs');
        const usersData = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
        existingUser = usersData.find(u => u.email.toLowerCase().trim() === normalizedEmail);
      }
      
      if (existingUser) {
        results.push({
          email: normalizedEmail,
          success: true,
          message: 'Mevcut kullanıcı tanındı',
          user: existingUser,
          isNewUser: false
        });
      } else {
        // Yeni kullanıcı oluştur
        const newUserId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const newUser = {
          _id: newUserId,
          email: normalizedEmail,
          fullName: fullName || email.split('@')[0],
          bio: '',
          avatar: '',
          website: '',
          location: '',
          isVerified: false,
          isActive: true,
          followers: [],
          following: [],
          savedWorks: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          source: source || 'bulk_recognition'
        };
        
        // MongoDB'ye kaydet
        try {
          const savedUser = await User.create(newUser);
          console.log('✅ Yeni kullanıcı MongoDB\'ye kaydedildi:', savedUser.fullName);
        } catch (mongoError) {
          // Mock data'ya kaydet
          const fs = require('fs');
          const usersData = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
          usersData.push(newUser);
          fs.writeFileSync('./data/users.json', JSON.stringify(usersData, null, 2));
          console.log('✅ Yeni kullanıcı mock data\'ya kaydedildi:', newUser.fullName);
        }
        
        results.push({
          email: normalizedEmail,
          success: true,
          message: 'Yeni kullanıcı oluşturuldu',
          user: newUser,
          isNewUser: true
        });
        
        newUsersCount++;
      }
    }
    
    // Admin paneline toplu işlem bildirimi gönder
    if (io) {
      io.emit('bulk_users_processed', {
        totalProcessed: users.length,
        newUsersCount: newUsersCount,
        results: results,
        timestamp: new Date(),
        action: 'bulk_user_recognition'
      });
    }
    
    res.json({
      success: true,
      message: `${users.length} kullanıcı işlendi, ${newUsersCount} yeni kullanıcı oluşturuldu`,
      results: results,
      summary: {
        totalProcessed: users.length,
        newUsersCount: newUsersCount,
        existingUsersCount: users.length - newUsersCount
      }
    });
    
  } catch (error) {
    console.error('❌ Toplu kullanıcı tanıma hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Toplu kullanıcı tanıma sırasında hata oluştu'
    });
  }
});

// GET /api/admin/users - Admin panel için kullanıcıları getir (MongoDB + Mock Data)
app.get('/api/admin/users', async (req, res) => {
  try {
    let users = [];
    
    // Önce MongoDB'den kullanıcıları getir
    try {
      users = await User.find({})
        .select('-password') // Şifreleri hariç tut
        .sort({ createdAt: -1 });
      console.log('📊 MongoDB\'den admin kullanıcıları alındı:', users.length);
    } catch (mongoError) {
      console.log('⚠️ MongoDB hatası, mock data kullanılıyor:', mongoError.message);
    }
    
    // Eğer MongoDB'de kullanıcı yoksa mock data kullan
    if (users.length === 0) {
      const fs = require('fs');
      const usersData = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
      users = usersData.map(user => ({
        ...user,
        password: undefined // Şifreyi kaldır
      }));
      console.log('📊 Mock data admin kullanıcıları alındı:', users.length);
    }

    // İstatistikleri hesapla
    const stats = {
      totalUsers: users.length,
      verifiedUsers: users.filter(user => user.isVerified).length,
      unverifiedUsers: users.filter(user => !user.isVerified).length,
      totalFollowers: users.reduce((sum, user) => sum + (user.followers?.length || 0), 0),
      totalFollowing: users.reduce((sum, user) => sum + (user.following?.length || 0), 0)
    };

    res.json({
      success: true,
      users: users,
      stats: stats
    });
  } catch (error) {
    console.error('Admin kullanıcıları alınırken hata:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcılar alınırken hata oluştu'
    });
  }
});

app.use('/api/works', require('./routes/works'));
app.use('/api/categories', require('./routes/categories'));

// Instagram-style follow system routes
app.use('/api/follow', require('./routes/follow'));
app.use('/api/notifications', require('./routes/notifications'));

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

// ==================== INSTAGRAM TARZI FOLLOW & NOTIFICATIONS ====================

// POST /api/follow/request/:userId - Takip isteği gönder
app.post('/api/follow/request/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const senderId = req.headers['x-user-id'] || '1'; // Mock: Giriş yapmış kullanıcı ID
    
    if (senderId === userId) {
      return res.status(400).json({
        success: false,
        message: 'Kendinizi takip edemezsiniz'
      });
    }

    // Zaten istek var mı kontrol et
    const existingRequest = followRequests.find(
      req => req.senderId === senderId && req.receiverId === userId && req.status === 'pending'
    );

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Zaten bir takip isteği gönderdiniz'
      });
    }

    // Yeni takip isteği oluştur
    const newRequest = {
      _id: Date.now().toString(),
      senderId: senderId,
      receiverId: userId,
      status: 'pending', // pending, accepted, rejected
      createdAt: new Date()
    };

    followRequests.push(newRequest);

    // Alıcıya bildirim oluştur
    const newNotification = {
      _id: Date.now().toString() + '_notif',
      userId: userId, // Bildirimi alacak kişi
      fromUserId: senderId, // İsteği gönderen
      type: 'follow_request',
      relatedId: newRequest._id,
      message: 'size bir takip isteği gönderdi',
      status: 'unread',
      createdAt: new Date()
    };

    notifications.push(newNotification);

    console.log(`📤 Takip isteği gönderildi: ${senderId} -> ${userId}`);
    console.log(`🔔 Bildirim oluşturuldu: ${userId} için`);

    res.json({
      success: true,
      message: 'Takip isteği gönderildi',
      request: newRequest,
      notification: newNotification
    });
  } catch (error) {
    console.error('Follow request error:', error);
    res.status(500).json({
      success: false,
      message: 'Takip isteği gönderilirken hata oluştu'
    });
  }
});

// POST /api/follow/accept/:requestId - Takip isteğini kabul et
app.post('/api/follow/accept/:requestId', (req, res) => {
  try {
    const { requestId } = req.params;
    const request = followRequests.find(req => req._id === requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Takip isteği bulunamadı'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Bu istek zaten işleme alınmış'
      });
    }

    // İsteği kabul et
    request.status = 'accepted';
    request.updatedAt = new Date();

    // Kullanıcının followers array'ine ekle
    const receiver = users.find(u => u._id === request.receiverId);
    const sender = users.find(u => u._id === request.senderId);

    if (receiver && sender) {
      if (!receiver.followers.includes(request.senderId)) {
        receiver.followers.push(request.senderId);
      }
      if (!sender.following.includes(request.receiverId)) {
        sender.following.push(request.receiverId);
      }
    }

    // Gönderene bildirim oluştur
    const newNotification = {
      _id: Date.now().toString() + '_notif',
      userId: request.senderId,
      fromUserId: request.receiverId,
      type: 'follow_accepted',
      relatedId: request._id,
      message: 'takip isteğinizi kabul etti',
      status: 'unread',
      createdAt: new Date()
    };

    notifications.push(newNotification);
    
    // Kabul edilen takip isteği bildirimini sil
    const followRequestNotificationIndex = notifications.findIndex(notif => 
      notif.type === 'follow_request' && 
      notif.relatedId === requestId &&
      notif.userId === request.receiverId
    );
    
    if (followRequestNotificationIndex !== -1) {
      notifications.splice(followRequestNotificationIndex, 1);
      console.log(`🗑️ Takip isteği bildirimi silindi: ${requestId}`);
    }

    console.log(`✅ Takip isteği kabul edildi: ${request.receiverId} -> ${request.senderId}`);
    console.log(`🔔 Bildirim: ${request.senderId} için`);

    res.json({
      success: true,
      message: 'Takip isteği kabul edildi',
      request: request,
      notification: newNotification
    });
  } catch (error) {
    console.error('Accept follow request error:', error);
    res.status(500).json({
      success: false,
      message: 'Takip isteği kabul edilirken hata oluştu'
    });
  }
});

// POST /api/follow/reject/:requestId - Takip isteğini reddet
app.post('/api/follow/reject/:requestId', (req, res) => {
  try {
    const { requestId } = req.params;
    const request = followRequests.find(req => req._id === requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Takip isteği bulunamadı'
      });
    }

    request.status = 'rejected';
    request.updatedAt = new Date();

    console.log(`❌ Takip isteği reddedildi: ${request.receiverId} -> ${request.senderId}`);

    res.json({
      success: true,
      message: 'Takip isteği reddedildi',
      request: request
    });
  } catch (error) {
    console.error('Reject follow request error:', error);
    res.status(500).json({
      success: false,
      message: 'Takip isteği reddedilirken hata oluştu'
    });
  }
});

// GET /api/follow/requests/pending - Bekleyen takip isteklerini getir
app.get('/api/follow/requests/pending', (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || '1'; // Mock: Giriş yapmış kullanıcı
    
    const pendingRequests = followRequests
      .filter(req => req.receiverId === userId && req.status === 'pending')
      .map(req => {
        const sender = users.find(u => u._id === req.senderId);
        return {
          ...req,
          sender: sender ? {
            _id: sender._id,
            username: sender.username,
            fullName: sender.fullName,
            avatar: sender.avatar,
            isVerified: sender.isVerified
          } : null
        };
      });

    res.json({
      success: true,
      requests: pendingRequests,
      count: pendingRequests.length
    });
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Bekleyen takip istekleri alınırken hata oluştu'
    });
  }
});

// GET /api/notifications - Kullanıcının bildirimlerini getir (MongoDB + Mock Fallback)
app.get('/api/notifications', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || '1';
    const { limit = 50, type } = req.query;

    // Önce MongoDB'den bildirimleri getirmeyi dene
    try {
      let query = { userId: userId, isActive: true };
      if (type && type !== 'all') {
        query.type = type;
      }

      const notifications = await Notification.find(query)
        .populate('fromUserId', 'username fullName avatar')
        .populate('userId', 'username fullName')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));

      // Bildirimleri frontend formatına dönüştür
      const formattedNotifications = notifications.map(notif => ({
        _id: notif._id,
        userId: notif.userId._id,
        type: notif.type,
        fromUserId: notif.fromUserId._id,
        fromUserName: notif.fromUserId.fullName,
        fromUserAvatar: notif.fromUserId.avatar,
        message: notif.message,
        relatedId: notif.relatedId,
        status: notif.status,
        createdAt: notif.createdAt,
        fromUser: {
          _id: notif.fromUserId._id,
          username: notif.fromUserId.username,
          fullName: notif.fromUserId.fullName,
          avatar: notif.fromUserId.avatar,
          isVerified: false
        }
      }));

      // Okunmamış bildirim sayısını hesapla
      const unreadCount = await Notification.countDocuments({ 
        userId: userId, 
        status: 'unread', 
        isActive: true 
      });

      res.json({
        success: true,
        notifications: formattedNotifications,
        total: formattedNotifications.length,
        unreadCount: unreadCount
      });
      return;
    } catch (mongoError) {
      console.log('MongoDB hatası, mock data kullanılıyor:', mongoError.message);
    }

    // MongoDB başarısızsa mock data kullan
    const allNotifications = [...notifications, ...testNotifications];

    const userNotifications = allNotifications
      .filter(notif => notif.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, parseInt(limit))
      .map(notif => {
        const fromUser = mockUsers.find(u => u._id === notif.fromUserId);
        return {
          ...notif,
          fromUser: fromUser ? {
            _id: fromUser._id,
            username: fromUser.username,
            fullName: fromUser.fullName,
            avatar: fromUser.avatar,
            isVerified: fromUser.isVerified
          } : null
        };
      });

    const unreadCount = allNotifications.filter(
      notif => notif.userId === userId && notif.status === 'unread'
    ).length;

    res.json({
      success: true,
      notifications: userNotifications,
      unreadCount: unreadCount,
      total: userNotifications.length
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Bildirimler alınırken hata oluştu'
    });
  }
});

// PUT /api/notifications/:notificationId/read - Bildirimi okundu olarak işaretle
app.put('/api/notifications/:notificationId/read', (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = notifications.find(notif => notif._id === notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Bildirim bulunamadı'
      });
    }

    notification.status = 'read';

    res.json({
      success: true,
      message: 'Bildirim okundu olarak işaretlendi',
      notification: notification
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Bildirim okundu olarak işaretlenirken hata oluştu'
    });
  }
});

// ==================== HEALTH CHECK ====================

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

// MongoDB bağlantısını başlat ve sunucuyu çalıştır
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Tüm ağ arayüzlerinden erişilebilir yap

// Socket.IO bağlantı yönetimi
const connectedUsers = new Map(); // userId -> socketId mapping

io.on('connection', (socket) => {
  console.log(`🔌 Kullanıcı bağlandı: ${socket.id}`);
  
  // Kullanıcı giriş yaptığında
  socket.on('user_login', async (userId) => {
    connectedUsers.set(userId, socket.id);
    socket.join(`user_${userId}`); // Kullanıcı kendi odasına katıl
    console.log(`👤 Kullanıcı ${userId} giriş yaptı`);
    
    // Kullanıcı bilgilerini al
    let userInfo = { userId, fullName: 'Bilinmeyen Kullanıcı' };
    try {
      // Önce JSON dosyasından al (mock data kullanıyoruz)
      const fs = require('fs');
      const usersData = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
      const jsonUser = usersData.find(u => u._id === userId);
      if (jsonUser) {
        userInfo = { userId, fullName: jsonUser.fullName || jsonUser.username || 'Kullanıcı' };
        console.log(`✅ Kullanıcı bilgisi bulundu: ${userInfo.fullName}`);
      } else {
        // MongoDB'den de dene (ObjectId formatında)
        try {
          const user = await User.findById(userId);
          if (user) {
            userInfo = { userId, fullName: user.fullName || user.username || 'Kullanıcı' };
            console.log(`✅ MongoDB'den kullanıcı bilgisi bulundu: ${userInfo.fullName}`);
          }
        } catch (mongoError) {
          console.log('MongoDB ObjectId hatası:', mongoError.message);
        }
      }
    } catch (error) {
      console.log('Kullanıcı bilgisi alınamadı:', error.message);
    }
    
    // Admin paneline real-time bildirim gönder
    io.emit('user_login', { ...userInfo, timestamp: new Date() });
  });
  
  // Kullanıcı çıkış yaptığında
  socket.on('user_logout', async (userId) => {
    connectedUsers.delete(userId);
    console.log(`👋 Kullanıcı ${userId} çıkış yaptı`);
    
    // Kullanıcı bilgilerini al
    let userInfo = { userId, fullName: 'Bilinmeyen Kullanıcı' };
    try {
      // Önce JSON dosyasından al (mock data kullanıyoruz)
      const fs = require('fs');
      const usersData = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
      const jsonUser = usersData.find(u => u._id === userId);
      if (jsonUser) {
        userInfo = { userId, fullName: jsonUser.fullName || jsonUser.username || 'Kullanıcı' };
        console.log(`✅ Çıkış yapan kullanıcı bilgisi bulundu: ${userInfo.fullName}`);
      } else {
        // MongoDB'den de dene (ObjectId formatında)
        try {
          const user = await User.findById(userId);
          if (user) {
            userInfo = { userId, fullName: user.fullName || user.username || 'Kullanıcı' };
            console.log(`✅ MongoDB'den çıkış yapan kullanıcı bilgisi bulundu: ${userInfo.fullName}`);
          }
        } catch (mongoError) {
          console.log('MongoDB ObjectId hatası:', mongoError.message);
        }
      }
    } catch (error) {
      console.log('Kullanıcı bilgisi alınamadı:', error.message);
    }
    
    // Admin paneline real-time bildirim gönder
    io.emit('user_logout', { ...userInfo, timestamp: new Date() });
  });
  
  // Mesajlaşma event'leri
  socket.on('join_chat_room', async (data) => {
    const { userId1, userId2 } = data;
    try {
      const room = await ChatRoom.findOrCreateRoom(userId1, userId2);
      socket.join(`room_${room._id}`);
      console.log(`🏠 Kullanıcı ${userId1} oda ${room._id}'ye katıldı`);
    } catch (error) {
      console.error('Oda katılma hatası:', error);
    }
  });

  // Takipleşme event'leri
  socket.on('follow_user', async (data) => {
    const { followerId, followingId } = data;
    
    try {
      // Kendi kendini takip etme kontrolü
      if (followerId === followingId) {
        console.log('❌ Kullanıcı kendini takip etmeye çalışıyor:', followerId);
        socket.emit('follow_error', { error: 'Kendinizi takip edemezsiniz' });
        return;
      }
      
      // Mevcut takip isteği var mı kontrol et
      const existingRequest = await FollowRequest.findOne({
        senderId: followerId,
        receiverId: followingId,
        status: { $in: ['pending', 'accepted'] }
      });
      
      if (existingRequest) {
        console.log('⚠️ Zaten takip isteği mevcut:', followerId, '->', followingId);
        socket.emit('follow_error', { error: 'Zaten takip isteği gönderilmiş' });
        return;
      }
      
      // Takip isteğini veritabanına kaydet
      const followRequest = new FollowRequest({
        senderId: followerId,
        receiverId: followingId,
        status: 'pending'
      });
      
      await followRequest.save();
      
      // Bildirim oluştur
      const notification = new Notification({
        userId: followingId,
        fromUserId: followerId,
        type: 'follow_request',
        message: `${followerId} sizi takip etmek istiyor`,
        relatedId: followRequest._id,
        relatedModel: 'FollowRequest'
      });
      
      await notification.save();
      
      // Gerçek zamanlı bildirim gönder
      io.to(`user_${followingId}`).emit('new_follow_request', {
        _id: notification._id,
        userId: notification.userId,
        fromUserId: notification.fromUserId,
        type: notification.type,
        message: notification.message,
        relatedId: notification.relatedId,
        status: notification.status,
        createdAt: notification.createdAt
      });
      
      // Admin paneline bildirim oluşturma event'i gönder
      io.emit('notification_created', {
        _id: notification._id,
        userId: notification.userId,
        fromUserId: notification.fromUserId,
        type: notification.type,
        message: notification.message,
        timestamp: new Date()
      });
      
      console.log(`👥 Takip isteği gönderildi: ${followerId} -> ${followingId}`);
      
      // Admin paneline real-time bildirim gönder
      io.emit('follow_request', { 
        followerId, 
        followingId, 
        timestamp: new Date(),
        requestId: followRequest._id,
        followerName: follower.fullName || follower.username || 'Kullanıcı',
        followingName: following.fullName || following.username || 'Kullanıcı'
      });
    } catch (error) {
      console.error('Takip isteği gönderme hatası:', error);
      socket.emit('follow_error', { error: 'Takip isteği gönderilemedi' });
    }
  });

  socket.on('accept_follow', async (data) => {
    const { requestId, accepterId, requesterId } = data;
    
    try {
      // Takip isteğini kabul et
      await FollowRequest.findByIdAndUpdate(requestId, { status: 'accepted' });
      
      // Bildirim oluştur
      const notification = new Notification({
        userId: requesterId,
        fromUserId: accepterId,
        type: 'follow_accepted',
        message: `${accepterId} takip isteğinizi kabul etti`,
        relatedId: requestId,
        relatedModel: 'FollowRequest'
      });
      
      await notification.save();
      
      // Gerçek zamanlı bildirim gönder
      io.to(`user_${requesterId}`).emit('follow_accepted', {
        _id: notification._id,
        userId: notification.userId,
        fromUserId: notification.fromUserId,
        type: notification.type,
        message: notification.message,
        relatedId: notification.relatedId,
        status: notification.status,
        createdAt: notification.createdAt
      });
      
      console.log(`✅ Takip isteği kabul edildi: ${requesterId} -> ${accepterId}`);
    } catch (error) {
      console.error('Takip kabul etme hatası:', error);
      socket.emit('follow_error', { error: 'Takip isteği kabul edilemedi' });
    }
  });

  socket.on('reject_follow', async (data) => {
    const { requestId, rejecterId, requesterId } = data;
    
    try {
      // Takip isteğini reddet
      await FollowRequest.findByIdAndUpdate(requestId, { status: 'rejected' });
      
      console.log(`❌ Takip isteği reddedildi: ${requesterId} -> ${rejecterId}`);
    } catch (error) {
      console.error('Takip reddetme hatası:', error);
      socket.emit('follow_error', { error: 'Takip isteği reddedilemedi' });
    }
  });

  // Instagram-style follow system Socket.io events
  socket.on('instagram_follow_request', async (data) => {
    const { senderId, receiverId } = data;
    
    try {
      // Kendi kendini takip etme kontrolü
      if (senderId === receiverId) {
        socket.emit('instagram_follow_error', { error: 'Kendinizi takip edemezsiniz' });
        return;
      }

      // Follow modelini kullanarak takip isteği oluştur
      const Follow = require('./models/Follow');
      const User = require('./models/User');
      
      // Hedef kullanıcının var olup olmadığını kontrol et
      const receiver = await User.findById(receiverId);
      if (!receiver) {
        socket.emit('instagram_follow_error', { error: 'Kullanıcı bulunamadı' });
        return;
      }

      // Mevcut takip durumunu kontrol et
      const existingFollow = await Follow.findOne({
        senderId: senderId,
        receiverId: receiverId
      });

      if (existingFollow) {
        if (existingFollow.status === 'pending') {
          socket.emit('instagram_follow_error', { error: 'Zaten takip isteği gönderilmiş' });
          return;
        } else if (existingFollow.status === 'accepted') {
          socket.emit('instagram_follow_error', { error: 'Bu kullanıcıyı zaten takip ediyorsunuz' });
          return;
        }
      }

      // Yeni takip isteği oluştur
      const newFollow = new Follow({
        senderId: senderId,
        receiverId: receiverId,
        status: 'pending'
      });
      await newFollow.save();

      // Bildirim oluştur
      const sender = await User.findById(senderId);
      const notification = new Notification({
        userId: receiverId,
        fromUserId: senderId,
        type: 'follow_request',
        message: `${sender?.fullName || sender?.username} sizi takip etmek istiyor`,
        status: 'unread'
      });
      await notification.save();

      // Socket.io ile gerçek zamanlı bildirim gönder
      io.to(`user_${receiverId}`).emit('newFollowRequest', {
        _id: notification._id,
        userId: notification.userId,
        fromUserId: notification.fromUserId,
        type: notification.type,
        message: notification.message,
        status: notification.status,
        createdAt: notification.createdAt
      });

      console.log(`📤 Instagram-style takip isteği gönderildi: ${senderId} -> ${receiverId}`);
      socket.emit('instagram_follow_success', { message: 'Takip isteği gönderildi' });

    } catch (error) {
      console.error('Instagram-style takip isteği hatası:', error);
      socket.emit('instagram_follow_error', { error: 'Takip isteği gönderilemedi' });
    }
  });

  socket.on('instagram_follow_accept', async (data) => {
    const { followId, accepterId } = data;
    
    try {
      const Follow = require('./models/Follow');
      const User = require('./models/User');
      
      // Takip isteğini bul
      const follow = await Follow.findById(followId);
      if (!follow) {
        socket.emit('instagram_follow_error', { error: 'Takip isteği bulunamadı' });
        return;
      }

      // Sadece isteği alan kişi kabul edebilir
      if (follow.receiverId !== accepterId) {
        socket.emit('instagram_follow_error', { error: 'Bu isteği kabul etme yetkiniz yok' });
        return;
      }

      // İsteği kabul et
      await follow.accept();

      // Kabul bildirimi oluştur
      const accepter = await User.findById(accepterId);
      const notification = new Notification({
        userId: follow.senderId,
        fromUserId: accepterId,
        type: 'follow_accepted',
        message: `${accepter?.fullName || accepter?.username} takip isteğinizi kabul etti`,
        status: 'unread'
      });
      await notification.save();

      // Socket.io ile gerçek zamanlı bildirim gönder
      io.to(`user_${follow.senderId}`).emit('followAccepted', {
        _id: notification._id,
        userId: notification.userId,
        fromUserId: notification.fromUserId,
        type: notification.type,
        message: notification.message,
        status: notification.status,
        createdAt: notification.createdAt
      });

      console.log(`✅ Instagram-style takip isteği kabul edildi: ${follow.senderId} -> ${accepterId}`);
      socket.emit('instagram_follow_success', { message: 'Takip isteği kabul edildi' });

    } catch (error) {
      console.error('Instagram-style takip kabul hatası:', error);
      socket.emit('instagram_follow_error', { error: 'Takip isteği kabul edilemedi' });
    }
  });

  socket.on('instagram_follow_reject', async (data) => {
    const { followId, rejecterId } = data;
    
    try {
      const Follow = require('./models/Follow');
      const User = require('./models/User');
      
      // Takip isteğini bul
      const follow = await Follow.findById(followId);
      if (!follow) {
        socket.emit('instagram_follow_error', { error: 'Takip isteği bulunamadı' });
        return;
      }

      // Sadece isteği alan kişi reddedebilir
      if (follow.receiverId !== rejecterId) {
        socket.emit('instagram_follow_error', { error: 'Bu isteği reddetme yetkiniz yok' });
        return;
      }

      // İsteği reddet
      await follow.reject();

      // Red bildirimi oluştur
      const rejecter = await User.findById(rejecterId);
      const notification = new Notification({
        userId: follow.senderId,
        fromUserId: rejecterId,
        type: 'follow_rejected',
        message: `${rejecter?.fullName || rejecter?.username} takip isteğinizi reddetti`,
        status: 'unread'
      });
      await notification.save();

      // Socket.io ile gerçek zamanlı bildirim gönder
      io.to(`user_${follow.senderId}`).emit('followRejected', {
        _id: notification._id,
        userId: notification.userId,
        fromUserId: notification.fromUserId,
        type: notification.type,
        message: notification.message,
        status: notification.status,
        createdAt: notification.createdAt
      });

      console.log(`❌ Instagram-style takip isteği reddedildi: ${follow.senderId} -> ${rejecterId}`);
      socket.emit('instagram_follow_success', { message: 'Takip isteği reddedildi' });

    } catch (error) {
      console.error('Instagram-style takip reddetme hatası:', error);
      socket.emit('instagram_follow_error', { error: 'Takip isteği reddedilemedi' });
    }
  });

  socket.on('send_message', async (data) => {
    const { senderId, receiverId, content, messageType = 'text' } = data;
    
    try {
      // Chat room'u bul veya oluştur
      const room = await ChatRoom.findOrCreateRoom(senderId, receiverId);
      
      // Mesajı veritabanına kaydet
      const newMessage = new Message({
        senderId,
        receiverId,
        content,
        chatRoomId: room._id.toString(),
        messageType
      });
      
      await newMessage.save();
      
      // Room'un son mesajını güncelle
      await ChatRoom.findByIdAndUpdate(room._id, {
        lastMessage: newMessage._id,
        lastMessageTime: new Date()
      });

      // Mesajı tüm room üyelerine gönder
      io.to(`room_${room._id}`).emit('new_message', {
        _id: newMessage._id,
        senderId: newMessage.senderId,
        receiverId: newMessage.receiverId,
        content: newMessage.content,
        timestamp: newMessage.timestamp,
        isRead: newMessage.isRead,
        messageType: newMessage.messageType
      });

      // Gönderen'e onay gönder
      socket.emit('message_sent', {
        messageId: newMessage._id,
        chatRoomId: room._id
      });

      console.log(`💬 Mesaj gönderildi: ${senderId} -> ${receiverId}`);
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      socket.emit('message_error', { error: 'Mesaj gönderilemedi' });
    }
  });

  // Takip bırakma event'i
  socket.on('unfollow_user', async (data) => {
    const { followerId, followingId } = data;
    
    try {
      console.log(`👋 Takip bırakma isteği: ${followerId} -> ${followingId}`);
      
      // Takip ilişkisini bul ve sil
      const followRequest = await Follow.findOneAndDelete({
        senderId: followerId,
        receiverId: followingId,
        status: 'accepted'
      });
      
      if (!followRequest) {
        console.log('❌ Takip ilişkisi bulunamadı:', followerId, '->', followingId);
        socket.emit('unfollow_error', { error: 'Bu kullanıcıyı takip etmiyorsunuz' });
        return;
      }
      
      // Kullanıcıların takipçi/takip edilen sayılarını güncelle
      await User.findByIdAndUpdate(followerId, { $pull: { following: followingId } });
      await User.findByIdAndUpdate(followingId, { $pull: { followers: followerId } });
      
      console.log(`✅ Takip bırakıldı: ${followerId} -> ${followingId}`);
      
      // Gerçek zamanlı güncelleme gönder
      socket.emit('unfollow_success', { 
        message: 'Takip bırakıldı',
        followingId: followingId 
      });
      
      // Takip edilen kullanıcıya da bildirim gönder
      io.to(`user_${followingId}`).emit('user_unfollowed', {
        followerId: followerId,
        message: 'Birisi sizi takip etmeyi bıraktı'
      });
      
    } catch (error) {
      console.error('Takip bırakma hatası:', error);
      socket.emit('unfollow_error', { error: 'Takip bırakılamadı' });
    }
  });

  // Bağlantı kesildiğinde
  socket.on('disconnect', () => {
    console.log(`🔌 Kullanıcı bağlantısı kesildi: ${socket.id}`);
    // Bağlantı kesilen kullanıcıyı bul ve temizle
    for (let [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });
});


// Gerçek zamanlı bildirim oluşturma endpoint'i (MongoDB)
app.post('/api/notifications/create-realtime', async (req, res) => {
  try {
    const { userId, type, message, fromUserId, relatedId, relatedModel } = req.body;
    
    // MongoDB'de bildirim oluştur
    const notification = new Notification({
      userId: userId,
      fromUserId: fromUserId,
      type: type,
      message: message,
      relatedId: relatedId,
      relatedModel: relatedModel,
      status: 'unread'
    });

    const savedNotification = await notification.save();
    
    // Populate ile kullanıcı bilgilerini getir
    await savedNotification.populate('fromUserId', 'username fullName avatar');
    await savedNotification.populate('userId', 'username fullName');

    // Socket.IO ile gerçek zamanlı bildirim gönder
    if (global.io) {
      global.io.to(userId).emit('new_notification', {
        _id: savedNotification._id,
        userId: savedNotification.userId._id,
        type: savedNotification.type,
        fromUserId: savedNotification.fromUserId._id,
        fromUserName: savedNotification.fromUserId.fullName,
        fromUserAvatar: savedNotification.fromUserId.avatar,
        message: savedNotification.message,
        relatedId: savedNotification.relatedId,
        status: savedNotification.status,
        createdAt: savedNotification.createdAt,
        fromUser: {
          _id: savedNotification.fromUserId._id,
          username: savedNotification.fromUserId.username,
          fullName: savedNotification.fromUserId.fullName,
          avatar: savedNotification.fromUserId.avatar
        }
      });
    }

    res.json({
      success: true,
      notification: savedNotification,
      message: 'Bildirim başarıyla oluşturuldu ve gönderildi'
    });
  } catch (error) {
    console.error('Gerçek zamanlı bildirim oluşturma hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Bildirim oluşturulurken hata oluştu'
    });
  }
});

// Bildirim oluşturma endpoint'i (MongoDB + Mock Fallback)
app.post('/api/notifications/create', async (req, res) => {
  try {
    const { userId, type, message, fromUserId, fromUserName, fromUserAvatar, relatedId, relatedModel } = req.body;
    
    // Önce MongoDB'de bildirim oluşturmayı dene
    try {
      const notification = new Notification({
        userId: userId,
        fromUserId: fromUserId || 'system',
        type: type || 'general',
        message: message || 'Yeni bildirim',
        relatedId: relatedId,
        relatedModel: relatedModel,
        status: 'unread'
      });

      const savedNotification = await notification.save();
      
      // Populate ile kullanıcı bilgilerini getir
      await savedNotification.populate('fromUserId', 'username fullName avatar');
      await savedNotification.populate('userId', 'username fullName');

      // Socket.IO ile gerçek zamanlı bildirim gönder
      if (global.io) {
        const receiverSocketId = global.connectedUsers.get(userId);
        if (receiverSocketId) {
          global.io.to(receiverSocketId).emit('new_notification', {
            _id: savedNotification._id,
            userId: savedNotification.userId._id,
            type: savedNotification.type,
            fromUserId: savedNotification.fromUserId._id,
            fromUserName: savedNotification.fromUserId.fullName,
            fromUserAvatar: savedNotification.fromUserId.avatar,
            message: savedNotification.message,
            relatedId: savedNotification.relatedId,
            status: savedNotification.status,
            createdAt: savedNotification.createdAt,
            fromUser: {
              _id: savedNotification.fromUserId._id,
              username: savedNotification.fromUserId.username,
              fullName: savedNotification.fromUserId.fullName,
              avatar: savedNotification.fromUserId.avatar
            }
          });
          console.log(`📡 MongoDB bildirim gönderildi: ${userId}`);
        }
      }

      res.json({
        success: true,
        notification: savedNotification,
        message: 'Bildirim başarıyla oluşturuldu ve gönderildi'
      });
      return;
    } catch (mongoError) {
      console.log('MongoDB hatası, mock data kullanılıyor:', mongoError.message);
    }

    // MongoDB başarısızsa mock data kullan
    const newNotification = {
      _id: Date.now().toString(),
      userId,
      type: type || 'general',
      fromUserId: fromUserId || 'system',
      fromUserName: fromUserName || 'Sistem',
      fromUserAvatar: fromUserAvatar || '',
      message: message || 'Yeni bildirim',
      status: 'unread',
      createdAt: new Date()
    };
    
    notifications.push(newNotification);
    
    // Gerçek zamanlı bildirim gönder
    const receiverSocketId = global.connectedUsers.get(userId);
    if (receiverSocketId && global.io) {
      global.io.to(receiverSocketId).emit('new_notification', {
        type: type,
        message: message,
        notification: newNotification,
        timestamp: new Date()
      });
      console.log(`📡 Mock bildirim gönderildi: ${userId}`);
    }
    
    res.json({
      success: true,
      message: 'Bildirim oluşturuldu',
      notification: newNotification
    });
  } catch (error) {
    console.error('Bildirim oluşturma hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Bildirim oluşturma sırasında hata oluştu'
    });
  }
});

// Test endpoint - Anlık bildirim gönderme
app.post('/api/test-notification', (req, res) => {
  try {
    const { userId = '1', type = 'test', message = 'Test bildirimi' } = req.body;
    
    const newNotification = {
      _id: Date.now().toString(),
      userId,
      type,
      fromUserId: '6', // Zeynep Esmer
      fromUserName: 'Zeynep Esmer',
      fromUserAvatar: '/can.jpg',
      message,
      status: 'unread',
      createdAt: new Date()
    };
    
    notifications.push(newNotification);
    
    // Gerçek zamanlı bildirim gönder
    const receiverSocketId = global.connectedUsers.get(userId);
    if (receiverSocketId && global.io) {
      global.io.to(receiverSocketId).emit('new_notification', {
        type: type,
        message: message,
        notification: newNotification,
        timestamp: new Date()
      });
      console.log(`📡 Test bildirimi gönderildi: ${userId}`);
    }
    
    res.json({
      success: true,
      message: 'Test bildirimi gönderildi',
      notification: newNotification
    });
  } catch (error) {
    console.error('Test bildirimi hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Test bildirimi gönderme sırasında hata oluştu'
    });
  }
});

// Socket.IO'yu global olarak erişilebilir yap
global.io = io;
global.connectedUsers = connectedUsers;

// Database bağlantısını başlat
// MongoDB'deki kullanıcıları güncelle (isActive field'ı ekle)
const updateUsersWithIsActive = async () => {
  try {
    const result = await User.updateMany(
      { isActive: { $exists: false } },
      { $set: { isActive: true } }
    );
    console.log(`✅ ${result.modifiedCount} kullanıcı güncellendi (isActive field eklendi)`);
  } catch (error) {
    console.log('⚠️ Kullanıcı güncelleme hatası:', error.message);
  }
};

connectDB().then(async () => {
  // MongoDB bağlandıktan sonra kullanıcıları güncelle
  await updateUsersWithIsActive();
  
  // MongoDB bağlandıktan sonra sunucuyu başlat
  server.listen(PORT, HOST, () => {
    console.log(`🚀 Feellink server ${HOST}:${PORT} üzerinde çalışıyor`);
    console.log(`🌐 API: http://localhost:${PORT}/api`);
    console.log(`📱 Tablet için: http://192.168.1.29:${PORT}/api`);
    console.log(`💾 MongoDB bağlı - Gerçek veriler kaydediliyor`);
    console.log('🔌 WebSocket bağlantıları aktif');
  });
}).catch((error) => {
  console.error('❌ MongoDB bağlantı hatası:', error);
  console.log('⚠️  Mock data modunda devam ediliyor...');
  
  // MongoDB bağlantısı başarısızsa mock data ile devam et
  server.listen(PORT, HOST, () => {
    console.log(`🚀 Feellink server ${HOST}:${PORT} üzerinde çalışıyor (Mock Mode)`);
    console.log(`🌐 API: http://localhost:${PORT}/api`);
    console.log(`📱 Tablet için: http://192.168.1.29:${PORT}/api`);
    console.log('🔌 WebSocket bağlantıları aktif');
  });
});

