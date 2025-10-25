import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { FiHeart, FiMessageCircle, FiCalendar, FiTrendingUp, FiHome, FiEye, FiBell, FiUser, FiBookmark, FiClock } from 'react-icons/fi';

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
`;

const Content = styled.div`
  flex: 1;
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
  padding: 40px 24px;
  flex: 1;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  background: ${props => props.theme.surface};
  border-bottom: 1px solid ${props => props.theme.border};
  padding: 24px;
  z-index: 100;
  backdrop-filter: blur(20px);
  margin-bottom: 20px;
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0 0 8px 0;
  background: ${props => props.theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeaderSubtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.textSecondary};
  margin: 0;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 10px 20px;
  background: ${props => props.active ? props.theme.gradient : props.theme.surface};
  color: ${props => props.active ? 'white' : props.theme.text};
  border: 2px solid ${props => props.active ? 'transparent' : props.theme.border};
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.shadow};
  }
`;

const ArticlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const ArticleCard = styled.div`
  background: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary};
  }
`;

const ArticleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const AuthorAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AuthorInfo = styled.div`
  flex: 1;
`;

const AuthorName = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const VerifiedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
  font-size: 10px;
  color: white;
  font-weight: bold;
`;

const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
`;

const ArticleTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0 0 12px 0;
  line-height: 1.4;
`;

const ArticleExcerpt = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
  margin: 0 0 16px 0;
`;

const ArticleFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.border};
`;

const ArticleStats = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ReadMoreButton = styled.button`
  background: transparent;
  border: 2px solid ${props => props.theme.primary};
  color: ${props => props.theme.primary};
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.primary};
    color: white;
    transform: translateY(-2px);
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

const Articles = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState('all');

  // Gerçek zamanlı köşe yazıları (backend entegrasyonu için hazır)
  const articles = [];

  const filteredArticles = articles.filter(article => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'trending') return article.isTrending;
    return true;
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
          
          <MenuItem theme={theme} active={location.pathname === '/articles'} onClick={() => navigate('/articles')}>
            <MenuIcon>
              <FiCalendar />
            </MenuIcon>
            <MenuText>Köşe Yazıları</MenuText>
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
      
      <Content theme={theme}>
        <Header>
          <HeaderTitle theme={theme}>🎨 Sanatçı Köşe Yazıları</HeaderTitle>
          <HeaderSubtitle theme={theme}>
            Sanatçıların düşünceleri, deneyimleri ve yaratıcı süreçleri
          </HeaderSubtitle>
        </Header>

        <ContentInner>
          <FilterButtons>
            <FilterButton
              theme={theme}
              active={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
            >
              Tümü
            </FilterButton>
            <FilterButton
              theme={theme}
              active={activeFilter === 'trending'}
              onClick={() => setActiveFilter('trending')}
            >
              <FiTrendingUp style={{ marginRight: '6px' }} />
              Trend Yazılar
            </FilterButton>
          </FilterButtons>

          {filteredArticles.length === 0 ? (
            <EmptyState theme={theme}>
              <EmptyIcon>✍️</EmptyIcon>
              <EmptyText theme={theme}>Henüz yazı yok</EmptyText>
              <EmptySubtext theme={theme}>
                Sanatçılar köşe yazılarını paylaştıkça burada görünecek
              </EmptySubtext>
            </EmptyState>
          ) : (
            <ArticlesGrid>
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} theme={theme}>
                  <ArticleHeader>
                    <AuthorAvatar theme={theme}>
                      <img src={article.author.avatar} alt={article.author.name} />
                    </AuthorAvatar>
                    <AuthorInfo>
                      <AuthorName theme={theme}>
                        {article.author.name}
                        {article.author.isVerified && (
                          <VerifiedBadge>✓</VerifiedBadge>
                        )}
                      </AuthorName>
                      <ArticleMeta theme={theme}>
                        <FiCalendar size={14} />
                        {article.date}
                      </ArticleMeta>
                    </AuthorInfo>
                  </ArticleHeader>

                  <ArticleTitle theme={theme}>{article.title}</ArticleTitle>
                  <ArticleExcerpt theme={theme}>{article.excerpt}</ArticleExcerpt>

                  <ArticleFooter>
                    <ArticleStats theme={theme}>
                      <StatItem>
                        <FiHeart size={16} />
                        {article.likes}
                      </StatItem>
                      <StatItem>
                        <FiMessageCircle size={16} />
                        {article.comments}
                      </StatItem>
                    </ArticleStats>
                    <ReadMoreButton theme={theme}>
                      Devamını Oku →
                    </ReadMoreButton>
                  </ArticleFooter>
                </ArticleCard>
              ))}
            </ArticlesGrid>
          )}
        </ContentInner>
      </Content>
    </Container>
  );
};

export default Articles;
