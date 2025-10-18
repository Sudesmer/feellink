import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FiHeart, 
  FiMessageCircle, 
  FiUserPlus, 
  FiAward, 
  FiTrendingUp,
  FiClock,
  FiMoreHorizontal,
  FiCheck
} from 'react-icons/fi';

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
  padding: 0;
  margin: 0;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  background: ${props => props.theme.surface};
  border-bottom: 1px solid ${props => props.theme.border};
  padding: 16px 24px;
  z-index: 100;
  backdrop-filter: blur(20px);
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

const Content = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
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
  
  &:hover {
    background: ${props => props.primary ? props.theme.primaryHover : props.theme.surfaceHover};
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

const MoreButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.surfaceHover};
    color: ${props => props.theme.text};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.textSecondary};
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.theme.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: ${props => props.theme.textSecondary};
  font-size: 2rem;
`;

const EmptyText = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: ${props => props.theme.text};
`;

const EmptySubtext = styled.p`
  font-size: 0.9rem;
  margin: 0;
  color: ${props => props.theme.textSecondary};
`;

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    type: 'like',
    user: {
      name: 'Zeynep Esmer',
      avatar: '/zeynep.jpg',
      username: 'zeynep_esmer'
    },
    action: 'beğendi',
    target: 'Günbatımında İstanbul',
    targetImage: '/t1.jpg',
    time: '2 dakika önce',
    read: false
  },
  {
    id: 2,
    type: 'comment',
    user: {
      name: 'Ahmet Yılmaz',
      avatar: '/can.jpg',
      username: 'ahmet_yilmaz'
    },
    action: 'yorum yaptı',
    target: 'Soyut Düşler',
    targetImage: '/t2.webp',
    time: '15 dakika önce',
    read: false
  },
  {
    id: 3,
    type: 'follow',
    user: {
      name: 'Sude Esmer',
      avatar: '/sude.jpg',
      username: 'sude_esmer'
    },
    action: 'seni takip etmeye başladı',
    target: null,
    targetImage: null,
    time: '1 saat önce',
    read: true
  },
  {
    id: 4,
    type: 'like',
    user: {
      name: 'Can Soyut',
      avatar: '/can.jpg',
      username: 'can_soyut'
    },
    action: 'beğendi',
    target: 'Geometrik Düşler',
    targetImage: '/leo2.jpeg',
    time: '2 saat önce',
    read: true
  },
  {
    id: 5,
    type: 'award',
    user: {
      name: 'Feellink',
      avatar: null,
      username: 'feellink'
    },
    action: 'seni Ayın Sanatçısı seçti!',
    target: null,
    targetImage: null,
    time: '1 gün önce',
    read: true
  },
  {
    id: 6,
    type: 'comment',
    user: {
      name: 'Arda Minimal',
      avatar: '/t11.jpeg',
      username: 'arda_minimal'
    },
    action: 'yorum yaptı',
    target: 'Minimalist Düşünce',
    targetImage: '/t3.jpg',
    time: '2 gün önce',
    read: true
  }
];

const Notifications = () => {
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState(mockNotifications);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like': return <FiHeart />;
      case 'comment': return <FiMessageCircle />;
      case 'follow': return <FiUserPlus />;
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

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.read;
    return notification.type === activeFilter;
  });

  return (
    <Container theme={theme}>
      <Header theme={theme}>
        <HeaderTitle theme={theme}>
          <NotificationIcon theme={theme}>
            <FiBell />
          </NotificationIcon>
          Bildirimler
        </HeaderTitle>
      </Header>

      <Content theme={theme}>
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
                key={notification.id} 
                theme={theme}
                style={{ 
                  opacity: notification.read ? 0.7 : 1,
                  background: notification.read ? theme.surface : theme.cardBackground
                }}
              >
                <NotificationAvatar theme={theme}>
                  {notification.user.avatar ? (
                    <NotificationAvatarImg src={notification.user.avatar} alt={notification.user.name} />
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
                    {getNotificationText(notification)}
                  </NotificationText>
                  
                  <NotificationTime theme={theme}>
                    <FiClock size={12} />
                    {notification.time}
                  </NotificationTime>

                  {!notification.read && (
                    <NotificationActions theme={theme}>
                      <ActionButton 
                        theme={theme} 
                        primary
                        onClick={() => markAsRead(notification.id)}
                      >
                        <FiCheck size={12} />
                        Okundu
                      </ActionButton>
                    </NotificationActions>
                  )}
                </NotificationContent>

                {notification.targetImage && (
                  <NotificationImage theme={theme}>
                    <NotificationImageImg 
                      src={notification.targetImage} 
                      alt={notification.target} 
                    />
                  </NotificationImage>
                )}

                <MoreButton theme={theme}>
                  <FiMoreHorizontal size={16} />
                </MoreButton>
              </NotificationItem>
            ))}
          </NotificationList>
        )}
      </Content>
    </Container>
  );
};

export default Notifications;
