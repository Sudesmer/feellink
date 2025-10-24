const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Kategori adı gerekli'],
    unique: true,
    trim: true,
    maxlength: [50, 'Kategori adı en fazla 50 karakter olmalı']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [200, 'Açıklama en fazla 200 karakter olmalı'],
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#FF6B35',
    match: [/^#[0-9A-F]{6}$/i, 'Geçerli bir hex renk kodu girin']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create slug from name before saving
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);



