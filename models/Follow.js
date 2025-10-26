const mongoose = require('mongoose');

// Instagram-style follow system model
const followSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true,
    ref: 'User'
  },
  receiverId: {
    type: String,
    required: true,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'blocked'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Unique constraint: bir kullanıcı aynı kişiye sadece bir kez istek atabilir
followSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

// Status'a göre indeks
followSchema.index({ status: 1 });

// Receiver'a göre indeks (bildirimler için)
followSchema.index({ receiverId: 1, status: 1 });

// Sender'a göre indeks (takip edilenler için)
followSchema.index({ senderId: 1, status: 1 });

// Kendini takip etme kontrolü
followSchema.pre('save', function(next) {
  if (this.senderId === this.receiverId) {
    const error = new Error('Kendinizi takip edemezsiniz');
    error.statusCode = 400;
    return next(error);
  }
  next();
});

// Static method: takip durumunu kontrol et
followSchema.statics.getFollowStatus = async function(senderId, receiverId) {
  try {
    const follow = await this.findOne({
      senderId: senderId,
      receiverId: receiverId
    });
    
    if (!follow) return 'not_following';
    return follow.status;
  } catch (error) {
    console.error('Takip durumu kontrol hatası:', error);
    return 'not_following';
  }
};

// Static method: takipçi sayısını al
followSchema.statics.getFollowerCount = async function(userId) {
  try {
    const count = await this.countDocuments({
      receiverId: userId,
      status: 'accepted'
    });
    return count;
  } catch (error) {
    console.error('Takipçi sayısı alma hatası:', error);
    return 0;
  }
};

// Static method: takip edilen sayısını al
followSchema.statics.getFollowingCount = async function(userId) {
  try {
    const count = await this.countDocuments({
      senderId: userId,
      status: 'accepted'
    });
    return count;
  } catch (error) {
    console.error('Takip edilen sayısı alma hatası:', error);
    return 0;
  }
};

// Instance method: takip isteğini kabul et
followSchema.methods.accept = async function() {
  this.status = 'accepted';
  this.updatedAt = new Date();
  return await this.save();
};

// Instance method: takip isteğini reddet
followSchema.methods.reject = async function() {
  this.status = 'rejected';
  this.updatedAt = new Date();
  return await this.save();
};

// Instance method: takibi bırak
followSchema.methods.unfollow = async function() {
  // Kaydı tamamen sil
  return await this.deleteOne();
};

module.exports = mongoose.model('Follow', followSchema);
