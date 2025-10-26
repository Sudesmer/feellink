import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useInstagramFollow } from '../hooks/useInstagramFollow';

// Instagram-style notifications component
const NotificationsContainer = styled.div`
  max-width: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

const NotificationsHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #dbdbdb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
`;

const UnreadBadge = styled.span`
  background: #0095f6;
  color: white;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
`;

const NotificationsList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #fafafa;
  }
  
  ${props => props.unread && `
    background-color: #f8f9ff;
    border-left: 3px solid #0095f6;
  `}
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.avatar ? `url(${props.avatar})` : '#dbdbdb'};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #262626;
  line-height: 1.4;
`;

const NotificationTime = styled.span`
  font-size: 12px;
  color: #8e8e8e;
  margin-top: 4px;
  display: block;
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => {
    switch (props.action) {
      case 'accept':
        return `
          background: #0095f6;
          color: white;
          &:hover {
            background: #0080d6;
          }
        `;
      case 'reject':
        return `
          background: #f0f0f0;
          color: #666;
          &:hover {
            background: #e0e0e0;
          }
        `;
      default:
        return `
          background: #f0f0f0;
          color: #666;
        `;
    }
  }}
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #8e8e8e;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyText = styled.p`
  margin: 0;
  font-size: 16px;
`;

const InstagramNotifications = ({ 
  onFollowRequestAction = () => {},
  className = '' 
}) => {
  const {
    notifications,
    unreadCount,
    getNotifications,
    markNotificationAsRead,
    acceptFollowRequest,
    rejectFollowRequest
  } = useInstagramFollow();

  const [isLoading, setIsLoading] = useState(false);

  // Bildirimleri yükle
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      await getNotifications();
    } catch (error) {
      console.error('Bildirimleri yükleme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (notification.status === 'unread') {
      await markNotificationAsRead(notification._id);
    }
  };

  const handleAcceptFollow = async (notification) => {
    try {
      const result = await acceptFollowRequest(notification.relatedId);
      if (result.success) {
        onFollowRequestAction('accepted', notification);
        // Bildirimi güncelle
        await loadNotifications();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Takip kabul etme hatası:', error);
      alert('Takip isteği kabul edilemedi');
    }
  };

  const handleRejectFollow = async (notification) => {
    try {
      const result = await rejectFollowRequest(notification.relatedId);
      if (result.success) {
        onFollowRequestAction('rejected', notification);
        // Bildirimi güncelle
        await loadNotifications();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Takip reddetme hatası:', error);
      alert('Takip isteği reddedilemedi');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) {
      return `${minutes} dakika önce`;
    } else if (hours < 24) {
      return `${hours} saat önce`;
    } else if (days < 7) {
      return `${days} gün önce`;
    } else {
      return date.toLocaleDateString('tr-TR');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'follow_request':
        return '👤';
      case 'follow_accepted':
        return '✅';
      case 'follow_rejected':
        return '❌';
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'mention':
        return '📢';
      case 'message':
        return '📨';
      default:
        return '🔔';
    }
  };

  if (isLoading) {
    return (
      <NotificationsContainer className={className}>
        <NotificationsHeader>
          <HeaderTitle>Bildirimler</HeaderTitle>
        </NotificationsHeader>
        <EmptyState>
          <EmptyText>Yükleniyor...</EmptyText>
        </EmptyState>
      </NotificationsContainer>
    );
  }

  return (
    <NotificationsContainer className={className}>
      <NotificationsHeader>
        <HeaderTitle>Bildirimler</HeaderTitle>
        {unreadCount > 0 && (
          <UnreadBadge>{unreadCount}</UnreadBadge>
        )}
      </NotificationsHeader>
      
      <NotificationsList>
        {notifications.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🔔</EmptyIcon>
            <EmptyText>Henüz bildirim yok</EmptyText>
          </EmptyState>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              unread={notification.status === 'unread'}
              onClick={() => handleNotificationClick(notification)}
            >
              <UserAvatar avatar={notification.fromUser?.avatar} />
              <NotificationContent>
                <NotificationText>
                  <span style={{ marginRight: '8px' }}>
                    {getNotificationIcon(notification.type)}
                  </span>
                  {notification.message}
                </NotificationText>
                <NotificationTime>
                  {formatTime(notification.createdAt)}
                </NotificationTime>
                
                {notification.type === 'follow_request' && (
                  <NotificationActions>
                    <ActionButton
                      action="accept"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptFollow(notification);
                      }}
                    >
                      Kabul Et
                    </ActionButton>
                    <ActionButton
                      action="reject"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRejectFollow(notification);
                      }}
                    >
                      Reddet
                    </ActionButton>
                  </NotificationActions>
                )}
              </NotificationContent>
            </NotificationItem>
          ))
        )}
      </NotificationsList>
    </NotificationsContainer>
  );
};

export default InstagramNotifications;
