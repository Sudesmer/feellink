import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FiHeart, 
  FiMessageCircle, 
  FiUserPlus, 
  FiAward, 
  FiTrendingUp,
  FiClock,
  FiMoreHorizontal,
  FiCheck,
  FiBell,
  FiUser,
  FiHome,
  FiEye,
  FiBookmark
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
          </ContentInner>
        </Content>
      </MainLayout>
    </Container>
  );
};

export default Notifications;
