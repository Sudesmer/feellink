const mongoose = require('mongoose');

const followRequestSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true
  },
  receiverId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  message: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Unique constraint - aynı kullanıcılar arasında sadece bir aktif istek olabilir
followRequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });
followRequestSchema.index({ receiverId: 1, status: 1 });
followRequestSchema.index({ senderId: 1, status: 1 });

module.exports = mongoose.model('FollowRequest', followRequestSchema);
