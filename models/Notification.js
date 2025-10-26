const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  fromUserId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['follow_request', 'follow_accepted', 'like', 'comment', 'mention'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedId: {
    type: String
  },
  relatedModel: {
    type: String,
    enum: ['FollowRequest', 'Work', 'Comment']
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index'ler
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ status: 1 });
notificationSchema.index({ type: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
