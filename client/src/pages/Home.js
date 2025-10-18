import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSearch, FiTrendingUp, FiStar, FiUsers, FiArrowRight, FiAward, FiMessageCircle, FiMapPin, FiHeart, FiEye, FiAward as FiBadge } from 'react-icons/fi';
import WorkCard from '../components/WorkCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ArtistsSidebar from '../components/ArtistsSidebar';

const Container = styled.div`
  min-height: 100vh;
  background: #000000;
  padding: 0;
  width: 100vw;
  overflow-x: hidden;
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

const MainContent = styled.div`
  flex: 1;
  min-width: 0;
  width: calc(100vw - 400px);
  height: 100vh;
  overflow-y: auto;
  padding: 20px;
  margin-right: 0;
  background: #000000;

  @media (max-width: 1200px) {
    height: auto;
    overflow: visible;
    padding: 20px;
    width: 100%;
  }
`;

const SidebarWrapper = styled.div`
  position: fixed;
  top: 0px;
  right: 0;
  width: 400px;
  height: 100vh;
  z-index: 100;
  overflow-y: auto;
  background: #000000;

  @media (max-width: 1200px) {
    display: none;
  }
`;

const HeroSection = styled.section`
  padding: 120px 0 80px;
  background: ${props => props.theme.gradient};
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

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  color: white;
  margin-bottom: 24px;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const SearchContainer = styled.div`
  max-width: 600px;
  margin: 0 auto 60px;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 16px 24px 16px 56px;
  border: none;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.95);
  font-size: 16px;
  color: ${props => props.theme.text};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    background: white;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  }

  &::placeholder {
    color: ${props => props.theme.textMuted};
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.textMuted};
  font-size: 20px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const StatItem = styled.div`
  text-align: center;
  color: white;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  opacity: 0.9;
`;

const FeaturedSection = styled.section`
  padding: 40px 0;
  background: ${props => props.theme.background};
  position: relative;
  overflow: hidden;
`;

const SectionContainer = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
  position: relative;
  z-index: 2;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
  padding: 0 20px 0 500px;
  
  h2, p {
    color: ${props => props.theme.text};
  }
  
  @media (max-width: 768px) {
    padding: 0 20px;
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 0;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ModernEyeIcon = styled(FiEye)`
  font-size: 1.6rem;
  color: #FF6B35;
  display: inline-block;
  transform: rotate(0deg);
  transition: all 0.3s ease;
  
  &:hover {
    transform: rotate(5deg) scale(1.1);
    color: #FF8C42;
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 8px;
  position: relative;
  z-index: 1000;
  
  @media (max-width: 768px) {
    gap: 6px;
  }
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #FF6B35;
  border-radius: 20px;
  background: ${props => props.active ? '#FF6B35' : 'transparent'};
  color: ${props => props.active ? 'white' : '#FF6B35'};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  z-index: 1001;
  
  &:hover {
    background: #FF6B35;
    color: white;
    border-color: #FF6B35;
  }
  
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.textSecondary};
  max-width: 600px;
  margin: 0 auto;
`;

const WorksGrid = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
  width: 100%;
  margin: 0 0 40px 0;
  padding: 0 0 0 500px;
  overflow: visible;

  @media (max-width: 1800px) {
    gap: 20px;
    width: 100%;
    margin: 0 0 40px 0;
    padding: 0 0 0 500px;
  }

  @media (max-width: 768px) {
    gap: 16px;
    width: 100%;
    margin: 0 0 40px 0;
    padding: 0 20px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const ViewAllButton = styled.button`
  display: block;
  margin: 0 auto;
  padding: 16px 40px;
  background: #FF6B35;
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
`;

const MonthlyHighlightsSection = styled.section`
  background: ${props => props.theme.backgroundSecondary};
  padding: 80px 0 40px 0;
  overflow: hidden; /* Turuncu çubuğu gizle */
  position: relative;
`;

const HighlightsContainer = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
`;

const HighlightsHeader = styled.div`
  text-align: left;
  margin-bottom: 30px;
  padding: 0 20px 0 500px;
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const HighlightsTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 0;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
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

const BadgeIcon = styled(FiBadge)`
  font-size: 1.4rem;
  color: #FF6B35;
  font-weight: bold;
  filter: drop-shadow(0 2px 4px rgba(255, 107, 53, 0.3));
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    color: #FF8C42;
    filter: drop-shadow(0 4px 8px rgba(255, 107, 53, 0.5));
  }
`;

const HighlightsGrid = styled.div`
  display: flex;
  gap: 18px;
  margin-bottom: 0px;
  padding: 0 0 16px 500px;
  position: relative;
  width: 100%;
  overflow: hidden; /* Turuncu çubuğu gizle */
  mask: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
  -webkit-mask: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);

  @media (max-width: 768px) {
    gap: 16px;
    padding: 0 0 12px 20px;
  }

`;

const HighlightCard = styled.div`
  background: #000000;
  border: 2px solid transparent;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: none;
  height: 200px;
  width: 247px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  /* Arka plan resmi */
  background-image: url(${props => props.backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: scroll;
  
  /* Düz Hizalama - Yamukluk Yok */
  transform: translateY(0);
  
  /* Modern Gölge Efekti */
  box-shadow: 
    0 8px 25px rgba(69, 67, 67, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  
  /* Hover efektleri kaldırıldı */
  &:hover {
    /* Hover efektleri kaldırıldı */
  }

  /* Glow efekti kaldırıldı */
  &::after {
    display: none;
  }

  /* İçerik Parlaklık Efekti - hover glow ile çakışmaması için kaldırıldı */

  @media (max-width: 768px) {
    width: 300px;
    height: 180px;
    
    &:hover {
      transform: translateY(-4px) scale(1.01);
    }
  }
`;

const HighlightHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  color: ${props => props.theme.text};
`;

const HighlightIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 1.2rem;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
`;

const HighlightTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0;
`;


const HighlightWinner = styled.div`
  background: transparent;
  border-radius: 16px;
  padding: 8px;
  margin-bottom: 4px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const WinnerImage = styled.div`
  width: 100%;
  height: 80px;
  border-radius: 16px;
  background: transparent;
  border: 1px solid ${props => props.theme.border};
  margin: 0 auto 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.01);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

const WinnerImageContent = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const WinnerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.glass};
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 16px;

  ${WinnerImage}:hover & {
    opacity: 1;
  }
`;

const WinnerOverlayContent = styled.div`
  text-align: center;
  color: ${props => props.theme.text};
`;

const WinnerOverlayName = styled.div`
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 4px;
`;

const WinnerOverlayStats = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const WinnerIcon = styled.div`
  font-size: 1.5rem;
  color: ${props => props.theme.primary};
`;

const WinnerName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  margin-bottom: 4px;
  text-align: center;
`;

const WinnerStats = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.8rem;
  text-align: center;
  line-height: 1.3;
  opacity: 0.8;
`;

const HighlightBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: ${props => props.theme.primary};
  color: white;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 0.6rem;
  font-weight: 600;
`;

const HighlightOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.8) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 12px;
  color: white;
`;

const HighlightInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HighlightName = styled.h3`
  font-size: 0.9rem;
  font-weight: 700;
  color: white;
  margin: 0;
  line-height: 1.2;
`;

const HighlightDescription = styled.p`
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.2;
`;

const HighlightStats = styled.p`
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  line-height: 1.2;
`;


const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredWorks, setFeaturedWorks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    // Mock data for featured works
    const mockWorks = [
      {
        _id: '1',
        title: 'Günbatımında İstanbul',
        description: 'Boğaz\'ın büyüleyici günbatımı manzarası',
        images: [{ url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop', isMain: true }],
        author: { name: 'Ahmet Yılmaz', username: 'ahmet_art', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
        category: { name: 'Resim', color: '#FF6B35' },
        likeCount: 245,
        viewCount: 980
      },
      {
        _id: '2',
        title: 'Doğanın Sessizliği',
        description: 'Doğanın huzur veren sessizliği',
        images: [{ url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', isMain: true }],
        author: { name: 'Mehmet Doğan', username: 'mehmet_nature', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
        category: { name: 'Fotoğraf', color: '#4CAF50' },
        likeCount: 289,
        viewCount: 1150
      },
      {
        _id: '3',
        title: 'Soyut Düşler',
        description: 'Renklerin dansı',
        images: [{ url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop', isMain: true }],
        author: { name: 'Can Soyut', username: 'can_abstract', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop' },
        category: { name: 'Dijital Sanat', color: '#2196F3' },
        likeCount: 312,
        viewCount: 1240
      }
    ];
    
    setFeaturedWorks(mockWorks);
    setIsLoading(false);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/explore?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <Container>
      <MainLayout>
        <MainContent>
          <MonthlyHighlightsSection>
            <HighlightsContainer>
              <HighlightsHeader>
                <BadgeContainer>
                  <BadgeIcon />
                </BadgeContainer>
                <HighlightsTitle>Ayın Öne Çıkanları</HighlightsTitle>
              </HighlightsHeader>

          <HighlightsGrid>
            {/* First set of cards */}
                       <HighlightCard
                         backgroundImage="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop"
                       >
                         <HighlightOverlay>
                           <HighlightInfo>
                             <HighlightDescription>⭐ Ayın Müzesi</HighlightDescription>
                             <HighlightName>İstanbul Modern</HighlightName>
                             <HighlightDescription>Modern Sanat Koleksiyonu</HighlightDescription>
                             <HighlightStats>2.4K ziyaretçi</HighlightStats>
                           </HighlightInfo>
                         </HighlightOverlay>
                       </HighlightCard>

                       <HighlightCard
                         backgroundImage="/ayın sanatçısı image/zeynep.jpg"
                       >
                         <HighlightOverlay>
                           <HighlightInfo>
                             <HighlightDescription>⭐ Ayın Sanatçısı</HighlightDescription>
                             <HighlightName>Zeynep Esmer</HighlightName>
                             <HighlightDescription>Dijital sanat ustası</HighlightDescription>
                             <HighlightStats>1.8K takipçi</HighlightStats>
                           </HighlightInfo>
                         </HighlightOverlay>
                       </HighlightCard>

            <HighlightCard
              backgroundImage="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=400&fit=crop"
            >
              <HighlightOverlay>
                <HighlightInfo>
                  <HighlightDescription>⭐ Ayın Eseri</HighlightDescription>
                  <HighlightName>Günbatımında İstanbul</HighlightName>
                  <HighlightDescription>En çok beğenilen eser</HighlightDescription>
                  <HighlightStats>3.2K beğeni</HighlightStats>
                </HighlightInfo>
              </HighlightOverlay>
            </HighlightCard>

            <HighlightCard
              backgroundImage="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop"
            >
              <HighlightOverlay>
                <HighlightInfo>
                  <HighlightDescription>⭐ Ayın Yorumu</HighlightDescription>
                  <HighlightName>"Bu eser bana huzur veriyor"</HighlightName>
                  <HighlightDescription>En etkileyici yorum</HighlightDescription>
                  <HighlightStats>1.5K beğeni</HighlightStats>
                </HighlightInfo>
              </HighlightOverlay>
            </HighlightCard>

            <HighlightCard
              backgroundImage="/images/venice-art.jpg"
            >
              <HighlightOverlay>
                <HighlightInfo>
                  <HighlightDescription>⭐ Ayın Koleksiyoneri</HighlightDescription>
                  <HighlightName>Mehmet Özkan</HighlightName>
                  <HighlightDescription>En popüler koleksiyon</HighlightDescription>
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

          {isLoading ? (
            <LoadingSpinner text="Eserler yükleniyor..." />
          ) : (
            <>
              <WorksGrid>
                {featuredWorks?.slice(0, 25).map((work, index) => (
                  <WorkCard key={work._id} work={work} />
                ))}
              </WorksGrid>

            </>
          )}
            </SectionContainer>
          </FeaturedSection>
        </MainContent>

        <SidebarWrapper>
          <ArtistsSidebar />
        </SidebarWrapper>
      </MainLayout>

    </Container>
  );
};

export default Home;
