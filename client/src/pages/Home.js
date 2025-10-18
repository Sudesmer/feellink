import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiSearch, FiTrendingUp, FiStar, FiUsers, FiArrowRight, FiAward, FiMessageCircle, FiMapPin } from 'react-icons/fi';
import axios from 'axios';
import WorkCard from '../components/WorkCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ArtistsSidebar from '../components/ArtistsSidebar';

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
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
  width: calc(100vw - 350px); /* Sidebar genişliği kadar çıkar */
  height: 100vh;
  overflow-y: auto;
  padding: 0 20px; /* İçerik için padding */
  margin-right: 0; /* Sidebar ile arasında boşluk yok */

  @media (max-width: 1200px) {
    height: auto;
    overflow: visible;
    padding: 0 20px;
    width: 100%;
  }
`;

const SidebarWrapper = styled.div`
  position: fixed;
  top: 0px;
  right: 0;
  width: 350px;
  height: 100vh;
  z-index: 100;
  overflow-y: auto;

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

const HeroTitle = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 800;
  color: white;
  margin-bottom: 24px;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
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

const SearchContainer = styled(motion.div)`
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

const StatsContainer = styled(motion.div)`
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
  text-align: center;
  margin-bottom: 60px;
  padding: 0 20px;
  
  h2, p {
    color: ${props => props.theme.text};
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.textSecondary};
  max-width: 600px;
  margin: 0 auto;
`;

const WorksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 sütun */
  gap: 20px;
  margin-bottom: 40px;
  width: calc(100% - 350px); /* Sidebar genişliği kadar azalt */
  margin: 0 0 40px 0; /* Margin'i kaldır */
  padding: 0 20px;
  overflow: visible; /* Overflow'u kaldır */

  @media (max-width: 1200px) {
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    width: 100%; /* Mobilde tam genişlik */
    margin: 0 0 40px 0;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
`;

const ViewAllButton = styled(motion.button)`
  display: block;
  margin: 0 auto; /* Ortala */
  padding: 16px 40px;
  background: ${props => props.theme.gradient};
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.shadowHover};
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
  text-align: center;
  margin-bottom: 60px;
  padding: 0 20px;
`;

const HighlightsTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HighlightsSubtitle = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.textSecondary};
  max-width: 600px;
  margin: 0 auto;
`;

const HighlightsGrid = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 60px;
  padding: 0 0 16px 0;
  position: relative;
  width: 100%;
  animation: slideLeft 30s linear infinite;
  overflow: hidden; /* Turuncu çubuğu gizle */
  mask: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
  -webkit-mask: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);

  @media (max-width: 768px) {
    gap: 16px;
    padding: 0 0 12px 0;
  }

  @keyframes slideLeft {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
`;

const HighlightCard = styled(motion.div)`
  background: ${props => props.theme.surface};
  border: 2px solid transparent;
  border-radius: 32px;
  position: relative;
  
  /* Tam çevreleyen renkli çerçeve için pseudo-element */
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 34px;
    background: ${props => props.gradient};
    z-index: -1;
  }
  padding: 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: none; /* Hover efektlerini kaldır */
  height: 200px;
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  /* Düz Hizalama - Yamukluk Yok */
  transform: translateY(0);
  
  /* Modern Gölge Efekti */
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.15),
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

const HighlightDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.8rem;
  line-height: 1.3;
  margin-bottom: 8px;
  opacity: 0.9;
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
  top: 20px;
  right: 20px;
  background: ${props => props.theme.primary};
  color: white;
  padding: 6px 12px;
  border-radius: 32px;
  font-size: 0.8rem;
  font-weight: 600;
`;


const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch featured works
  const { data: featuredWorks, isLoading: featuredLoading } = useQuery(
    'featured-works',
    async () => {
      const response = await axios.get('/api/works?featured=true&limit=10');
      return response.data.works;
    }
  );

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery(
    'categories',
    async () => {
      const response = await axios.get('/api/categories');
      return response.data.categories;
    }
  );

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
                <HighlightsTitle>Ayın Enleri</HighlightsTitle>
                <HighlightsSubtitle>
                  Bu ay topluluk tarafından en çok beğenilen ve öne çıkan içerikler
                </HighlightsSubtitle>
              </HighlightsHeader>

          <HighlightsGrid>
            {/* First set of cards */}
            <HighlightCard
              gradient="linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <HighlightHeader>
                <HighlightIcon gradient="linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)">
                  <FiAward size={20} />
                </HighlightIcon>
                <HighlightTitle>Ayın En İyi Eseri</HighlightTitle>
              </HighlightHeader>
              <HighlightDescription>
                Bu ay en çok beğenilen ve ilham verici eser
              </HighlightDescription>
              <HighlightWinner>
                <WinnerImage>
                  <WinnerImageContent 
                    src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=200&fit=crop" 
                    alt="Güzel Çizim Eseri"
                  />
                  <WinnerOverlay>
                    <WinnerOverlayContent>
                      <WinnerOverlayName>Güzel Çizim Eseri</WinnerOverlayName>
                      <WinnerOverlayStats>@testuser • 2.5K beğeni</WinnerOverlayStats>
                    </WinnerOverlayContent>
                  </WinnerOverlay>
                </WinnerImage>
              </HighlightWinner>
            </HighlightCard>

            <HighlightCard
              gradient="linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <HighlightHeader>
                <HighlightIcon gradient="linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)">
                  <FiMessageCircle size={20} />
                </HighlightIcon>
                <HighlightTitle>Ayın En İyi Yorumu</HighlightTitle>
              </HighlightHeader>
              <HighlightDescription>
                En yaratıcı ve faydalı yorum
              </HighlightDescription>
              <HighlightWinner>
                <WinnerName>@creative_designer</WinnerName>
                <WinnerStats>"Bu eser gerçekten harika! Renklerin uyumu ve kompozisyon mükemmel. Sanatçının yaratıcılığına hayran kaldım. 👏"</WinnerStats>
              </HighlightWinner>
            </HighlightCard>

            <HighlightCard
              gradient="linear-gradient(135deg, #2196F3 0%, #03A9F4 100%)"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <HighlightHeader>
                <HighlightIcon gradient="linear-gradient(135deg, #2196F3 0%, #03A9F4 100%)">
                  <FiMapPin size={20} />
                </HighlightIcon>
                <HighlightTitle>Ayın En İyi Müzesi</HighlightTitle>
              </HighlightHeader>
              <HighlightDescription>
                En çok ziyaret edilen ve beğenilen müze
              </HighlightDescription>
              <HighlightWinner>
                <WinnerImage>
                  <WinnerImageContent 
                    src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=120&h=120&fit=crop" 
                    alt="İstanbul Modern"
                  />
                </WinnerImage>
                <WinnerName>İstanbul Modern</WinnerName>
                <WinnerStats>1.2K ziyaretçi • 4.8⭐ puan</WinnerStats>
              </HighlightWinner>
            </HighlightCard>


          </HighlightsGrid>
            </HighlightsContainer>
          </MonthlyHighlightsSection>

          <FeaturedSection>
            <SectionContainer>
          <SectionHeader>
            <SectionTitle>Öne Çıkan Eserler</SectionTitle>
            <SectionSubtitle>
              Topluluk tarafından en çok beğenilen ve ilham verici eserler
            </SectionSubtitle>
          </SectionHeader>

          {featuredLoading ? (
            <LoadingSpinner text="Eserler yükleniyor..." />
          ) : (
            <>
              <WorksGrid>
                {featuredWorks?.slice(0, 25).map((work, index) => (
                  <motion.div
                    key={work._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <WorkCard work={work} />
                  </motion.div>
                ))}
              </WorksGrid>

              <ViewAllButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/explore'}
              >
                Tümünü Gör
                <FiArrowRight />
              </ViewAllButton>
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
