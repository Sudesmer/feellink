// Mock data for testing without MongoDB
const mockUsers = [
  {
    _id: '1',
    username: 'testuser',
    email: 'test@example.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
    fullName: 'Test User',
    bio: 'Test kullanıcısı',
    avatar: '',
    followers: [],
    following: [],
    savedWorks: [],
    isVerified: false,
    createdAt: new Date()
  },
  {
    _id: '2',
    username: 'admin',
    email: 'admin@feellink.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
    fullName: 'Admin User',
    bio: 'Feellink yöneticisi',
    avatar: '',
    followers: [],
    following: [],
    savedWorks: [],
    isVerified: true,
    createdAt: new Date()
  },
  {
    _id: '3',
    username: 'designer',
    email: 'designer@feellink.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
    fullName: 'Creative Designer',
    bio: 'Profesyonel grafik tasarımcı',
    avatar: '',
    followers: [],
    following: [],
    savedWorks: [],
    isVerified: true,
    createdAt: new Date()
  }
];

const mockCategories = [
  {
    _id: '1',
    name: 'Grafik Tasarım',
    slug: 'grafik-tasarim',
    color: '#FF6B35',
    icon: '🎨'
  },
  {
    _id: '2',
    name: 'Web Tasarım',
    slug: 'web-tasarim',
    color: '#4CAF50',
    icon: '💻'
  },
  {
    _id: '3',
    name: 'UI/UX',
    slug: 'ui-ux',
    color: '#2196F3',
    icon: '📱'
  }
];

const mockWorks = [
  {
    _id: '1',
    title: 'The Birth of Venus',
    description: 'Sandro Botticelli\'nin ünlü rönesans eseri',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
        alt: 'The Birth of Venus',
        isMain: true
      }
    ],
    category: {
      _id: '3',
      name: 'Resim',
      color: '#9C27B0'
    },
    author: {
      _id: '17',
      username: 'botticelli',
      fullName: 'Sandro Botticelli',
      avatar: '',
      isVerified: true,
      followers: 18000
    },
    likes: [],
    likeCount: 3200,
    views: 75000,
    isPublished: true,
    isFeatured: true,
    tags: ['resim', 'rönesans', 'venus'],
    tools: ['Tempera'],
    year: 1485,
    createdAt: new Date()
  },
  {
    _id: '2',
    title: 'The Persistence of Memory',
    description: 'Salvador Dalí\'nin sürrealist başyapıtı',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        alt: 'The Persistence of Memory',
        isMain: true
      }
    ],
    category: {
      _id: '3',
      name: 'Resim',
      color: '#9C27B0'
    },
    author: {
      _id: '18',
      username: 'dali',
      fullName: 'Salvador Dalí',
      avatar: '',
      isVerified: true,
      followers: 28000
    },
    likes: [],
    likeCount: 4500,
    views: 95000,
    isPublished: true,
    isFeatured: true,
    tags: ['resim', 'sürrealizm', 'saat'],
    tools: ['Yağlı Boya'],
    year: 1931,
    createdAt: new Date()
  },
  {
    _id: '3',
    title: 'The Kiss',
    description: 'Gustav Klimt\'in art nouveau başyapıtı',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop',
        alt: 'The Kiss',
        isMain: true
      }
    ],
    category: {
      _id: '3',
      name: 'Resim',
      color: '#9C27B0'
    },
    author: {
      _id: '19',
      username: 'klimt',
      fullName: 'Gustav Klimt',
      avatar: '',
      isVerified: true,
      followers: 25000
    },
    likes: [],
    likeCount: 3800,
    views: 85000,
    isPublished: true,
    isFeatured: true,
    tags: ['resim', 'art nouveau', 'öpmek'],
    tools: ['Yağlı Boya'],
    year: 1908,
    createdAt: new Date()
  },
  {
    _id: '4',
    title: 'Poster Tasarım',
    description: 'Yaratıcı poster tasarım çalışması',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        alt: 'Poster Tasarım',
        isMain: true
      }
    ],
    category: {
      _id: '1',
      name: 'Grafik Tasarım',
      color: '#FF6B35'
    },
    author: {
      _id: '1',
      username: 'testuser',
      fullName: 'Test User',
      avatar: '',
      isVerified: false,
      followers: 0
    },
    likes: [],
    likeCount: 0,
    views: 67,
    isPublished: true,
    isFeatured: false,
    tags: ['poster', 'tasarım', 'grafik'],
    tools: ['Photoshop', 'Illustrator'],
    year: 2024,
    createdAt: new Date()
  },
  {
    _id: '5',
    title: 'Dashboard Tasarım',
    description: 'Modern dashboard arayüz tasarımı',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
        alt: 'Dashboard Tasarım',
        isMain: true
      }
    ],
    category: {
      _id: '3',
      name: 'UI/UX',
      color: '#2196F3'
    },
    author: {
      _id: '1',
      username: 'testuser',
      fullName: 'Test User',
      avatar: '',
      isVerified: false,
      followers: 0
    },
    likes: [],
    likeCount: 0,
    views: 189,
    isPublished: true,
    isFeatured: true,
    tags: ['dashboard', 'ui', 'data'],
    tools: ['Figma', 'React'],
    year: 2024,
    createdAt: new Date()
  },
  // Sanatçı Tabloları - 5x5 Grid için 25 eser
  {
    _id: '4',
    title: 'Mona Lisa',
    description: 'Leonardo da Vinci\'nin ünlü eseri',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
        alt: 'Mona Lisa',
        isMain: true
      }
    ],
    category: {
      _id: '3',
      name: 'Resim',
      color: '#9C27B0'
    },
    author: {
      _id: '2',
      username: 'leonardo',
      fullName: 'Leonardo da Vinci',
      avatar: '',
      isVerified: true,
      followers: 15000
    },
    likes: [],
    likeCount: 2500,
    views: 50000,
    isPublished: true,
    isFeatured: true,
    tags: ['resim', 'rönesans', 'portre'],
    tools: ['Yağlı Boya'],
    year: 1503,
    createdAt: new Date()
  },
  {
    _id: '5',
    title: 'Yıldızlı Gece',
    description: 'Vincent van Gogh\'un ünlü eseri',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        alt: 'Yıldızlı Gece',
        isMain: true
      }
    ],
    category: {
      _id: '3',
      name: 'Resim',
      color: '#9C27B0'
    },
    author: {
      _id: '3',
      username: 'vangogh',
      fullName: 'Vincent van Gogh',
      avatar: '',
      isVerified: true,
      followers: 20000
    },
    likes: [],
    likeCount: 3200,
    views: 75000,
    isPublished: true,
    isFeatured: true,
    tags: ['resim', 'post-empresyonizm', 'gece'],
    tools: ['Yağlı Boya'],
    year: 1889,
    createdAt: new Date()
  },
  {
    _id: '6',
    title: 'Guernica',
    description: 'Pablo Picasso\'nun savaş karşıtı eseri',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop',
        alt: 'Guernica',
        isMain: true
      }
    ],
    category: {
      _id: '3',
      name: 'Resim',
      color: '#9C27B0'
    },
    author: {
      _id: '4',
      username: 'picasso',
      fullName: 'Pablo Picasso',
      avatar: '',
      isVerified: true,
      followers: 30000
    },
    likes: [],
    likeCount: 4500,
    views: 100000,
    isPublished: true,
    isFeatured: true,
    tags: ['resim', 'kübizm', 'savaş'],
    tools: ['Yağlı Boya'],
    year: 1937,
    createdAt: new Date()
  },
  {
    _id: '7',
    title: 'Scream',
    description: 'Edvard Munch\'un ünlü eseri',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&h=600&fit=crop',
        alt: 'Scream',
        isMain: true
      }
    ],
    category: {
      _id: '3',
      name: 'Resim',
      color: '#9C27B0'
    },
    author: {
      _id: '5',
      username: 'munch',
      fullName: 'Edvard Munch',
      avatar: '',
      isVerified: true,
      followers: 18000
    },
    likes: [],
    likeCount: 2800,
    views: 65000,
    isPublished: true,
    isFeatured: true,
    tags: ['resim', 'ekspresyonizm', 'çığlık'],
    tools: ['Yağlı Boya'],
    year: 1893,
    createdAt: new Date()
  },
  {
    _id: '8',
    title: 'The Great Wave',
    description: 'Katsushika Hokusai\'nin ünlü eseri',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=800&h=600&fit=crop',
        alt: 'The Great Wave',
        isMain: true
      }
    ],
    category: {
      _id: '4',
      name: 'Japon Sanatı',
      color: '#2196F3'
    },
    author: {
      _id: '6',
      username: 'hokusai',
      fullName: 'Katsushika Hokusai',
      avatar: '',
      isVerified: true,
      followers: 12000
    },
    likes: [],
    likeCount: 1900,
    views: 45000,
    isPublished: true,
    isFeatured: true,
    tags: ['japon', 'ahşap baskı', 'dalga'],
    tools: ['Ahşap Baskı'],
    year: 1831,
    createdAt: new Date()
  },
  // Daha fazla sanatçı eseri - 5x5 grid için 20 eser daha
  {
    _id: '9',
    title: 'The Persistence of Memory',
    description: 'Salvador Dalí\'nin ünlü eseri',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&h=600&fit=crop',
        alt: 'The Persistence of Memory',
        isMain: true
      }
    ],
    category: {
      _id: '3',
      name: 'Resim',
      color: '#9C27B0'
    },
    author: {
      _id: '7',
      username: 'dali',
      fullName: 'Salvador Dalí',
      avatar: '',
      isVerified: true,
      followers: 25000
    },
    likes: [],
    likeCount: 3800,
    views: 85000,
    isPublished: true,
    isFeatured: true,
    tags: ['resim', 'sürrealizm', 'saat'],
    tools: ['Yağlı Boya'],
    year: 1931,
    createdAt: new Date()
  },
  {
    _id: '10',
    title: 'The Birth of Venus',
    description: 'Sandro Botticelli\'nin ünlü eseri',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&h=600&fit=crop',
        alt: 'The Birth of Venus',
        isMain: true
      }
    ],
    category: {
      _id: '3',
      name: 'Resim',
      color: '#9C27B0'
    },
    author: {
      _id: '8',
      username: 'botticelli',
      fullName: 'Sandro Botticelli',
      avatar: '',
      isVerified: true,
      followers: 16000
    },
    likes: [],
    likeCount: 2200,
    views: 55000,
    isPublished: true,
    isFeatured: true,
    tags: ['resim', 'rönesans', 'venus'],
    tools: ['Tempera'],
    year: 1485,
    createdAt: new Date()
  },
  {
    _id: '11',
    title: 'The Kiss',
    description: 'Gustav Klimt\'in ünlü eseri',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&h=600&fit=crop',
        alt: 'The Kiss',
        isMain: true
      }
    ],
    category: {
      _id: '3',
      name: 'Resim',
      color: '#9C27B0'
    },
    author: {
      _id: '9',
      username: 'klimt',
      fullName: 'Gustav Klimt',
      avatar: '',
      isVerified: true,
      followers: 22000
    },
    likes: [],
    likeCount: 3100,
    views: 70000,
    isPublished: true,
    isFeatured: true,
    tags: ['resim', 'art nouveau', 'öpmek'],
    tools: ['Yağlı Boya'],
    year: 1908,
    createdAt: new Date()
  },
  {
    _id: '12',
    title: 'Water Lilies',
    description: 'Claude Monet\'nin ünlü eseri',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=600&fit=crop',
        alt: 'Water Lilies',
        isMain: true
      }
    ],
    category: {
      _id: '3',
      name: 'Resim',
      color: '#9C27B0'
    },
    author: {
      _id: '10',
      username: 'monet',
      fullName: 'Claude Monet',
      avatar: '',
      isVerified: true,
      followers: 28000
    },
    likes: [],
    likeCount: 4200,
    views: 95000,
    isPublished: true,
    isFeatured: true,
    tags: ['resim', 'empresyonizm', 'nilüfer'],
    tools: ['Yağlı Boya'],
    year: 1919,
    createdAt: new Date()
  },
  {
    _id: '13',
    title: 'The Last Supper',
    description: 'Leonardo da Vinci\'nin ünlü eseri',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&h=600&fit=crop',
        alt: 'The Last Supper',
        isMain: true
      }
    ],
    category: {
      _id: '3',
      name: 'Resim',
      color: '#9C27B0'
    },
    author: {
      _id: '2',
      username: 'leonardo',
      fullName: 'Leonardo da Vinci',
      avatar: '',
      isVerified: true,
      followers: 15000
    },
    likes: [],
    likeCount: 5000,
    views: 120000,
    isPublished: true,
    isFeatured: true,
    tags: ['resim', 'rönesans', 'son akşam yemeği'],
    tools: ['Tempera'],
    year: 1498,
    createdAt: new Date()
  },
  {
    _id: '14',
    title: 'The Great Wave off Kanagawa',
    description: 'Katsushika Hokusai\'nin ünlü eseri',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=600&fit=crop',
        alt: 'The Great Wave off Kanagawa',
        isMain: true
      }
    ],
    category: {
      _id: '4',
      name: 'Japon Sanatı',
      color: '#2196F3'
    },
    author: {
      _id: '6',
      username: 'hokusai',
      fullName: 'Katsushika Hokusai',
      avatar: '',
      isVerified: true,
      followers: 12000
    },
    likes: [],
    likeCount: 2100,
    views: 50000,
    isPublished: true,
    isFeatured: true,
    tags: ['japon', 'ahşap baskı', 'dalga'],
    tools: ['Ahşap Baskı'],
    year: 1831,
    createdAt: new Date()
  },
  {
    _id: '15',
    title: 'The Scream',
    description: 'Edvard Munch\'un ünlü eseri',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop',
        alt: 'The Scream',
        isMain: true
      }
    ],
    category: {
      _id: '3',
      name: 'Resim',
      color: '#9C27B0'
    },
    author: {
      _id: '5',
      username: 'munch',
      fullName: 'Edvard Munch',
      avatar: '',
      isVerified: true,
      followers: 18000
    },
    likes: [],
    likeCount: 2900,
    views: 68000,
    isPublished: true,
    isFeatured: true,
    tags: ['resim', 'ekspresyonizm', 'çığlık'],
    tools: ['Yağlı Boya'],
    year: 1893,
    createdAt: new Date()
  },
  {
    _id: '16',
    title: 'The Starry Night',
    description: 'Vincent van Gogh\'un ünlü eseri',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=800&h=600&fit=crop',
        alt: 'The Starry Night',
        isMain: true
      }
    ],
    category: {
      _id: '3',
      name: 'Resim',
      color: '#9C27B0'
    },
    author: {
      _id: '3',
      username: 'vangogh',
      fullName: 'Vincent van Gogh',
      avatar: '',
      isVerified: true,
      followers: 20000
    },
    likes: [],
    likeCount: 3500,
    views: 80000,
    isPublished: true,
    isFeatured: true,
    tags: ['resim', 'post-empresyonizm', 'gece'],
    tools: ['Yağlı Boya'],
    year: 1889,
    createdAt: new Date()
  },
  {
    _id: '17',
    title: 'Girl with a Pearl Earring',
    description: 'Johannes Vermeer\'in ünlü eseri',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1561214078-f3247647fc5e?w=800&h=600&fit=crop',
        alt: 'Girl with a Pearl Earring',
        isMain: true
      }
    ],
    category: {
      _id: '3',
      name: 'Resim',
      color: '#9C27B0'
    },
    author: {
      _id: '11',
      username: 'vermeer',
      fullName: 'Johannes Vermeer',
      avatar: '',
      isVerified: true,
      followers: 14000
    },
    likes: [],
    likeCount: 2600,
    views: 60000,
    isPublished: true,
    isFeatured: true,
    tags: ['resim', 'barok', 'portre'],
    tools: ['Yağlı Boya'],
    year: 1665,
    createdAt: new Date()
  },
  {
    _id: '18',
    title: 'The Creation of Adam',
    description: 'Michelangelo\'nin ünlü eseri',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&h=600&fit=crop',
        alt: 'The Creation of Adam',
        isMain: true
      }
    ],
    category: {
      _id: '5',
      name: 'Fresk',
      color: '#FF9800'
    },
    author: {
      _id: '12',
      username: 'michelangelo',
      fullName: 'Michelangelo',
      avatar: '',
      isVerified: true,
      followers: 35000
    },
    likes: [],
    likeCount: 6000,
    views: 150000,
    isPublished: true,
    isFeatured: true,
    tags: ['fresk', 'rönesans', 'yaratılış'],
    tools: ['Fresk'],
    year: 1512,
    createdAt: new Date()
  },
  {
    _id: '19',
    title: 'The Night Watch',
    description: 'Rembrandt\'ın ünlü eseri',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=800&h=600&fit=crop',
        alt: 'The Night Watch',
        isMain: true
      }
    ],
    category: {
      _id: '3',
      name: 'Resim',
      color: '#9C27B0'
    },
    author: {
      _id: '13',
      username: 'rembrandt',
      fullName: 'Rembrandt',
      avatar: '',
      isVerified: true,
      followers: 19000
    },
    likes: [],
    likeCount: 2800,
    views: 65000,
    isPublished: true,
    isFeatured: true,
    tags: ['resim', 'barok', 'gece'],
    tools: ['Yağlı Boya'],
    year: 1642,
    createdAt: new Date()
  },
  {
    _id: '20',
    title: 'The Garden of Earthly Delights',
    description: 'Hieronymus Bosch\'un ünlü eseri',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&h=600&fit=crop',
        alt: 'The Garden of Earthly Delights',
        isMain: true
      }
    ],
    category: {
      _id: '3',
      name: 'Resim',
      color: '#9C27B0'
    },
    author: {
      _id: '14',
      username: 'bosch',
      fullName: 'Hieronymus Bosch',
      avatar: '',
      isVerified: true,
      followers: 13000
    },
    likes: [],
    likeCount: 1900,
    views: 45000,
    isPublished: true,
    isFeatured: true,
    tags: ['resim', 'gotik', 'cennet'],
    tools: ['Yağlı Boya'],
    year: 1503,
    createdAt: new Date()
  },
  {
    _id: '21',
    title: 'The Arnolfini Portrait',
    description: 'Jan van Eyck\'in ünlü eseri',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&h=600&fit=crop',
        alt: 'The Arnolfini Portrait',
        isMain: true
      }
    ],
    category: {
      _id: '3',
      name: 'Resim',
      color: '#9C27B0'
    },
    author: {
      _id: '15',
      username: 'vaneyck',
      fullName: 'Jan van Eyck',
      avatar: '',
      isVerified: true,
      followers: 11000
    },
    likes: [],
    likeCount: 1700,
    views: 40000,
    isPublished: true,
    isFeatured: true,
    tags: ['resim', 'flaman', 'portre'],
    tools: ['Yağlı Boya'],
    year: 1434,
    createdAt: new Date()
  },
  {
    _id: '22',
    title: 'The School of Athens',
    description: 'Raphael\'in ünlü eseri',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop',
        alt: 'The School of Athens',
        isMain: true
      }
    ],
    category: {
      _id: '5',
      name: 'Fresk',
      color: '#FF9800'
    },
    author: {
      _id: '16',
      username: 'raphael',
      fullName: 'Raphael',
      avatar: '',
      isVerified: true,
      followers: 17000
    },
    likes: [],
    likeCount: 2400,
    views: 55000,
    isPublished: true,
    isFeatured: true,
    tags: ['fresk', 'rönesans', 'atina'],
    tools: ['Fresk'],
    year: 1511,
    createdAt: new Date()
  },
  {
    _id: '23',
    title: 'The Birth of Venus',
    description: 'Sandro Botticelli\'nin ünlü eseri',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
        alt: 'The Birth of Venus',
        isMain: true
      }
    ],
    category: {
      _id: '3',
      name: 'Resim',
      color: '#9C27B0'
    },
    author: {
      _id: '8',
      username: 'botticelli',
      fullName: 'Sandro Botticelli',
      avatar: '',
      isVerified: true,
      followers: 16000
    },
    likes: [],
    likeCount: 2300,
    views: 52000,
    isPublished: true,
    isFeatured: true,
    tags: ['resim', 'rönesans', 'venus'],
    tools: ['Tempera'],
    year: 1485,
    createdAt: new Date()
  },
  {
    _id: '24',
    title: 'The Great Wave',
    description: 'Katsushika Hokusai\'nin ünlü eseri',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        alt: 'The Great Wave',
        isMain: true
      }
    ],
    category: {
      _id: '4',
      name: 'Japon Sanatı',
      color: '#2196F3'
    },
    author: {
      _id: '6',
      username: 'hokusai',
      fullName: 'Katsushika Hokusai',
      avatar: '',
      isVerified: true,
      followers: 12000
    },
    likes: [],
    likeCount: 2000,
    views: 48000,
    isPublished: true,
    isFeatured: true,
    tags: ['japon', 'ahşap baskı', 'dalga'],
    tools: ['Ahşap Baskı'],
    year: 1831,
    createdAt: new Date()
  },
  {
    _id: '25',
    title: 'The Mona Lisa',
    description: 'Leonardo da Vinci\'nin ünlü eseri',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop',
        alt: 'The Mona Lisa',
        isMain: true
      }
    ],
    category: {
      _id: '3',
      name: 'Resim',
      color: '#9C27B0'
    },
    author: {
      _id: '2',
      username: 'leonardo',
      fullName: 'Leonardo da Vinci',
      avatar: '',
      isVerified: true,
      followers: 15000
    },
    likes: [],
    likeCount: 2700,
    views: 62000,
    isPublished: true,
    isFeatured: true,
    tags: ['resim', 'rönesans', 'portre'],
    tools: ['Yağlı Boya'],
    year: 1503,
    createdAt: new Date()
  },
  {
    _id: '26',
    title: 'Modern UI Design',
    description: 'Contemporary user interface design',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        alt: 'Modern UI Design',
        isMain: true
      }
    ],
    category: {
      _id: '3',
      name: 'UI/UX',
      color: '#2196F3'
    },
    author: {
      _id: '26',
      username: 'uidesigner',
      fullName: 'UI Designer',
      avatar: '',
      isVerified: true,
      followers: 12000
    },
    likes: [],
    likeCount: 1800,
    views: 35000,
    isPublished: true,
    isFeatured: true,
    tags: ['ui', 'design', 'modern'],
    tools: ['Figma', 'Sketch'],
    year: 2024,
    createdAt: new Date()
  },
  {
    _id: '27',
    title: 'Abstract Art',
    description: 'Contemporary abstract painting',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
        alt: 'Abstract Art',
        isMain: true
      }
    ],
    category: {
      _id: '3',
      name: 'Resim',
      color: '#9C27B0'
    },
    author: {
      _id: '27',
      username: 'abstractartist',
      fullName: 'Abstract Artist',
      avatar: '',
      isVerified: false,
      followers: 5000
    },
    likes: [],
    likeCount: 1200,
    views: 25000,
    isPublished: true,
    isFeatured: false,
    tags: ['abstract', 'art', 'contemporary'],
    tools: ['Acrylic', 'Canvas'],
    year: 2024,
    createdAt: new Date()
  },
  {
    _id: '28',
    title: 'Logo Design',
    description: 'Creative logo design for modern brand',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        alt: 'Logo Design',
        isMain: true
      }
    ],
    category: {
      _id: '1',
      name: 'Grafik Tasarım',
      color: '#FF6B35'
    },
    author: {
      _id: '28',
      username: 'logodesigner',
      fullName: 'Logo Designer',
      avatar: '',
      isVerified: true,
      followers: 8000
    },
    likes: [],
    likeCount: 900,
    views: 18000,
    isPublished: true,
    isFeatured: false,
    tags: ['logo', 'branding', 'design'],
    tools: ['Illustrator', 'Photoshop'],
    year: 2024,
    createdAt: new Date()
  }
];

// Mock yorum verisi
const mockComments = [
  {
    _id: '1',
    workId: '1',
    userId: '1',
    username: 'testuser',
    avatar: '/sude.jpg',
    content: 'Harika bir çalışma! Renkler çok güzel uyum sağlamış.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 saat önce
    isApproved: true,
    likes: 5
  },
  {
    _id: '2',
    workId: '1',
    userId: '3',
    username: 'designer',
    avatar: '/leo1.jpg',
    content: 'Çok yaratıcı bir tasarım. Bu tarzda daha fazla eser görmek isterim.',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 saat önce
    isApproved: true,
    likes: 3
  },
  {
    _id: '3',
    workId: '2',
    userId: '1',
    username: 'testuser',
    avatar: '/sude.jpg',
    content: 'Bu eser gerçekten etkileyici. Sanatçının yeteneği belli oluyor.',
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 dakika önce
    isApproved: true,
    likes: 0
  },
  {
    _id: '4',
    workId: '3',
    userId: '2',
    username: 'admin',
    avatar: '/can.jpg',
    content: 'Mükemmel bir kompozisyon. Detaylar çok dikkatli işlenmiş.',
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 dakika önce
    isApproved: true,
    likes: 8
  },
  {
    _id: '5',
    workId: '4',
    userId: '3',
    username: 'designer',
    avatar: '/leo1.jpg',
    content: 'Bu renk paleti çok hoşuma gitti. Hangi program kullandınız?',
    createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 dakika önce
    isApproved: true,
    likes: 1
  },
  {
    _id: '6',
    workId: '5',
    userId: '1',
    username: 'testuser',
    avatar: '/sude.jpg',
    content: 'Gerçekten etkileyici bir çalışma. Sanatçıyı tebrik ederim!',
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 dakika önce
    isApproved: true,
    likes: 2
  },
  {
    _id: '7',
    workId: '6',
    userId: '2',
    username: 'admin',
    avatar: '/can.jpg',
    content: 'Bu eser platformumuzda öne çıkan çalışmalardan biri olabilir.',
    createdAt: new Date(Date.now() - 3 * 60 * 1000), // 3 dakika önce
    isApproved: true,
    likes: 4
  },
  {
    _id: '8',
    workId: '7',
    userId: '3',
    username: 'designer',
    avatar: '/leo1.jpg',
    content: 'Çok profesyonel bir iş. Bu tarzda daha fazla eser bekliyorum.',
    createdAt: new Date(Date.now() - 1 * 60 * 1000), // 1 dakika önce
    isApproved: true,
    likes: 0
  },
  // Yeni yorumlar - daha fazla çeşitlilik için
  {
    _id: '9',
    workId: '1',
    userId: '4',
    username: 'artlover',
    avatar: '/leo2.jpeg',
    content: 'Bu eser bana huzur veriyor. Teşekkürler sanatçı!',
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 dakika önce
    isApproved: true,
    likes: 7
  },
  {
    _id: '10',
    workId: '2',
    userId: '5',
    username: 'creative_mind',
    avatar: '/picasso.webp',
    content: 'Renklerin uyumu mükemmel. Bu tarzda daha fazla eser görmek isterim.',
    createdAt: new Date(Date.now() - 20 * 60 * 1000), // 20 dakika önce
    isApproved: true,
    likes: 0
  },
  {
    _id: '11',
    workId: '3',
    userId: '6',
    username: 'art_critic',
    avatar: '/t1.jpg',
    content: 'Kompozisyon çok güçlü. Sanatçının tekniği gerçekten etkileyici.',
    createdAt: new Date(Date.now() - 12 * 60 * 1000), // 12 dakika önce
    isApproved: true,
    likes: 3
  },
  {
    _id: '12',
    workId: '4',
    userId: '7',
    username: 'design_enthusiast',
    avatar: '/t2.webp',
    content: 'Bu eser beni çok etkiledi. Sanatçıya teşekkürler!',
    createdAt: new Date(Date.now() - 8 * 60 * 1000), // 8 dakika önce
    isApproved: true,
    likes: 0
  },
  {
    _id: '13',
    workId: '5',
    userId: '8',
    username: 'modern_art_fan',
    avatar: '/t3.jpg',
    content: 'Çok yaratıcı bir yaklaşım. Bu tarzda daha fazla eser bekliyorum.',
    createdAt: new Date(Date.now() - 6 * 60 * 1000), // 6 dakika önce
    isApproved: true,
    likes: 5
  },
  {
    _id: '14',
    workId: '6',
    userId: '9',
    username: 'art_collector',
    avatar: '/t4.jpg',
    content: 'Bu eser koleksiyonumda olmasını isterdim. Harika bir çalışma!',
    createdAt: new Date(Date.now() - 4 * 60 * 1000), // 4 dakika önce
    isApproved: true,
    likes: 0
  },
  {
    _id: '15',
    workId: '7',
    userId: '10',
    username: 'digital_artist',
    avatar: '/t6.jpg',
    content: 'Dijital sanatın gücünü çok güzel yansıtmış. Tebrikler!',
    createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 dakika önce
    isApproved: true,
    likes: 6
  }
];

module.exports = {
  mockUsers,
  mockCategories,
  mockWorks,
  mockComments
};
