import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiHeart, FiBookmark, FiEye, FiUser } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Card = styled.div`
  background: #000000;
  border: 1px solid #262626;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  height: auto;
  width: 420px;
  flex-shrink: 0;
  margin-bottom: 20px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    width: 340px;
  }

  @media (max-width: 480px) {
    width: 320px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  background: #1a1a1a;
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


// Instagram benzeri post içeriği
const PostContent = styled.div`
  padding: 12px 16px;
  background: #000000;
  border-top: 1px solid #262626;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const UserAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #FF6B35;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 300;
  font-size: 10px;
  flex-shrink: 0;
`;

const UserAvatarImg = styled.img`
  width: 15%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #ffffff;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const PostActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #ffffff;
  font-size: 17px;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: #FF6B35;
  }
`;

const LikesCount = styled.div`
  font-weight: 600;
  color: #ffffff;
  font-size: 13px;
  margin-bottom: 4px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const PostTitle = styled.div`
  font-weight: 600;
  color: #ffffff;
  font-size: 16px;
  line-height: 1.3;
  margin-bottom: 4px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const PostDescription = styled.div`
  color: #8e8e8e;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const PostCaption = styled.div`
  color: #ffffff;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const PostTime = styled.div`
  color: #8e8e8e;
  font-size: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const PostStats = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #262626;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #8e8e8e;
  font-size: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 6px;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const AuthorAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
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
  color: white;
  font-size: 0.8rem;
`;

const AuthorUsername = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.7rem;
`;

const Stats = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
`;


const Category = styled.div`
  display: inline-block;
  padding: 3px 8px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
  margin-bottom: 8px;
  backdrop-filter: blur(10px);
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

  // Instagram benzeri mock veriler
  const mockUser = {
    name: work.author?.name || 'Sanatçı',
    username: work.author?.username || 'sanatci',
    avatar: work.author?.avatar || null
  };

  const mockCaption = work.description || `${work.title} - Bu eser bana ilham veriyor ✨`;
  const mockLikes = likeCount;
  const mockComments = Math.floor(Math.random() * 50) + 10;
  const mockViews = work.views || Math.floor(Math.random() * 1000) + 100;
  const mockTime = '2 saat önce';

  return (
    <Card>
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
      </ImageContainer>
      
      <PostContent>
        <PostHeader>
          {mockUser.avatar ? (
            <UserAvatarImg src={mockUser.avatar} alt={mockUser.name} />
          ) : (
            <UserAvatar>
              {mockUser.name.charAt(0)}
            </UserAvatar>
          )}
          <UserInfo>
            <UserName>{mockUser.name}</UserName>
          </UserInfo>
        </PostHeader>
        
        <PostTitle>
          {work.title}
        </PostTitle>
        
        <PostCaption>
          {mockCaption}
        </PostCaption>
        
        <PostTime>{mockTime}</PostTime>
        
        <PostStats>
          <StatItem>
            <FiHeart size={12} />
            {mockLikes}
          </StatItem>
          <StatItem>
            <FiEye size={12} />
            {mockViews}
          </StatItem>
        </PostStats>
      </PostContent>
    </Card>
  );
};

export default WorkCard;
