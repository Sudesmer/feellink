import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

// Instagram-style follow system hook
export const useInstagramFollow = () => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [followStatus, setFollowStatus] = useState('not_following');

  // Socket.io bağlantısını kur
  useEffect(() => {
    const token = localStorage.getItem('feellink-token');
    const user = JSON.parse(localStorage.getItem('feellink-user') || '{}');
    
    if (token && user._id) {
      const newSocket = io('http://localhost:5000', {
        query: { userId: user._id },
        auth: { token }
      });

      setSocket(newSocket);

      // Instagram-style follow system event listeners
      newSocket.on('newFollowRequest', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        console.log('📥 Yeni takip isteği:', notification);
      });

      newSocket.on('followAccepted', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        console.log('✅ Takip isteği kabul edildi:', notification);
      });

      newSocket.on('followRejected', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        console.log('❌ Takip isteği reddedildi:', notification);
      });

      newSocket.on('instagram_follow_success', (data) => {
        console.log('✅ Instagram-style takip işlemi başarılı:', data.message);
      });

      newSocket.on('instagram_follow_error', (error) => {
        console.error('❌ Instagram-style takip hatası:', error.error);
        alert(error.error);
      });

      return () => {
        newSocket.close();
      };
    }
  }, []);

  // Takip isteği gönder
  const sendFollowRequest = useCallback(async (receiverId) => {
    try {
      const token = localStorage.getItem('feellink-token');
      const user = JSON.parse(localStorage.getItem('feellink-user') || '{}');

      if (!token || !user._id) {
        throw new Error('Giriş yapmanız gerekiyor');
      }

      const response = await axios.post(
        'http://localhost:5000/api/follow/request',
        { receiverId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setFollowStatus('pending');
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Takip isteği gönderme hatası:', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  }, []);

  // Takip isteğini kabul et
  const acceptFollowRequest = useCallback(async (followId) => {
    try {
      const token = localStorage.getItem('feellink-token');

      if (!token) {
        throw new Error('Giriş yapmanız gerekiyor');
      }

      const response = await axios.post(
        `http://localhost:5000/api/follow/accept/${followId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Takip kabul etme hatası:', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  }, []);

  // Takip isteğini reddet
  const rejectFollowRequest = useCallback(async (followId) => {
    try {
      const token = localStorage.getItem('feellink-token');

      if (!token) {
        throw new Error('Giriş yapmanız gerekiyor');
      }

      const response = await axios.post(
        `http://localhost:5000/api/follow/reject/${followId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Takip reddetme hatası:', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  }, []);

  // Takibi bırak
  const unfollow = useCallback(async (userId) => {
    try {
      const token = localStorage.getItem('feellink-token');

      if (!token) {
        throw new Error('Giriş yapmanız gerekiyor');
      }

      const response = await axios.post(
        'http://localhost:5000/api/follow/unfollow',
        { userId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setFollowStatus('not_following');
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Takip bırakma hatası:', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  }, []);

  // Takip durumunu kontrol et
  const checkFollowStatus = useCallback(async (userId) => {
    try {
      const token = localStorage.getItem('feellink-token');

      if (!token) {
        return 'not_following';
      }

      const response = await axios.get(
        `http://localhost:5000/api/follow/status?userId=${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setFollowStatus(response.data.status);
        return response.data.status;
      } else {
        return 'not_following';
      }
    } catch (error) {
      console.error('Takip durumu kontrol hatası:', error);
      return 'not_following';
    }
  }, []);

  // Takip sayılarını al
  const getFollowCounts = useCallback(async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/follow/counts/${userId}`
      );

      if (response.data.success) {
        return response.data.counts;
      } else {
        return { followers: 0, following: 0 };
      }
    } catch (error) {
      console.error('Takip sayıları alma hatası:', error);
      return { followers: 0, following: 0 };
    }
  }, []);

  // Bildirimleri al
  const getNotifications = useCallback(async (page = 1, limit = 20) => {
    try {
      const token = localStorage.getItem('feellink-token');

      if (!token) {
        return { notifications: [], unreadCount: 0 };
      }

      const response = await axios.get(
        `http://localhost:5000/api/notifications?page=${page}&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
        return response.data;
      } else {
        return { notifications: [], unreadCount: 0 };
      }
    } catch (error) {
      console.error('Bildirimleri alma hatası:', error);
      return { notifications: [], unreadCount: 0 };
    }
  }, []);

  // Bildirimi okundu yap
  const markNotificationAsRead = useCallback(async (notificationId) => {
    try {
      const token = localStorage.getItem('feellink-token');

      if (!token) {
        return false;
      }

      const response = await axios.post(
        `http://localhost:5000/api/notifications/read/${notificationId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === notificationId 
              ? { ...notif, status: 'read' }
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Bildirim okundu yapma hatası:', error);
      return false;
    }
  }, []);

  // Socket.io ile takip isteği gönder (gerçek zamanlı)
  const sendFollowRequestSocket = useCallback((receiverId) => {
    if (socket) {
      const user = JSON.parse(localStorage.getItem('feellink-user') || '{}');
      socket.emit('instagram_follow_request', {
        senderId: user._id,
        receiverId: receiverId
      });
    }
  }, [socket]);

  // Socket.io ile takip isteğini kabul et (gerçek zamanlı)
  const acceptFollowRequestSocket = useCallback((followId) => {
    if (socket) {
      const user = JSON.parse(localStorage.getItem('feellink-user') || '{}');
      socket.emit('instagram_follow_accept', {
        followId: followId,
        accepterId: user._id
      });
    }
  }, [socket]);

  // Socket.io ile takip isteğini reddet (gerçek zamanlı)
  const rejectFollowRequestSocket = useCallback((followId) => {
    if (socket) {
      const user = JSON.parse(localStorage.getItem('feellink-user') || '{}');
      socket.emit('instagram_follow_reject', {
        followId: followId,
        rejecterId: user._id
      });
    }
  }, [socket]);

  return {
    // State
    socket,
    notifications,
    unreadCount,
    followStatus,
    
    // API Methods
    sendFollowRequest,
    acceptFollowRequest,
    rejectFollowRequest,
    unfollow,
    checkFollowStatus,
    getFollowCounts,
    getNotifications,
    markNotificationAsRead,
    
    // Socket Methods
    sendFollowRequestSocket,
    acceptFollowRequestSocket,
    rejectFollowRequestSocket
  };
};

export default useInstagramFollow;
