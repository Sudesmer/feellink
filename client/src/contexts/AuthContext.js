import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { authAPI, worksAPI } from '../api/mockApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Axios interceptor setup
const setupAxiosInterceptors = (setUser, setLoading) => {
  // Request interceptor
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('feellink-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
        localStorage.removeItem('feellink-token');
        setUser(null);
        toast.error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
      }
      return Promise.reject(error);
    }
  );
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setupAxiosInterceptors(setUser, setLoading);
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('feellink-token');
      if (!token) {
        setUser(null);
        setLoading(false);
        // Don't redirect, let App.js handle it
        return;
      }

      // Mock data için localStorage'dan user bilgisini al
      const storedUser = localStorage.getItem('feellink-user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        console.log('User loaded from localStorage:', userData);
      } else {
        // Token var ama user data yok - temizle
        localStorage.removeItem('feellink-token');
        localStorage.removeItem('feellink-user');
        setUser(null);
        // Don't redirect, let App.js handle it
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('feellink-token');
      localStorage.removeItem('feellink-user');
      setUser(null);
      // Force redirect to login on error
      const currentOrigin = window.location.origin;
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/login' || currentPath === '/register';
      const isAdminPage = currentPath === '/admin' || currentPath === '/admin-login';
      const isMuseumPage = currentPath === '/museum-login' || currentPath === '/museum-dashboard' || currentPath === '/museum-panel';
      
      if (!isAuthPage && !isAdminPage && !isMuseumPage) {
        window.location.replace(`${currentOrigin}/login`);
      }
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
          
          // Token ve kullanıcı bilgilerini localStorage'a kaydet
          localStorage.setItem('feellink-token', token);
          localStorage.setItem('feellink-user', JSON.stringify(userData));
          
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
    localStorage.removeItem('feellink-user');
    setUser(null);
    setLoading(false);
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

  const followUser = async (userId) => {
    try {
      const response = await axios.post(`/api/users/follow/${userId}`);
      if (response.data.success) {
        toast.success('Kullanıcı takip edildi');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Takip işlemi sırasında hata oluştu';
      toast.error(message);
      return { success: false, message };
    }
  };

  const unfollowUser = async (userId) => {
    try {
      const response = await axios.delete(`/api/users/unfollow/${userId}`);
      if (response.data.success) {
        toast.success('Takip bırakıldı');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Takip bırakma işlemi sırasında hata oluştu';
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
    login,
    register,
    logout,
    updateProfile,
    followUser,
    unfollowUser,
    likeWork,
    saveWork,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
