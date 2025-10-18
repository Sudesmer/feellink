import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FiGrid,
  FiHeart,
  FiMessageCircle,
  FiMoreHorizontal,
  FiBookmark,
  FiUserPlus,
  FiUserMinus,
  FiEdit3,
  FiPlus
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
  padding-top: 80px;
`;

const ProfileContainer = styled.div`
  max-width: 935px;
  margin: 0 auto;
  padding: 30px 20px;
`;

const ProfileHeader = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 44px;
  padding-bottom: 30px;
  border-bottom: 1px solid ${props => props.theme.border};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
  }
`;

const AvatarSection = styled.div`
  display: flex;
  justify-content: center;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  border: 1px solid ${props => props.theme.border};
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
`;

const AvatarImg = styled.img`
  width: 15%;
  height: 20%;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid ${props => props.theme.border};
`;

const ProfileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProfileTop = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
`;

const Username = styled.h1`
  font-size: 1.75rem;
  font-weight: 300;
  color: ${props => props.theme.text};
  margin: 0;
  line-height: 1.2;
  flex-shrink: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  flex-shrink: 0;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.border};
  background: ${props => props.primary ? props.theme.primary : props.theme.surface};
  color: ${props => props.primary ? 'white' : props.theme.text};
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;

  &:hover {
    background: ${props => props.primary ? props.theme.primaryHover : props.theme.surfaceHover};
  }
`;

const MoreButton = styled.button`
  padding: 8px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.surfaceHover};
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    justify-content: center;
    gap: 30px;
  }
`;

const StatItem = styled.div`
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const StatNumber = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 2px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
`;

const Bio = styled.div`
  color: ${props => props.theme.text};
  line-height: 1.5;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const BioText = styled.p`
  margin: 0;
  font-size: 0.95rem;
`;

const BioLink = styled.a`
  color: ${props => props.theme.primary};
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const ProfileTabs = styled.div`
  display: flex;
  justify-content: center;
  border-top: 1px solid ${props => props.theme.border};
  margin-top: 0;
`;

const Tab = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 16px 0;
  background: none;
  border: none;
  color: ${props => props.active ? props.theme.text : props.theme.textSecondary};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border-top: 1px solid ${props => props.active ? props.theme.text : 'transparent'};
  transition: all 0.3s ease;
  margin-right: 60px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    color: ${props => props.theme.text};
  }
`;

const WorksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
  margin-top: 0;

  @media (max-width: 768px) {
    gap: 2px;
  }
`;

const WorkItem = styled.div`
  aspect-ratio: 1;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  position: relative;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
    z-index: 10;
    box-shadow: 0 8px 25px ${props => props.theme.shadow};
  }
`;

const WorkImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;

  ${WorkItem}:hover & {
    transform: scale(1.1);
  }
`;

const WorkOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  opacity: 0;
  transition: all 0.3s ease;

  ${WorkItem}:hover & {
    opacity: 1;
  }
`;

const OverlayIcon = styled.div`
  color: white;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  font-size: 0.9rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.textSecondary};
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${props => props.theme.text};
`;

const EmptyDescription = styled.p`
  font-size: 0.9rem;
  max-width: 300px;
  margin: 0 auto;
  line-height: 1.4;
`;

// Mock data for Instagram-like profile
const mockProfile = {
  username: 'zeynep_esmer',
  fullName: 'Zeynep Esmer',
  bio: '🎨 Sanatçı & Tasarımcı\n📍 İstanbul, Türkiye\n✨ Dijital sanat ve geleneksel tekniklerin buluştuğu nokta',
  website: 'zeynepesmer.com',
  location: 'İstanbul, Türkiye',
  avatar: '/zeynep.jpg',
  followers: 2847,
  following: 156,
  posts: 42,
  isFollowing: false,
  isOwnProfile: false
};

const mockWorks = [
  { id: 1, image: '/t1.jpg', likes: 234, comments: 12 },
  { id: 2, image: '/t2.webp', likes: 189, comments: 8 },
  { id: 3, image: '/t3.jpg', likes: 156, comments: 5 },
  { id: 4, image: '/t4.jpg', likes: 298, comments: 18 },
  { id: 5, image: '/t6.jpg', likes: 167, comments: 9 },
  { id: 6, image: '/t7.webp', likes: 223, comments: 14 },
  { id: 7, image: '/t8.jpg', likes: 145, comments: 7 },
  { id: 8, image: '/t10.jpg', likes: 189, comments: 11 },
  { id: 9, image: '/t11.jpeg', likes: 134, comments: 6 },
  { id: 10, image: '/t12.jpeg', likes: 267, comments: 16 },
  { id: 11, image: '/leo1.jpg', likes: 312, comments: 22 },
  { id: 12, image: '/leo2.jpeg', likes: 198, comments: 13 },
  { id: 13, image: '/picasso.webp', likes: 245, comments: 19 },
  { id: 14, image: '/can.jpg', likes: 178, comments: 8 },
  { id: 15, image: '/sude.jpg', likes: 156, comments: 4 }
];

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(mockProfile.isFollowing);

  const profile = mockProfile;
  const works = mockWorks;
  const isOwnProfile = currentUser && currentUser.username === username;

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleWorkClick = (workId) => {
    navigate(`/work/${workId}`);
  };

  return (
    <Container theme={theme}>
      <ProfileContainer theme={theme}>
        <ProfileHeader theme={theme}>
          <AvatarSection>
            {profile.avatar ? (
              <AvatarImg src={profile.avatar} alt={profile.fullName} theme={theme} />
            ) : (
              <Avatar theme={theme}>
                {profile.fullName.charAt(0).toUpperCase()}
              </Avatar>
            )}
          </AvatarSection>

          <ProfileInfo>
            <ProfileTop>
              <Username theme={theme}>{profile.username}</Username>
              <ActionButtons>
                {isOwnProfile ? (
                  <>
                    <ActionButton theme={theme} onClick={() => navigate('/settings')}>
                      <FiEdit3 size={14} />
                      Profili Düzenle
                    </ActionButton>
                    <ActionButton theme={theme} primary>
                      <FiPlus size={14} />
                      Eser Ekle
                    </ActionButton>
                    <MoreButton theme={theme}>
                      <FiMoreHorizontal size={16} />
                    </MoreButton>
                  </>
                ) : (
                  <>
                    <ActionButton 
                      theme={theme} 
                      primary={!isFollowing}
                      onClick={handleFollow}
                    >
                      {isFollowing ? (
                        <>
                          <FiUserMinus size={14} />
                          Takibi Bırak
                        </>
                      ) : (
                        <>
                          <FiUserPlus size={14} />
                          Takip Et
                        </>
                      )}
                    </ActionButton>
                    <ActionButton theme={theme}>
                      <FiMessageCircle size={14} />
                      Mesaj
                    </ActionButton>
                    <MoreButton theme={theme}>
                      <FiMoreHorizontal size={16} />
                    </MoreButton>
                  </>
                )}
              </ActionButtons>
            </ProfileTop>

            <Stats>
              <StatItem>
                <StatNumber theme={theme}>{profile.posts}</StatNumber>
                <StatLabel theme={theme}>eser</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber theme={theme}>{profile.followers.toLocaleString()}</StatNumber>
                <StatLabel theme={theme}>takipçi</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber theme={theme}>{profile.following}</StatNumber>
                <StatLabel theme={theme}>takip</StatLabel>
              </StatItem>
            </Stats>

            <Bio theme={theme}>
              <BioText theme={theme}>
                {profile.fullName}
              </BioText>
              {profile.bio && (
                <BioText theme={theme}>
                  {profile.bio.split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < profile.bio.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </BioText>
              )}
              {profile.website && (
                <BioLink theme={theme} href={profile.website} target="_blank" rel="noopener noreferrer">
                  {profile.website}
                </BioLink>
              )}
            </Bio>
          </ProfileInfo>
        </ProfileHeader>

        <ProfileTabs theme={theme}>
          <Tab 
            theme={theme} 
            active={activeTab === 'posts'}
            onClick={() => setActiveTab('posts')}
          >
            <FiGrid size={12} />
            Eserler
          </Tab>
          <Tab 
            theme={theme} 
            active={activeTab === 'saved'}
            onClick={() => setActiveTab('saved')}
          >
            <FiBookmark size={12} />
            Kaydedilenler
          </Tab>
        </ProfileTabs>

        {activeTab === 'posts' && (
          <>
            {works.length > 0 ? (
              <WorksGrid>
                {works.map((work) => (
                  <WorkItem 
                    key={work.id} 
                    theme={theme}
                    onClick={() => handleWorkClick(work.id)}
                  >
                    <WorkImage src={work.image} alt={`Eser ${work.id}`} />
                    <WorkOverlay>
                      <OverlayIcon>
                        <FiHeart size={16} />
                        {work.likes}
                      </OverlayIcon>
                      <OverlayIcon>
                        <FiMessageCircle size={16} />
                        {work.comments}
                      </OverlayIcon>
                    </WorkOverlay>
                  </WorkItem>
                ))}
              </WorksGrid>
            ) : (
              <EmptyState theme={theme}>
                <EmptyIcon>📷</EmptyIcon>
                <EmptyTitle theme={theme}>Henüz eser yok</EmptyTitle>
                <EmptyDescription theme={theme}>
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
          <EmptyState theme={theme}>
            <EmptyIcon>🔖</EmptyIcon>
            <EmptyTitle theme={theme}>Kaydedilen eserler</EmptyTitle>
            <EmptyDescription theme={theme}>
              Kaydettiğiniz eserler burada görünecek.
            </EmptyDescription>
          </EmptyState>
        )}
      </ProfileContainer>
    </Container>
  );
};

export default Profile;

