const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Kullanıcı adı gereklidir'],
    unique: true,
    trim: true,
    minlength: [3, 'Kullanıcı adı en az 3 karakter olmalıdır'],
    maxlength: [20, 'Kullanıcı adı en fazla 20 karakter olabilir'],
    match: [/^[a-zA-Z0-9_]+$/, 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir']
  },
  email: {
    type: String,
    required: [true, 'E-posta gereklidir'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Geçerli bir e-posta adresi giriniz']
  },
  password: {
    type: String,
    required: [true, 'Şifre gereklidir'],
    minlength: [6, 'Şifre en az 6 karakter olmalıdır']
  },
  fullName: {
    type: String,
    required: [true, 'Ad soyad gereklidir'],
    trim: true,
    maxlength: [50, 'Ad soyad en fazla 50 karakter olabilir']
  },
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'Biyografi en fazla 500 karakter olabilir'],
    default: ''
  },
  location: {
    type: String,
    maxlength: [100, 'Konum en fazla 100 karakter olabilir'],
    default: ''
  },
  website: {
    type: String,
    maxlength: [200, 'Website URL en fazla 200 karakter olabilir'],
    default: ''
  },
  socialLinks: {
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    behance: { type: String, default: '' },
    dribbble: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  savedWorks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Work'
  }],
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index'ler
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Şifre hash'leme middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Public profil metodu
userSchema.methods.getPublicProfile = function() {
  return {
    _id: this._id,
    username: this.username,
    fullName: this.fullName,
    avatar: this.avatar,
    bio: this.bio,
    location: this.location,
    website: this.website,
    socialLinks: this.socialLinks,
    isVerified: this.isVerified,
    followers: this.followers.length,
    following: this.following.length,
    createdAt: this.createdAt
  };
};

// Basit profil metodu (liste görünümleri için)
userSchema.methods.getSimpleProfile = function() {
  return {
    _id: this._id,
    username: this.username,
    fullName: this.fullName,
    avatar: this.avatar,
    isVerified: this.isVerified
  };
};

module.exports = mongoose.model('User', userSchema);
