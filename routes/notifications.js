const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth').authenticateToken;

// Instagram-style notification system routes

// GET /api/notifications - Kullanıcıya ait bildirimleri listele
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status; // 'unread', 'read', 'all'

    // Filtre oluştur
    const filter = { userId: userId };
    if (status && status !== 'all') {
      filter.status = status;
    }

    const notifications = await Notification.find(filter)
      .populate('fromUserId', 'fullName username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({
      userId: userId,
      status: 'unread'
    });

    res.json({
      success: true,
      notifications: notifications.map(notif => ({
        _id: notif._id,
        userId: notif.userId,
        fromUserId: notif.fromUserId,
        type: notif.type,
        message: notif.message,
        status: notif.status,
        createdAt: notif.createdAt,
        updatedAt: notif.updatedAt,
        fromUser: notif.fromUserId ? {
          _id: notif.fromUserId._id,
          fullName: notif.fromUserId.fullName,
          username: notif.fromUserId.username,
          avatar: notif.fromUserId.avatar
        } : null
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount: totalCount,
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      },
      unreadCount: unreadCount
    });

  } catch (error) {
    console.error('Bildirimleri listeleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Bildirimler listelenemedi'
    });
  }
});

// POST /api/notifications/read/:id - Bildirimi okundu yap
router.post('/read/:id', auth, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      _id: notificationId,
      userId: userId
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Bildirim bulunamadı'
      });
    }

    notification.status = 'read';
    notification.updatedAt = new Date();
    await notification.save();

    res.json({
      success: true,
      message: 'Bildirim okundu olarak işaretlendi'
    });

  } catch (error) {
    console.error('Bildirim okundu yapma hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Bildirim okundu yapılamadı'
    });
  }
});

// POST /api/notifications/read-all - Tüm bildirimleri okundu yap
router.post('/read-all', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { userId: userId, status: 'unread' },
      { status: 'read', updatedAt: new Date() }
    );

    res.json({
      success: true,
      message: 'Tüm bildirimler okundu olarak işaretlendi'
    });

  } catch (error) {
    console.error('Tüm bildirimleri okundu yapma hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Bildirimler okundu yapılamadı'
    });
  }
});

// DELETE /api/notifications/:id - Bildirimi sil
router.delete('/:id', auth, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId: userId
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Bildirim bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Bildirim silindi'
    });

  } catch (error) {
    console.error('Bildirim silme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Bildirim silinemedi'
    });
  }
});

// GET /api/notifications/unread-count - Okunmamış bildirim sayısı
router.get('/unread-count', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const unreadCount = await Notification.countDocuments({
      userId: userId,
      status: 'unread'
    });

    res.json({
      success: true,
      unreadCount: unreadCount
    });

  } catch (error) {
    console.error('Okunmamış bildirim sayısı alma hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Okunmamış bildirim sayısı alınamadı'
    });
  }
});

// POST /api/notifications/create - Manuel bildirim oluştur (test için)
router.post('/create', auth, async (req, res) => {
  try {
    const { userId, type, message } = req.body;
    const fromUserId = req.user.id;

    if (!userId || !type || !message) {
      return res.status(400).json({
        success: false,
        message: 'userId, type ve message parametreleri gerekli'
      });
    }

    const notification = new Notification({
      userId: userId,
      fromUserId: fromUserId,
      type: type,
      message: message,
      status: 'unread'
    });

    await notification.save();

    // Socket.io ile gerçek zamanlı bildirim gönder
    if (req.app.locals.io) {
      req.app.locals.io.to(`user_${userId}`).emit('newNotification', {
        _id: notification._id,
        userId: notification.userId,
        fromUserId: notification.fromUserId,
        type: notification.type,
        message: notification.message,
        status: notification.status,
        createdAt: notification.createdAt
      });
    }

    res.json({
      success: true,
      message: 'Bildirim oluşturuldu',
      notification: notification
    });

  } catch (error) {
    console.error('Bildirim oluşturma hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Bildirim oluşturulamadı'
    });
  }
});

// GET /api/notifications/types - Bildirim tiplerini listele
router.get('/types', (req, res) => {
  res.json({
    success: true,
    types: [
      {
        value: 'follow_request',
        label: 'Takip İsteği',
        description: 'Birisi sizi takip etmek istiyor'
      },
      {
        value: 'follow_accepted',
        label: 'Takip Kabul Edildi',
        description: 'Takip isteğiniz kabul edildi'
      },
      {
        value: 'follow_rejected',
        label: 'Takip Reddedildi',
        description: 'Takip isteğiniz reddedildi'
      },
      {
        value: 'like',
        label: 'Beğeni',
        description: 'Birisi gönderinizi beğendi'
      },
      {
        value: 'comment',
        label: 'Yorum',
        description: 'Birisi gönderinize yorum yaptı'
      },
      {
        value: 'mention',
        label: 'Bahsetme',
        description: 'Birisi sizi bahsetti'
      },
      {
        value: 'message',
        label: 'Mesaj',
        description: 'Yeni mesaj aldınız'
      }
    ]
  });
});

module.exports = router;
