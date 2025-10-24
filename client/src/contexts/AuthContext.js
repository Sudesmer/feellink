import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

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
      
      // Mock data için basit kontrol
      const mockUsers = [
        { email: 'testuser@feellink.com', password: 'test123', username: 'testuser', fullName: 'Test User' },
        { email: 'admin@feellink.com', password: 'admin123', username: 'admin', fullName: 'Admin User' }
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
        console.log('User set:', userData);
        toast.success('Giriş başarılı!');
        return { success: true };
      } else {
        console.log('Login failed: Invalid credentials');
        return { success: false, message: 'Geçersiz email veya şifre' };
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = 'Giriş yapılırken hata oluştu';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/register', userData);

      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('feellink-token', token);
        setUser(user);
        toast.success('Kayıt başarılı!');
        return { success: true };
      }
    } catch (error) {
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
      const response = await axios.post(`/api/works/${workId}/like`);
      if (response.data.success) {
        return { success: true, data: response.data };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Beğeni işlemi sırasında hata oluştu';
      toast.error(message);
      return { success: false, message };
    }
  };

  const saveWork = async (workId) => {
    try {
      const response = await axios.post(`/api/works/${workId}/save`);
      if (response.data.success) {
        toast.success(response.data.message);
        return { success: true, data: response.data };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Kaydetme işlemi sırasında hata oluştu';
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
