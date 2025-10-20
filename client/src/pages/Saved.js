import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiBookmark, FiGrid, FiList, FiSearch, FiHome, FiEye, FiBell, FiUser, FiPlus, FiEdit3, FiTrash2, FiFolder } from 'react-icons/fi';
import axios from 'axios';
import WorkCard from '../components/WorkCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
  padding: 0;
  margin: 0;
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
  padding: 40px 20px;
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

// Koleksiyonlar için yeni styled components
const CollectionsSection = styled.div`
  margin-bottom: 40px;
`;

const CollectionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const CollectionsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CreateCollectionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.primaryHover};
    transform: translateY(-2px);
  }
`;

const CollectionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const CollectionCard = styled.div`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary};
  }
`;

const CollectionPreview = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
  background: ${props => props.theme.background};
`;

const CollectionImage = styled.div`
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  background-color: ${props => props.theme.background};
`;

const CollectionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CollectionName = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0;
`;

const CollectionCount = styled.p`
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
  margin: 0;
`;

const CollectionActions = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${CollectionCard}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

// Modal components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(8px);
`;

const ModalContent = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 40px ${props => props.theme.shadow};
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0 0 16px 0;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 16px;
  margin-bottom: 16px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;

  ${props => props.primary ? `
    background: ${props.theme.primary};
    color: white;
    
    &:hover {
      background: ${props.theme.primaryHover};
    }
  ` : `
    background: ${props.theme.background};
    color: ${props.theme.text};
    border: 1px solid ${props.theme.border};
    
    &:hover {
      background: ${props.theme.surface};
    }
  `}
`;

const Saved = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  
  // Koleksiyonlar state
  const [collections, setCollections] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [selectedCollection, setSelectedCollection] = useState(null);

  // Mock saved works for now
  const mockSavedWorks = [
    {
      _id: '1',
      title: 'Kaydedilen Eser 1',
      description: 'Bu eser kaydedilmiş',
      image: '/can.jpg',
      author: 'Test User',
      likes: 25,
      comments: 5,
      createdAt: new Date()
    },
    {
      _id: '2', 
      title: 'Kaydedilen Eser 2',
      description: 'Bu da kaydedilmiş',
      image: '/sude.jpg',
      author: 'Test User',
      likes: 18,
      comments: 3,
      createdAt: new Date()
    }
  ];

  // Koleksiyonları localStorage'dan yükle
  useEffect(() => {
    const savedCollections = localStorage.getItem('feellink-collections');
    if (savedCollections) {
      setCollections(JSON.parse(savedCollections));
    } else {
      // Varsayılan koleksiyonlar
      const defaultCollections = [
        {
          id: '1',
          name: 'Favorilerim',
          works: ['1', '2'],
          createdAt: new Date()
        }
      ];
      setCollections(defaultCollections);
      localStorage.setItem('feellink-collections', JSON.stringify(defaultCollections));
    }
  }, []);

  // Koleksiyon oluştur
  const createCollection = () => {
    if (newCollectionName.trim()) {
      const newCollection = {
        id: Date.now().toString(),
        name: newCollectionName.trim(),
        works: [],
        createdAt: new Date()
      };
      const updatedCollections = [...collections, newCollection];
      setCollections(updatedCollections);
      localStorage.setItem('feellink-collections', JSON.stringify(updatedCollections));
      setNewCollectionName('');
      setShowCreateModal(false);
    }
  };

  // Koleksiyon düzenle
  const editCollection = () => {
    if (newCollectionName.trim() && editingCollection) {
      const updatedCollections = collections.map(col => 
        col.id === editingCollection.id 
          ? { ...col, name: newCollectionName.trim() }
          : col
      );
      setCollections(updatedCollections);
      localStorage.setItem('feellink-collections', JSON.stringify(updatedCollections));
      setNewCollectionName('');
      setShowEditModal(false);
      setEditingCollection(null);
    }
  };

  // Koleksiyon sil
  const deleteCollection = (collectionId) => {
    const updatedCollections = collections.filter(col => col.id !== collectionId);
    setCollections(updatedCollections);
    localStorage.setItem('feellink-collections', JSON.stringify(updatedCollections));
  };

  // Koleksiyon seç
  const selectCollection = (collection) => {
    setSelectedCollection(collection);
  };

  // Koleksiyon düzenleme modalını aç
  const openEditModal = (collection) => {
    setEditingCollection(collection);
    setNewCollectionName(collection.name);
    setShowEditModal(true);
  };

  // Fetch saved works
  const { data: savedData, isLoading } = useQuery(
    'saved-works',
    async () => {
      try {
        const response = await axios.get('/api/works/saved');
        return response.data;
      } catch (error) {
        // If API fails, return mock data
        return { works: mockSavedWorks };
      }
    },
    {
      enabled: true, // Always enabled
    }
  );

  const works = savedData?.works || mockSavedWorks;

  // Seçili koleksiyona göre eserleri filtrele
  const getFilteredWorks = () => {
    let filtered = works;
    
    if (selectedCollection) {
      filtered = works.filter(work => selectedCollection.works.includes(work._id));
    }
    
    if (searchQuery) {
      filtered = filtered.filter(work =>
        work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        work.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredWorks = getFilteredWorks();


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
          
          <MenuItem theme={theme} active={location.pathname === '/notifications'} onClick={() => navigate('/notifications')}>
            <MenuIcon>
              <FiBell />
            </MenuIcon>
            <MenuText>Bildirimler</MenuText>
          </MenuItem>
          
          <MenuItem theme={theme} active={location.pathname.startsWith('/profile')} onClick={() => navigate('/profile')}>
            <MenuIcon>
              <FiUser />
            </MenuIcon>
            <MenuText>Profil</MenuText>
          </MenuItem>
          
          <MenuItem theme={theme} active={location.pathname === '/saved'} onClick={() => navigate('/saved')}>
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
          <Title>
            <FiBookmark size={32} />
            {selectedCollection ? selectedCollection.name : 'Kaydedilenler'}
          </Title>
          <Subtitle>
            {selectedCollection 
              ? `${selectedCollection.name} koleksiyonundaki eserler`
              : 'Beğendiğiniz ve kaydettiğiniz eserleri burada bulabilirsiniz'
            }
          </Subtitle>
        </Header>

        {/* Koleksiyonlar Bölümü */}
        <CollectionsSection>
          <CollectionsHeader>
            <CollectionsTitle>
              <FiFolder size={24} />
              Koleksiyonlarım
            </CollectionsTitle>
            <CreateCollectionButton onClick={() => setShowCreateModal(true)}>
              <FiPlus size={16} />
              Yeni Koleksiyon
            </CreateCollectionButton>
          </CollectionsHeader>

          <CollectionsGrid>
            {collections.map((collection) => {
              const collectionWorks = works.filter(work => collection.works.includes(work._id));
              const previewImages = collectionWorks.slice(0, 4).map(work => work.image);
              
              return (
                <CollectionCard 
                  key={collection.id} 
                  onClick={() => selectCollection(collection)}
                  style={{ 
                    borderColor: selectedCollection?.id === collection.id ? theme.primary : theme.border,
                    backgroundColor: selectedCollection?.id === collection.id ? theme.primaryLight : theme.surface
                  }}
                >
                  <CollectionActions>
                    <ActionButton onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(collection);
                    }}>
                      <FiEdit3 />
                    </ActionButton>
                    <ActionButton onClick={(e) => {
                      e.stopPropagation();
                      deleteCollection(collection.id);
                    }}>
                      <FiTrash2 />
                    </ActionButton>
                  </CollectionActions>
                  
                  <CollectionPreview>
                    {previewImages.length > 0 ? (
                      previewImages.map((image, index) => (
                        <CollectionImage key={index} src={image} />
                      ))
                    ) : (
                      <div style={{ 
                        gridColumn: '1 / -1', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: theme.textSecondary,
                        fontSize: '12px'
                      }}>
                        Boş koleksiyon
                      </div>
                    )}
                  </CollectionPreview>
                  
                  <CollectionInfo>
                    <CollectionName>{collection.name}</CollectionName>
                    <CollectionCount>{collection.works.length} eser</CollectionCount>
                  </CollectionInfo>
                </CollectionCard>
              );
            })}
          </CollectionsGrid>
        </CollectionsSection>

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
                {selectedCollection 
                  ? `${filteredWorks.length} eser (${selectedCollection.name})`
                  : `${filteredWorks.length} kaydedilen eser`
                }
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

        {/* Koleksiyon Oluşturma Modalı */}
        {showCreateModal && (
          <ModalOverlay onClick={() => setShowCreateModal(false)}>
            <ModalContent theme={theme} onClick={(e) => e.stopPropagation()}>
              <ModalTitle>Yeni Koleksiyon Oluştur</ModalTitle>
              <ModalInput
                theme={theme}
                type="text"
                placeholder="Koleksiyon adı girin..."
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createCollection()}
              />
              <ModalButtons>
                <ModalButton theme={theme} onClick={() => setShowCreateModal(false)}>
                  İptal
                </ModalButton>
                <ModalButton theme={theme} primary onClick={createCollection}>
                  Oluştur
                </ModalButton>
              </ModalButtons>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Koleksiyon Düzenleme Modalı */}
        {showEditModal && (
          <ModalOverlay onClick={() => setShowEditModal(false)}>
            <ModalContent theme={theme} onClick={(e) => e.stopPropagation()}>
              <ModalTitle>Koleksiyon Düzenle</ModalTitle>
              <ModalInput
                theme={theme}
                type="text"
                placeholder="Koleksiyon adı girin..."
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && editCollection()}
              />
              <ModalButtons>
                <ModalButton theme={theme} onClick={() => setShowEditModal(false)}>
                  İptal
                </ModalButton>
                <ModalButton theme={theme} primary onClick={editCollection}>
                  Kaydet
                </ModalButton>
              </ModalButtons>
            </ModalContent>
          </ModalOverlay>
        )}
          </ContentInner>
        </Content>
      </MainLayout>
    </Container>
  );
};

export default Saved;

