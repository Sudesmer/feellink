import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiHeart, 
  FiBookmark, 
  FiShare2, 
  FiUser, 
  FiEye,
  FiCalendar,
  FiExternalLink,
  FiChevronLeft,
  FiChevronRight,
  FiX
} from 'react-icons/fi';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
`;

const Header = styled.div`
  position: sticky;
  top: 80px;
  z-index: 100;
  background: ${props => props.theme.glass};
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${props => props.theme.glassBorder};
  padding: 20px 0;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const BackButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.surfaceHover};
    transform: scale(1.05);
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  flex: 1;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.surfaceHover};
    transform: scale(1.05);
  }

  &.liked {
    background: ${props => props.theme.error};
    color: white;
    border-color: ${props => props.theme.error};
  }

  &.saved {
    background: ${props => props.theme.primary};
    color: white;
    border-color: ${props => props.theme.primary};
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 60px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const ImageSection = styled.div`
  position: relative;
`;

const MainImage = styled.div`
  position: relative;
  width: 100%;
  height: 600px;
  border-radius: 16px;
  overflow: hidden;
  background: ${props => props.theme.surfaceHover};
  cursor: pointer;

  @media (max-width: 768px) {
    height: 400px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const ImageNavigation = styled.div`
  position: absolute;
  top: 50%;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.3s ease;

  ${MainImage}:hover & {
    opacity: 1;
  }
`;

const NavButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ImageCounter = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 12px;
  margin-top: 20px;
`;

const Thumbnail = styled.div`
  width: 100%;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${props => props.active ? props.theme.primary : 'transparent'};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.primary};
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const InfoSection = styled.div`
  position: sticky;
  top: 200px;
  height: fit-content;
`;

const WorkInfo = styled.div`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
`;

const WorkTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 12px;
  line-height: 1.3;
`;

const WorkDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
  margin-bottom: 24px;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 0;
  border-top: 1px solid ${props => props.theme.border};
  border-bottom: 1px solid ${props => props.theme.border};
  margin-bottom: 24px;
`;

const AuthorAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.2rem;
`;

const AuthorAvatarImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const AuthorDetails = styled.div`
  flex: 1;
`;

const AuthorName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 4px;
`;

const AuthorUsername = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
`;

const AuthorStats = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 8px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 0.9rem;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.8rem;
`;

const WorkStats = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
`;

const WorkStatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
`;

const WorkMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const Tag = styled.span`
  padding: 4px 12px;
  background: ${props => props.theme.primaryLight};
  color: ${props => props.theme.primary};
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ProjectLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${props => props.theme.primary};
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 16px;

  &:hover {
    background: ${props => props.theme.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(255, 107, 53, 0.3);
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
`;

const ModalClose = styled.button`
  position: absolute;
  top: -50px;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const WorkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, likeWork, saveWork } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Fetch work details
  const { data: workData, isLoading } = useQuery(
    ['work', id],
    async () => {
      const response = await axios.get(`/api/works/${id}`);
      return response.data;
    },
    {
      enabled: !!id,
      onSuccess: (data) => {
        setLikeCount(data.work.likeCount || 0);
        setIsLiked(data.work.likes?.includes(user?._id) || false);
        setIsSaved(user?.savedWorks?.includes(data.work._id) || false);
      }
    }
  );

  const work = workData?.work;
  const images = work?.images || [];

  const handleLike = async () => {
    if (!user) {
      toast.error('Beğenmek için giriş yapmalısınız');
      return;
    }

    const result = await likeWork(work._id);
    if (result.success) {
      setIsLiked(!isLiked);
      setLikeCount(result.data.likeCount);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('Kaydetmek için giriş yapmalısınız');
      return;
    }

    const result = await saveWork(work._id);
    if (result.success) {
      setIsSaved(!isSaved);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: work.title,
          text: work.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link kopyalandı');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <LoadingSpinner text="Eser yükleniyor..." />;
  }

  if (!work) {
    return (
      <Container>
        <Content>
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <h2>Eser bulunamadı</h2>
            <p>Bu eser mevcut değil veya silinmiş olabilir.</p>
          </div>
        </Content>
      </Container>
    );
  }

  const currentImage = images[currentImageIndex];

  return (
    <Container>
      <Header>
        <HeaderContent>
          <BackButton onClick={() => navigate(-1)}>
            <FiArrowLeft size={20} />
          </BackButton>
          <Title>{work.title}</Title>
          <Actions>
            <ActionButton
              className={isLiked ? 'liked' : ''}
              onClick={handleLike}
              title="Beğen"
            >
              <FiHeart size={18} fill={isLiked ? 'currentColor' : 'none'} />
            </ActionButton>
            <ActionButton
              className={isSaved ? 'saved' : ''}
              onClick={handleSave}
              title="Kaydet"
            >
              <FiBookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
            </ActionButton>
            <ActionButton onClick={handleShare} title="Paylaş">
              <FiShare2 size={18} />
            </ActionButton>
          </Actions>
        </HeaderContent>
      </Header>

      <Content>
        <ImageSection>
          <MainImage onClick={openModal}>
            {currentImage ? (
              <Image src={currentImage.url} alt={work.title} />
            ) : (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '4rem'
              }}>
                🎨
              </div>
            )}
            
            {images.length > 1 && (
              <>
                <ImageNavigation>
                  <NavButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    disabled={images.length <= 1}
                  >
                    <FiChevronLeft size={20} />
                  </NavButton>
                  <NavButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    disabled={images.length <= 1}
                  >
                    <FiChevronRight size={20} />
                  </NavButton>
                </ImageNavigation>
                <ImageCounter>
                  {currentImageIndex + 1} / {images.length}
                </ImageCounter>
              </>
            )}
          </MainImage>

          {images.length > 1 && (
            <ThumbnailGrid>
              {images.map((image, index) => (
                <Thumbnail
                  key={index}
                  active={index === currentImageIndex}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <ThumbnailImage src={image.url} alt={`${work.title} ${index + 1}`} />
                </Thumbnail>
              ))}
            </ThumbnailGrid>
          )}
        </ImageSection>

        <InfoSection>
          <WorkInfo>
            <WorkTitle>{work.title}</WorkTitle>
            <WorkDescription>{work.description}</WorkDescription>

            <WorkStats>
              <WorkStatItem>
                <FiHeart size={16} />
                {likeCount} beğeni
              </WorkStatItem>
              <WorkStatItem>
                <FiEye size={16} />
                {work.views || 0} görüntülenme
              </WorkStatItem>
              <WorkStatItem>
                <FiCalendar size={16} />
                {new Date(work.createdAt).toLocaleDateString('tr-TR')}
              </WorkStatItem>
            </WorkStats>

            <AuthorInfo>
              {work.author.avatar ? (
                <AuthorAvatarImg src={work.author.avatar} alt={work.author.fullName} />
              ) : (
                <AuthorAvatar>
                  {work.author.fullName.charAt(0).toUpperCase()}
                </AuthorAvatar>
              )}
              <AuthorDetails>
                <AuthorName>{work.author.fullName}</AuthorName>
                <AuthorUsername>@{work.author.username}</AuthorUsername>
                <AuthorStats>
                  <StatItem>
                    <StatNumber>{work.author.followers || 0}</StatNumber>
                    <StatLabel>Takipçi</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatNumber>{work.author.following || 0}</StatNumber>
                    <StatLabel>Takip</StatLabel>
                  </StatItem>
                </AuthorStats>
              </AuthorDetails>
            </AuthorInfo>

            <WorkMeta>
              {work.category && (
                <MetaItem>
                  <strong>Kategori:</strong> {work.category.name}
                </MetaItem>
              )}
              {work.year && (
                <MetaItem>
                  <strong>Yıl:</strong> {work.year}
                </MetaItem>
              )}
              {work.client && (
                <MetaItem>
                  <strong>Müşteri:</strong> {work.client}
                </MetaItem>
              )}
              {work.tools && work.tools.length > 0 && (
                <MetaItem>
                  <strong>Araçlar:</strong> {work.tools.join(', ')}
                </MetaItem>
              )}
            </WorkMeta>

            {work.tags && work.tags.length > 0 && (
              <Tags>
                {work.tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </Tags>
            )}

            {work.projectUrl && (
              <ProjectLink href={work.projectUrl} target="_blank" rel="noopener noreferrer">
                <FiExternalLink size={18} />
                Projeyi Görüntüle
              </ProjectLink>
            )}
          </WorkInfo>
        </InfoSection>
      </Content>

      {isModalOpen && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalClose onClick={closeModal}>
              <FiX size={20} />
            </ModalClose>
            <ModalImage src={currentImage?.url} alt={work.title} />
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default WorkDetail;

