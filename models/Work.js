const mongoose = require('mongoose');

const workSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Eser başlığı gereklidir'],
    trim: true,
    maxlength: [100, 'Başlık en fazla 100 karakter olabilir']
  },
  description: {
    type: String,
    required: [true, 'Eser açıklaması gereklidir'],
    trim: true,
    maxlength: [1000, 'Açıklama en fazla 1000 karakter olabilir']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Etiket en fazla 30 karakter olabilir']
  }],
  isPublished: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      maxlength: [500, 'Yorum en fazla 500 karakter olabilir']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tools: [{
    type: String,
    trim: true
  }],
  projectUrl: {
    type: String,
    default: ''
  },
  behanceUrl: {
    type: String,
    default: ''
  },
  dribbbleUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index'ler
workSchema.index({ author: 1, createdAt: -1 });
workSchema.index({ category: 1, createdAt: -1 });
workSchema.index({ isPublished: 1, isFeatured: 1, createdAt: -1 });
workSchema.index({ tags: 1 });
workSchema.index({ 'title': 'text', 'description': 'text', 'tags': 'text' });

// Public data metodu
workSchema.methods.getPublicData = function() {
  return {
    _id: this._id,
    title: this.title,
    description: this.description,
    images: this.images,
    author: this.author,
    category: this.category,
    tags: this.tags,
    isPublished: this.isPublished,
    isFeatured: this.isFeatured,
    views: this.views,
    likes: this.likes.length,
    comments: this.comments.length,
    tools: this.tools,
    projectUrl: this.projectUrl,
    behanceUrl: this.behanceUrl,
    dribbbleUrl: this.dribbbleUrl,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Beğeni ekleme metodu
workSchema.methods.addLike = function(userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Beğeni kaldırma metodu
workSchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(like => !like.equals(userId));
  return this.save();
};

// Yorum ekleme metodu
workSchema.methods.addComment = function(userId, text) {
  this.comments.push({
    user: userId,
    text: text
  });
  return this.save();
};

// Görüntülenme sayısını artırma metodu
workSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

module.exports = mongoose.model('Work', workSchema);
