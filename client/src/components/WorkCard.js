import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiHeart, FiEye, FiTrendingUp, FiMessageCircle, FiBookmark } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const Card = styled.div`
  background: ${props => props.theme.surface};
  border: none;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  height: auto;
  width: 420px;
  flex-shrink: 0;
  margin: 0;

  &:hover {
    transform: none;
    box-shadow: none;
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


// Trend ikonu
const TrendIcon = styled.div`
  position: relative;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #FF6B35, #F7931E);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
  }
`;

// Rozet detayları container
const BadgeDetails = styled.div`
  position: absolute;
  top: 35px;
  right: 1px;
  display: ${props => props.show ? 'flex' : 'none'};
  flex-direction: column;
  gap: 4px;
  z-index: 15;
  pointer-events: auto;
`;

// Rozet item
const BadgeItem = styled.div`
  position: relative;
  width: 28px;
  height: 28px;
  background: ${props => props.bgColor || 'rgba(255, 255, 255, 0.95)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  pointer-events: ${props => props.isVisible ? 'auto' : 'none'};
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: ${props => props.isVisible ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.8)'};

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.8);
    transition: transform 0.1s ease;
  }
`;

// Rozet açıklama tooltip
const BadgeTooltip = styled.div`
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 20;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  ${BadgeItem}:hover & {
    opacity: 1;
    visibility: visible;
    transform: translateY(-50%) scale(1.05);
  }

  &::after {
    content: '';
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-left-color: rgba(0, 0, 0, 0.8);
  }
`;





// Instagram benzeri post içeriği
const PostContent = styled.div`
  padding: 12px 16px;
  background: ${props => props.theme.surface};
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
  font-size: 12px;
  flex-shrink: 0;
`;

const UserAvatarImg = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;


const PostTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 16px;
  line-height: 1.3;
  margin-bottom: 4px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;


const PostCaption = styled.div`
  color: ${props => props.theme.text};
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;


const PostStats = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 12px;
  padding-top: 8px;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #8e8e8e;
  font-size: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

// Ortada modern yorum ikonu
const CenterOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  opacity: 0;
  transition: all 0.3s ease;

  ${Card}:hover & {
    opacity: 1;
  }
`;

const ModernCommentIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }
`;

// Sağ üst trend ikonları
const TopRightOverlay = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  z-index: 10;
`;

// Instagram Modal Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(10px);
`;

const ModalContent = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  max-width: 1200px;
  max-height: 60vh;
  width: 95vw;
  height: 50vh;
  display: flex;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const ModalImageSection = styled.div`
  flex: 1;
  min-width: 0;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const ModalInfoSection = styled.div`
  width: 450px;
  background: ${props => props.theme.surface};
  display: flex;
  flex-direction: column;
  border-left: 1px solid ${props => props.theme.border};
`;

const ModalHeader = styled.div`
  padding: 73px 16px 2px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ModalAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #FF6B35;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
`;

const ModalUserInfo = styled.div`
  flex: 1;
`;

const ModalUsername = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 14px;
`;

const ModalLocation = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 12px;
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background: ${props => props.theme.border};
  }
`;

const ModalActions = styled.div`
  padding: 8px 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 20px;
  cursor: pointer;
  padding: px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const ModalLikes = styled.div`
  padding: 0 26px 8px;
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 14px;
`;

const ModalCaption = styled.div`
  padding: 20px 16px 8px;
  color: ${props => props.theme.text};
  font-size: 14px;
  line-height: 1.4;
  
  strong {
    font-weight: 600;
    margin-right: 6px;
  }
`;

const ModalComments = styled.div`
  flex: 1;
  padding: 20px 26px 30px;
  overflow-y: auto;
  max-height: 500px;
`;

const CommentItem = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 6px;
  padding: 2px 0;
  align-items: flex-start;
`;

const CommentAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #FF6B35;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
  margin-top: 5px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const CommentContent = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
  position: relative;
  min-height: 40px;
`;

const CommentAuthor = styled.span`
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 13px;
  margin-right: 8px;
  line-height: 20px;
  display: inline-block;
  vertical-align: middle;
  padding-top: 0px;
`;

const CommentTextContainer = styled.div`
  flex: 1;
  margin-right: 30px;
`;

const CommentText = styled.span`
  color: ${props => props.theme.text};
  font-size: 13px;
  line-height: 1.3;
  display: block;
`;

const CommentLikeButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  padding: px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
  top: 5px;
  width: 20px;
  height: 20px;
  transition: color 0.2s ease;
  
  &:hover {
    color: #FF6B35;
  }
  
  &.liked {
    color: #FF6B35;
  }
`;

const ModalCommentForm = styled.form`
  padding: 20px 16px 72px;
  display: flex;
  gap: 8px;
  align-items: center;
`;

const CommentInput = styled.input`
  flex: 1;
  background: ${props => props.theme.surface};
  border: 2px solid ${props => props.theme.border};
  border-radius: 20px;
  color: ${props => props.theme.text};
  font-size: 14px;
  outline: none;
  padding: 8px 12px;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }

  &:hover {
    border-color: #FF6B35;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);
  }

  &:focus {
    border-color: #FF6B35;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);
  }
`;

const PostButton = styled.button`
  background: #FF6B35;
  border: none;
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #e55a2b;
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    background: ${props => props.theme.border};
    color: ${props => props.theme.textSecondary};
    cursor: not-allowed;
    transform: none;
  }
`;

// İfade butonları için styled components
const ReactionButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 107, 53, 0.1);
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.9);
  }
`;

const ReactionContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

const ReactionToggle = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.textSecondary};
  
  &:hover {
    background: rgba(255, 107, 53, 0.1);
    color: #FF6B35;
    transform: scale(1.1);
  }
`;

const ReactionDropdown = styled.div`
  position: absolute;
  top: -60px;
  left: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 25px;
  padding: 8px 12px;
  display: ${props => props.show ? 'flex' : 'none'};
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
`;

const ReactionEmoji = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 107, 53, 0.1);
    transform: scale(1.2);
  }
  
  &:active {
    transform: scale(0.9);
  }
`;

const ReactionDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const ReactionItem = styled.span`
  background: rgba(255, 107, 53, 0.1);
  color: #FF6B35;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;



const WorkCard = ({ work }) => {
  const { theme } = useTheme();
  
  // localStorage'dan like durumunu yükle
  const getStoredLikeState = () => {
    try {
      const likedWorks = JSON.parse(localStorage.getItem('likedWorks') || '{}');
      return likedWorks[work._id] || false;
    } catch (error) {
      console.error('Like durumu okuma hatası:', error);
      return false;
    }
  };
  
  // localStorage'dan like count'u yükle
  const getStoredLikeCount = () => {
    try {
      const workLikes = JSON.parse(localStorage.getItem('workLikes') || '{}');
      return workLikes[work._id] || work.likeCount || work.likes?.length || 0;
    } catch (error) {
      console.error('Like count okuma hatası:', error);
      return work.likeCount || work.likes?.length || 0;
    }
  };
  
  // localStorage'dan save durumunu yükle
  const getStoredSaveState = () => {
    try {
      const savedWorks = JSON.parse(localStorage.getItem('savedWorks') || '{}');
      return savedWorks[work._id] || false;
    } catch (error) {
      console.error('Save durumu okuma hatası:', error);
      return false;
    }
  };
  
  // Beğeni state'leri
  const [isLiked, setIsLiked] = useState(getStoredLikeState());
  const [likeCount, setLikeCount] = useState(getStoredLikeCount());
  const [isLiking, setIsLiking] = useState(false);
  
  // Kaydetme state'leri
  const [isSaved, setIsSaved] = useState(getStoredSaveState());
  const [isSaving, setIsSaving] = useState(false);
  
  const [showBadgeDetails, setShowBadgeDetails] = useState(false);
  const [visibleBadges, setVisibleBadges] = useState([]);
  
  // Modal state'i
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // localStorage'dan yorum beğenme durumunu yükle
  const getStoredCommentLikes = () => {
    try {
      return JSON.parse(localStorage.getItem('commentLikes') || '{}');
    } catch (error) {
      console.error('Yorum beğenme durumu okuma hatası:', error);
      return {};
    }
  };
  
  const getStoredReactions = () => {
    try {
      const stored = localStorage.getItem(`reactions_${work._id}`);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('İfade durumu okuma hatası:', error);
      return {};
    }
  };
  
  // Yorum state'leri
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentLikes, setCommentLikes] = useState(getStoredCommentLikes());
  
  // İfade state'leri
  const [reactions, setReactions] = useState(getStoredReactions());
  const [showReactions, setShowReactions] = useState(false);

  // Modal açıldığında yorumları yükle
  useEffect(() => {
    if (isModalOpen) {
      loadComments();
    }
  }, [isModalOpen, work._id]);

  // Yorumları yükleme fonksiyonu
  const loadComments = async () => {
    try {
      // Önce localStorage'dan yorumları yükle
      const workComments = JSON.parse(localStorage.getItem('workComments') || '{}');
      if (workComments[work._id]) {
        setComments(workComments[work._id]);
        console.log('Yorumlar localStorage\'dan yüklendi');
        return;
      }
      
      // localStorage'da yoksa API'den yükle
      const response = await fetch(`/api/comments/${work._id}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setComments(result.data);
          // API'den gelen yorumları localStorage'a kaydet
          workComments[work._id] = result.data;
          localStorage.setItem('workComments', JSON.stringify(workComments));
        }
      }
    } catch (error) {
      console.error('Yorumlar yüklenirken hata:', error);
    }
  };
  
  

  
  // Trend ikonu için basit mantık - bazı eserlerde göster
  const isTrending = (work.likeCount || work.likes?.length || 0) > 50;
  
  // Rozet türleri
  const badgeTypes = {
    star: { emoji: '🏆', name: 'Sahnenin Yıldızı Rozeti', color: 'rgba(255, 215, 0, 1)' },
    echo: { emoji: '✨', name: 'Sanatın Yankısı Rozeti', color: 'rgba(255, 105, 180, 1)' },
    light: { emoji: '🖌️', name: 'Yaratıcılığın Işığı Rozeti', color: 'rgba(30, 144, 255, 1)' },
    inspiration: { emoji: '🌿', name: 'İlham Kaynağı Rozeti', color: 'rgba(50, 205, 50, 1)' },
    horizons: { emoji: '🌟', name: 'Yeni Ufuklar Rozeti', color: 'rgba(138, 43, 226, 1)' }
  };

  // Trend ikonuna hover fonksiyonu
  const handleTrendHover = () => {
    setShowBadgeDetails(true);
    setVisibleBadges([]);
    
    const badgeKeys = Object.keys(badgeTypes);
    badgeKeys.forEach((key, index) => {
      setTimeout(() => {
        setVisibleBadges(prev => [...prev, key]);
      }, index * 150); // Her rozet 150ms arayla çıksın
    });
  };

  // Trend ikonundan çıkma fonksiyonu
  const handleTrendLeave = () => {
    setShowBadgeDetails(false);
    setVisibleBadges([]);
  };

  // Yorum gönderme fonksiyonu
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workId: work._id,
          content: newComment.trim(),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Yeni yorumu listeye ekle
          const updatedComments = [result.data, ...comments];
          setComments(updatedComments);
          setNewComment('');
          
          // localStorage'a yorumları kaydet
          try {
            const workComments = JSON.parse(localStorage.getItem('workComments') || '{}');
            workComments[work._id] = updatedComments;
            localStorage.setItem('workComments', JSON.stringify(workComments));
            console.log('Yorum localStorage\'a kaydedildi');
          } catch (error) {
            console.error('Yorum kaydetme hatası:', error);
          }
        }
      } else {
        console.error('Yorum gönderilemedi');
      }
    } catch (error) {
      console.error('Yorum gönderme hatası:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Yorum beğenme fonksiyonu
  const handleCommentLike = (commentId) => {
    const newLikeState = !commentLikes[commentId];
    setCommentLikes(prev => ({
      ...prev,
      [commentId]: newLikeState
    }));
    
    // localStorage'a yorum beğenme durumunu kaydet
    try {
      const commentLikesData = JSON.parse(localStorage.getItem('commentLikes') || '{}');
      if (newLikeState) {
        commentLikesData[commentId] = true;
      } else {
        delete commentLikesData[commentId];
      }
      localStorage.setItem('commentLikes', JSON.stringify(commentLikesData));
      console.log('Yorum beğenme durumu localStorage\'a kaydedildi');
    } catch (error) {
      console.error('Yorum beğenme kaydetme hatası:', error);
    }
  };
  
  // İfade bırakma fonksiyonu
  const handleReaction = (emoji) => {
    const newReactions = { ...reactions };
    if (newReactions[emoji]) {
      delete newReactions[emoji];
    } else {
      newReactions[emoji] = true;
    }
    setReactions(newReactions);
    localStorage.setItem(`reactions_${work._id}`, JSON.stringify(newReactions));
    setShowReactions(false);
  };

  // Beğeni fonksiyonu
  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLiking) return;
    
    setIsLiking(true);
    
    try {
      const newLikeState = !isLiked;
      const newLikeCount = newLikeState ? likeCount + 1 : likeCount - 1;
      
      // State'i güncelle
      setIsLiked(newLikeState);
      setLikeCount(newLikeCount);
      
      // localStorage'a kaydet
      const likedWorks = JSON.parse(localStorage.getItem('likedWorks') || '{}');
      if (newLikeState) {
        likedWorks[work._id] = true;
      } else {
        delete likedWorks[work._id];
      }
      localStorage.setItem('likedWorks', JSON.stringify(likedWorks));
      
      // Like count'u da kaydet
      const workLikes = JSON.parse(localStorage.getItem('workLikes') || '{}');
      workLikes[work._id] = newLikeCount;
      localStorage.setItem('workLikes', JSON.stringify(workLikes));
      
      console.log('Like durumu localStorage\'a kaydedildi');
      
    } catch (error) {
      console.error('Beğeni hatası:', error);
    } finally {
      setIsLiking(false);
    }
  };

  // Kaydetme fonksiyonu
  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSaving) return;
    
    setIsSaving(true);
    
    try {
      const newSaveState = !isSaved;
      
      // State'i güncelle
      setIsSaved(newSaveState);
      
      // localStorage'a kaydet
      const savedWorks = JSON.parse(localStorage.getItem('savedWorks') || '{}');
      if (newSaveState) {
        savedWorks[work._id] = true;
      } else {
        delete savedWorks[work._id];
      }
      localStorage.setItem('savedWorks', JSON.stringify(savedWorks));
      
      console.log('Save durumu localStorage\'a kaydedildi');
      
    } catch (error) {
      console.error('Kaydetme hatası:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Rozet tıklama fonksiyonu
  const handleBadgeClick = (badgeKey, badgeName) => {
    console.log(`${badgeName} rozetine tıklandı!`);
    
    // Görsel feedback için rozet animasyonu
    const badgeElement = document.querySelector(`[data-badge="${badgeKey}"]`);
    if (badgeElement) {
      badgeElement.style.transform = 'scale(0.8)';
      setTimeout(() => {
        badgeElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
          badgeElement.style.transform = 'scale(1)';
        }, 150);
      }, 100);
    }
    
    // Burada rozet tıklama işlemi yapılabilir
    // Örneğin: toast mesajı, modal açma, vs.
  };
  

  // const handleLike = async (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
    
  //   if (!user) {
  //     toast.error('Beğenmek için giriş yapmalısınız');
  //     return;
  //   }

  //   try {
  //     const result = await likeWork(work._id);
  //     if (result.success) {
  //       setIsLiked(!isLiked);
  //       setLikeCount(result.data.likeCount);
  //     }
  //   } catch (error) {
  //     console.error('Like error:', error);
  //   }
  // };

  // const handleSave = async (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
    
  //   if (!user) {
  //     toast.error('Kaydetmek için giriş yapmalısınız');
  //     return;
  //   }

  //   try {
  //     const result = await saveWork(work._id);
  //     if (result.success) {
  //       setIsSaved(!isSaved);
  //     }
  //   } catch (error) {
  //     console.error('Save error:', error);
  //   }
  // };

  // Yorum gönderme fonksiyonu

  const mainImage = work.images?.find(img => img.isMain) || work.images?.[0];

  // Instagram benzeri mock veriler
  const mockUser = {
    name: work.author?.name || 'Sanatçı',
    username: work.author?.username || 'sanatci',
    avatar: work.author?.avatar || null
  };

  const mockCaption = work.description || `${work.title} - Bu eser bana ilham veriyor ✨`;
  const mockLikes = likeCount;
  // const mockComments = Math.floor(Math.random() * 50) + 10;
  const mockViews = work.views || 1000; // Sabit değer kullan

  return (
    <>
    <Card onClick={() => setIsModalOpen(true)}>
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
            color: '#2C1810',
            fontSize: '2rem'
          }}>
            🎨
          </div>
        )}
        
        {/* Ortada modern yorum ikonu */}
        <CenterOverlay>
          <ModernCommentIcon onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}>
            <FiMessageCircle size={20} />
          </ModernCommentIcon>
        </CenterOverlay>
        
        {/* Sağ üst trend ikonları */}
        {isTrending && (
          <TopRightOverlay
            onMouseEnter={handleTrendHover}
            onMouseLeave={handleTrendLeave}
          >
            <TrendIcon>
              <FiTrendingUp />
            </TrendIcon>
            
            <BadgeDetails 
              show={showBadgeDetails}
              data-badge-details="true"
              onMouseEnter={() => setShowBadgeDetails(true)}
              onMouseLeave={() => {
                setShowBadgeDetails(false);
                setVisibleBadges([]);
              }}
            >
              {Object.entries(badgeTypes).map(([key, badge]) => (
                <BadgeItem 
                  key={key} 
                  bgColor={badge.color}
                  isVisible={visibleBadges.includes(key)}
                  onClick={() => handleBadgeClick(key, badge.name)}
                  data-badge={key}
                >
                  {badge.emoji}
                  <BadgeTooltip>
                    {badge.name}
                  </BadgeTooltip>
                </BadgeItem>
              ))}
            </BadgeDetails>
          </TopRightOverlay>
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
    
    {/* Instagram Modal */}
    {isModalOpen && (
      <ModalOverlay onClick={() => setIsModalOpen(false)}>
        <ModalContent theme={theme} onClick={(e) => e.stopPropagation()}>
          <ModalImageSection>
            {mainImage ? (
              <ModalImage src={mainImage.url} alt={work.title} />
            ) : (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2C1810',
                fontSize: '4rem'
              }}>
                🎨
              </div>
            )}
          </ModalImageSection>
          
          <ModalInfoSection theme={theme}>
            <ModalHeader theme={theme}>
              <ModalAvatar>
                {(work.author?.username || work.author?.fullName || work.author) ? (work.author?.username || work.author?.fullName || work.author).charAt(0).toUpperCase() : 'A'}
              </ModalAvatar>
              <ModalUserInfo>
                <ModalUsername theme={theme}>{work.author?.username || work.author?.fullName || work.author || 'Artist'}</ModalUsername>
                <ModalLocation theme={theme}>Istanbul, Turkey</ModalLocation>
              </ModalUserInfo>
              <ModalCloseButton theme={theme} onClick={() => setIsModalOpen(false)}>
                ×
              </ModalCloseButton>
            </ModalHeader>
            
            <ModalCaption theme={theme}>
              <strong>{work.author?.username || work.author?.fullName || work.author || 'Artist'}</strong> {work.description || work.title}
            </ModalCaption>
            
            <ModalActions theme={theme}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginLeft: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ModalActionButton 
                    theme={theme} 
                    onClick={handleLike}
                    disabled={isLiking}
                    style={{ 
                      color: isLiked ? '#FF6B35' : theme.text,
                      transform: isLiked ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <FiHeart 
                      size={20} 
                      fill={isLiked ? '#FF6B35' : 'none'}
                      style={{ 
                        color: isLiked ? '#FF6B35' : theme.text,
                        transition: 'all 0.2s ease'
                      }}
                    />
                  </ModalActionButton>
                  <span style={{ 
                    color: theme.text, 
                    fontSize: '14px', 
                    fontWeight: '600',
                    lineHeight: '1',
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '-5px'
                  }}>
                    {likeCount}
                  </span>
                </div>
                <ModalActionButton theme={theme}>
                  <FiMessageCircle size={20} />
                </ModalActionButton>
                <ModalActionButton 
                  theme={theme} 
                  onClick={handleSave}
                  disabled={isSaving}
                  style={{ 
                    color: isSaved ? '#FF6B35' : theme.text,
                    transform: isSaved ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <FiBookmark 
                    size={20} 
                    fill={isSaved ? '#FF6B35' : 'none'}
                    style={{ 
                      color: isSaved ? '#FF6B35' : theme.text,
                      transition: 'all 0.2s ease'
                    }}
                  />
                </ModalActionButton>
              </div>
              
              {/* İfade butonları */}
              <ReactionContainer>
                <ReactionToggle 
                  theme={theme}
                  onClick={() => setShowReactions(!showReactions)}
                >
                  😊
                </ReactionToggle>
                
                <ReactionDropdown show={showReactions}>
                  <ReactionEmoji onClick={() => handleReaction('❤️')}>❤️</ReactionEmoji>
                  <ReactionEmoji onClick={() => handleReaction('😍')}>😍</ReactionEmoji>
                  <ReactionEmoji onClick={() => handleReaction('🤩')}>🤩</ReactionEmoji>
                  <ReactionEmoji onClick={() => handleReaction('😮')}>😮</ReactionEmoji>
                  <ReactionEmoji onClick={() => handleReaction('😢')}>😢</ReactionEmoji>
                  <ReactionEmoji onClick={() => handleReaction('😂')}>😂</ReactionEmoji>
                </ReactionDropdown>
              </ReactionContainer>
            </ModalActions>
            
            {/* İfade gösterimi */}
            {Object.keys(reactions).length > 0 && (
              <ReactionDisplay>
                {Object.keys(reactions).map(emoji => (
                  <ReactionItem key={emoji}>
                    {emoji}
                  </ReactionItem>
                ))}
              </ReactionDisplay>
            )}
            
            <ModalComments theme={theme}>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <CommentItem key={comment._id}>
                    <CommentAvatar 
                      style={{
                        backgroundImage: comment.avatar ? `url(${process.env.PUBLIC_URL}${comment.avatar})` : 'none',
                        backgroundColor: comment.avatar ? 'transparent' : '#FF6B35'
                      }}
                    >
                      {!comment.avatar && (comment.username ? comment.username.charAt(0).toUpperCase() : 'U')}
                    </CommentAvatar>
                    <CommentContent>
                      <CommentTextContainer>
                        <CommentAuthor theme={theme}>{comment.username || 'Kullanıcı'}</CommentAuthor>
                        <CommentText theme={theme}>{comment.content}</CommentText>
                      </CommentTextContainer>
                      <CommentLikeButton 
                        theme={theme}
                        onClick={() => handleCommentLike(comment._id)}
                        className={commentLikes[comment._id] ? 'liked' : ''}
                      >
                        <FiHeart size={12} />
                      </CommentLikeButton>
                    </CommentContent>
                  </CommentItem>
                ))
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  color: theme.textSecondary, 
                  fontSize: '14px',
                  padding: '20px 0'
                }}>
                  Henüz yorum yok. İlk yorumu sen yap!
                </div>
              )}
            </ModalComments>
            
            <ModalCommentForm theme={theme} onSubmit={handleSubmitComment}>
              <CommentInput 
                theme={theme}
                placeholder="Yorum ekle..."
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <PostButton 
                type="submit" 
                disabled={isSubmittingComment}
                onClick={handleSubmitComment}
              >
                {isSubmittingComment ? 'Gönderiliyor...' : 'Paylaş'}
              </PostButton>
            </ModalCommentForm>
          </ModalInfoSection>
        </ModalContent>
      </ModalOverlay>
    )}
    </>
  );
};

export default WorkCard;
