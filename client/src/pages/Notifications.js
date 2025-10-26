import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import io from 'socket.io-client';
import { 
  FiHeart, 
  FiMessageCircle, 
  FiUserPlus, 
  FiAward, 
  FiTrendingUp,
  FiClock,
  FiCheck,
  FiBell,
  FiUser,
  FiHome,
  FiEye,
  FiBookmark,
  FiX
} from 'react-icons/fi';

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
  padding: 0;
  margin: 0;
`;

const MainLayout = styled.div`
  display: flex;
  width: 100vw;
  margin: 0;
  gap: 0;
  padding: 0;
  align-items: flex-start;
  position: relative;
  height: 100vh;
  overflow: hidden;

  @media (max-width: 1200px) {
    flex-direction: column;
    gap: 0;
    height: auto;
    overflow: visible;
    width: 100vw;
    margin: 0;
    padding: 0 20px;
  }
`;

const LeftSidebar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: ${props => props.theme.surface};
  backdrop-filter: blur(20px);
  border-right: 2px solid ${props => props.theme.border};
  padding: 20px 0;
  z-index: 1000;
  overflow-y: auto;
  box-shadow: 4px 0 20px ${props => props.theme.shadow};

  @media (max-width: 1200px) {
    display: none;
  }
`;

const SidebarMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
  padding: 0 20px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${props => props.active ? '#FFFFFF' : props.theme.text};
  background: ${props => props.active ? props.theme.gradient : 'transparent'};
  margin: 4px 12px;
  box-shadow: ${props => props.active ? `0 4px 15px ${props.theme.shadow}` : 'none'};
  transform: ${props => props.active ? 'translateX(8px)' : 'translateX(0)'};

  &:hover {
    background: ${props => props.theme.primary};
    color: #FFFFFF;
    transform: translateX(8px);
    box-shadow: 0 6px 20px ${props => props.theme.shadow};
  }
`;

const MenuIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 20px;
`;

const MenuText = styled.span`
  font-size: 18px;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: inherit;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
  width: calc(100vw - 280px);
  height: 100vh;
  overflow-y: auto;
  padding: 0;
  margin-left: 280px;
  margin-right: 0;
  background: ${props => props.theme.background};
  display: flex;
  flex-direction: column;

  @media (max-width: 1200px) {
    height: auto;
    overflow: visible;
    padding: 0;
    width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
`;

const ContentInner = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
  flex: 1;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  background: ${props => props.theme.surface};
  border-bottom: 1px solid ${props => props.theme.border};
  padding: 16px 24px;
  z-index: 100;
  backdrop-filter: blur(20px);
  margin-bottom: 20px;
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NotificationIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid ${props => props.theme.border};
  padding-bottom: 16px;
`;

const FilterTab = styled.button`
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  border: 1px solid ${props => props.active ? props.theme.primary : props.theme.border};
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? props.theme.primary : props.theme.surfaceHover};
    border-color: ${props => props.theme.primary};
  }
`;

const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NotificationItem = styled.div`
  background: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: ${props => props.theme.surfaceHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 20px ${props => props.theme.shadow};
  }
`;

const NotificationAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
  position: relative;
`;

const NotificationAvatarImg = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const NotificationIconSmall = styled.div`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.type === 'like' ? '#FF6B35' : 
                      props.type === 'comment' ? '#4CAF50' : 
                      props.type === 'follow' ? '#2196F3' : 
                      props.type === 'award' ? '#FFD700' : '#9C27B0'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.7rem;
  border: 2px solid ${props => props.theme.surface};
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationText = styled.p`
  color: ${props => props.theme.text};
  font-size: 0.95rem;
  line-height: 1.4;
  margin: 0 0 4px 0;
`;

const NotificationTime = styled.span`
  color: ${props => props.theme.textSecondary};
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? props.theme.primary : 'transparent'};
  color: ${props => props.primary ? 'white' : props.theme.text};
  border: 1px solid ${props => props.primary ? props.theme.primary : props.theme.border};
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 10;
  
  &:hover {
    background: ${props => props.primary ? props.theme.primaryHover : props.theme.surfaceHover};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const NotificationImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.textSecondary};
  font-size: 1.5rem;
`;

const NotificationImageImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
`;


const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: ${props => props.theme.textSecondary};
`;

const EmptyIcon = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: white;
  font-size: 3rem;
  box-shadow: 0 8px 30px rgba(255, 107, 53, 0.3);
`;

const EmptyText = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: ${props => props.theme.text};
  background: ${props => props.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const EmptySubtext = styled.p`
  font-size: 1rem;
  margin: 0;
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
`;

// Mock notification data
// Gerçek zamanlı bildirimler için boş array (ileride backend'den çekilecek)
const mockNotifications = [];

const Notifications = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { user, acceptFollowRequest, rejectFollowRequest, updateFollowersCount } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [socket, setSocket] = useState(null);
  
  // localStorage'dan kullanıcının bildirimlerini yükle
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [disappearingNotifications, setDisappearingNotifications] = useState(new Set());
  
  // Gerçek zamanlı bildirim dinleyicisi
  useEffect(() => {
    if (!user || !user._id) return;

    // Socket.IO bağlantısı
    const newSocket = io('http://localhost:5000', { 
      transports: ['websocket', 'polling'] 
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('🔌 Notifications Socket.IO bağlandı');
      newSocket.emit('user_login', user._id);
    });

    // Yeni bildirim geldiğinde
    newSocket.on('new_notification', (data) => {
      console.log('🔔 Yeni bildirim geldi:', data);
      
      // Bildirimleri güncelle
      setNotifications(prev => {
        const newNotification = {
          _id: data.notification._id,
          type: data.notification.type,
          message: data.notification.message,
          fromUserId: data.notification.fromUserId,
          fromUserName: data.notification.fromUserName,
          fromUserAvatar: data.notification.fromUserAvatar,
          status: 'unread',
          createdAt: new Date(data.notification.createdAt)
        };
        
        return [newNotification, ...prev];
      });
      
      // Okunmamış sayısını artır
      setUnreadCount(prev => prev + 1);
    });

    // Takip isteği geldiğinde
    newSocket.on('new_follow_request', (notification) => {
      console.log('👥 Yeni takip isteği:', notification);
      
      setNotifications(prev => {
        const newNotification = {
          _id: notification._id,
          type: notification.type,
          message: notification.message,
          fromUserId: notification.fromUserId,
          fromUserName: notification.fromUserName || 'Kullanıcı',
          fromUserAvatar: notification.fromUserAvatar || '/images/default-avatar.png',
          status: notification.status,
          createdAt: new Date(notification.createdAt),
          relatedId: notification.relatedId
        };
        
        return [newNotification, ...prev];
      });
      
      setUnreadCount(prev => prev + 1);
    });

    // Takip isteği kabul edildiğinde
    newSocket.on('follow_accepted', (notification) => {
      console.log('✅ Takip isteği kabul edildi:', notification);
      
      setNotifications(prev => {
        const newNotification = {
          _id: notification._id,
          type: notification.type,
          message: notification.message,
          fromUserId: notification.fromUserId,
          fromUserName: notification.fromUserName || 'Kullanıcı',
          fromUserAvatar: notification.fromUserAvatar || '/images/default-avatar.png',
          status: notification.status,
          createdAt: new Date(notification.createdAt),
          relatedId: notification.relatedId
        };
        
        return [newNotification, ...prev];
      });
      
      setUnreadCount(prev => prev + 1);
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Notifications Socket.IO bağlantısı kesildi');
    });

    return () => {
      newSocket.emit('user_logout', user._id);
      newSocket.disconnect();
    };
  }, [user]);
  
  const loadNotifications = async () => {
    try {
      setLoading(true);
      
      // Her zaman test verisi ekle (geliştirme için)
      const testUser = {
        _id: "1",
        username: "sudesmer001",
        email: "sudesmer001@gmail.com", 
        fullName: "Sude Esmer",
        avatar: "/sude.jpg",
        followers: [],
        following: [],
        isVerified: false,
        createdAt: new Date().toISOString()
      };
      const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiaWF0IjoxNzYxNDcwNDYwLCJleHAiOjE3NjIwNzUyNjB9.test";
      
      // Her zaman localStorage'a test verisi ekle
      localStorage.setItem('feellink-user', JSON.stringify(testUser));
      localStorage.setItem('feellink-token', testToken);
      
      const token = localStorage.getItem('feellink-token');
      const userData = localStorage.getItem('feellink-user');
      
      if (!token || !userData) {
        console.log('📬 Token veya user data yok');
        setNotifications([]);
        setLoading(false);
        return;
      }
      
      const user = JSON.parse(userData);
      const userId = user._id || user.id;
      
      if (!userId) {
        console.log('📬 User ID bulunamadı');
        setNotifications([]);
        setLoading(false);
        return;
      }

      // API'den bildirimleri çek
      const response = await axios.get(`http://localhost:5000/api/notifications`, {
        headers: {
          'x-user-id': userId
        }
      });
      
      if (response.data.success) {
        const apiNotifications = response.data.notifications || [];
        setNotifications(apiNotifications);
        setUnreadCount(response.data.unreadCount || 0);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Bildirimler yüklenirken hata:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde bildirimleri yükle
  useEffect(() => {
    loadNotifications();

    // Her 30 saniyede bir bildirimleri güncelle
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like': return <FiHeart />;
      case 'comment': return <FiMessageCircle />;
      case 'follow': return <FiUserPlus />;
      case 'follow_request': return <FiUserPlus />;
      case 'award': return <FiAward />;
      default: return <FiTrendingUp />;
    }
  };

  const getNotificationText = (notification) => {
    const { user, action, target } = notification;
    if (target) {
      return (
        <>
          <strong>{user.name}</strong> {action} <strong>{target}</strong>
        </>
      );
    } else {
      return (
        <>
          <strong>{user.name}</strong> {action}
        </>
      );
    }
  };

  const markAsRead = async (id) => {
    try {
      // API'ye bildir
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`);
      
      // Local state'i güncelle
      setNotifications(prev => {
        const updated = prev.map(notif => 
          notif._id === id ? { ...notif, status: 'read' } : notif
        );
        return updated;
      });
      
      // Unread count'u güncelle
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Bildirim okundu olarak işaretlenirken hata:', error);
    }
  };

  // Takip isteği kabul etme
  const handleAcceptRequest = async (notification) => {
    console.log('✅ Kabul Et butonuna tıklandı:', notification);
    
    // Animasyon başlat - bildirimi kaybolan listesine ekle
    setDisappearingNotifications(prev => new Set([...prev, notification._id]));
    
    // JavaScript ile animasyon
    const notificationElement = document.querySelector(`[data-notification-id="${notification._id}"]`);
    if (notificationElement) {
      // Animasyonu başlat
      notificationElement.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      notificationElement.style.opacity = '0';
      notificationElement.style.transform = 'translateX(-100%) scale(0.8)';
      notificationElement.style.pointerEvents = 'none';
    }
    
    try {
      const requestId = notification.relatedId;
      console.log('🔍 Request ID:', requestId);
      
      if (!requestId) {
        console.error('❌ Request ID bulunamadı');
        return;
      }

      // Socket.IO ile gerçek zamanlı kabul etme
      if (socket) {
        socket.emit('accept_follow', {
          requestId: requestId,
          accepterId: user._id,
          requesterId: notification.fromUserId
        });
      }

      console.log('📡 API çağrısı yapılıyor:', `http://localhost:5000/api/follow/accept/${requestId}`);
      const response = await axios.post(`http://localhost:5000/api/follow/accept/${requestId}`);
      
      console.log('📡 API yanıtı:', response.data);
      
      if (response.data.success) {
        console.log('✅ Takip isteği başarıyla kabul edildi');
        
        // Animasyon tamamlandıktan sonra element'i DOM'dan kaldır ve bildirimleri yeniden yükle
        setTimeout(async () => {
          // Element'i DOM'dan kaldır
          if (notificationElement) {
            notificationElement.remove();
          }
          
          // State'den de kaldır
          setDisappearingNotifications(prev => {
            const newSet = new Set(prev);
            newSet.delete(notification._id);
            return newSet;
          });
          
          // Bildirimleri yeniden yükle
          await loadNotifications();
          
          // Takipçi sayısını güncelle
          if (user && user._id) {
            await updateFollowersCount(user._id);
          }
          
          console.log('✅ İşlem tamamlandı: Bildirim silindi, takipçi sayısı güncellendi');
        }, 600); // 600ms animasyon süresi
      }
    } catch (error) {
      console.error('❌ Takip isteği kabul edilirken hata:', error);
      // Hata durumunda animasyonu geri al
      setDisappearingNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(notification._id);
        return newSet;
      });
      
      // Animasyonu geri al
      if (notificationElement) {
        notificationElement.style.opacity = '1';
        notificationElement.style.transform = 'translateX(0) scale(1)';
        notificationElement.style.pointerEvents = 'auto';
      }
    }
  };

  // Takip isteği reddetme
  const handleRejectRequest = async (notification) => {
    console.log('❌ Reddet butonuna tıklandı:', notification);
    
    // Animasyon başlat - bildirimi kaybolan listesine ekle
    setDisappearingNotifications(prev => new Set([...prev, notification._id]));
    
    // JavaScript ile animasyon
    const notificationElement = document.querySelector(`[data-notification-id="${notification._id}"]`);
    if (notificationElement) {
      // Animasyonu başlat
      notificationElement.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      notificationElement.style.opacity = '0';
      notificationElement.style.transform = 'translateX(-100%) scale(0.8)';
      notificationElement.style.pointerEvents = 'none';
    }
    
    try {
      const requestId = notification.relatedId;
      console.log('🔍 Request ID:', requestId);
      
      if (!requestId) {
        console.error('❌ Request ID bulunamadı');
        return;
      }

      // Socket.IO ile gerçek zamanlı reddetme
      if (socket) {
        socket.emit('reject_follow', {
          requestId: requestId,
          rejecterId: user._id,
          requesterId: notification.fromUserId
        });
      }

      console.log('📡 API çağrısı yapılıyor:', `http://localhost:5000/api/follow/reject/${requestId}`);
      const response = await axios.post(`http://localhost:5000/api/follow/reject/${requestId}`);
      
      console.log('📡 API yanıtı:', response.data);
      
      if (response.data.success) {
        console.log('✅ Takip isteği başarıyla reddedildi');
        
        // Animasyon tamamlandıktan sonra element'i DOM'dan kaldır ve bildirimleri yeniden yükle
        setTimeout(async () => {
          // Element'i DOM'dan kaldır
          if (notificationElement) {
            notificationElement.remove();
          }
          
          // State'den de kaldır
          setDisappearingNotifications(prev => {
            const newSet = new Set(prev);
            newSet.delete(notification._id);
            return newSet;
          });
          
          // Bildirimleri yeniden yükle
          await loadNotifications();
          
          console.log('✅ İşlem tamamlandı: Bildirim silindi');
        }, 600); // 600ms animasyon süresi
      }
    } catch (error) {
      console.error('❌ Takip isteği reddedilirken hata:', error);
      // Hata durumunda animasyonu geri al
      setDisappearingNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(notification._id);
        return newSet;
      });
      
      // Animasyonu geri al
      if (notificationElement) {
        notificationElement.style.opacity = '1';
        notificationElement.style.transform = 'translateX(0) scale(1)';
        notificationElement.style.pointerEvents = 'auto';
      }
    }
  };
  
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return notification.status === 'unread';
    return notification.type === activeFilter;
  });

  if (loading) {
    return (
      <Container theme={theme}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <p style={{ color: theme.textSecondary }}>Yükleniyor...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container theme={theme}>
      <LeftSidebar theme={theme}>
        <SidebarMenu>
          <MenuItem theme={theme} active={location.pathname === '/'} onClick={() => navigate('/')}>
            <MenuIcon>
              <FiHome />
            </MenuIcon>
            <MenuText>Ana Sayfa</MenuText>
          </MenuItem>
          
          <MenuItem theme={theme} active={location.pathname === '/explore'} onClick={() => navigate('/explore')}>
            <MenuIcon>
              <FiEye />
            </MenuIcon>
            <MenuText>Keşfet</MenuText>
          </MenuItem>
          
          <MenuItem theme={theme} active={location.pathname === '/notifications'} onClick={() => navigate('/notifications')}>
            <MenuIcon>
              <FiBell />
            </MenuIcon>
            <MenuText>Bildirimler</MenuText>
          </MenuItem>
          
          <MenuItem theme={theme} onClick={() => navigate('/profile')}>
            <MenuIcon>
              <FiUser />
            </MenuIcon>
            <MenuText>Profil</MenuText>
          </MenuItem>
          
          <MenuItem theme={theme} onClick={() => navigate('/saved')}>
            <MenuIcon>
              <FiBookmark />
            </MenuIcon>
            <MenuText>Kaydedilenler</MenuText>
          </MenuItem>
        </SidebarMenu>
      </LeftSidebar>
      
      <MainLayout>
        <Content theme={theme}>
          <Header theme={theme}>
            <HeaderTitle theme={theme}>
              <NotificationIcon theme={theme}>
                <FiBell />
              </NotificationIcon>
              Bildirimler
            </HeaderTitle>
          </Header>
          
          <ContentInner>
            <FilterTabs theme={theme}>
          <FilterTab 
            theme={theme} 
            active={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
          >
            Tümü
          </FilterTab>
          <FilterTab 
            theme={theme} 
            active={activeFilter === 'unread'}
            onClick={() => setActiveFilter('unread')}
          >
            Okunmamış
          </FilterTab>
          <FilterTab 
            theme={theme} 
            active={activeFilter === 'like'}
            onClick={() => setActiveFilter('like')}
          >
            Beğeniler
          </FilterTab>
          <FilterTab 
            theme={theme} 
            active={activeFilter === 'comment'}
            onClick={() => setActiveFilter('comment')}
          >
            Yorumlar
          </FilterTab>
          <FilterTab 
            theme={theme} 
            active={activeFilter === 'follow'}
            onClick={() => setActiveFilter('follow')}
          >
            Takip
          </FilterTab>
        </FilterTabs>

        {filteredNotifications.length === 0 ? (
          <EmptyState theme={theme}>
            <EmptyIcon theme={theme}>
              <FiBell />
            </EmptyIcon>
            <EmptyText theme={theme}>Henüz bildirim yok</EmptyText>
            <EmptySubtext theme={theme}>
              Yeni etkileşimler olduğunda burada görünecek
            </EmptySubtext>
          </EmptyState>
        ) : (
          <NotificationList theme={theme}>
            {filteredNotifications.map((notification) => (
              <NotificationItem 
                key={notification._id} 
                theme={theme}
                data-notification-id={notification._id}
                style={{ 
                  background: notification.status === 'read' ? theme.surface : theme.cardBackground
                }}
              >
                <NotificationAvatar theme={theme}>
                  {notification.fromUser && notification.fromUser.avatar ? (
                    <NotificationAvatarImg src={notification.fromUser.avatar} alt={notification.fromUser.fullName || 'User'} />
                  ) : (
                    <FiUser />
                  )}
                  <NotificationIconSmall 
                    theme={theme} 
                    type={notification.type}
                  >
                    {getNotificationIcon(notification.type)}
                  </NotificationIconSmall>
                </NotificationAvatar>

                <NotificationContent theme={theme}>
                  <NotificationText theme={theme}>
                    {notification.fromUser && (
                      <>
                        <strong>{notification.fromUser.fullName || notification.fromUser.username}</strong> {notification.message}
                      </>
                    )}
                  </NotificationText>
                  
                  <NotificationTime theme={theme}>
                    <FiClock size={12} />
                    {new Date(notification.createdAt).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </NotificationTime>

                  {notification.status === 'unread' && (
                    <NotificationActions theme={theme}>
                      {notification.type === 'follow_request' ? (
                        <>
                          <ActionButton 
                            theme={theme} 
                            primary
                            onClick={() => {
                              console.log('✅ Kabul Et butonuna tıklandı');
                              handleAcceptRequest(notification);
                            }}
                          >
                            <FiCheck size={12} />
                            Kabul Et
                          </ActionButton>
                          <ActionButton 
                            theme={theme}
                            style={{ marginLeft: '8px', background: '#ff4444' }}
                            onClick={() => {
                              console.log('❌ Reddet butonuna tıklandı');
                              handleRejectRequest(notification);
                            }}
                          >
                            <FiX size={12} />
                            Reddet
                          </ActionButton>
                        </>
                      ) : (
                        <ActionButton 
                          theme={theme} 
                          primary
                          onClick={() => markAsRead(notification._id)}
                        >
                          <FiCheck size={12} />
                          Okundu
                        </ActionButton>
                      )}
                    </NotificationActions>
                  )}
                </NotificationContent>
              </NotificationItem>
            ))}
          </NotificationList>
          )}
          </ContentInner>
        </Content>
      </MainLayout>
    </Container>
  );
};

export default Notifications;
