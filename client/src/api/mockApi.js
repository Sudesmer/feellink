// Mock API for GitHub Pages deployment
// This replaces the backend API calls with static data

import { mockUsers, mockCategories, mockWorks, mockComments } from '../../mock-data';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data storage
let users = [...mockUsers];
let categories = [...mockCategories];
let works = [...mockWorks];
let comments = [...mockComments];
let currentUserId = 1;

// Auth API
export const authAPI = {
  async login(email, password) {
    await delay(500);
    
    if (!email || !password) {
      throw new Error('E-posta ve şifre gerekli');
    }

    const user = users.find(u => u.email === email);
    
    if (!user || password !== '123456') {
      throw new Error('Geçersiz e-posta veya şifre');
    }

    const token = 'mock-token-' + user._id;
    
    return {
      success: true,
      message: 'Giriş başarılı',
      token,
      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        bio: user.bio,
        avatar: user.avatar,
        followers: user.followers.length,
        following: user.following.length,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    };
  },

  async register(username, email, password, fullName) {
    await delay(500);
    
    if (!username || !email || !password || !fullName) {
      throw new Error('Tüm alanlar gerekli');
    }

    const existingUser = users.find(u => u.email === email || u.username === username);
    
    if (existingUser) {
      throw new Error(existingUser.email === email 
        ? 'Bu e-posta adresi zaten kullanılıyor'
        : 'Bu kullanıcı adı zaten alınmış'
      );
    }

    const newUser = {
      _id: (++currentUserId).toString(),
      username,
      email,
      fullName,
      bio: '',
      avatar: '',
      followers: [],
      following: [],
      savedWorks: [],
      isVerified: false,
      createdAt: new Date()
    };

    users.push(newUser);
    const token = 'mock-token-' + newUser._id;

    return {
      success: true,
      message: 'Kayıt başarılı',
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        fullName: newUser.fullName,
        bio: newUser.bio,
        avatar: newUser.avatar,
        followers: newUser.followers.length,
        following: newUser.following.length,
        isVerified: newUser.isVerified,
        createdAt: newUser.createdAt
      }
    };
  },

  async getCurrentUser(token) {
    await delay(300);
    
    if (!token) {
      throw new Error('Token gerekli');
    }

    const userId = token.replace('mock-token-', '');
    const user = users.find(u => u._id === userId);

    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    return {
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        bio: user.bio,
        avatar: user.avatar,
        followers: user.followers.length,
        following: user.following.length,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    };
  }
};

// Works API
export const worksAPI = {
  async getWorks(featured = false) {
    await delay(300);
    
    let filteredWorks = works.filter(work => work.isPublished);
    
    if (featured) {
      filteredWorks = filteredWorks.filter(work => work.isFeatured);
    }

    return {
      success: true,
      works: filteredWorks,
      pagination: {
        current: 1,
        pages: 1,
        total: filteredWorks.length
      }
    };
  },

  async getWorkById(id) {
    await delay(300);
    
    const work = works.find(w => w._id === id);
    
    if (!work || !work.isPublished) {
      throw new Error('Eser bulunamadı');
    }

    work.views += 1;

    return {
      success: true,
      work
    };
  },

  async likeWork(id) {
    await delay(200);
    
    const work = works.find(w => w._id === id);
    
    if (!work) {
      throw new Error('Eser bulunamadı');
    }

    work.likeCount += 1;
    
    return {
      success: true,
      message: 'Eser beğenildi',
      isLiked: true,
      likeCount: work.likeCount
    };
  },

  async saveWork(id) {
    await delay(200);
    
    const work = works.find(w => w._id === id);
    
    if (!work) {
      throw new Error('Eser bulunamadı');
    }

    return {
      success: true,
      message: 'Eser kaydedildi',
      isSaved: true
    };
  },

  async getSavedWorks() {
    await delay(300);
    
    return {
      success: true,
      works: [],
      pagination: {
        current: 1,
        pages: 0,
        total: 0
      }
    };
  }
};

// Categories API
export const categoriesAPI = {
  async getCategories() {
    await delay(200);
    
    return {
      success: true,
      categories
    };
  }
};

// Comments API
export const commentsAPI = {
  async getComments(workId) {
    await delay(300);
    
    const workComments = comments.filter(comment => 
      comment.workId === workId && comment.isApproved
    );
    
    return {
      success: true,
      data: workComments
    };
  },

  async addComment(workId, content) {
    await delay(500);
    
    if (!workId || !content) {
      throw new Error('Gerekli alanlar eksik');
    }
    
    const newComment = {
      _id: Date.now().toString(),
      workId,
      userId: 'temp_user_' + Date.now(),
      username: 'Kullanıcı',
      userAvatar: '',
      content: content.trim(),
      createdAt: new Date(),
      isApproved: false,
      likes: 0
    };
    
    comments.push(newComment);
    
    return {
      success: true,
      message: 'Yorumunuz gönderildi! Admin onayından sonra görünecek.',
      data: newComment
    };
  }
};

// Messages API
export const messagesAPI = {
  async getConversations() {
    await delay(300);
    
    const mockConversations = [
      {
        id: '1',
        user: {
          id: '2',
          username: 'admin',
          fullName: 'Admin User',
          avatar: ''
        },
        lastMessage: {
          text: 'Bu eser gerçekten etkileyici!',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        unreadCount: 2
      },
      {
        id: '2',
        user: {
          id: '3',
          username: 'designer',
          fullName: 'Designer User',
          avatar: ''
        },
        lastMessage: {
          text: 'Teşekkürler! Senin çalışman da harika.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        unreadCount: 0
      }
    ];
    
    return {
      success: true,
      conversations: mockConversations
    };
  },

  async getMessages(conversationId) {
    await delay(300);
    
    const mockMessages = {
      '1': [
        {
          id: '1',
          text: 'Merhaba! Eserini çok beğendim.',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          senderId: '2',
          isRead: true
        },
        {
          id: '2',
          text: 'Teşekkürler! Senin çalışman da harika.',
          timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
          senderId: '1',
          isRead: true
        },
        {
          id: '3',
          text: 'Bu eser gerçekten etkileyici!',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          senderId: '2',
          isRead: false
        }
      ],
      '2': [
        {
          id: '1',
          text: 'Yeni teknikler hakkında konuşalım mı?',
          timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000),
          senderId: '3',
          isRead: true
        },
        {
          id: '2',
          text: 'Tabii ki! Hangi konuda?',
          timestamp: new Date(Date.now() - 24.5 * 60 * 60 * 1000),
          senderId: '1',
          isRead: true
        }
      ]
    };
    
    return {
      success: true,
      messages: mockMessages[conversationId] || []
    };
  },

  async sendMessage(conversationId, text) {
    await delay(500);
    
    if (!text || !text.trim()) {
      throw new Error('Mesaj metni gerekli');
    }
    
    const newMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      timestamp: new Date(),
      senderId: '1',
      isRead: false
    };
    
    return {
      success: true,
      message: newMessage
    };
  }
};

// Health check
export const healthAPI = {
  async check() {
    await delay(100);
    
    return {
      status: 'OK',
      message: 'Feellink API çalışıyor (Mock Mode)',
      timestamp: new Date().toISOString()
    };
  }
};
