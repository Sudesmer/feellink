const express = require('express');
const router = express.Router();
const Follow = require('../models/Follow');
const Notification = require('../models/Notification');
const User = require('../models/User');
const auth = require('../middleware/auth').authenticateToken;

// Instagram-style follow system routes

// POST /api/follow/request - Takip isteği gönder
router.post('/request', auth, async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;

    // Kendini takip etme kontrolü
    if (senderId === receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Kendinizi takip edemezsiniz'
      });
    }

    // Hedef kullanıcının var olup olmadığını kontrol et
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Mevcut takip durumunu kontrol et
    const existingFollow = await Follow.findOne({
      senderId: senderId,
      receiverId: receiverId
    });

    if (existingFollow) {
      if (existingFollow.status === 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Zaten takip isteği gönderilmiş'
        });
      } else if (existingFollow.status === 'accepted') {
        return res.status(400).json({
          success: false,
          message: 'Bu kullanıcıyı zaten takip ediyorsunuz'
        });
      } else if (existingFollow.status === 'rejected') {
        // Reddedilmiş isteği yeniden pending yap
        existingFollow.status = 'pending';
        existingFollow.updatedAt = new Date();
        await existingFollow.save();
      }
    } else {
      // Yeni takip isteği oluştur
      const newFollow = new Follow({
        senderId: senderId,
        receiverId: receiverId,
        status: 'pending'
      });
      await newFollow.save();
    }

    // Bildirim oluştur
    const notification = new Notification({
      userId: receiverId,
      fromUserId: senderId,
      type: 'follow_request',
      message: `${req.user.fullName || req.user.username} sizi takip etmek istiyor`,
      status: 'unread'
    });
    await notification.save();

    // Socket.io ile gerçek zamanlı bildirim gönder
    if (req.app.locals.io) {
      req.app.locals.io.to(`user_${receiverId}`).emit('newFollowRequest', {
        _id: notification._id,
        userId: notification.userId,
        fromUserId: notification.fromUserId,
        type: notification.type,
        message: notification.message,
        status: notification.status,
        createdAt: notification.createdAt
      });
    }

    console.log(`📤 Takip isteği gönderildi: ${senderId} -> ${receiverId}`);

    res.json({
      success: true,
      message: 'Takip isteği gönderildi',
      followStatus: 'pending'
    });

  } catch (error) {
    console.error('Takip isteği gönderme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Takip isteği gönderilemedi'
    });
  }
});

// POST /api/follow/accept/:id - Takip isteğini kabul et
router.post('/accept/:id', auth, async (req, res) => {
  try {
    const followId = req.params.id;
    const accepterId = req.user._id;

    // Takip isteğini bul
    const follow = await Follow.findById(followId);
    if (!follow) {
      return res.status(404).json({
        success: false,
        message: 'Takip isteği bulunamadı'
      });
    }

    // Sadece isteği alan kişi kabul edebilir
    if (follow.receiverId !== accepterId) {
      return res.status(403).json({
        success: false,
        message: 'Bu isteği kabul etme yetkiniz yok'
      });
    }

    // İsteği kabul et
    await follow.accept();

    // Kabul bildirimi oluştur
    const notification = new Notification({
      userId: follow.senderId,
      fromUserId: accepterId,
      type: 'follow_accepted',
      message: `${req.user.fullName || req.user.username} takip isteğinizi kabul etti`,
      status: 'unread'
    });
    await notification.save();

    // Socket.io ile gerçek zamanlı bildirim gönder
    if (req.app.locals.io) {
      req.app.locals.io.to(`user_${follow.senderId}`).emit('followAccepted', {
        _id: notification._id,
        userId: notification.userId,
        fromUserId: notification.fromUserId,
        type: notification.type,
        message: notification.message,
        status: notification.status,
        createdAt: notification.createdAt
      });
    }

    console.log(`✅ Takip isteği kabul edildi: ${follow.senderId} -> ${accepterId}`);

    res.json({
      success: true,
      message: 'Takip isteği kabul edildi',
      followStatus: 'accepted'
    });

  } catch (error) {
    console.error('Takip kabul etme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Takip isteği kabul edilemedi'
    });
  }
});

// POST /api/follow/reject/:id - Takip isteğini reddet
router.post('/reject/:id', auth, async (req, res) => {
  try {
    const followId = req.params.id;
    const rejecterId = req.user._id;

    // Takip isteğini bul
    const follow = await Follow.findById(followId);
    if (!follow) {
      return res.status(404).json({
        success: false,
        message: 'Takip isteği bulunamadı'
      });
    }

    // Sadece isteği alan kişi reddedebilir
    if (follow.receiverId !== rejecterId) {
      return res.status(403).json({
        success: false,
        message: 'Bu isteği reddetme yetkiniz yok'
      });
    }

    // İsteği reddet
    await follow.reject();

    // Red bildirimi oluştur
    const notification = new Notification({
      userId: follow.senderId,
      fromUserId: rejecterId,
      type: 'follow_rejected',
      message: `${req.user.fullName || req.user.username} takip isteğinizi reddetti`,
      status: 'unread'
    });
    await notification.save();

    // Socket.io ile gerçek zamanlı bildirim gönder
    if (req.app.locals.io) {
      req.app.locals.io.to(`user_${follow.senderId}`).emit('followRejected', {
        _id: notification._id,
        userId: notification.userId,
        fromUserId: notification.fromUserId,
        type: notification.type,
        message: notification.message,
        status: notification.status,
        createdAt: notification.createdAt
      });
    }

    console.log(`❌ Takip isteği reddedildi: ${follow.senderId} -> ${rejecterId}`);

    res.json({
      success: true,
      message: 'Takip isteği reddedildi',
      followStatus: 'rejected'
    });

  } catch (error) {
    console.error('Takip reddetme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Takip isteği reddedilemedi'
    });
  }
});

// GET /api/follow/status - İki kullanıcı arasındaki mevcut ilişki durumunu döndür
router.get('/status', auth, async (req, res) => {
  try {
    const { userId } = req.query;
    const currentUserId = req.user._id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId parametresi gerekli'
      });
    }

    const status = await Follow.getFollowStatus(currentUserId, userId);

    res.json({
      success: true,
      status: status,
      message: `Takip durumu: ${status}`
    });

  } catch (error) {
    console.error('Takip durumu kontrol hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Takip durumu kontrol edilemedi'
    });
  }
});

// GET /api/follow/counts/:userId - Takipçi ve takip edilen sayısı
router.get('/counts/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const followerCount = await Follow.getFollowerCount(userId);
    const followingCount = await Follow.getFollowingCount(userId);

    res.json({
      success: true,
      counts: {
        followers: followerCount,
        following: followingCount
      }
    });

  } catch (error) {
    console.error('Takip sayıları alma hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Takip sayıları alınamadı'
    });
  }
});

// POST /api/follow/unfollow - Takibi bırak
router.post('/unfollow', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user._id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId parametresi gerekli'
      });
    }

    console.log(`👋 Takip bırakma isteği: ${currentUserId} -> ${userId}`);

    // Takip ilişkisini bul
    const follow = await Follow.findOne({
      senderId: currentUserId,
      receiverId: userId,
      status: 'accepted'
    });

    if (!follow) {
      return res.status(404).json({
        success: false,
        message: 'Bu kullanıcıyı takip etmiyorsunuz'
      });
    }

    // Takibi bırak
    await follow.unfollow();

    console.log(`👋 Takip bırakıldı: ${currentUserId} -> ${userId}`);

    res.json({
      success: true,
      message: 'Takip bırakıldı',
      followStatus: 'not_following'
    });

  } catch (error) {
    console.error('Takip bırakma hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Takip bırakılamadı'
    });
  }
});

// GET /api/follow/followers/:userId - Takipçileri listele
router.get('/followers/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const followers = await Follow.find({
      receiverId: userId,
      status: 'accepted'
    })
    .populate('senderId', 'fullName username avatar email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const totalCount = await Follow.countDocuments({
      receiverId: userId,
      status: 'accepted'
    });

    res.json({
      success: true,
      followers: followers.map(f => ({
        _id: f.senderId._id,
        fullName: f.senderId.fullName,
        username: f.senderId.username,
        avatar: f.senderId.avatar,
        email: f.senderId.email,
        followedAt: f.createdAt
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount: totalCount,
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Takipçileri listeleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Takipçiler listelenemedi'
    });
  }
});

// GET /api/follow/following/:userId - Takip edilenleri listele
router.get('/following/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const following = await Follow.find({
      senderId: userId,
      status: 'accepted'
    })
    .populate('receiverId', 'fullName username avatar email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const totalCount = await Follow.countDocuments({
      senderId: userId,
      status: 'accepted'
    });

    res.json({
      success: true,
      following: following.map(f => ({
        _id: f.receiverId._id,
        fullName: f.receiverId.fullName,
        username: f.receiverId.username,
        avatar: f.receiverId.avatar,
        email: f.receiverId.email,
        followedAt: f.createdAt
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount: totalCount,
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Takip edilenleri listeleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Takip edilenler listelenemedi'
    });
  }
});

module.exports = router;
