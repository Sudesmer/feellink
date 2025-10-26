import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
import { authAPI, worksAPI } from '../api/mockApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Socket.IO bağlantısı
let socket = null;

// Axios interceptor setup
const setupAxiosInterceptors = (setUser, setLoading) => {
  // Request interceptor
  axios.interceptors.request.use(
    (config) => {
      // skipAuth header'ı varsa Authorization ekleme
      if (!config.headers.skipAuth) {
        const token = localStorage.getItem('feellink-token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      // skipAuth header'ını config'den kaldır (backend'e gönderilmemesi için)
      delete config.headers.skipAuth;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Sadece gerçek auth hatalarında çıkış yap
        // API endpoints'lerden gelen 401'ler handle ediliyor
        console.log('401 error detected, but not auto-logging out:', error.config.url);
        // localStorage.removeItem('feellink-token');
        // setUser(null);
        // toast.error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
      }
      return Promise.reject(error);
    }
  );
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setupAxiosInterceptors(setUser, setLoading);
    checkAuthStatus();
  }, []);

  // Socket.IO bağlantısını yönet
  useEffect(() => {
    if (user && user._id) {
      // Socket bağlantısını başlat
      socket = io('http://localhost:5000', {
        transports: ['websocket', 'polling']
      });

      socket.on('connect', () => {
        console.log('🔌 Socket.IO bağlandı');
        socket.emit('user_login', user._id);
      });

      socket.on('new_notification', (data) => {
        console.log('🔔 Yeni bildirim:', data);
        setNotifications(prev => [data, ...prev]);
        
        // Toast bildirimi göster
        toast.success(data.message, {
          duration: 4000,
          position: 'top-right',
          icon: '🔔'
        });
      });

      socket.on('disconnect', () => {
        console.log('🔌 Socket.IO bağlantısı kesildi');
      });

      return () => {
        if (socket) {
          socket.emit('user_logout', user._id);
          socket.disconnect();
        }
      };
    }
  }, [user]);

  // Socket.IO event listeners
  useEffect(() => {
    if (socket && user) {
      // Takip isteği geldiğinde
      socket.on('new_follow_request', (notification) => {
        console.log('🔔 Yeni takip isteği:', notification);
        setNotifications(prev => [notification, ...prev]);
        toast.success('Yeni takip isteği geldi!');
      });

      // Takip isteği kabul edildiğinde
      socket.on('follow_accepted', (notification) => {
        console.log('✅ Takip isteği kabul edildi:', notification);
        setNotifications(prev => [notification, ...prev]);
        toast.success('Takip isteğiniz kabul edildi!');
      });

      // Takip hatası
      socket.on('follow_error', (error) => {
        console.error('Takip hatası:', error);
        toast.error(error.error || 'Takip işlemi başarısız');
      });

      return () => {
        socket.off('new_follow_request');
        socket.off('follow_accepted');
        socket.off('follow_error');
      };
    }
  }, [socket, user]);

  // Debug: localStorage'ı temizle
  const clearLocalStorage = () => {
    console.log('🧹 localStorage temizleniyor...');
    localStorage.removeItem('feellink-token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('feellink-user');
    console.log('✅ localStorage temizlendi');
  };

  // Debug: localStorage içeriğini göster
  const debugLocalStorage = () => {
    console.log('🔍 localStorage içeriği:');
    console.log('feellink-token:', localStorage.getItem('feellink-token')?.substring(0, 20) + '...');
    console.log('authToken:', localStorage.getItem('authToken')?.substring(0, 20) + '...');
    console.log('feellink-user:', localStorage.getItem('feellink-user'));
  };

  const checkAuthStatus = async () => {
    try {
      // Debug: localStorage içeriğini göster
      debugLocalStorage();
      
      const token = localStorage.getItem('authToken') || localStorage.getItem('feellink-token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      console.log('🔍 Token bulundu, kullanıcı bilgileri kontrol ediliyor...');
      console.log('🔍 Token:', token.substring(0, 20) + '...');
      
      try {
        // Backend'den kullanıcı bilgilerini al
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          const userData = response.data.user;
          console.log('✅ Kullanıcı bilgileri yüklendi:', userData);
          console.log('✅ Kullanıcı ID:', userData._id);
          console.log('✅ Kullanıcı Email:', userData.email);
          
          // localStorage'ı güncelle
          localStorage.setItem('feellink-user', JSON.stringify(userData));
          localStorage.setItem('feellink-token', token); // Eski key'i de güncelle
          
          // State'i güncelle
          setUser(userData);
          
          // Socket.IO bağlantısını kur
          if (socket) {
            socket.disconnect();
          }
          
          socket = io('http://localhost:5000', {
            query: { userId: userData._id }
          });
          
          socket.on('connect', () => {
            console.log('🔌 Socket.IO bağlandı:', socket.id);
            socket.emit('user_login', userData._id);
          });
          
          socket.on('disconnect', () => {
            console.log('🔌 Socket.IO bağlantısı kesildi');
          });
          
          // Socket.IO event listeners
          socket.on('new_follow_request', (notification) => {
            console.log('📥 Yeni takip isteği:', notification);
            setNotifications(prev => [notification, ...prev]);
          });
          
          socket.on('follow_accepted', (notification) => {
            console.log('✅ Takip isteği kabul edildi:', notification);
            setNotifications(prev => [notification, ...prev]);
          });
          
          socket.on('follow_error', (error) => {
            console.error('❌ Takip hatası:', error);
            toast.error(error.error || 'Takip işlemi sırasında hata oluştu');
          });
          
          socket.on('unfollow_success', (data) => {
            console.log('✅ Takip başarıyla bırakıldı:', data);
            toast.success(data.message);
          });
          
          socket.on('unfollow_error', (error) => {
            console.error('❌ Takip bırakma hatası:', error);
            toast.error(error.error || 'Takip bırakma işlemi sırasında hata oluştu');
          });
          
          socket.on('user_unfollowed', (data) => {
            console.log('👋 Birisi sizi takip etmeyi bıraktı:', data);
            toast.info(data.message);
          });
          
        } else {
          console.log('❌ Token geçersiz, localStorage temizleniyor');
          localStorage.removeItem('feellink-token');
          localStorage.removeItem('authToken');
          localStorage.removeItem('feellink-user');
          setUser(null);
        }
      } catch (apiError) {
        console.log('API hatası, token geçersiz olabilir:', apiError.message);
        console.log('API Error Response:', apiError.response?.data);
        
        // API hatası durumunda localStorage'ı temizle ve çıkış yap
        localStorage.removeItem('feellink-token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('feellink-user');
        setUser(null);
        
        // Kullanıcıyı login sayfasına yönlendir
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    } catch (error) {
      console.error('❌ Auth durumu kontrol hatası:', error);
      localStorage.removeItem('feellink-token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('feellink-user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('AuthContext login called with:', { email, password });
      
      // Email formatını kontrol et
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, message: 'Geçerli bir email adresi girin' };
      }
      
      // Backend API'ye login isteği gönder
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.post(`${API_URL}/api/auth/login`, {
          email,
          password
        });
        
        if (response.data.success) {
          const { token, user: userData } = response.data;
          
          console.log('✅ Login başarılı:', userData);
          console.log('✅ Token alındı:', token.substring(0, 20) + '...');
          
          // Token ve kullanıcı bilgilerini localStorage'a kaydet
          localStorage.setItem('feellink-token', token);
          localStorage.setItem('authToken', token); // Kalıcı oturum için
          localStorage.setItem('feellink-user', JSON.stringify(userData));
          
          console.log('✅ localStorage güncellendi');
          console.log('✅ Kullanıcı ID:', userData._id);
          console.log('✅ Kullanıcı Email:', userData.email);
          
          setUser(userData);
          console.log('User logged in:', userData);
          toast.success('Giriş başarılı!');
          return { success: true, user: userData };
        } else {
          return { success: false, message: response.data.message || 'Giriş başarısız' };
        }
      } catch (apiError) {
        console.error('API login error:', apiError);
        
        // Fallback: Mock data ile devam et (backend çalışmıyorsa)
        const mockUsers = [
          { email: 'test@example.com', password: 'password', username: 'testuser', fullName: 'Test User' },
          { email: 'admin@feellink.com', password: 'password', username: 'admin', fullName: 'Admin User' },
          { email: 'designer@feellink.com', password: 'password', username: 'designer', fullName: 'Creative Designer' }
        ];
        
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
          const token = 'mock-token-' + Date.now();
          const userData = {
            _id: '1',
            email: user.email,
            username: user.username,
            fullName: user.fullName,
            avatar: '',
            isVerified: true
          };
          
          localStorage.setItem('feellink-token', token);
          localStorage.setItem('authToken', token); // Kalıcı oturum için
          localStorage.setItem('feellink-user', JSON.stringify(userData));
          setUser(userData);
          console.log('User set (mock):', userData);
          toast.success('Giriş başarılı!');
          return { success: true, user: userData };
        } else {
          return { success: false, message: 'Geçersiz email veya şifre' };
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Giriş yapılırken hata oluştu';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('AuthContext register called with:', userData);
      
      // Email formatını kontrol et
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        return { success: false, message: 'Geçerli bir email adresi girin' };
      }
      
      // Şifre uzunluğunu kontrol et
      if (userData.password.length < 6) {
        return { success: false, message: 'Şifre en az 6 karakter olmalıdır' };
      }
      
      // Backend API'ye register isteği gönder
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.post(`${API_URL}/api/auth/register`, userData);
        
        if (response.data.success) {
          const { token, user: newUser } = response.data;
          
          // Token ve kullanıcı bilgilerini localStorage'a kaydet
          localStorage.setItem('feellink-token', token);
          localStorage.setItem('feellink-user', JSON.stringify(newUser));
          
          setUser(newUser);
          console.log('User registered:', newUser);
          toast.success('Kayıt başarılı! Hoş geldiniz!');
          return { success: true, user: newUser };
        } else {
          return { success: false, message: response.data.message || 'Kayıt başarısız' };
        }
      } catch (apiError) {
        console.error('API register error:', apiError);
        
        // Eğer bu e-posta zaten kayıtlı ise hata mesajını döndür
        if (apiError.response?.status === 409) {
          const errorMessage = apiError.response.data?.message || 'Bu e-posta adresi ile zaten bir hesap bulunmaktadır.';
          return { success: false, message: errorMessage };
        }
        
        // Fallback: Mock registration (backend çalışmıyorsa)
        const token = 'mock-token-' + Date.now();
        const newUser = {
          _id: Date.now().toString(),
          email: userData.email,
          username: userData.username || userData.email.split('@')[0],
          fullName: userData.fullName || userData.username || 'Yeni Kullanıcı',
          avatar: '',
          isVerified: true
        };
        
        localStorage.setItem('feellink-token', token);
        localStorage.setItem('feellink-user', JSON.stringify(newUser));
        setUser(newUser);
        console.log('User registered (mock):', newUser);
        toast.success('Kayıt başarılı! Hoş geldiniz!');
        return { success: true, user: newUser };
      }
    } catch (error) {
      console.error('Register error:', error);
      const message = error.response?.data?.message || 'Kayıt olurken hata oluştu';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('feellink-token');
    localStorage.removeItem('authToken'); // Kalıcı oturum token'ını da temizle
    localStorage.removeItem('feellink-user');
    setUser(null);
    setLoading(false);
    
    // Socket.IO bağlantısını kapat
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    
    toast.success('Çıkış yapıldı');
    // Redirect to login page immediately
    window.location.replace('/login');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/api/users/profile', profileData);
      if (response.data.success) {
        setUser(response.data.user);
        toast.success('Profil güncellendi');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Profil güncellenirken hata oluştu';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Takipçi sayısını güncelle
  const updateFollowersCount = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/profile/${userId}`);
      if (response.data.success) {
        const userData = response.data.user;
        setUser(prevUser => ({
          ...prevUser,
          followers: userData.followers || [],
          followersCount: userData.followers?.length || 0
        }));
        
        // localStorage'ı da güncelle
        const storedUser = localStorage.getItem('feellink-user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          user.followers = userData.followers || [];
          user.followersCount = userData.followers?.length || 0;
          localStorage.setItem('feellink-user', JSON.stringify(user));
        }
        
        console.log('✅ Takipçi sayısı güncellendi:', userData.followers?.length || 0);
      }
    } catch (error) {
      console.error('Takipçi sayısı güncellenirken hata:', error);
    }
  };

  const followUser = async (userId) => {
    try {
      const token = localStorage.getItem('feellink-token');
      const storedUser = localStorage.getItem('feellink-user');
      let currentUserId = '1'; // Default mock user
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        currentUserId = userData._id;
      }

      // Kendi kendini takip etme kontrolü
      if (currentUserId === userId) {
        toast.error('Kendinizi takip edemezsiniz');
        return { success: false, message: 'Kendinizi takip edemezsiniz' };
      }

      // Socket.IO ile gerçek zamanlı takip isteği gönder
      if (socket) {
        socket.emit('follow_user', {
          followerId: currentUserId,
          followingId: userId
        });
      }

      const response = await axios.post(
        `http://localhost:5000/api/users/follow/${userId}`,
        {},
        {
          headers: {
            'x-user-id': currentUserId,
            // Authorization header ekleme (interceptor eklemesin)
            skipAuth: true
          }
        }
      );
      
      if (response.data.success) {
        toast.success('Kullanıcı takip edildi');
        
        // Kullanıcının following listesini güncelle
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const updatedUser = {
            ...userData,
            following: [...(userData.following || []), userId]
          };
          localStorage.setItem('feellink-user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
        
        // Eşzamanlı güncelleme için state'i güncelle
        setUser(prevUser => ({
          ...prevUser,
          following: [...(prevUser?.following || []), userId]
        }));
        
        // Bildirim varsa göster
        if (response.data.notification) {
          console.log('🔔 Bildirim:', response.data.notification);
        }
        
        return { success: true, notification: response.data.notification };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Takip işlemi sırasında hata oluştu';
      toast.error(message);
      return { success: false, message };
    }
  };

  const unfollowUser = async (userId) => {
    try {
      const token = localStorage.getItem('feellink-token');
      const storedUser = localStorage.getItem('feellink-user');
      let currentUserId = '1'; // Default mock user
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        currentUserId = userData._id;
      }

      console.log('👋 Takip bırakma isteği:', currentUserId, '->', userId);
      console.log('🔑 Token:', token ? token.substring(0, 20) + '...' : 'Token yok');

      // Socket.IO ile gerçek zamanlı unfollow event'i gönder
      if (socket) {
        socket.emit('unfollow_user', {
          followerId: currentUserId,
          followingId: userId
        });
      }

      // Axios interceptor token'ı otomatik ekleyecek, manuel eklemeye gerek yok
      const response = await axios.post(
        `http://localhost:5000/api/follow/unfollow`,
        { userId: userId }
      );
      
      if (response.data.success) {
        console.log('✅ Takip başarıyla bırakıldı');
        toast.success('Takip bırakıldı');
        
        // Kullanıcının following listesini güncelle
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const updatedUser = {
            ...userData,
            following: (userData.following || []).filter(id => id !== userId)
          };
          localStorage.setItem('feellink-user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
        
        // Eşzamanlı güncelleme için state'i güncelle
        setUser(prevUser => ({
          ...prevUser,
          following: (prevUser?.following || []).filter(id => id !== userId)
        }));
        
        return { success: true };
      }
    } catch (error) {
      console.error('Takip bırakma hatası:', error);
      const message = error.response?.data?.message || 'Takip bırakma işlemi sırasında hata oluştu';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Gizli hesap takip isteği gönderme
  const sendFollowRequest = async (userId) => {
    try {
      const token = localStorage.getItem('feellink-token');
      const storedUser = localStorage.getItem('feellink-user');
      let currentUserId = '1'; // Default mock user
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        currentUserId = userData._id;
      }

      const response = await axios.post(`http://localhost:5000/api/users/${userId}/follow-request`, {
        senderId: currentUserId,
        senderName: user?.fullName || 'Kullanıcı',
        senderAvatar: user?.avatar || ''
      }, {
        headers: { skipAuth: true }
      });
      
      if (response.data.success) {
        toast.success('Takip isteği gönderildi');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Takip isteği gönderme başarısız';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Takip isteği kabul etme
  const acceptFollowRequest = async (requestId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/follow-requests/${requestId}/accept`, {}, {
        headers: { skipAuth: true }
      });
      
      if (response.data.success) {
        toast.success('Takip isteği kabul edildi');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Takip isteği kabul etme başarısız';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Takip isteği reddetme
  const rejectFollowRequest = async (requestId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/follow-requests/${requestId}/reject`, {}, {
        headers: { skipAuth: true }
      });
      
      if (response.data.success) {
        toast.success('Takip isteği reddedildi');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Takip isteği reddetme başarısız';
      toast.error(message);
      return { success: false, message };
    }
  };

  const likeWork = async (workId) => {
    try {
      const response = await worksAPI.likeWork(workId);
      if (response.success) {
        toast.success(response.message);
        return { success: true, data: response };
      }
    } catch (error) {
      const message = error.message || 'Beğeni işlemi sırasında hata oluştu';
      toast.error(message);
      return { success: false, message };
    }
  };

  const saveWork = async (workId) => {
    try {
      const response = await worksAPI.saveWork(workId);
      if (response.success) {
        toast.success(response.message);
        return { success: true, data: response };
      }
    } catch (error) {
      const message = error.message || 'Kaydetme işlemi sırasında hata oluştu';
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    notifications,
    login,
    register,
    logout,
    updateProfile,
    followUser,
    unfollowUser,
    updateFollowersCount,
    sendFollowRequest,
    acceptFollowRequest,
    rejectFollowRequest,
    likeWork,
    saveWork,
    clearLocalStorage, // Debug fonksiyonu
    debugLocalStorage // Debug fonksiyonu
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
