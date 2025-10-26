import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiSearch, FiGrid, FiList, FiHome, FiEye, FiBell, FiUser, FiBookmark } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import WorkCard from '../components/WorkCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { worksAPI, categoriesAPI } from '../api/mockApi';

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
  padding: 0;
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  flex: 1;
`;

const Header = styled.div`
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
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

const LoadMoreButton = styled(motion.button)`
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

const WorksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  justify-content: center;
  justify-items: center;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
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

// User search components
const UserSearchSection = styled.div`
  margin-bottom: 40px;
`;

const UserSearchTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 20px;
  background: ${props => props.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const UserCard = styled(motion.div)`
  background: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary};
  }
`;

const UserAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 16px;
  background: ${props => props.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.5rem;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 8px;
`;

const UserEmail = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  margin: 0 0 16px 0;
`;

const UserBio = styled.p`
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
  margin: 0 0 8px 0;
  line-height: 1.4;
  max-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserLocation = styled.p`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const UserUsername = styled.p`
  font-size: 0.8rem;
  color: ${props => props.theme.primary};
  margin: 0 0 12px 0;
  font-weight: 500;
`;

const UserMatchType = styled.p`
  font-size: 0.75rem;
  color: ${props => props.theme.primary};
  margin: 0 0 8px 0;
  font-weight: 600;
  background: ${props => props.theme.surface};
  padding: 4px 8px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  display: inline-block;
`;

const NoResultsMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
  background: ${props => props.theme.surface};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
`;

const FollowButton = styled.button`
  padding: 8px 16px;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;

  &:hover {
    background: ${props => props.theme.primaryHover};
    transform: translateY(-1px);
  }

  &:disabled {
    background: ${props => props.theme.textMuted};
    cursor: not-allowed;
    transform: none;
  }
`;

const Explore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { user: currentUser, followUser, unfollowUser } = useAuth();
  
  // URL'den arama parametresini oku
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [searchMode, setSearchMode] = useState('works'); // 'works' or 'users'
  const [users, setUsers] = useState([]);
  const [followingUsers, setFollowingUsers] = useState(new Set());

  // Fetch categories
  const { data: categories } = useQuery(
    'categories',
    async () => {
      const response = await categoriesAPI.getCategories();
      return response.categories;
    }
  );

  // Fetch users for search
  const searchUsers = async (query) => {
    if (!query.trim()) return [];
    
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      if (response.data && response.data.success) {
        const allUsers = response.data.users || [];
        // Filter users by query - tek harf aramaları için optimize edilmiş
        const filtered = allUsers.map(user => {
          const searchTerm = query.toLowerCase().trim();
          let matchType = '';
          let isMatch = false;
          
          // Tek harf aramaları için özel kontrol
          if (searchTerm.length === 1) {
            if (user.fullName?.toLowerCase().startsWith(searchTerm)) {
              isMatch = true;
              matchType = 'İsim';
            } else if (user.email?.toLowerCase().startsWith(searchTerm)) {
              isMatch = true;
              matchType = 'Email';
            } else if (user.username?.toLowerCase().startsWith(searchTerm)) {
              isMatch = true;
              matchType = 'Kullanıcı Adı';
            } else if (user.fullName?.toLowerCase().split(' ').some(name => name.startsWith(searchTerm))) {
              isMatch = true;
              matchType = 'İsim';
            } else if (user.email?.split('@')[0]?.toLowerCase().startsWith(searchTerm)) {
              isMatch = true;
              matchType = 'Email';
            }
          } else {
            // Çoklu karakter aramaları için normal kontrol
            if (user.fullName?.toLowerCase().includes(searchTerm)) {
              isMatch = true;
              matchType = 'İsim';
            } else if (user.email?.toLowerCase().includes(searchTerm)) {
              isMatch = true;
              matchType = 'Email';
            } else if (user.username?.toLowerCase().includes(searchTerm)) {
              isMatch = true;
              matchType = 'Kullanıcı Adı';
            } else if (user.bio?.toLowerCase().includes(searchTerm)) {
              isMatch = true;
              matchType = 'Biyografi';
            } else if (user.location?.toLowerCase().includes(searchTerm)) {
              isMatch = true;
              matchType = 'Konum';
            } else if (user.fullName?.toLowerCase().split(' ').some(name => name.includes(searchTerm))) {
              isMatch = true;
              matchType = 'İsim';
            } else if (user.email?.split('@')[0]?.toLowerCase().includes(searchTerm)) {
              isMatch = true;
              matchType = 'Email';
            }
          }
          
          return isMatch ? { ...user, matchType } : null;
        }).filter(Boolean);
        
        // Kendi profilini arama sonuçlarından çıkar
        const filteredUsers = filtered.filter(user => user._id !== currentUser?._id);
        
        console.log(`🔍 "${query}" için ${filteredUsers.length} kullanıcı bulundu:`, filteredUsers.map(u => `${u.fullName} (${u.matchType})`));
        return filteredUsers;
      }
      return [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  };

  // Fetch works - Gerçek zamanlı eserler için boş array (backend entegrasyonu için hazır)
  const { data: worksData, isLoading, isFetching } = useQuery(
    ['works', searchQuery, category, sortBy, page],
    async () => {
      // Gerçek zamanlı eserler eklendikçe buraya backend entegrasyonu yapılacak
      return {
        success: true,
        works: [],
        pagination: {
          current: 1,
          pages: 1,
          total: 0
        }
      };
    }
  );

  // Search users when search query changes - debounced
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchUsers(searchQuery).then(setUsers);
      } else {
        setUsers([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  // Takip fonksiyonları
  const handleFollow = async (targetUser) => {
    if (!currentUser) {
      alert('Takip etmek için giriş yapmalısınız');
      return;
    }

    if (currentUser._id === targetUser._id) {
      alert('Kendinizi takip edemezsiniz');
      return;
    }

    try {
      const result = await followUser(targetUser._id);
      if (result && result.success) {
        setFollowingUsers(prev => new Set([...prev, targetUser._id]));
      }
    } catch (error) {
      console.error('Takip hatası:', error);
    }
  };

  const handleUnfollow = async (targetUser) => {
    try {
      const result = await unfollowUser(targetUser._id);
      if (result && result.success) {
        setFollowingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(targetUser._id);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Takipten çıkma hatası:', error);
    }
  };

  const works = worksData?.works || [];
  const hasMore = worksData?.pagination?.current < worksData?.pagination?.pages;

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
          
          <MenuItem theme={theme} onClick={() => navigate('/notifications')}>
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
          <ContentInner>
            <Header>
              <Title theme={theme}>Keşfet</Title>
              <Subtitle theme={theme}>
                Yaratıcı eserleri keşfedin, ilham alın ve yeni tasarımcılarla tanışın
              </Subtitle>
            </Header>

          <FiltersContainer>
            <SearchContainer>
              <form onSubmit={handleSearch}>
                <SearchInput
                  theme={theme}
                  type="text"
                  placeholder="Tek harf bile yazabilirsiniz: z, s, gmail..."
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
              {categories?.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
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

          {/* User Search Results */}
          {searchQuery.trim() && (
            <UserSearchSection>
              <UserSearchTitle theme={theme}>
                👥 Bulunan Kullanıcılar
              </UserSearchTitle>
              {users.length > 0 ? (
                <UsersGrid>
                  {users.map((user, index) => (
                    <UserCard
                      key={user._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <UserAvatar theme={theme}>
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.fullName} />
                        ) : (
                          user.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
                        )}
                      </UserAvatar>
                      <UserName theme={theme}>{user.fullName || user.email}</UserName>
                      <UserEmail theme={theme}>{user.email}</UserEmail>
                      
                      {/* Eşleşme türü */}
                      <UserMatchType theme={theme}>
                        🎯 {user.matchType} ile eşleşti
                      </UserMatchType>
                      
                      {/* Kullanıcı bilgileri */}
                      {user.bio && (
                        <UserBio theme={theme}>{user.bio}</UserBio>
                      )}
                      {user.location && (
                        <UserLocation theme={theme}>📍 {user.location}</UserLocation>
                      )}
                      {user.username && (
                        <UserUsername theme={theme}>@{user.username}</UserUsername>
                      )}
                      
                      {/* Takip Butonu */}
                      {currentUser && currentUser._id !== user._id && (
                        <FollowButton
                          theme={theme}
                          onClick={(e) => {
                            e.stopPropagation();
                            const isFollowing = followingUsers.has(user._id);
                            if (isFollowing) {
                              handleUnfollow(user);
                            } else {
                              handleFollow(user);
                            }
                          }}
                        >
                          {followingUsers.has(user._id) ? 'Takipten Çık' : 'Takip Et'}
                        </FollowButton>
                      )}
                      
                      {/* Profil Ziyaret Butonu */}
                      <FollowButton
                        theme={theme}
                        onClick={() => {
                          const identifier = user.username || user.email?.split('@')[0] || user._id;
                          navigate(`/profile/${identifier}`);
                        }}
                        style={{ 
                          background: theme.surface, 
                          color: theme.text,
                          border: `1px solid ${theme.border}`
                        }}
                      >
                        Profili Ziyaret Et
                      </FollowButton>
                    </UserCard>
                  ))}
                </UsersGrid>
              ) : (
                <NoResultsMessage theme={theme}>
                  🔍 "{searchQuery}" için kullanıcı bulunamadı
                </NoResultsMessage>
              )}
            </UserSearchSection>
          )}

          {/* Works Section */}
          {isLoading ? (
            <LoadingSpinner text="Eserler yükleniyor..." />
          ) : works.length > 0 ? (
            <>
              <ResultsHeader>
                <ResultsCount theme={theme}>
                  {worksData?.pagination?.total || 0} eser bulundu
                </ResultsCount>
              </ResultsHeader>

              {viewMode === 'grid' ? (
                <WorksGrid>
                  {works.map((work, index) => (
                    <motion.div
                      key={work._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                      style={{ pointerEvents: 'none' }}
                    >
                      <div style={{ pointerEvents: 'auto' }}>
                        <WorkCard work={work} />
                      </div>
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
                      style={{ pointerEvents: 'none' }}
                    >
                      <div style={{ pointerEvents: 'auto' }}>
                        <WorkCard work={work} />
                      </div>
                    </motion.div>
                  ))}
                </WorksList>
              )}

              {hasMore && (
                <LoadMoreButton
                  theme={theme}
                  onClick={handleLoadMore}
                  disabled={isFetching}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isFetching ? 'Yükleniyor...' : 'Daha Fazla Yükle'}
                </LoadMoreButton>
              )}
            </>
          ) : (
            <EmptyState theme={theme}>
              <EmptyIcon>🔍</EmptyIcon>
              <EmptyTitle theme={theme}>Eser bulunamadı</EmptyTitle>
              <EmptyDescription theme={theme}>
                Arama kriterlerinize uygun eser bulunamadı. 
                Farklı anahtar kelimeler deneyebilir veya filtreleri değiştirebilirsiniz.
              </EmptyDescription>
            </EmptyState>
          )}
          </ContentInner>
        </Content>
      </MainLayout>
    </Container>
  );
};

export default Explore;

