import React, { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiBookmark, FiGrid, FiList, FiSearch } from 'react-icons/fi';
import axios from 'axios';
import WorkCard from '../components/WorkCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
  padding: 40px 0;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Header = styled.div`
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 16px;

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
  gap: 16px;
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
    gap: 16px;
    align-items: stretch;
  }
`;

const ResultsCount = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 1rem;
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

const Saved = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Fetch saved works
  const { data: savedData, isLoading } = useQuery(
    'saved-works',
    async () => {
      const response = await axios.get('/api/works/saved');
      return response.data;
    },
    {
      enabled: !!user,
    }
  );

  const works = savedData?.works || [];

  const filteredWorks = works.filter(work =>
    work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    work.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <Container>
        <Content>
          <EmptyState>
            <EmptyIcon>🔒</EmptyIcon>
            <EmptyTitle>Giriş gerekli</EmptyTitle>
            <EmptyDescription>
              Kaydedilen eserlerinizi görmek için giriş yapmalısınız.
            </EmptyDescription>
          </EmptyState>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        <Header>
          <Title>
            <FiBookmark size={32} />
            Kaydedilenler
          </Title>
          <Subtitle>
            Beğendiğiniz ve kaydettiğiniz eserleri burada bulabilirsiniz
          </Subtitle>
        </Header>

        <FiltersContainer>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Kaydedilen eserlerde ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon />
          </SearchContainer>

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
        </FiltersContainer>

        {isLoading ? (
          <LoadingSpinner text="Kaydedilen eserler yükleniyor..." />
        ) : filteredWorks.length > 0 ? (
          <>
            <ResultsHeader>
              <ResultsCount>
                {filteredWorks.length} kaydedilen eser
              </ResultsCount>
            </ResultsHeader>

            {viewMode === 'grid' ? (
              <WorksGrid>
                {filteredWorks.map((work, index) => (
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
                {filteredWorks.map((work, index) => (
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
            )}
          </>
        ) : (
          <EmptyState>
            <EmptyIcon>🔖</EmptyIcon>
            <EmptyTitle>
              {searchQuery ? 'Arama sonucu bulunamadı' : 'Henüz kaydedilen eser yok'}
            </EmptyTitle>
            <EmptyDescription>
              {searchQuery 
                ? 'Arama kriterlerinize uygun kaydedilen eser bulunamadı.'
                : 'Beğendiğiniz eserleri kaydetmeye başlayın ve burada görün.'
              }
            </EmptyDescription>
          </EmptyState>
        )}
      </Content>
    </Container>
  );
};

export default Saved;

