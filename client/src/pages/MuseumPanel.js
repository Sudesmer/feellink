import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiHome, 
  FiEye, 
  FiUser, 
  FiMessageCircle,
  FiBarChart2,
  FiUsers,
  FiImage,
  FiSettings,
  FiLogOut,
  FiPlus,
  FiEdit,
  FiFilter,
  FiDownload,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiHeart,
  FiAward,
  FiSearch,
  FiGrid,
  FiList
} from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import WorkCard from '../components/WorkCard';
import ArtistsSidebar from '../components/ArtistsSidebar';
import { mockWorks } from '../mock-data';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 25%, #FFFFFF 50%, #FFF8F5 75%, #FF6B35 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  padding: 0;
  width: 100vw;
  overflow-x: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(247, 147, 30, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
  
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const MainLayout = styled.div`
  display: flex;
  width: 100vw; /* Tam genişlik kullan */
  margin: 0;
  gap: 0; /* Gap'i kaldır */
  padding: 0; /* Padding'i kaldır */
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
    background: ${props => props.active ? props.theme.gradient : props.theme.backgroundSecondary};
    transform: ${props => props.active ? 'translateX(8px)' : 'translateX(4px)'};
    box-shadow: ${props => props.active ? `0 4px 15px ${props.theme.shadow}` : `0 2px 8px ${props.theme.shadow}`};
  }
`;

const MenuIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 18px;
`;

const MenuText = styled.span`
  font-size: 18px;
  font-weight: 600;
`;

const MainContent = styled.div`
  flex: 1;
  min-width: 0;
  width: calc(100vw - 680px); /* 280px (sol) + 400px (sağ) = 680px */
  height: 100vh;
  overflow-y: auto;
  padding: 20px;
  margin-left: 280px; /* Sol sidebar genişliği */
  margin-right: 0;
  background: ${props => props.theme.surface};

  @media (max-width: 1200px) {
    height: auto;
    overflow: visible;
    padding: 20px;
    width: 100%;
    margin-left: 0;
  }
`;

const SidebarWrapper = styled.div`
  position: fixed;
  top: 0px;
  right: 0;
  width: 480px;
  height: 100vh;
  z-index: 100;
  overflow-y: auto;
  background: ${props => props.theme.surface};

  @media (max-width: 1200px) {
    display: none;
  }
`;

// Ana Sayfa Styled Components
const MonthlyHighlightsSection = styled.section`
  background: ${props => props.theme.backgroundSecondary};
  padding: 80px 0 40px 0;
  margin-bottom: 40px;
`;

const HighlightsContainer = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
`;

const HighlightsHeader = styled.div`
  text-align: left;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: auto;
  background: none;
  border-radius: none;
  box-shadow: none;
  position: relative;
`;

const BadgeIcon = styled(FiAward)`
  font-size: 1.4rem;
  color: #667eea;
  font-weight: bold;
  filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3));
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    color: #764ba2;
  }
`;

const HighlightsTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0;
`;

const ModernEyeIcon = styled(FiEye)`
  font-size: 1.6rem;
  color: #667eea;
  display: inline-block;
  transform: rotate(0deg);
  transition: all 0.3s ease;
  
  &:hover {
    transform: rotate(5deg) scale(1.1);
    color: #764ba2;
  }
`;

const HighlightsGrid = styled.div`
  display: flex;
  gap: 18px;
  overflow-x: auto;
  padding: 10px 0;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.backgroundSecondary};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.primary};
    border-radius: 3px;
  }
`;

const HighlightCard = styled.div`
  border: none;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  min-width: 200px;
  height: 120px;
  background-image: url(${props => props.backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
  }
`;

const HighlightOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 100%);
  display: flex;
  align-items: flex-end;
  padding: 15px;
`;

const HighlightInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HighlightDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 500;
`;

const HighlightName = styled.h3`
  font-size: 0.9rem;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0;
`;

const HighlightStats = styled.p`
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
`;

const FeaturedSection = styled.section`
  padding: 40px 0;
  background: ${props => props.theme.background};
`;

const SectionContainer = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;


const FilterButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border: 2px solid ${props => props.active ? props.theme.primary : '#666666'};
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? '#FFFFFF' : props.theme.text};
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    border-color: ${props => props.theme.primary};
    background: ${props => props.active ? props.theme.primary : props.theme.primary + '20'};
    color: ${props => props.active ? '#FFFFFF' : props.theme.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.primary + '30'};
  }
`;

const WorksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 420px);
  gap: 20px;
  justify-content: center;
  padding: 20px 0;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(2, 420px);
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    max-width: 420px;
    margin: 0 auto;
  }
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


const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 16px;
  padding: 28px;
  border: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.theme.primary + '30'};
  }
`;

const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, ${props => props.color || '#667eea'} 0%, ${props => props.color2 || '#764ba2'} 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
    transform: rotate(45deg);
    animation: shine 4s infinite;
  }

  @keyframes shine {
    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
    50% { transform: translateX(100%) translateY(100%) rotate(45deg); }
    100% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  }
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

const SectionContent = styled.div`
  padding: 24px;
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background: ${props => props.theme.surface};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primaryLight};
  }

  &::placeholder {
    color: ${props => props.theme.textMuted};
  }
`;

// Explore sayfası için ek styled componentler
const Content = styled.div`
  flex: 1;
  min-width: 0;
  width: calc(100vw - 680px); /* 280px (sol) + 400px (sağ) = 680px */
  height: 100vh;
  overflow-y: auto;
  padding: 0;
  margin-left: 280px; /* Sol sidebar genişliği */
  margin-right: 0;
  background: ${props => props.theme.surface};
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
  width: 100%;
  margin: 0;
  padding: 20px;
  flex: 1;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.textSecondary};
  max-width: 600px;
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  margin-bottom: 40px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;

  @media (max-width: 768px) {
    min-width: auto;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.textMuted};
  font-size: 20px;
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const SortSelect = styled.select`
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const ViewToggle = styled.div`
  display: flex;
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  overflow: hidden;
`;

const ViewButton = styled.button`
  padding: 12px 16px;
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

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 32px;
    align-items: stretch;
  }
`;

const ResultsCount = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 1rem;
`;

const LoadMoreButton = styled.button`
  display: block;
  margin: 40px auto 0;
  padding: 12px 32px;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(255, 107, 53, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const WorksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
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

const MuseumPanel = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [museumUser, setMuseumUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredWorks, setFilteredWorks] = useState(mockWorks);
  
  // Explore sayfası için state'ler
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  
  const [stats] = useState({
    totalWorks: 24,
    totalViews: 15420,
    totalLikes: 892,
    totalComments: 156,
    monthlyVisitors: 3240,
    revenue: 45600,
    exhibitions: 8,
    artists: 45
  });

  // Mock museum works data
  const [museumWorks] = useState([
    {
      _id: '1',
      title: 'Modern Sanat Koleksiyonu',
      description: 'Çağdaş sanatın en güzel örnekleri',
      images: [{ url: '/t1.jpg', isMain: true }],
      author: { 
        _id: '101',
        username: 'istanbul_modern',
        fullName: 'İstanbul Modern Sanat Müzesi',
        avatar: '/images/feellink.logo.png',
        isVerified: true,
        followers: 18000
      },
      category: { name: 'Modern Sanat', color: '#667eea' },
      likeCount: 89,
      views: 1250,
      comments: 12,
      status: 'published',
      isTrending: true,
      createdAt: new Date('2024-01-20')
    },
    {
      _id: '2',
      title: 'Antik Eserler Galerisi',
      description: 'Tarihi eserlerin büyüleyici dünyası',
      images: [{ url: '/t2.webp', isMain: true }],
      author: { 
        _id: '101',
        username: 'istanbul_modern',
        fullName: 'İstanbul Modern Sanat Müzesi',
        avatar: '/images/feellink.logo.png',
        isVerified: true,
        followers: 18000
      },
      category: { name: 'Antik Sanat', color: '#764ba2' },
      likeCount: 67,
      views: 980,
      comments: 8,
      status: 'published',
      isTrending: false,
      createdAt: new Date('2024-01-18')
    },
    {
      _id: '3',
      title: 'Çağdaş Heykel Sergisi',
      description: 'Modern heykel sanatının örnekleri',
      images: [{ url: '/t3.jpg', isMain: true }],
      author: { 
        _id: '101',
        username: 'istanbul_modern',
        fullName: 'İstanbul Modern Sanat Müzesi',
        avatar: '/images/feellink.logo.png',
        isVerified: true,
        followers: 18000
      },
      category: { name: 'Heykel', color: '#f093fb' },
      likeCount: 45,
      views: 756,
      comments: 6,
      status: 'draft',
      isTrending: false,
      createdAt: new Date('2024-01-15')
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

  // Filter works based on activeFilter
  useEffect(() => {
    let filtered = mockWorks;
    
    if (activeFilter === 'popular') {
      filtered = mockWorks.filter(work => work.isTrending);
    } else if (activeFilter === 'new') {
      filtered = mockWorks.filter(work => 
        work.createdAt && new Date(work.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
    }
    
    setFilteredWorks(filtered);
  }, [activeFilter]);

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

  const renderDashboard = () => (
    <>
      <StatsGrid>
        <StatCard theme={theme}>
          <StatIcon color="#667eea" color2="#764ba2">
            <FiImage size={28} />
          </StatIcon>
          <StatInfo>
            <StatValue theme={theme}>{stats.totalWorks}</StatValue>
            <StatLabel theme={theme}>Toplam Eser</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard theme={theme}>
          <StatIcon color="#f093fb" color2="#f5576c">
            <FiEye size={28} />
          </StatIcon>
          <StatInfo>
            <StatValue theme={theme}>{stats.totalViews.toLocaleString()}</StatValue>
            <StatLabel theme={theme}>Toplam Görüntülenme</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard theme={theme}>
          <StatIcon color="#4facfe" color2="#00f2fe">
            <FiUsers size={28} />
          </StatIcon>
          <StatInfo>
            <StatValue theme={theme}>{stats.monthlyVisitors.toLocaleString()}</StatValue>
            <StatLabel theme={theme}>Aylık Ziyaretçi</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard theme={theme}>
          <StatIcon color="#43e97b" color2="#38f9d7">
            <FiMessageCircle size={28} />
          </StatIcon>
          <StatInfo>
            <StatValue theme={theme}>{stats.totalComments}</StatValue>
            <StatLabel theme={theme}>Toplam Yorum</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard theme={theme}>
          <StatIcon color="#ffecd2" color2="#fcb69f">
            <FiDollarSign size={28} />
          </StatIcon>
          <StatInfo>
            <StatValue theme={theme}>₺{stats.revenue.toLocaleString()}</StatValue>
            <StatLabel theme={theme}>Aylık Gelir</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard theme={theme}>
          <StatIcon color="#a8edea" color2="#fed6e3">
            <FiHome size={28} />
          </StatIcon>
          <StatInfo>
            <StatValue theme={theme}>{stats.exhibitions}</StatValue>
            <StatLabel theme={theme}>Aktif Sergi</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard theme={theme}>
          <StatIcon color="#d299c2" color2="#fef9d7">
            <FiUser size={28} />
          </StatIcon>
          <StatInfo>
            <StatValue theme={theme}>{stats.artists}</StatValue>
            <StatLabel theme={theme}>Kayıtlı Sanatçı</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard theme={theme}>
          <StatIcon color="#89f7fe" color2="#66a6ff">
            <FiHeart size={28} />
          </StatIcon>
          <StatInfo>
            <StatValue theme={theme}>{stats.totalLikes}</StatValue>
            <StatLabel theme={theme}>Toplam Beğeni</StatLabel>
          </StatInfo>
        </StatCard>
      </StatsGrid>

      <Section theme={theme}>
        <SectionHeader theme={theme}>
          <SectionTitle theme={theme}>Son Eklenen Eserler</SectionTitle>
        </SectionHeader>
        <SectionContent>
          <WorksGrid>
            {museumWorks.slice(0, 3).map((work) => (
              <WorkCard key={work._id} work={work} />
            ))}
          </WorksGrid>
        </SectionContent>
      </Section>
    </>
  );

  const renderWorks = () => (
    <>
      <FilterBar theme={theme}>
        <SearchInput
          theme={theme}
          type="text"
          placeholder="Eserlerde ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterButton theme={theme} onClick={() => setSelectedFilter('all')}>
          <FiFilter size={16} />
          Tümü
        </FilterButton>
        <FilterButton theme={theme} onClick={() => setSelectedFilter('published')}>
          <FiEye size={16} />
          Yayınlanan
        </FilterButton>
        <FilterButton theme={theme} onClick={() => setSelectedFilter('draft')}>
          <FiEdit size={16} />
          Taslak
        </FilterButton>
        <FilterButton theme={theme} onClick={() => setSelectedFilter('trending')}>
          <FiTrendingUp size={16} />
          Trend
        </FilterButton>
      </FilterBar>

      <WorksGrid>
        {filteredWorks.map((work) => (
          <WorkCard key={work._id} work={work} />
        ))}
      </WorksGrid>
    </>
  );

  const renderExhibitions = () => (
    <>
      <FilterBar theme={theme}>
        <SearchInput
          theme={theme}
          type="text"
          placeholder="Sergilerde ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterButton theme={theme}>
          <FiCalendar size={16} />
          Aktif Sergiler
        </FilterButton>
        <FilterButton theme={theme}>
          <FiPlus size={16} />
          Yeni Sergi
        </FilterButton>
      </FilterBar>

      <Section theme={theme}>
        <SectionHeader theme={theme}>
          <SectionTitle theme={theme}>Aktif Sergiler</SectionTitle>
        </SectionHeader>
        <SectionContent>
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: theme.textSecondary,
            fontSize: '16px'
          }}>
            <FiCalendar size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>Sergi yönetimi özelliği yakında eklenecek...</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Burada sergi oluşturma, eser atama ve tarih yönetimi yapabileceksiniz.
            </p>
          </div>
        </SectionContent>
      </Section>
    </>
  );

  const renderAnalytics = () => (
    <>
      <FilterBar theme={theme}>
        <FilterButton theme={theme}>
          <FiCalendar size={16} />
          Son 30 Gün
        </FilterButton>
        <FilterButton theme={theme}>
          <FiTrendingUp size={16} />
          Popüler Eserler
        </FilterButton>
        <FilterButton theme={theme}>
          <FiUsers size={16} />
          Ziyaretçi Analizi
        </FilterButton>
        <FilterButton theme={theme}>
          <FiDownload size={16} />
          Rapor İndir
        </FilterButton>
      </FilterBar>

      <Section theme={theme}>
        <SectionHeader theme={theme}>
          <SectionTitle theme={theme}>Analitik Dashboard</SectionTitle>
        </SectionHeader>
        <SectionContent>
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: theme.textSecondary,
            fontSize: '16px'
          }}>
            <FiBarChart2 size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>Detaylı analitik özellikleri yakında eklenecek...</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Ziyaretçi istatistikleri, popüler eserler ve gelir analizi burada görünecek.
            </p>
          </div>
        </SectionContent>
      </Section>
    </>
  );

  const renderSettings = () => (
    <>
      <Section theme={theme}>
        <SectionHeader theme={theme}>
          <SectionTitle theme={theme}>Müze Ayarları</SectionTitle>
        </SectionHeader>
        <SectionContent>
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: theme.textSecondary,
            fontSize: '16px'
          }}>
            <FiSettings size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>Müze ayarları yakında eklenecek...</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Profil düzenleme, bildirim ayarları ve genel tercihler burada olacak.
            </p>
          </div>
        </SectionContent>
      </Section>
    </>
  );

  const renderHome = () => (
    <>
      <MonthlyHighlightsSection>
        <HighlightsContainer>
          <HighlightsHeader>
            <BadgeContainer>
              <BadgeIcon />
            </BadgeContainer>
            <HighlightsTitle>Ayın Öne Çıkanları</HighlightsTitle>
          </HighlightsHeader>

          <HighlightsGrid>
            <HighlightCard backgroundImage="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop">
              <HighlightOverlay>
                <HighlightInfo>
                  <HighlightDescription>⭐ Ayın Müzesi</HighlightDescription>
                  <HighlightName>İstanbul Modern</HighlightName>
                  <HighlightStats>2.4K ziyaretçi</HighlightStats>
                </HighlightInfo>
              </HighlightOverlay>
            </HighlightCard>

            <HighlightCard backgroundImage="/sude.jpg">
              <HighlightOverlay>
                <HighlightInfo>
                  <HighlightDescription>⭐ Ayın Sanatçısı</HighlightDescription>
                  <HighlightName>Sude Esmer</HighlightName>
                  <HighlightStats>1.8K takipçi</HighlightStats>
                </HighlightInfo>
              </HighlightOverlay>
            </HighlightCard>

            <HighlightCard backgroundImage="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=400&fit=crop">
              <HighlightOverlay>
                <HighlightInfo>
                  <HighlightDescription>⭐ Ayın Eseri</HighlightDescription>
                  <HighlightName>Günbatımında İstanbul</HighlightName>
                  <HighlightStats>3.2K beğeni</HighlightStats>
                </HighlightInfo>
              </HighlightOverlay>
            </HighlightCard>

            <HighlightCard backgroundImage="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop">
              <HighlightOverlay>
                <HighlightInfo>
                  <HighlightDescription>⭐ Ayın Yorumu</HighlightDescription>
                  <HighlightName>"Bu eser bana huzur veriyor"</HighlightName>
                  <HighlightStats>1.5K beğeni</HighlightStats>
                </HighlightInfo>
              </HighlightOverlay>
            </HighlightCard>

            <HighlightCard backgroundImage="/zeynep.jpg">
              <HighlightOverlay>
                <HighlightInfo>
                  <HighlightDescription>⭐ Ayın Koleksiyoneri</HighlightDescription>
                  <HighlightName>Zeynep Esmer</HighlightName>
                  <HighlightStats>2.8K takipçi</HighlightStats>
                </HighlightInfo>
              </HighlightOverlay>
            </HighlightCard>
          </HighlightsGrid>
        </HighlightsContainer>
      </MonthlyHighlightsSection>

      <FeaturedSection>
        <SectionContainer>
          <SectionHeader>
            <SectionTitle>
              <ModernEyeIcon />
              Keşfet
            </SectionTitle>
            <FilterButtons>
              <FilterButton 
                active={activeFilter === 'all'} 
                onClick={() => setActiveFilter('all')}
              >
                Tümü
              </FilterButton>
              <FilterButton 
                active={activeFilter === 'popular'} 
                onClick={() => setActiveFilter('popular')}
              >
                Popüler
              </FilterButton>
              <FilterButton 
                active={activeFilter === 'new'} 
                onClick={() => setActiveFilter('new')}
              >
                Yeni
              </FilterButton>
            </FilterButtons>
          </SectionHeader>

          <WorksGrid>
            {filteredWorks.map((work) => (
              <WorkCard key={work._id} work={work} />
            ))}
          </WorksGrid>
        </SectionContainer>
      </FeaturedSection>
    </>
  );

  const renderExplore = () => (
    <Content theme={theme}>
      <ContentInner>
        <Header>
          <Title theme={theme}>Keşfet</Title>
          <Subtitle theme={theme}>
            Yaratıcı eserleri keşfedin, ilham alın ve yeni tasarımcılarla tanışın
          </Subtitle>
        </Header>

        <FiltersContainer>
          <SearchContainer>
            <form onSubmit={(e) => e.preventDefault()}>
              <SearchInput
                theme={theme}
                type="text"
                placeholder="Eserler, tasarımcılar ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchIcon theme={theme} />
            </form>
          </SearchContainer>

          <FilterSelect
            theme={theme}
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tüm Kategoriler</option>
            <option value="painting">Resim</option>
            <option value="sculpture">Heykel</option>
            <option value="digital">Dijital Sanat</option>
            <option value="photography">Fotoğraf</option>
          </FilterSelect>

          <SortSelect
            theme={theme}
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
          >
            <option value="newest">En Yeni</option>
            <option value="oldest">En Eski</option>
            <option value="mostLiked">En Çok Beğenilen</option>
            <option value="mostViewed">En Çok Görüntülenen</option>
            <option value="featured">Öne Çıkanlar</option>
          </SortSelect>

          <ViewToggle theme={theme}>
            <ViewButton
              theme={theme}
              active={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
            >
              <FiGrid size={18} />
              Grid
            </ViewButton>
            <ViewButton
              theme={theme}
              active={viewMode === 'list'}
              onClick={() => setViewMode('list')}
            >
              <FiList size={18} />
              Liste
            </ViewButton>
          </ViewToggle>
        </FiltersContainer>

        <ResultsHeader>
          <ResultsCount theme={theme}>
            {mockWorks.length} eser bulundu
          </ResultsCount>
        </ResultsHeader>

        {viewMode === 'grid' ? (
          <WorksGrid>
            {mockWorks.filter(work => {
              const matchesSearch = work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                   work.description.toLowerCase().includes(searchQuery.toLowerCase());
              
              if (category && work.category !== category) return false;
              
              return matchesSearch;
            }).map((work) => (
              <WorkCard key={work._id} work={work} />
            ))}
          </WorksGrid>
        ) : (
          <WorksList>
            {mockWorks.filter(work => {
              const matchesSearch = work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                   work.description.toLowerCase().includes(searchQuery.toLowerCase());
              
              if (category && work.category !== category) return false;
              
              return matchesSearch;
            }).map((work) => (
              <WorkCard key={work._id} work={work} />
            ))}
          </WorksList>
        )}
      </ContentInner>
    </Content>
  );

  const renderProfile = () => (
    <Content theme={theme}>
      <ContentInner>
        <Header>
          <Title theme={theme}>Profil</Title>
          <Subtitle theme={theme}>
            Müze profilinizi yönetin ve ayarlarınızı düzenleyin
          </Subtitle>
        </Header>

        <Section theme={theme}>
          <SectionContent>
            <h3>Müze Bilgileri</h3>
            <p>Müze adı: İstanbul Modern</p>
            <p>Kuruluş yılı: 2004</p>
            <p>Adres: Meclis-i Mebusan Caddesi, Liman İşletmeleri Sahası Antrepo No:4, 34433 Karaköy/İstanbul</p>
          </SectionContent>
        </Section>

        <Section theme={theme}>
          <SectionContent>
            <h3>İstatistikler</h3>
            <p>Toplam eser sayısı: {stats.totalWorks}</p>
            <p>Toplam görüntülenme: {stats.totalViews.toLocaleString()}</p>
            <p>Toplam beğeni: {stats.totalLikes.toLocaleString()}</p>
          </SectionContent>
        </Section>
      </ContentInner>
    </Content>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHome();
      case 'explore':
        return renderExplore();
      case 'profile':
        return renderProfile();
      case 'dashboard':
        return renderDashboard();
      case 'works':
        return renderWorks();
      case 'analytics':
        return renderAnalytics();
      case 'exhibitions':
        return renderExhibitions();
      case 'settings':
        return renderSettings();
      default:
        return renderHome();
    }
  };

  return (
    <Container theme={theme}>
      <LeftSidebar theme={theme}>
        <SidebarMenu>
          <MenuItem theme={theme} active={activeTab === 'home'} onClick={() => setActiveTab('home')}>
            <MenuIcon><FiHome /></MenuIcon><MenuText>Ana Sayfa</MenuText>
          </MenuItem>
          <MenuItem theme={theme} active={activeTab === 'explore'} onClick={() => setActiveTab('explore')}>
            <MenuIcon><FiEye /></MenuIcon><MenuText>Keşfet</MenuText>
          </MenuItem>
          <MenuItem theme={theme} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
            <MenuIcon><FiUser /></MenuIcon><MenuText>Profil</MenuText>
          </MenuItem>
          <MenuItem theme={theme} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>
            <MenuIcon><FiBarChart2 /></MenuIcon><MenuText>Dashboard</MenuText>
          </MenuItem>
          <MenuItem theme={theme} active={activeTab === 'works'} onClick={() => setActiveTab('works')}>
            <MenuIcon><FiImage /></MenuIcon><MenuText>Eserlerim</MenuText>
          </MenuItem>
          <MenuItem theme={theme} active={activeTab === 'exhibitions'} onClick={() => setActiveTab('exhibitions')}>
            <MenuIcon><FiCalendar /></MenuIcon><MenuText>Sergiler</MenuText>
          </MenuItem>
          <MenuItem theme={theme} active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')}>
            <MenuIcon><FiTrendingUp /></MenuIcon><MenuText>Analitik</MenuText>
          </MenuItem>
          <MenuItem theme={theme} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
            <MenuIcon><FiSettings /></MenuIcon><MenuText>Ayarlar</MenuText>
          </MenuItem>
          <MenuItem theme={theme} onClick={handleLogout}>
            <MenuIcon><FiLogOut /></MenuIcon><MenuText>Çıkış Yap</MenuText>
          </MenuItem>
        </SidebarMenu>
      </LeftSidebar>
      
      <MainLayout>
        <MainContent>
          {renderContent()}
        </MainContent>
      </MainLayout>
      
      <SidebarWrapper>
        <ArtistsSidebar />
      </SidebarWrapper>
    </Container>
  );
};

export default MuseumPanel;
