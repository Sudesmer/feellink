import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useInstagramFollow } from '../hooks/useInstagramFollow';

// Instagram-style follow button component
const FollowButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const FollowButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  
  ${props => {
    switch (props.status) {
      case 'not_following':
        return `
          background: #0095f6;
          color: white;
          &:hover {
            background: #0080d6;
          }
        `;
      case 'pending':
        return `
          background: #f0f0f0;
          color: #666;
          cursor: not-allowed;
        `;
      case 'accepted':
        return `
          background: transparent;
          color: #262626;
          border: 1px solid #dbdbdb;
          &:hover {
            background: #fafafa;
          }
        `;
      default:
        return `
          background: #0095f6;
          color: white;
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const FollowCounts = styled.div`
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #8e8e8e;
`;

const CountItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .count {
    font-weight: 600;
    color: #262626;
  }
  
  .label {
    font-size: 12px;
  }
`;

const InstagramFollowButton = ({ 
  targetUserId, 
  targetUserName, 
  showCounts = false,
  onStatusChange = () => {},
  className = ''
}) => {
  const {
    followStatus,
    checkFollowStatus,
    sendFollowRequest,
    unfollow,
    getFollowCounts,
    sendFollowRequestSocket,
    unfollowSocket
  } = useInstagramFollow();

  const [isLoading, setIsLoading] = useState(false);
  const [counts, setCounts] = useState({ followers: 0, following: 0 });

  // Takip durumunu kontrol et
  useEffect(() => {
    if (targetUserId) {
      checkFollowStatus(targetUserId);
      if (showCounts) {
        getFollowCounts(targetUserId).then(setCounts);
      }
    }
  }, [targetUserId, checkFollowStatus, getFollowCounts, showCounts]);

  // Takip durumu değiştiğinde callback çağır
  useEffect(() => {
    onStatusChange(followStatus);
  }, [followStatus, onStatusChange]);

  const handleFollowClick = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      if (followStatus === 'not_following') {
        // Takip et
        const result = await sendFollowRequest(targetUserId);
        if (result.success) {
          // Socket.io ile de gönder (gerçek zamanlı)
          sendFollowRequestSocket(targetUserId);
        } else {
          alert(result.message);
        }
      } else if (followStatus === 'accepted') {
        // Takibi bırak
        const result = await unfollow(targetUserId);
        if (result.success) {
          // Socket.io ile de gönder (gerçek zamanlı)
          if (unfollowSocket) {
            unfollowSocket(targetUserId);
          }
        } else {
          alert(result.message);
        }
      }
    } catch (error) {
      console.error('Takip işlemi hatası:', error);
      alert('Takip işlemi sırasında hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    switch (followStatus) {
      case 'not_following':
        return 'Takip Et';
      case 'pending':
        return 'İstek Gönderildi';
      case 'accepted':
        return 'Takiptesin';
      default:
        return 'Takip Et';
    }
  };

  const getButtonIcon = () => {
    switch (followStatus) {
      case 'not_following':
        return '➕';
      case 'pending':
        return '⏳';
      case 'accepted':
        return '✓';
      default:
        return '➕';
    }
  };

  return (
    <div className={className}>
      <FollowButtonContainer>
        <FollowButton
          status={followStatus}
          onClick={handleFollowClick}
          disabled={isLoading || followStatus === 'pending'}
        >
          <span>{getButtonIcon()}</span>
          <span>{isLoading ? 'İşleniyor...' : getButtonText()}</span>
        </FollowButton>
      </FollowButtonContainer>
      
      {showCounts && (
        <FollowCounts>
          <CountItem>
            <span className="count">{counts.followers}</span>
            <span className="label">Takipçi</span>
          </CountItem>
          <CountItem>
            <span className="count">{counts.following}</span>
            <span className="label">Takip Edilen</span>
          </CountItem>
        </FollowCounts>
      )}
    </div>
  );
};

export default InstagramFollowButton;
