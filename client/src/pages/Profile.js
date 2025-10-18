import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiUser, 
  FiMapPin, 
  FiGlobe, 
  FiHeart, 
  FiUsers, 
  FiBookmark,
  FiSettings,
  FiPlus,
  FiGrid,
  FiList
} from 'react-icons/fi';
import axios from 'axios';
import WorkCard from '../components/WorkCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
`;

const Header = styled.div`
  background: ${props => props.theme.gradient};
  padding: 120px 0 60px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    opacity: 0.3;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
`;

const ProfileInfo = styled.div`
  display: flex;
  gap: 40px;
  align-items: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 24px;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: 700;
  border: 4px solid white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`;

const ProfileDetails = styled.div`
  flex: 1;
  color: white;
`;

const Name = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Username = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 16px;
`;

const Bio = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 24px;
  line-height: 1.6;
  max-width: 600px;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  opacity: 0.9;
`;

const Website = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  text-decoration: none;
  opacity: 0.9;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 40px;
  margin-top: 32px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const Actions = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  border-radius: 50px;
  border: 2px solid white;
  background: ${props => props.primary ? 'white' : 'transparent'};
  color: ${props => props.primary ? props.theme.primary : 'white'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Tabs = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 40px;
  border-bottom: 1px solid ${props => props.theme.border};

  @media (max-width: 768px) {
    gap: 16px;
    overflow-x: auto;
    padding-bottom: 16px;
  }
`;

const Tab = styled.button`
  padding: 12px 0;
  background: none;
  border: none;
  color: ${props => props.active ? props.theme.primary : props.theme.textSecondary};
  font-weight: 600;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? props.theme.primary : 'transparent'};
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const ViewControls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  overflow: hidden;
`;

const ViewButton = styled.button`
  padding: 8px 16px;
  background: ${props => props.active ? props.theme.primary : props.theme.surface};
  color: ${props => props.active ? 'white' : props.theme.text};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${props => props.active ? props.theme.primaryHover : props.theme.surfaceHover};
  }
`;

const WorksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const WorksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: ${props => props.theme.textSecondary};
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 24px;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: ${props => props.theme.text};
`;

const EmptyDescription = styled.p`
  font-size: 1rem;
  max-width: 400px;
  margin: 0 auto;
`;

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, followUser, unfollowUser } = useAuth();
  const [activeTab, setActiveTab] = useState('works');
  const [viewMode, setViewMode] = useState('grid');
  const [isFollowing, setIsFollowing] = useState(false);

  // Fetch profile data
  const { data: profileData, isLoading } = useQuery(
    ['profile', username],
    async () => {
      const response = await axios.get(`/api/users/profile/${username}`);
      return response.data;
    },
    {
      enabled: !!username,
    }
  );

  const profile = profileData?.user;
  const works = profileData?.works || [];

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error('Takip etmek için giriş yapmalısınız');
      return;
    }

    if (isFollowing) {
      const result = await unfollowUser(profile._id);
      if (result.success) {
        setIsFollowing(false);
      }
    } else {
      const result = await followUser(profile._id);
      if (result.success) {
        setIsFollowing(true);
      }
    }
  };

  const isOwnProfile = currentUser && currentUser.username === username;

  if (isLoading) {
    return <LoadingSpinner text="Profil yükleniyor..." />;
  }

  if (!profile) {
    return (
      <Container>
        <Content>
          <EmptyState>
            <EmptyIcon>👤</EmptyIcon>
            <EmptyTitle>Kullanıcı bulunamadı</EmptyTitle>
            <EmptyDescription>
              Aradığınız kullanıcı bulunamadı veya hesabı silinmiş olabilir.
            </EmptyDescription>
          </EmptyState>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <ProfileInfo>
            <AvatarContainer>
              {profile.avatar ? (
                <AvatarImg src={profile.avatar} alt={profile.fullName} />
              ) : (
                <Avatar>
                  {profile.fullName.charAt(0).toUpperCase()}
                </Avatar>
              )}
            </AvatarContainer>

            <ProfileDetails>
              <Name>{profile.fullName}</Name>
              <Username>@{profile.username}</Username>
              
              {profile.bio && <Bio>{profile.bio}</Bio>}
              
              {profile.location && (
                <Location>
                  <FiMapPin size={18} />
                  {profile.location}
                </Location>
              )}
              
              {profile.website && (
                <Website href={profile.website} target="_blank" rel="noopener noreferrer">
                  <FiGlobe size={18} />
                  {profile.website}
                </Website>
              )}

              <Stats>
                <StatItem>
                  <StatNumber>{works.length}</StatNumber>
                  <StatLabel>Eser</StatLabel>
                </StatItem>
                <StatItem>
                  <StatNumber>{profile.followers}</StatNumber>
                  <StatLabel>Takipçi</StatLabel>
                </StatItem>
                <StatItem>
                  <StatNumber>{profile.following}</StatNumber>
                  <StatLabel>Takip</StatLabel>
                </StatItem>
              </Stats>

              <Actions>
                {isOwnProfile ? (
                  <>
                    <ActionButton onClick={() => navigate('/settings')}>
                      <FiSettings size={18} />
                      Ayarlar
                    </ActionButton>
                    <ActionButton primary>
                      <FiPlus size={18} />
                      Eser Ekle
                    </ActionButton>
                  </>
                ) : (
                  <ActionButton
                    primary={!isFollowing}
                    onClick={handleFollow}
                  >
                    <FiUsers size={18} />
                    {isFollowing ? 'Takibi Bırak' : 'Takip Et'}
                  </ActionButton>
                )}
              </Actions>
            </ProfileDetails>
          </ProfileInfo>
        </HeaderContent>
      </Header>

      <Content>
        <Tabs>
          <Tab
            active={activeTab === 'works'}
            onClick={() => setActiveTab('works')}
          >
            Eserler ({works.length})
          </Tab>
          <Tab
            active={activeTab === 'saved'}
            onClick={() => setActiveTab('saved')}
          >
            Kaydedilenler
          </Tab>
          <Tab
            active={activeTab === 'liked'}
            onClick={() => setActiveTab('liked')}
          >
            Beğenilenler
          </Tab>
        </Tabs>

        {activeTab === 'works' && (
          <>
            <ViewControls>
              <div></div>
              <ViewToggle>
                <ViewButton
                  active={viewMode === 'grid'}
                  onClick={() => setViewMode('grid')}
                >
                  <FiGrid size={18} />
                  Grid
                </ViewButton>
                <ViewButton
                  active={viewMode === 'list'}
                  onClick={() => setViewMode('list')}
                >
                  <FiList size={18} />
                  Liste
                </ViewButton>
              </ViewToggle>
            </ViewControls>

            {works.length > 0 ? (
              viewMode === 'grid' ? (
                <WorksGrid>
                  {works.map((work, index) => (
                    <motion.div
                      key={work._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                    >
                      <WorkCard work={work} />
                    </motion.div>
                  ))}
                </WorksGrid>
              ) : (
                <WorksList>
                  {works.map((work, index) => (
                    <motion.div
                      key={work._id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                    >
                      <WorkCard work={work} />
                    </motion.div>
                  ))}
                </WorksList>
              )
            ) : (
              <EmptyState>
                <EmptyIcon>🎨</EmptyIcon>
                <EmptyTitle>Henüz eser yok</EmptyTitle>
                <EmptyDescription>
                  {isOwnProfile 
                    ? 'İlk eserinizi paylaşmaya ne dersiniz?'
                    : 'Bu kullanıcı henüz eser paylaşmamış.'
                  }
                </EmptyDescription>
              </EmptyState>
            )}
          </>
        )}

        {activeTab === 'saved' && (
          <EmptyState>
            <EmptyIcon>🔖</EmptyIcon>
            <EmptyTitle>Kaydedilen eserler</EmptyTitle>
            <EmptyDescription>
              Bu özellik yakında eklenecek.
            </EmptyDescription>
          </EmptyState>
        )}

        {activeTab === 'liked' && (
          <EmptyState>
            <EmptyIcon>❤️</EmptyIcon>
            <EmptyTitle>Beğenilen eserler</EmptyTitle>
            <EmptyDescription>
              Bu özellik yakında eklenecek.
            </EmptyDescription>
          </EmptyState>
        )}
      </Content>
    </Container>
  );
};

export default Profile;

