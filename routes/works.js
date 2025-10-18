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

// @route   GET /api/works
// @desc    Tüm eserleri getir (ana sayfa, keşfet)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      search, 
      sort = 'newest',
      featured 
    } = req.query;

    let filteredWorks = works.filter(work => work.isPublished);
    
    // Kategori filtresi
    if (category) {
      filteredWorks = filteredWorks.filter(work => work.category._id === category);
    }
    
    // Öne çıkan eserler filtresi
    if (featured === 'true') {
      filteredWorks = filteredWorks.filter(work => work.isFeatured);
    }
    
    // Arama filtresi
    if (search) {
      const searchLower = search.toLowerCase();
      filteredWorks = filteredWorks.filter(work => 
        work.title.toLowerCase().includes(searchLower) ||
        work.description.toLowerCase().includes(searchLower) ||
        work.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sıralama
    switch (sort) {
      case 'oldest':
        filteredWorks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'mostLiked':
        filteredWorks.sort((a, b) => b.likeCount - a.likeCount);
        break;
      case 'mostViewed':
        filteredWorks.sort((a, b) => b.views - a.views);
        break;
      case 'featured':
        filteredWorks.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        break;
      default: // newest
        filteredWorks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedWorks = filteredWorks.slice(startIndex, endIndex);

    res.json({
      success: true,
      works: paginatedWorks,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(filteredWorks.length / limit),
        total: filteredWorks.length
      }
    });

  } catch (error) {
    console.error('Get works error:', error);
    res.status(500).json({
      success: false,
      message: 'Eserler alınırken hata oluştu'
    });
  }
});

// @route   GET /api/works/:id
// @desc    Tek eser detayını getir
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const work = works.find(w => w._id === req.params.id);

    if (!work) {
      return res.status(404).json({
        success: false,
        message: 'Eser bulunamadı'
      });
    }

    if (!work.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Eser bulunamadı'
      });
    }

    // Görüntülenme sayısını artır
    work.views += 1;

    res.json({
      success: true,
      work
    });

  } catch (error) {
    console.error('Get work error:', error);
    res.status(500).json({
      success: false,
      message: 'Eser detayları alınırken hata oluştu'
    });
  }
});

// @route   POST /api/works
// @desc    Yeni eser oluştur
// @access  Private
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      images,
      category,
      tags,
      projectUrl,
      tools,
      year,
      client,
      team
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Başlık, açıklama ve kategori gerekli'
      });
    }

    const work = new Work({
      title,
      description,
      images: images || [],
      category,
      tags: tags || [],
      author: req.user._id,
      projectUrl: projectUrl || '',
      tools: tools || [],
      year: year || new Date().getFullYear(),
      client: client || '',
      team: team || []
    });

    await work.save();
    await work.populate('category', 'name color');

    res.status(201).json({
      success: true,
      message: 'Eser oluşturuldu',
      work: work.getPublicData()
    });

  } catch (error) {
    console.error('Create work error:', error);
    res.status(500).json({
      success: false,
      message: 'Eser oluşturulurken hata oluştu'
    });
  }
});

// @route   PUT /api/works/:id
// @desc    Eser güncelle
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);

    if (!work) {
      return res.status(404).json({
        success: false,
        message: 'Eser bulunamadı'
      });
    }

    // Sadece eser sahibi güncelleyebilir
    if (work.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Bu eseri güncelleme yetkiniz yok'
      });
    }

    const updateData = req.body;
    const updatedWork = await Work.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name color');

    res.json({
      success: true,
      message: 'Eser güncellendi',
      work: updatedWork.getPublicData()
    });

  } catch (error) {
    console.error('Update work error:', error);
    res.status(500).json({
      success: false,
      message: 'Eser güncellenirken hata oluştu'
    });
  }
});

// @route   DELETE /api/works/:id
// @desc    Eser sil
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);

    if (!work) {
      return res.status(404).json({
        success: false,
        message: 'Eser bulunamadı'
      });
    }

    // Sadece eser sahibi silebilir
    if (work.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Bu eseri silme yetkiniz yok'
      });
    }

    await Work.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Eser silindi'
    });

  } catch (error) {
    console.error('Delete work error:', error);
    res.status(500).json({
      success: false,
      message: 'Eser silinirken hata oluştu'
    });
  }
});

// @route   POST /api/works/:id/like
// @desc    Eseri beğen/beğenme
// @access  Private
router.post('/:id/like', async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);

    if (!work) {
      return res.status(404).json({
        success: false,
        message: 'Eser bulunamadı'
      });
    }

    const isLiked = work.likes.includes(req.user._id);

    if (isLiked) {
      // Beğeniyi kaldır
      work.likes.pull(req.user._id);
      await work.save();
      
      res.json({
        success: true,
        message: 'Beğeni kaldırıldı',
        isLiked: false,
        likeCount: work.likes.length
      });
    } else {
      // Beğeni ekle
      work.likes.push(req.user._id);
      await work.save();
      
      res.json({
        success: true,
        message: 'Eser beğenildi',
        isLiked: true,
        likeCount: work.likes.length
      });
    }

  } catch (error) {
    console.error('Like work error:', error);
    res.status(500).json({
      success: false,
      message: 'Beğeni işlemi sırasında hata oluştu'
    });
  }
});

// @route   POST /api/works/:id/save
// @desc    Eseri kaydet/kaydetme
// @access  Private
router.post('/:id/save', async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);

    if (!work) {
      return res.status(404).json({
        success: false,
        message: 'Eser bulunamadı'
      });
    }

    const user = await User.findById(req.user._id);
    const isSaved = user.savedWorks.includes(req.params.id);

    if (isSaved) {
      // Kaydetmeyi kaldır
      user.savedWorks.pull(req.params.id);
      await user.save();
      
      res.json({
        success: true,
        message: 'Eser kaydedilenlerden kaldırıldı',
        isSaved: false
      });
    } else {
      // Kaydet
      user.savedWorks.push(req.params.id);
      await user.save();
      
      res.json({
        success: true,
        message: 'Eser kaydedildi',
        isSaved: true
      });
    }

  } catch (error) {
    console.error('Save work error:', error);
    res.status(500).json({
      success: false,
      message: 'Kaydetme işlemi sırasında hata oluştu'
    });
  }
});

// @route   GET /api/works/saved
// @desc    Kaydedilen eserleri getir
// @access  Private
router.get('/saved', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findById(req.user._id)
      .populate({
        path: 'savedWorks',
        populate: {
          path: 'author',
          select: 'username fullName avatar isVerified'
        },
        populate: {
          path: 'category',
          select: 'name color'
        },
        options: {
          limit: limit * 1,
          skip: (page - 1) * limit,
          sort: { createdAt: -1 }
        }
      });

    res.json({
      success: true,
      works: user.savedWorks.map(work => work.getPublicData()),
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(user.savedWorks.length / limit),
        total: user.savedWorks.length
      }
    });

  } catch (error) {
    console.error('Get saved works error:', error);
    res.status(500).json({
      success: false,
      message: 'Kaydedilen eserler alınırken hata oluştu'
    });
  }
});

module.exports = router;
