import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { FiUser, FiMail, FiCalendar, FiMapPin, FiGlobe, FiEdit3, FiLogOut, FiSettings, FiHeart, FiUsers, FiImage, FiMessageCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// Dashboard styled components
const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const DashboardContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const WelcomeTitle = styled.h1`
  color: #2d3748;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const WelcomeSubtitle = styled.p`
  color: #718096;
  font-size: 1.1rem;
  margin: 0 0 20px 0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const UserAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.avatar ? `url(${props.avatar})` : 'linear-gradient(135deg, #667eea, #764ba2)'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  font-weight: 600;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 5px 0;
`;

const UserEmail = styled.p`
  color: #718096;
  font-size: 1rem;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const StatIcon = styled.div`
  font-size: 2.5rem;
  color: #667eea;
  margin-bottom: 15px;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  color: #718096;
  font-size: 0.9rem;
  font-weight: 500;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const ActionCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ActionIcon = styled.div`
  font-size: 2rem;
  color: #667eea;
  margin-bottom: 15px;
`;

const ActionTitle = styled.h3`
  color: #2d3748;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 10px 0;
`;

const ActionDescription = styled.p`
  color: #718096;
  font-size: 0.9rem;
  margin: 0 0 20px 0;
  line-height: 1.5;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }
`;

const LogoutButton = styled.button`
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  
  &:hover {
    background: #c53030;
    transform: translateY(-2px);
  }
`;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    followers: 0,
    following: 0,
    works: 0,
    likes: 0
  });

  useEffect(() => {
    // Kullanıcı istatistiklerini yükle
    if (user) {
      // Mock data - gerçek uygulamada API'den gelecek
      setStats({
        followers: Math.floor(Math.random() * 1000),
        following: Math.floor(Math.random() * 500),
        works: Math.floor(Math.random() * 50),
        likes: Math.floor(Math.random() * 2000)
      });
    }
  }, [user]);

  const handleAction = (action) => {
    switch (action) {
      case 'profile':
        navigate('/profile');
        break;
      case 'edit':
        navigate('/edit-profile');
        break;
      case 'works':
        navigate('/');
        break;
      case 'messages':
        navigate('/messages');
        break;
      case 'notifications':
        navigate('/notifications');
        break;
      case 'settings':
        navigate('/settings');
        break;
      default:
        break;
    }
  };

  if (!user) {
    return (
      <DashboardContainer>
        <DashboardContent>
          <WelcomeCard>
            <WelcomeTitle>Giriş Yapmanız Gerekiyor</WelcomeTitle>
            <WelcomeSubtitle>Dashboard'a erişmek için lütfen giriş yapın.</WelcomeSubtitle>
          </WelcomeCard>
        </DashboardContent>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardContent>
        <WelcomeCard>
          <WelcomeTitle>Hoş Geldiniz!</WelcomeTitle>
          <WelcomeSubtitle>Feellink Dashboard'unuza hoş geldiniz</WelcomeSubtitle>
          
          <UserInfo>
            <UserAvatar avatar={user.avatar}>
              {!user.avatar && (user.fullName?.charAt(0) || user.username?.charAt(0) || 'U')}
            </UserAvatar>
            <UserDetails>
              <UserName>{user.fullName || user.username || 'Kullanıcı'}</UserName>
              <UserEmail>{user.email}</UserEmail>
            </UserDetails>
          </UserInfo>
        </WelcomeCard>

        <StatsGrid>
          <StatCard>
            <StatIcon><FiUsers /></StatIcon>
            <StatNumber>{stats.followers}</StatNumber>
            <StatLabel>Takipçi</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon><FiHeart /></StatIcon>
            <StatNumber>{stats.following}</StatNumber>
            <StatLabel>Takip Edilen</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon><FiImage /></StatIcon>
            <StatNumber>{stats.works}</StatNumber>
            <StatLabel>Gönderi</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon><FiHeart /></StatIcon>
            <StatNumber>{stats.likes}</StatNumber>
            <StatLabel>Beğeni</StatLabel>
          </StatCard>
        </StatsGrid>

        <ActionsGrid>
          <ActionCard onClick={() => handleAction('profile')}>
            <ActionIcon><FiUser /></ActionIcon>
            <ActionTitle>Profilim</ActionTitle>
            <ActionDescription>
              Profil bilgilerinizi görüntüleyin ve düzenleyin
            </ActionDescription>
            <ActionButton>
              <FiUser size={16} />
              Profili Görüntüle
            </ActionButton>
          </ActionCard>

          <ActionCard onClick={() => handleAction('edit')}>
            <ActionIcon><FiEdit3 /></ActionIcon>
            <ActionTitle>Profili Düzenle</ActionTitle>
            <ActionDescription>
              Profil bilgilerinizi güncelleyin ve özelleştirin
            </ActionDescription>
            <ActionButton>
              <FiEdit3 size={16} />
              Düzenle
            </ActionButton>
          </ActionCard>

          <ActionCard onClick={() => handleAction('works')}>
            <ActionIcon><FiImage /></ActionIcon>
            <ActionTitle>Gönderilerim</ActionTitle>
            <ActionDescription>
              Tüm gönderilerinizi görüntüleyin ve yönetin
            </ActionDescription>
            <ActionButton>
              <FiImage size={16} />
              Gönderileri Görüntüle
            </ActionButton>
          </ActionCard>

          <ActionCard onClick={() => handleAction('messages')}>
            <ActionIcon><FiMessageCircle /></ActionIcon>
            <ActionTitle>Mesajlar</ActionTitle>
            <ActionDescription>
              Gelen mesajlarınızı kontrol edin
            </ActionDescription>
            <ActionButton>
              <FiMessageCircle size={16} />
              Mesajları Aç
            </ActionButton>
          </ActionCard>

          <ActionCard onClick={() => handleAction('notifications')}>
            <ActionIcon><FiHeart /></ActionIcon>
            <ActionTitle>Bildirimler</ActionTitle>
            <ActionDescription>
              Yeni bildirimlerinizi kontrol edin
            </ActionDescription>
            <ActionButton>
              <FiHeart size={16} />
              Bildirimleri Aç
            </ActionButton>
          </ActionCard>

          <ActionCard onClick={() => handleAction('settings')}>
            <ActionIcon><FiSettings /></ActionIcon>
            <ActionTitle>Ayarlar</ActionTitle>
            <ActionDescription>
              Hesap ayarlarınızı yönetin
            </ActionDescription>
            <ActionButton>
              <FiSettings size={16} />
              Ayarları Aç
            </ActionButton>
          </ActionCard>
        </ActionsGrid>

        <LogoutButton onClick={logout}>
          <FiLogOut size={16} />
          Çıkış Yap
        </LogoutButton>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default Dashboard;
