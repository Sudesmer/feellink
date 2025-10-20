import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiEye, 
  FiBell, 
  FiUser, 
  FiBookmark, 
  FiMessageCircle,
  FiHome as FiBuilding,
  FiBarChart2,
  FiUsers,
  FiImage,
  FiSettings,
  FiLogOut,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye as FiView
} from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
  display: flex;
`;

const MainLayout = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
`;

const LeftSidebar = styled.div`
  width: 280px;
  background: ${props => props.theme.surface};
  border-right: 1px solid ${props => props.theme.border};
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 100;

  @media (max-width: 1200px) {
    display: none;
  }
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MuseumIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const MuseumInfo = styled.div`
  flex: 1;
`;

const MuseumName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 4px;
`;

const MuseumType = styled.div`
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
`;

const SidebarMenu = styled.div`
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.active ? props.theme.primary : props.theme.text};
  background: ${props => props.active ? props.theme.primary + '15' : 'transparent'};
  border-right: ${props => props.active ? `3px solid ${props.theme.primary}` : '3px solid transparent'};

  &:hover {
    background: ${props => props.theme.primary + '10'};
  }
`;

const MenuIcon = styled.div`
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MenuText = styled.span`
  font-size: 16px;
  font-weight: 500;
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  flex: 1;
`;

const Header = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid ${props => props.theme.border};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  background: ${props => props.theme.primary};
  border: none;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  padding: 24px;
  border: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, ${props => props.color || '#667eea'} 0%, ${props => props.color2 || '#764ba2'} 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
`;

const Section = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  margin-bottom: 20px;
`;

const SectionHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0;
`;

const SectionContent = styled.div`
  padding: 24px;
`;

const WorksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

const WorkCard = styled.div`
  background: ${props => props.theme.background};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const WorkImage = styled.div`
  width: 100%;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
`;

const WorkInfo = styled.div`
  padding: 12px;
`;

const WorkTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 4px;
`;

const WorkStats = styled.div`
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
  display: flex;
  gap: 8px;
`;

const WorkActions = styled.div`
  padding: 12px;
  border-top: 1px solid ${props => props.theme.border};
  display: flex;
  gap: 8px;
`;

const SmallButton = styled.button`
  flex: 1;
  padding: 6px 8px;
  border: 1px solid ${props => props.theme.border};
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  &:hover {
    background: ${props => props.theme.primary + '10'};
    border-color: ${props => props.theme.primary};
  }
`;

const MuseumDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  
  const [museumUser, setMuseumUser] = useState(null);
  const [stats, setStats] = useState({
    totalWorks: 24,
    totalViews: 15420,
    totalLikes: 892,
    totalComments: 156
  });

  // Mock museum works data
  const [museumWorks] = useState([
    {
      id: '1',
      title: 'Modern Sanat Koleksiyonu',
      views: 1250,
      likes: 89,
      comments: 12,
      status: 'published'
    },
    {
      id: '2',
      title: 'Antik Eserler Galerisi',
      views: 980,
      likes: 67,
      comments: 8,
      status: 'published'
    },
    {
      id: '3',
      title: 'Çağdaş Heykel Sergisi',
      views: 756,
      likes: 45,
      comments: 6,
      status: 'draft'
    }
  ]);

  useEffect(() => {
    // Check museum authentication
    const museumAuth = localStorage.getItem('museumAuth');
    const museumUserData = localStorage.getItem('museumUser');
    
    if (museumAuth === 'true' && museumUserData) {
      setMuseumUser(JSON.parse(museumUserData));
    } else {
      navigate('/museum-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('museumAuth');
    localStorage.removeItem('museumUser');
    navigate('/museum-login');
  };

  const handleAddWork = () => {
    // Navigate to add work page
    console.log('Add new work');
  };

  if (!museumUser) {
    return null; // Loading or redirecting
  }

  return (
    <Container theme={theme}>
      <LeftSidebar theme={theme}>
        <SidebarHeader theme={theme}>
          <MuseumIcon>
            <FiBuilding size={20} />
          </MuseumIcon>
          <MuseumInfo>
            <MuseumName theme={theme}>{museumUser.name}</MuseumName>
            <MuseumType theme={theme}>Müze Sahibi</MuseumType>
          </MuseumInfo>
        </SidebarHeader>

        <SidebarMenu>
          <MenuItem theme={theme} active={location.pathname === '/museum-dashboard'} onClick={() => navigate('/museum-dashboard')}>
            <MenuIcon><FiBarChart2 /></MenuIcon><MenuText>Dashboard</MenuText>
          </MenuItem>
          <MenuItem theme={theme} active={location.pathname === '/museum-works'} onClick={() => navigate('/museum-works')}>
            <MenuIcon><FiImage /></MenuIcon><MenuText>Eserlerim</MenuText>
          </MenuItem>
          <MenuItem theme={theme} active={location.pathname === '/museum-visitors'} onClick={() => navigate('/museum-visitors')}>
            <MenuIcon><FiUsers /></MenuIcon><MenuText>Ziyaretçiler</MenuText>
          </MenuItem>
          <MenuItem theme={theme} active={location.pathname === '/museum-analytics'} onClick={() => navigate('/museum-analytics')}>
            <MenuIcon><FiBarChart2 /></MenuIcon><MenuText>Analitik</MenuText>
          </MenuItem>
          <MenuItem theme={theme} active={location.pathname === '/museum-settings'} onClick={() => navigate('/museum-settings')}>
            <MenuIcon><FiSettings /></MenuIcon><MenuText>Ayarlar</MenuText>
          </MenuItem>
          <MenuItem theme={theme} onClick={handleLogout}>
            <MenuIcon><FiLogOut /></MenuIcon><MenuText>Çıkış Yap</MenuText>
          </MenuItem>
        </SidebarMenu>
      </LeftSidebar>
      
      <MainLayout>
        <Content theme={theme}>
          <ContentInner>
            <Header theme={theme}>
              <Title theme={theme}>Müze Dashboard</Title>
              <HeaderActions>
                <ActionButton theme={theme} onClick={handleAddWork}>
                  <FiPlus size={16} />
                  Yeni Eser Ekle
                </ActionButton>
              </HeaderActions>
            </Header>

            <StatsGrid>
              <StatCard theme={theme}>
                <StatIcon color="#667eea" color2="#764ba2">
                  <FiImage size={24} />
                </StatIcon>
                <StatInfo>
                  <StatValue theme={theme}>{stats.totalWorks}</StatValue>
                  <StatLabel theme={theme}>Toplam Eser</StatLabel>
                </StatInfo>
              </StatCard>

              <StatCard theme={theme}>
                <StatIcon color="#f093fb" color2="#f5576c">
                  <FiEye size={24} />
                </StatIcon>
                <StatInfo>
                  <StatValue theme={theme}>{stats.totalViews.toLocaleString()}</StatValue>
                  <StatLabel theme={theme}>Toplam Görüntülenme</StatLabel>
                </StatInfo>
              </StatCard>

              <StatCard theme={theme}>
                <StatIcon color="#4facfe" color2="#00f2fe">
                  <FiUsers size={24} />
                </StatIcon>
                <StatInfo>
                  <StatValue theme={theme}>{stats.totalLikes}</StatValue>
                  <StatLabel theme={theme}>Toplam Beğeni</StatLabel>
                </StatInfo>
              </StatCard>

              <StatCard theme={theme}>
                <StatIcon color="#43e97b" color2="#38f9d7">
                  <FiMessageCircle size={24} />
                </StatIcon>
                <StatInfo>
                  <StatValue theme={theme}>{stats.totalComments}</StatValue>
                  <StatLabel theme={theme}>Toplam Yorum</StatLabel>
                </StatInfo>
              </StatCard>
            </StatsGrid>

            <Section theme={theme}>
              <SectionHeader theme={theme}>
                <SectionTitle theme={theme}>Son Eklenen Eserler</SectionTitle>
              </SectionHeader>
              <SectionContent>
                <WorksGrid>
                  {museumWorks.map((work) => (
                    <WorkCard key={work.id} theme={theme}>
                      <WorkImage>
                        <FiImage size={32} />
                      </WorkImage>
                      <WorkInfo>
                        <WorkTitle theme={theme}>{work.title}</WorkTitle>
                        <WorkStats theme={theme}>
                          <span>{work.views} görüntülenme</span>
                          <span>•</span>
                          <span>{work.likes} beğeni</span>
                        </WorkStats>
                      </WorkInfo>
                      <WorkActions theme={theme}>
                        <SmallButton theme={theme}>
                          <FiView size={12} />
                          Görüntüle
                        </SmallButton>
                        <SmallButton theme={theme}>
                          <FiEdit size={12} />
                          Düzenle
                        </SmallButton>
                        <SmallButton theme={theme}>
                          <FiTrash2 size={12} />
                          Sil
                        </SmallButton>
                      </WorkActions>
                    </WorkCard>
                  ))}
                </WorksGrid>
              </SectionContent>
            </Section>
          </ContentInner>
        </Content>
      </MainLayout>
    </Container>
  );
};

export default MuseumDashboard;
