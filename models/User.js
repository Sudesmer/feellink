const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Kullanıcı adı gerekli'],
    unique: true,
    trim: true,
    minlength: [3, 'Kullanıcı adı en az 3 karakter olmalı'],
    maxlength: [30, 'Kullanıcı adı en fazla 30 karakter olmalı'],
    match: [/^[a-zA-Z0-9_]+$/, 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir']
  },
  email: {
    type: String,
    required: [true, 'E-posta gerekli'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Geçerli bir e-posta adresi girin']
  },
  password: {
    type: String,
    required: [true, 'Şifre gerekli'],
    minlength: [6, 'Şifre en az 6 karakter olmalı'],
    select: false // Varsayılan olarak şifreyi getirme
  },
  fullName: {
    type: String,
    required: [true, 'Ad soyad gerekli'],
    trim: true,
    maxlength: [100, 'Ad soyad en fazla 100 karakter olmalı']
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio en fazla 500 karakter olmalı'],
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
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
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'artist', 'admin'],
    default: 'user'
  },
  socialLinks: {
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    behance: { type: String, default: '' },
    dribbble: { type: String, default: '' }
  }
}, {
  timestamps: true
});

// İndeksler
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

// Şifreyi hash'lemeden önce
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  // Şifre bcrypt ile hash'leniyor
  const bcrypt = require('bcryptjs');
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(candidatePassword, this.password);
};

// Public profil metodu
userSchema.methods.getPublicProfile = function() {
  return {
    _id: this._id,
    username: this.username,
    fullName: this.fullName,
    email: this.email,
    bio: this.bio,
    avatar: this.avatar,
    coverImage: this.coverImage,
    website: this.website,
    location: this.location,
    followers: this.followers.length,
    following: this.following.length,
    savedWorks: this.savedWorks.length,
    isVerified: this.isVerified,
    role: this.role,
    socialLinks: this.socialLinks,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);
