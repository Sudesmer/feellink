import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiHeart, FiBookmark, FiEye, FiUser } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Card = styled(motion.div)`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  aspect-ratio: 1;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary};
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: ${props => props.theme.surfaceHover};
`;

const WorkImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;

  ${Card}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: white;
    transform: scale(1.1);
  }

  &.liked {
    background: ${props => props.theme.error};
    color: white;
  }

  &.saved {
    background: ${props => props.theme.primary};
    color: white;
  }
`;

const Content = styled.div`
  padding: 20px;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Description = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const AuthorAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
`;

const AuthorAvatarImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const AuthorInfo = styled.div`
  flex: 1;
`;

const AuthorName = styled.div`
  font-weight: 500;
  color: ${props => props.theme.text};
  font-size: 0.9rem;
`;

const AuthorUsername = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.8rem;
`;

const Stats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.border};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
`;

const Category = styled.div`
  display: inline-block;
  padding: 4px 12px;
  background: ${props => props.color || props.theme.primaryLight};
  color: ${props => props.theme.primary};
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 12px;
`;

const WorkCard = ({ work }) => {
  const { user, likeWork, saveWork } = useAuth();
  const [isLiked, setIsLiked] = useState(work.likes?.includes(user?._id) || false);
  const [isSaved, setIsSaved] = useState(user?.savedWorks?.includes(work._id) || false);
  const [likeCount, setLikeCount] = useState(work.likeCount || work.likes?.length || 0);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Beğenmek için giriş yapmalısınız');
      return;
    }

    try {
      const result = await likeWork(work._id);
      if (result.success) {
        setIsLiked(!isLiked);
        setLikeCount(result.data.likeCount);
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Kaydetmek için giriş yapmalısınız');
      return;
    }

    try {
      const result = await saveWork(work._id);
      if (result.success) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const mainImage = work.images?.find(img => img.isMain) || work.images?.[0];

  return (
    <Card
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        // Eser detay sayfasına git
        window.location.href = `/work/${work._id}`;
      }}
    >
      <ImageContainer>
        {mainImage ? (
          <WorkImage 
            src={mainImage.url} 
            alt={work.title}
            loading="lazy"
          />
        ) : (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2rem'
          }}>
            🎨
          </div>
        )}
        
        <Overlay>
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
        </Overlay>
      </ImageContainer>
    </Card>
  );
};

export default WorkCard;
