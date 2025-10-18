const express = require('express');
const router = express.Router();

// Mock database
let users, categories, works, currentUserId;

// Initialize mock data
router.use((req, res, next) => {
  const { mockUsers, mockCategories, mockWorks } = require('../mock-data');
  users = users || [...mockUsers];
  categories = categories || [...mockCategories];
  works = works || [...mockWorks];
  currentUserId = currentUserId || 1;
  next();
});

// @route   GET /api/categories
// @desc    Tüm kategorileri getir
// @access  Public
router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Kategoriler alınırken hata oluştu'
    });
  }
});

// @route   GET /api/categories/:id
// @desc    Tek kategori detayını getir
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategori bulunamadı'
      });
    }

    res.json({
      success: true,
      category
    });

  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Kategori detayları alınırken hata oluştu'
    });
  }
});

// @route   GET /api/categories/:id/works
// @desc    Kategoriye ait eserleri getir
// @access  Public
router.get('/:id/works', async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = 'newest' } = req.query;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategori bulunamadı'
      });
    }

    // Sıralama
    let sortOption = { createdAt: -1 };
    switch (sort) {
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'mostLiked':
        sortOption = { likes: -1 };
        break;
      case 'mostViewed':
        sortOption = { views: -1 };
        break;
    }

    const works = await Work.find({ 
      category: req.params.id, 
      isPublished: true 
    })
    .populate('author', 'username fullName avatar isVerified')
    .populate('category', 'name color')
    .sort(sortOption)
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const totalWorks = await Work.countDocuments({ 
      category: req.params.id, 
      isPublished: true 
    });

    res.json({
      success: true,
      category,
      works: works.map(work => work.getPublicData()),
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(totalWorks / limit),
        total: totalWorks
      }
    });

  } catch (error) {
    console.error('Get category works error:', error);
    res.status(500).json({
      success: false,
      message: 'Kategori eserleri alınırken hata oluştu'
    });
  }
});

// @route   POST /api/categories
// @desc    Yeni kategori oluştur (Admin only)
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, description, icon, color, sortOrder } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Kategori adı gerekli'
      });
    }

    const category = new Category({
      name,
      description: description || '',
      icon: icon || '',
      color: color || '#FF6B35',
      sortOrder: sortOrder || 0
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Kategori oluşturuldu',
      category
    });

  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Kategori oluşturulurken hata oluştu'
    });
  }
});

// @route   PUT /api/categories/:id
// @desc    Kategori güncelle (Admin only)
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategori bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Kategori güncellendi',
      category
    });

  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Kategori güncellenirken hata oluştu'
    });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Kategori sil (Admin only)
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategori bulunamadı'
      });
    }

    // Kategoriye ait eser var mı kontrol et
    const worksCount = await Work.countDocuments({ category: req.params.id });
    if (worksCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Bu kategoriye ait eserler bulunduğu için silinemez'
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Kategori silindi'
    });

  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Kategori silinirken hata oluştu'
    });
  }
});

module.exports = router;
