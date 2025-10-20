import React, { useState, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FiGrid,
  FiHeart,
  FiMessageCircle,
  FiBookmark,
  FiUserPlus,
  FiUserMinus,
  FiEdit3,
  FiPlus,
  FiHome,
  FiEye,
  FiBell,
  FiUser,
  FiCamera,
  FiX
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { mockWorks as originalMockWorks } from '../mock-data';

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(5px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
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
  max-width: 935px;
  margin: 0 auto;
  padding: 30px 20px;
  flex: 1;
`;

const ProfileContainer = styled.div`
  max-width: 935px;
  margin: 0 auto;
  padding: 30px 20px;
`;

const ProfileHeader = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 0px;
  padding-bottom: 30px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
  }
`;

const AvatarSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  position: relative;
`;

const Avatar = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: ${props => props.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: 700;
  border: 3px solid ${props => props.theme.border};
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: ${props => props.expanded ? 'scale(1.2)' : 'scale(1)'};
  z-index: ${props => props.expanded ? '1000' : '1'};
  position: ${props => props.expanded ? 'relative' : 'static'};

  &:hover {
    transform: ${props => props.expanded ? 'scale(1.2)' : 'scale(1.05)'};
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
    font-size: 2.5rem;
  }
`;

const AvatarOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  animation: ${props => props.show ? 'fadeIn' : 'fadeOut'} 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;

const ExpandedAvatar = styled.img`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid white;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: ${props => props.show ? 'scaleIn' : 'scaleOut'} 0.3s ease;

  @keyframes scaleIn {
    from { 
      transform: scale(0.5);
      opacity: 0;
    }
    to { 
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes scaleOut {
    from { 
      transform: scale(1);
      opacity: 1;
    }
    to { 
      transform: scale(0.5);
      opacity: 0;
    }
  }

  @media (max-width: 768px) {
    width: 250px;
    height: 250px;
  }
`;

const ExpandedAvatarText = styled.div`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: ${props => props.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 6rem;
  font-weight: 700;
  border: 5px solid white;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: ${props => props.show ? 'scaleIn' : 'scaleOut'} 0.3s ease;

  @keyframes scaleIn {
    from { 
      transform: scale(0.5);
      opacity: 0;
    }
    to { 
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes scaleOut {
    from { 
      transform: scale(1);
      opacity: 1;
    }
    to { 
      transform: scale(0.5);
      opacity: 0;
    }
  }

  @media (max-width: 768px) {
    width: 250px;
    height: 250px;
    font-size: 5rem;
  }
`;

const AvatarImg = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${props => props.theme.border};
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: ${props => props.expanded ? 'scale(1.2)' : 'scale(1)'};
  z-index: ${props => props.expanded ? '1000' : '1'};
  position: ${props => props.expanded ? 'relative' : 'static'};

  &:hover {
    transform: ${props => props.expanded ? 'scale(1.2)' : 'scale(1.05)'};
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }
`;

const PhotoUploadButton = styled.button`
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.primary};
  border: 2px solid ${props => props.theme.background};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: ${props => props.theme.primaryHover};
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    bottom: 3px;
    right: 3px;
  }
`;

const PhotoUploadModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PhotoUploadContent = styled.div`
  background: ${props => props.theme.background};
  border-radius: 12px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const PhotoUploadTitle = styled.h3`
  color: ${props => props.theme.text};
  margin: 0 0 20px 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const PhotoPreview = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin: 0 auto 20px;
  overflow: hidden;
  border: 3px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.background};
`;

const PhotoPreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PhotoUploadActions = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
`;

const PhotoUploadButton2 = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
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
      background: ${props.theme.hover};
    }
  `}
`;

const HiddenFileInput = styled.input`
  display: none;
`;

// Eser ekleme modal styled components
const WorkUploadModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const WorkUploadContent = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const WorkUploadTitle = styled.h3`
  color: ${props => props.theme.text};
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
`;

const WorkForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const WorkInput = styled.input`
  padding: 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #FF6B35;
    box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.2);
  }
`;

const WorkTextarea = styled.textarea`
  padding: 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #FF6B35;
    box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.2);
  }
`;

const WorkSelect = styled.select`
  padding: 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #FF6B35;
    box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.2);
  }
`;

const WorkPreview = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 0;
`;

const WorkPreviewImg = styled.img`
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  object-fit: cover;
`;

const WorkUploadActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const WorkUploadButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.primary ? `
    background: #FF6B35;
    color: white;
    
    &:hover {
      background: #e55a2b;
    }
  ` : `
    background: ${props.theme.border};
    color: ${props.theme.text};
    
    &:hover {
      background: ${props.theme.text}20;
    }
  `}
`;

const WorkFileInput = styled.input`
  display: none;
`;

// Takipçi/Takip Modal Styled Components
const FollowModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const FollowModalContent = styled.div`
  background: ${props => props.theme.background};
  border-radius: 12px;
  width: 400px;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const FollowModalHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FollowModalTitle = styled.h3`
  color: ${props => props.theme.text};
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const FollowModalCloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.hover};
  }
`;

const FollowModalList = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 500px;
  
  /* Kaydırma çubuğu stilleri */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme === 'dark' ? '#2a2a2a' : '#f1f1f1'};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme === 'dark' ? '#555' : '#c1c1c1'};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme === 'dark' ? '#777' : '#a8a8a8'};
  }
`;

const FollowUserItem = styled.div`
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid ${props => props.theme.border};
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.hover};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const FollowUserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #FF6B35;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const FollowUserInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const FollowUsername = styled.div`
  color: ${props => props.theme.text};
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const FollowFullName = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 12px;
`;

const FollowButton = styled.button`
  background: ${props => props.isFollowing ? 'transparent' : '#0095f6'};
  color: ${props => props.isFollowing ? props.theme.text : 'white'};
  border: 1px solid ${props => props.isFollowing ? props.theme.border : '#0095f6'};
  border-radius: 6px;
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.isFollowing ? props.theme.hover : '#0080d6'};
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProfileTop = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
`;

const Username = styled.h1`
  font-size: 1.75rem;
  font-weight: 300;
  color: ${props => props.theme.text};
  margin: 0;
  line-height: 1.2;
  flex-shrink: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  flex-shrink: 0;
  width: 100%;
`;

const ActionButton = styled.button`
  flex: 0 0 auto;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  background: ${props => props.primary ? props.theme.primary : props.theme.surface};
  color: ${props => props.primary ? 'white' : props.theme.text};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  white-space: nowrap;
  min-width: 120px;

  &:hover {
    background: ${props => props.primary ? props.theme.primaryHover : props.theme.surfaceHover};
  }
`;


const Stats = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    justify-content: center;
    gap: 30px;
  }
`;

const StatItem = styled.div`
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const StatNumber = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 2px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
`;

const Bio = styled.div`
  color: ${props => props.theme.text};
  line-height: 1.6;
  margin-bottom: 16px;
  font-size: 0.95rem;
`;

const BioText = styled.span`
  margin: 0;
  font-size: 0.95rem;
  display: inline;
  white-space: normal;
  line-height: 1.6;
`;

const BioLink = styled.a`
  color: ${props => props.theme.primary};
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const ProfileTabs = styled.div`
  display: flex;
  justify-content: center;
  border-top: 1px solid ${props => props.theme.border};
  margin-top: 0;
`;

const Tab = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 0;
  background: none;
  border: none;
  color: ${props => props.active ? props.theme.text : props.theme.textSecondary};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border-top: 1px solid ${props => props.active ? props.theme.text : 'transparent'};
  transition: all 0.3s ease;
  margin-right: 60px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    color: ${props => props.theme.text};
  }
`;

const WorksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  margin-top: 0;

  @media (max-width: 768px) {
    gap: 3px;
  }
`;

const WorkItem = styled.div`
  aspect-ratio: 1;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  position: relative;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  border-radius: 8px;

  &:hover {
    transform: scale(1.02);
    z-index: 10;
    box-shadow: 0 8px 25px ${props => props.theme.shadow};
    
    button {
      opacity: 1;
    }
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  opacity: 0;
  transition: all 0.2s ease;
  z-index: 20;
  
  &:hover {
    background: rgba(255, 0, 0, 1);
    transform: scale(1.1);
  }
`;

const MessageOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const MessageContent = styled.div`
  background: ${props => props.type === 'success' ? '#fff' : '#fff'};
  border: 2px solid ${props => props.type === 'success' ? '#ff6b35' : '#ff4444'};
  border-radius: 12px;
  padding: 24px 32px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transform: ${props => props.show ? 'scale(1)' : 'scale(0.8)'};
  transition: all 0.3s ease;
`;

const MessageIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  color: ${props => props.type === 'success' ? '#ff6b35' : '#ff4444'};
`;

const MessageText = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
`;

const ConfirmOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const ConfirmContent = styled.div`
  background: #fff;
  border: 2px solid #ff6b35;
  border-radius: 16px;
  padding: 24px;
  max-width: 320px;
  text-align: center;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  transform: ${props => props.show ? 'scale(1)' : 'scale(0.8)'};
  transition: all 0.3s ease;
`;

const ConfirmIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
  color: #ff6b35;
`;

const ConfirmTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
  line-height: 1.3;
`;

const ConfirmMessage = styled.div`
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
  line-height: 1.5;
`;

const ConfirmButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

const ConfirmButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  
  ${props => props.variant === 'danger' ? `
    background: #ff6b35;
    color: white;
    
    &:hover {
      background: #e55a2b;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
    }
  ` : `
    background: #f5f5f5;
    color: #666;
    border: 1px solid #ddd;
    
    &:hover {
      background: #e9e9e9;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `}
`;

const WorkImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
  background: #000;
  
  /* Eğer resim yoksa simsiyah göster */
  &:not([src]), &[src=""], &[src="undefined"] {
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 14px;
  }

  ${WorkItem}:hover & {
    transform: scale(1.1);
  }
`;

const WorkOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  opacity: 0;
  transition: all 0.3s ease;

  ${WorkItem}:hover & {
    opacity: 1;
  }
`;

const OverlayIcon = styled.div`
  color: white;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  font-size: 0.9rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.textSecondary};
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${props => props.theme.text};
`;

const EmptyDescription = styled.p`
  font-size: 0.9rem;
  max-width: 300px;
  margin: 0 auto;
  line-height: 1.4;
`;

// Mock data for Instagram-like profile
const mockProfile = {
  username: 'zeynep_esmer',
  fullName: 'Zeynep Esmer',
  bio: '🎨 Sanatçı & Tasarımcı\n📍 İstanbul, Türkiye\n✨ Dijital sanat ve geleneksel tekniklerin buluştuğu nokta',
  website: 'zeynepesmer.com',
  location: 'İstanbul, Türkiye',
  avatar: '/zeynep.jpg',
  followers: 0,
  following: 0,
  posts: 42,
  isFollowing: false,
  isOwnProfile: true
};


const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  
  // Mock takipçi ve takip edilen kullanıcı verileri
  const mockFollowers = [];
  
  const mockFollowing = [];
  
  const [followers, setFollowers] = useState(mockFollowers);
  const [following, setFollowing] = useState(mockFollowing);
  const [hoveredWorkId, setHoveredWorkId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '', show: false });
  const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', onConfirm: null });
  const [isAvatarExpanded, setIsAvatarExpanded] = useState(false);
  
  // Yorum filtreleri ve sabitleme state'leri
  const [commentFilter, setCommentFilter] = useState('all'); // 'all', 'most_interactive'
  const [pinnedComments, setPinnedComments] = useState([]);
  
  // Sağ tık menüsü
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, commentId: null });
  
  // Mesaj gösterme fonksiyonu
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type, show: true });
    setTimeout(() => {
      setMessage({ text: '', type: '', show: false });
    }, 3000);
  };
  
  // Onay modal'ı gösterme fonksiyonu
  const showConfirmModal = (title, message, onConfirm) => {
    setConfirmModal({ show: true, title, message, onConfirm });
  };
  
  // Onay modal'ını kapatma fonksiyonu
  const closeConfirmModal = () => {
    setConfirmModal({ show: false, title: '', message: '', onConfirm: null });
  };
  
  // Onay işlemi
  const handleConfirm = () => {
    if (confirmModal.onConfirm) {
      confirmModal.onConfirm();
    }
    closeConfirmModal();
  };
  
  // localStorage'dan yorum filtrelerini yükle
  const getStoredCommentFilter = () => {
    try {
      return localStorage.getItem('commentFilter') || 'all';
    } catch (error) {
      console.error('Yorum filtresi yüklenirken hata:', error);
      return 'all';
    }
  };

  // localStorage'dan sabitlenmiş yorumları yükle
  const getStoredPinnedComments = () => {
    try {
      const stored = localStorage.getItem('pinnedComments');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Sabitlenmiş yorumlar yüklenirken hata:', error);
      return [];
    }
  };

  // Yorum sabitleme fonksiyonu
  const togglePinComment = (commentId) => {
    const isCurrentlyPinned = pinnedComments.includes(commentId);
    
    if (isCurrentlyPinned) {
      // Sabitlemeyi kaldır
      const newPinnedComments = pinnedComments.filter(id => id !== commentId);
      setPinnedComments(newPinnedComments);
      localStorage.setItem('pinnedComments', JSON.stringify(newPinnedComments));
      
      // Custom event dispatch et
      window.dispatchEvent(new CustomEvent('pinnedCommentsUpdated', { 
        detail: { pinnedComments: newPinnedComments } 
      }));
    } else {
      // Yeni sabitleme - 3 yorum sınırını kontrol et
      if (pinnedComments.length >= 3) {
        showMessage('En fazla 3 yorum sabitleyebilirsiniz', 'error');
        return;
      }
      
      // Sabitle
      const newPinnedComments = [...pinnedComments, commentId];
      setPinnedComments(newPinnedComments);
      localStorage.setItem('pinnedComments', JSON.stringify(newPinnedComments));
      
      // Custom event dispatch et
      window.dispatchEvent(new CustomEvent('pinnedCommentsUpdated', { 
        detail: { pinnedComments: newPinnedComments } 
      }));
    }
  };

  // Sağ tık menüsü fonksiyonları
  const handleContextMenu = (e, commentId) => {
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      commentId: commentId
    });
  };

  const hideContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, commentId: null });
  };

  const handlePinFromMenu = (commentId) => {
    togglePinComment(commentId);
    hideContextMenu();
  };

  const handleDeleteFromMenu = (commentId) => {
    // Yorum silme işlemi
    const updatedComments = userComments.filter(comment => comment._id !== commentId);
    setUserComments(updatedComments);
    localStorage.setItem('userComments', JSON.stringify(updatedComments));
    
    // Sabitlenmiş yorumlar listesinden de kaldır
    const updatedPinnedComments = pinnedComments.filter(id => id !== commentId);
    setPinnedComments(updatedPinnedComments);
    localStorage.setItem('pinnedComments', JSON.stringify(updatedPinnedComments));
    
    hideContextMenu();
  };

  // Filtre değiştirme fonksiyonu
  const handleFilterChange = (newFilter) => {
    setCommentFilter(newFilter);
    localStorage.setItem('commentFilter', newFilter);
  };

  // Yorum filtreleme fonksiyonu
  const filterComments = (comments) => {
    if (commentFilter === 'most_interactive') {
      // En çok etkileşim alan yorumları (beğeni sayısına göre sırala)
      return comments.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
    return comments; // 'all' için tüm yorumlar
  };

  // Sabitlenmiş yorumları başa al
  const sortCommentsWithPinned = (comments) => {
    const pinned = comments.filter(comment => pinnedComments.includes(comment._id));
    const unpinned = comments.filter(comment => !pinnedComments.includes(comment._id));
    
    return [...pinned, ...filterComments(unpinned)];
  };

  // localStorage'dan takip durumunu yükle
  const getStoredFollowState = () => {
    try {
      const stored = localStorage.getItem('userFollowState');
      return stored ? JSON.parse(stored) : mockProfile.isFollowing;
    } catch (error) {
      console.error('Takip durumu okuma hatası:', error);
      return mockProfile.isFollowing;
    }
  };
  
  const [isFollowing, setIsFollowing] = useState(getStoredFollowState());
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  
  // Eser ekleme modal state'leri
  const [showWorkUpload, setShowWorkUpload] = useState(false);
  const [workTitle, setWorkTitle] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [workFile, setWorkFile] = useState(null);
  const [workPreviewUrl, setWorkPreviewUrl] = useState(null);
  const workFileInputRef = useRef(null);
  
  // Instagram tarzı modal state'leri
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [userComments, setUserComments] = useState([]);

  // Filtre sayılarını hesapla
  const getFilterCounts = () => {
    const totalCount = userComments.length;
    const mostInteractiveCount = userComments.filter(comment => (comment.likes || 0) > 0).length;
    
    return {
      all: totalCount,
      most_interactive: mostInteractiveCount
    };
  };

  const filterCounts = getFilterCounts();

  // localStorage'dan profil fotoğrafını yükle
  const getStoredProfilePhoto = () => {
    try {
      return localStorage.getItem('userProfilePhoto') || mockProfile.avatar;
    } catch (error) {
      console.error('Profil fotoğrafı okuma hatası:', error);
      return mockProfile.avatar;
    }
  };

  // localStorage'dan kullanıcı yorumlarını yükle
  const getStoredUserComments = () => {
    try {
      const stored = localStorage.getItem('userComments');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Kullanıcı yorumları okuma hatası:', error);
      return [];
    }
  };

  // localStorage'dan profil verilerini yükle
  const getStoredProfileData = () => {
    try {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        return {
          ...mockProfile,
          ...parsedProfile,
          avatar: getStoredProfilePhoto() // Fotoğrafı ayrı key'den al
        };
      }
    } catch (error) {
      console.error('Profil verileri okuma hatası:', error);
    }
    return {
      ...mockProfile,
      avatar: getStoredProfilePhoto()
    };
  };
  
  const [profile, setProfile] = useState(getStoredProfileData());
  
  // Kullanıcı yorumlarını yükle
  React.useEffect(() => {
    setUserComments(getStoredUserComments());
    setCommentFilter(getStoredCommentFilter());
    setPinnedComments(getStoredPinnedComments());
  }, []);

  // Sağ tık menüsünü kapatma
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        hideContextMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('contextmenu', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('contextmenu', handleClickOutside);
    };
  }, [contextMenu.visible]);

  // localStorage'dan kullanıcı yorumlarını dinle
  React.useEffect(() => {
    const handleStorageChange = () => {
      setUserComments(getStoredUserComments());
    };

    const handleUserCommentsUpdate = (event) => {
      setUserComments(event.detail.comments);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userCommentsUpdated', handleUserCommentsUpdate);
    
    // Sayfa içi değişiklikleri de dinle
    const interval = setInterval(() => {
      const currentComments = getStoredUserComments();
      if (JSON.stringify(currentComments) !== JSON.stringify(userComments)) {
        setUserComments(currentComments);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userCommentsUpdated', handleUserCommentsUpdate);
      clearInterval(interval);
    };
  }, [userComments]);
  
  // localStorage'dan eserleri yükle, yoksa orijinal mock data'yı kullan
  const getStoredWorks = () => {
    try {
      const stored = localStorage.getItem('userWorks');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('localStorage okuma hatası:', error);
    }
    return originalMockWorks;
  };
  
  const [works, setWorks] = useState(getStoredWorks());
  const [savedWorksCount, setSavedWorksCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(profile.followers);
  const [followingCount, setFollowingCount] = useState(profile.following);
  const isOwnProfile = mockProfile.isOwnProfile || (currentUser && currentUser.username === username);
  
  // Kaydedilen eser sayısını hesapla
  const getSavedWorksCount = () => {
    try {
      const savedWorks = JSON.parse(localStorage.getItem('savedWorks') || '{}');
      return Object.keys(savedWorks).length;
    } catch (error) {
      console.error('Kaydedilen eser sayısı okuma hatası:', error);
      return 0;
    }
  };
  
  // Takipçi sayısını hesapla
  const getFollowersCount = () => {
    return profile.followers; // Her zaman 0 döndür (launch için)
  };
  
  // Takip ettiğim sayısını hesapla
  const getFollowingCount = () => {
    return profile.following; // Her zaman 0 döndür (launch için)
  };
  
  // Sayıları güncelle
  const updateCounts = useCallback(() => {
    setSavedWorksCount(getSavedWorksCount());
    setFollowersCount(getFollowersCount());
    setFollowingCount(getFollowingCount());
  }, []);
  
  // Component mount olduğunda sayıları güncelle
  React.useEffect(() => {
    // Takip sayılarını sıfırla (launch için)
    localStorage.removeItem('followersCount');
    localStorage.removeItem('followingCount');
    localStorage.removeItem('followersData');
    localStorage.removeItem('followingData');
    
    updateCounts();
    
    // localStorage'dan takip verilerini yükle
    try {
      const storedFollowers = localStorage.getItem('followersData');
      if (storedFollowers) {
        setFollowers(JSON.parse(storedFollowers));
      }
      
      const storedFollowing = localStorage.getItem('followingData');
      if (storedFollowing) {
        setFollowing(JSON.parse(storedFollowing));
      }
    } catch (error) {
      console.error('localStorage takip verileri yükleme hatası:', error);
    }
  }, [updateCounts]);

  // localStorage'dan güncellenmiş profil verilerini yükle
  React.useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        const updatedProfile = JSON.parse(storedProfile);
        setProfile(prevProfile => ({
          ...prevProfile,
          ...updatedProfile
        }));
      }
    } catch (error) {
      console.error('localStorage profil verileri yükleme hatası:', error);
    }
  }, []);

  const handleFollow = () => {
    const newFollowState = !isFollowing;
    setIsFollowing(newFollowState);
    
    // Takipçi sayısını güncelle
    const newFollowersCount = newFollowState ? followersCount + 1 : followersCount - 1;
    setFollowersCount(newFollowersCount);
    
    // localStorage'a takip durumunu ve sayıları kaydet
    try {
      localStorage.setItem('userFollowState', JSON.stringify(newFollowState));
      localStorage.setItem('followersCount', newFollowersCount.toString());
      console.log('Takip durumu ve sayıları localStorage\'a kaydedildi:', newFollowState, newFollowersCount);
    } catch (error) {
      console.error('Takip durumu kaydetme hatası:', error);
    }
  };

  // Takipçi modal'ındaki takip işlemi
  const handleFollowerFollow = (followerId) => {
    setFollowers(prevFollowers => 
      prevFollowers.map(follower => 
        follower._id === followerId 
          ? { ...follower, isFollowing: !follower.isFollowing }
          : follower
      )
    );
    
    // localStorage'a kaydet
    try {
      const updatedFollowers = followers.map(follower => 
        follower._id === followerId 
          ? { ...follower, isFollowing: !follower.isFollowing }
          : follower
      );
      localStorage.setItem('followersData', JSON.stringify(updatedFollowers));
      console.log('Takipçi takip durumu güncellendi:', followerId);
    } catch (error) {
      console.error('Takipçi takip durumu kaydetme hatası:', error);
    }
  };

  // Takip edilenler modal'ındaki takip işlemi
  const handleFollowingUnfollow = (followingId) => {
    setFollowing(prevFollowing => 
      prevFollowing.map(user => 
        user._id === followingId 
          ? { ...user, isFollowing: false }
          : user
      )
    );
    
    // Takip edilen sayısını güncelle
    const newFollowingCount = followingCount - 1;
    setFollowingCount(newFollowingCount);
    
    // localStorage'a kaydet
    try {
      const updatedFollowing = following.map(user => 
        user._id === followingId 
          ? { ...user, isFollowing: false }
          : user
      );
      localStorage.setItem('followingData', JSON.stringify(updatedFollowing));
      localStorage.setItem('followingCount', newFollowingCount.toString());
      console.log('Takip edilen kullanıcı takipten çıkarıldı:', followingId);
    } catch (error) {
      console.error('Takip edilen kullanıcı takipten çıkarma hatası:', error);
    }
  };

  const handleWorkClick = (workId) => {
    const work = works.find(w => (w._id || w.id) === workId);
    if (work) {
      setSelectedWork(work);
      setIsLiked(false); // localStorage'dan yüklenecek
      setLikeCount(work.likeCount || work.likes?.length || 0);
      setIsSaved(false); // localStorage'dan yüklenecek
      setComments([]);
      setIsModalOpen(true);
    }
  };

  // Modal fonksiyonları
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWork(null);
  };

  const handleLike = () => {
    const newLikeState = !isLiked;
    setIsLiked(newLikeState);
    setLikeCount(prev => newLikeState ? prev + 1 : prev - 1);
    
    // localStorage'a kaydet
    try {
      const likedWorks = JSON.parse(localStorage.getItem('likedWorks') || '{}');
      if (newLikeState) {
        likedWorks[selectedWork._id] = true;
      } else {
        delete likedWorks[selectedWork._id];
      }
      localStorage.setItem('likedWorks', JSON.stringify(likedWorks));
    } catch (error) {
      console.error('Like kaydetme hatası:', error);
    }
  };

  const handleSave = () => {
    const newSaveState = !isSaved;
    setIsSaved(newSaveState);
    
    // localStorage'a kaydet
    try {
      const savedWorks = JSON.parse(localStorage.getItem('savedWorks') || '{}');
      if (newSaveState) {
        savedWorks[selectedWork._id] = true;
      } else {
        delete savedWorks[selectedWork._id];
      }
      localStorage.setItem('savedWorks', JSON.stringify(savedWorks));
      
      // Sayıları güncelle
      updateCounts();
    } catch (error) {
      console.error('Save kaydetme hatası:', error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const newCommentObj = {
        _id: `comment_${Date.now()}`,
        workId: selectedWork._id,
        userId: 'temp_user',
        username: 'Kullanıcı',
        avatar: '/sude.jpg',
        content: newComment.trim(),
        createdAt: new Date(),
        isApproved: true,
        likes: 0
      };
      
      const updatedComments = [newCommentObj, ...comments];
      setComments(updatedComments);
      setNewComment('');
      
      // localStorage'a kaydet
      try {
        const workComments = JSON.parse(localStorage.getItem('workComments') || '{}');
        workComments[selectedWork._id] = updatedComments;
        localStorage.setItem('workComments', JSON.stringify(workComments));
        
        // Kullanıcı yorumlarını da sakla
        const userComment = {
          _id: Date.now().toString(),
          text: newComment,
          workId: selectedWork._id,
          workTitle: selectedWork.title,
          workImage: selectedWork.imageUrl,
          author: {
            _id: currentUser?._id || '1',
            username: currentUser?.username || 'zeynep_esmer',
            fullName: currentUser?.fullName || 'Zeynep Esmer',
            avatar: currentUser?.avatar || '/zeynep.jpg'
          },
          createdAt: new Date(),
          isApproved: true,
          likes: 0
        };
        
        const updatedUserComments = [userComment, ...userComments];
        setUserComments(updatedUserComments);
        localStorage.setItem('userComments', JSON.stringify(updatedUserComments));
      } catch (error) {
        console.error('Yorum kaydetme hatası:', error);
      }
    } catch (error) {
      console.error('Yorum gönderme hatası:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handlePhotoUpload = () => {
    setShowPhotoUpload(true);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = () => {
    if (selectedFile) {
      // localStorage'a profil fotoğrafını kaydet
      try {
        localStorage.setItem('userProfilePhoto', previewUrl);
        console.log('Profil fotoğrafı localStorage\'a kaydedildi');
        
        // Profil state'ini güncelle
        setProfile(prevProfile => ({
          ...prevProfile,
          avatar: previewUrl
        }));
        
        // Mock profil fotoğrafını güncelle
        mockProfile.avatar = previewUrl;
        
        // Profil verilerini de güncelle (EditProfile.js ile aynı key kullan)
        const updatedProfile = {
          ...profile,
          avatar: previewUrl
        };
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        
        // Modal'ı kapat ve formu temizle
        setShowPhotoUpload(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        showMessage('Profil fotoğrafı başarıyla güncellendi ve kaydedildi!', 'success');
      } catch (error) {
        console.error('Profil fotoğrafı kaydetme hatası:', error);
        showMessage('Fotoğraf kaydedilirken hata oluştu.', 'error');
      }
    } else {
      showMessage('Lütfen bir fotoğraf seçin.', 'error');
    }
  };

  const handleCancelPhoto = () => {
    setShowPhotoUpload(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Eser ekleme fonksiyonları
  const handleWorkUpload = () => {
    setShowWorkUpload(true);
  };

  const handleWorkFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setWorkFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setWorkPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveWork = () => {
    if (workTitle && workFile) {
      // Yeni eser oluştur
      const newWork = {
        _id: `work_${Date.now()}`,
        title: workTitle,
        description: workDescription || '',
        category: 'diger',
        imageUrl: workPreviewUrl,
        author: {
          _id: currentUser?._id || '1',
          username: currentUser?.username || 'zeynep_esmer',
          fullName: currentUser?.fullName || 'Zeynep Esmer',
          avatar: currentUser?.avatar || '/zeynep.jpg'
        },
        likes: 0,
        comments: [],
        createdAt: new Date(),
        isApproved: true
      };
      
      // State'i güncelle - yeni eseri başa ekle
      const updatedWorks = [newWork, ...works];
      setWorks(updatedWorks);
      
      // localStorage'a kaydet
      try {
        localStorage.setItem('userWorks', JSON.stringify(updatedWorks));
        console.log('Eser localStorage\'a kaydedildi');
      } catch (error) {
        console.error('localStorage kaydetme hatası:', error);
      }
      
      // Sayıları güncelle
      updateCounts();
      
      // Başarı mesajını göster
      showMessage('Eser başarıyla eklendi ve kaydedildi!', 'success');
      
      // Modal'ı kapat ve formu temizle (mesaj gösterildikten sonra)
      setTimeout(() => {
        setShowWorkUpload(false);
        setWorkTitle('');
        setWorkDescription('');
        setWorkFile(null);
        setWorkPreviewUrl(null);
        if (workFileInputRef.current) {
          workFileInputRef.current.value = '';
        }
      }, 1500); // 1.5 saniye bekle
    } else {
      showMessage('Lütfen eser başlığı ve dosya seçin.', 'error');
    }
  };

  // Eser silme fonksiyonu
  const handleDeleteWork = (workId) => {
    showConfirmModal(
      'Eseri Sil',
      'Bu eseri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      () => {
        const updatedWorks = works.filter(work => work._id !== workId);
        setWorks(updatedWorks);
        
        // Eğer silinen eser modal'da açık olan eserse, modal'ı kapat
        if (selectedWork && (selectedWork._id === workId || selectedWork.id === workId)) {
          setIsModalOpen(false);
          setSelectedWork(null);
        }
        
        // localStorage'dan da sil
        try {
          localStorage.setItem('userWorks', JSON.stringify(updatedWorks));
          console.log('Eser localStorage\'dan silindi');
        } catch (error) {
          console.error('localStorage silme hatası:', error);
        }
        
        // Sayıları güncelle
        updateCounts();
      }
    );
  };

  const handleCancelWork = () => {
    setShowWorkUpload(false);
    setWorkTitle('');
    setWorkDescription('');
    setWorkFile(null);
    setWorkPreviewUrl(null);
    if (workFileInputRef.current) {
      workFileInputRef.current.value = '';
    }
  };

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
      <ProfileContainer theme={theme}>
        <ProfileHeader theme={theme}>
          <AvatarSection>
            {profile.avatar ? (
              <AvatarImg 
                src={profile.avatar} 
                alt={profile.fullName} 
                theme={theme}
                expanded={isAvatarExpanded}
                onClick={() => setIsAvatarExpanded(!isAvatarExpanded)}
              />
            ) : (
              <Avatar 
                theme={theme}
                expanded={isAvatarExpanded}
                onClick={() => setIsAvatarExpanded(!isAvatarExpanded)}
              >
                {profile.fullName.charAt(0).toUpperCase()}
              </Avatar>
            )}
            {isOwnProfile && (
              <PhotoUploadButton theme={theme} onClick={handlePhotoUpload}>
                <FiCamera size={18} />
              </PhotoUploadButton>
            )}
          </AvatarSection>

          <ProfileInfo>
            <ProfileTop>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Username theme={theme}>{profile.username}</Username>
                <div 
                  style={{ 
                    position: 'relative',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)'
                  }}
                  title="Kullanıcı Rozeti"
                  onMouseEnter={(e) => {
                    const tooltip = document.createElement('div');
                    tooltip.id = 'user-badge-tooltip';
                    tooltip.style.cssText = `
                      position: absolute;
                      bottom: 35px;
                      left: 50%;
                      transform: translateX(-50%);
                      background: rgba(0, 0, 0, 0.9);
                      color: white;
                      padding: 8px 12px;
                      border-radius: 6px;
                      font-size: 12px;
                      font-weight: 500;
                      white-space: nowrap;
                      z-index: 1000;
                      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                      animation: fadeIn 0.3s ease;
                    `;
                    tooltip.textContent = 'Kullanıcı Rozeti';
                    e.target.appendChild(tooltip);
                  }}
                  onMouseLeave={(e) => {
                    const tooltip = document.getElementById('user-badge-tooltip');
                    if (tooltip) {
                      tooltip.remove();
                    }
                  }}
                >
                  👤
                </div>
              </div>
            </ProfileTop>

            <Stats>
              <StatItem>
                <StatNumber theme={theme}>{works.length}</StatNumber>
                <StatLabel theme={theme}>eser</StatLabel>
              </StatItem>
              <StatItem onClick={() => setShowFollowersModal(true)} style={{ cursor: 'pointer' }}>
                <StatNumber theme={theme}>{followersCount.toLocaleString()}</StatNumber>
                <StatLabel theme={theme}>takipçi</StatLabel>
              </StatItem>
              <StatItem onClick={() => setShowFollowingModal(true)} style={{ cursor: 'pointer' }}>
                <StatNumber theme={theme}>{followingCount}</StatNumber>
                <StatLabel theme={theme}>takip</StatLabel>
              </StatItem>
            </Stats>

            <Bio theme={theme}>
              <BioText theme={theme}>
                {profile.fullName}
                {profile.bio && (
                  <>
                    <br />
                    {profile.bio.split('\n').map((line, index) => (
                      <span key={index}>
                        {line}
                        {index < profile.bio.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </>
                )}
                {profile.website && (
                  <>
                    <br />
                    <BioLink theme={theme} href={profile.website} target="_blank" rel="noopener noreferrer">
                      {profile.website}
                    </BioLink>
                  </>
                )}
              </BioText>
            </Bio>
            
            <ActionButtons>
              {isOwnProfile ? (
                <>
                  <ActionButton theme={theme} onClick={() => navigate('/edit-profile')}>
                    <FiEdit3 size={14} />
                    Profili Düzenle
                  </ActionButton>
                  <ActionButton theme={theme} primary onClick={handleWorkUpload}>
                    <FiPlus size={14} />
                    Gönderi Ekle
                  </ActionButton>
                </>
              ) : (
                <>
                  <ActionButton 
                    theme={theme} 
                    primary={!isFollowing}
                    onClick={handleFollow}
                  >
                    {isFollowing ? (
                      <>
                        <FiUserMinus size={14} />
                        Takibi Bırak
                      </>
                    ) : (
                      <>
                        <FiUserPlus size={14} />
                        Takip Et
                      </>
                    )}
                  </ActionButton>
                  <ActionButton theme={theme}>
                    <FiMessageCircle size={14} />
                    Mesaj
                  </ActionButton>
                </>
              )}
            </ActionButtons>
          </ProfileInfo>
        </ProfileHeader>

        <ProfileTabs theme={theme}>
          <Tab 
            theme={theme} 
            active={activeTab === 'posts'}
            onClick={() => setActiveTab('posts')}
          >
            <FiGrid size={12} />
            Gönderiler ({works.length})
          </Tab>
          <Tab 
            theme={theme} 
            active={activeTab === 'comments'}
            onClick={() => setActiveTab('comments')}
          >
            <FiMessageCircle size={12} />
            Yorumlar ({userComments.length})
          </Tab>
          <Tab 
            theme={theme} 
            active={activeTab === 'favorites'}
            onClick={() => setActiveTab('favorites')}
          >
            <FiHeart size={12} />
            Favori Müzeleri (0)
          </Tab>
          <Tab 
            theme={theme} 
            active={activeTab === 'saved'}
            onClick={() => setActiveTab('saved')}
          >
            <FiBookmark size={12} />
            Kaydedilenler ({savedWorksCount})
          </Tab>
        </ProfileTabs>

        {activeTab === 'posts' && (
          <>
            {works.length > 0 ? (
              <WorksGrid>
                {works.map((work) => (
                  <WorkItem 
                    key={work._id || work.id} 
                    theme={theme}
                    onClick={() => handleWorkClick(work._id || work.id)}
                  >
                    <WorkImage 
                      src={work.imageUrl || work.image || work.images?.[0]?.url || ''} 
                      alt={`Eser ${work._id || work.id}`}
                      onError={(e) => {
                        e.target.style.background = '#000';
                        e.target.style.display = 'flex';
                        e.target.style.alignItems = 'center';
                        e.target.style.justifyContent = 'center';
                        e.target.style.color = '#666';
                        e.target.style.fontSize = '14px';
                        e.target.src = '';
                      }}
                    />
                    <WorkOverlay>
                      <OverlayIcon>
                        <FiHeart size={16} />
                        {work.likes}
                      </OverlayIcon>
                      <OverlayIcon>
                        <FiMessageCircle size={16} />
                        {work.comments?.length || work.comments}
                      </OverlayIcon>
                    </WorkOverlay>
                    {isOwnProfile && (
                      <DeleteButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWork(work._id || work.id);
                        }}
                        title="Eseri Sil"
                      >
                        ×
                      </DeleteButton>
                    )}
                  </WorkItem>
                ))}
              </WorksGrid>
            ) : (
              <EmptyState theme={theme}>
                <EmptyIcon>📷</EmptyIcon>
                <EmptyTitle theme={theme}>Henüz eser yok</EmptyTitle>
                <EmptyDescription theme={theme}>
                  {isOwnProfile 
                    ? 'İlk eserinizi paylaşmaya ne dersiniz?'
                    : 'Bu kullanıcı henüz eser paylaşmamış.'
                  }
                </EmptyDescription>
              </EmptyState>
            )}
          </>
        )}

        {activeTab === 'saved' && (
          <EmptyState theme={theme}>
            <EmptyIcon>🔖</EmptyIcon>
            <EmptyTitle theme={theme}>Kaydedilen eserler</EmptyTitle>
            <EmptyDescription theme={theme}>
              Kaydettiğiniz eserler burada görünecek.
            </EmptyDescription>
          </EmptyState>
        )}

        {activeTab === 'comments' && (
          userComments.length > 0 ? (
            <div style={{ padding: '20px 0' }}>
              {/* Yorum Filtreleri */}
              <div style={{ 
                display: 'flex',
                gap: '8px',
                marginBottom: '20px',
                padding: '0 4px',
                alignItems: 'center'
              }}>
                <button
                  onClick={() => handleFilterChange('most_interactive')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    background: commentFilter === 'most_interactive' 
                      ? '#ff6b35' 
                      : (theme.isDark ? '#404040' : '#f0f0f0'),
                    color: commentFilter === 'most_interactive' 
                      ? 'white' 
                      : theme.text,
                    fontSize: '14px',
                    fontWeight: commentFilter === 'most_interactive' ? '600' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  En Çok Etkileşim ({filterCounts.most_interactive})
                </button>
                <button
                  onClick={() => handleFilterChange('all')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    background: commentFilter === 'all' 
                      ? '#ff6b35' 
                      : (theme.isDark ? '#404040' : '#f0f0f0'),
                    color: commentFilter === 'all' 
                      ? 'white' 
                      : theme.text,
                    fontSize: '14px',
                    fontWeight: commentFilter === 'all' ? '600' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Tümü ({filterCounts.all})
                </button>
                
                {/* Sabitlenmiş Yorum Sayısı İndikatörü */}
                {pinnedComments.length > 0 && (
                  <div style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    background: theme.isDark ? '#2a2a2a' : '#f0f0f0',
                    borderRadius: '16px',
                    fontSize: '12px',
                    color: theme.text,
                    border: `1px solid ${theme.isDark ? '#404040' : '#e0e0e0'}`
                  }}>
                    <span>📌</span>
                    <span>{pinnedComments.length}/3 sabitlenmiş</span>
                  </div>
                )}
              </div>

              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {sortCommentsWithPinned(userComments).map((comment) => (
                  <div 
                    key={comment._id} 
                    style={{
                      background: theme.isDark ? '#2a2a2a' : '#f8f9fa',
                      borderRadius: '8px',
                      padding: '16px',
                      border: `1px solid ${theme.isDark ? '#404040' : '#e9ecef'}`,
                      borderLeft: pinnedComments.includes(comment._id) 
                        ? `4px solid #ff6b35` 
                        : `1px solid ${theme.isDark ? '#404040' : '#e9ecef'}`,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      position: 'relative',
                      '&:hover': {
                        background: theme.isDark ? '#333' : '#e9ecef'
                      }
                    }}
                    onClick={() => {
                      // Önce profil eserlerinde ara, sonra tüm eserlerde ara
                      let work = works.find(w => String(w._id || w.id) === String(comment.workId));
                      
                      // Profil eserlerinde bulunamazsa, tüm eserlerde ara
                      if (!work) {
                        work = originalMockWorks.find(w => String(w._id || w.id) === String(comment.workId));
                      }
                      
                      // Eser bulunursa modal aç
                      if (work) {
                        setSelectedWork(work);
                        setIsLiked(false);
                        setLikeCount(work.likeCount || work.likes?.length || 0);
                        setIsSaved(false);
                        setComments([]);
                        setIsModalOpen(true);
                      }
                    }}
                    onContextMenu={(e) => handleContextMenu(e, comment._id)}
                    onMouseEnter={(e) => {
                      e.target.style.background = theme.isDark ? '#333' : '#e9ecef';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = theme.isDark ? '#2a2a2a' : '#f8f9fa';
                    }}
                  >

                    {/* Sabitlenmiş İndikatörü */}
                    {pinnedComments.includes(comment._id) && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: '#ff6b35',
                        color: 'white',
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        fontWeight: '600'
                      }}>
                        SABİTLENMİŞ
                      </div>
                    )}

                    <div style={{ 
                      color: theme.text,
                      fontSize: '14px',
                      lineHeight: '1.4',
                      marginBottom: '8px',
                      paddingRight: '40px',
                      paddingTop: pinnedComments.includes(comment._id) ? '20px' : '0'
                    }}>
                      {comment.text}
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      color: theme.isDark ? '#888' : '#666'
                    }}>
                      <span>📅 {new Date(comment.createdAt).toLocaleDateString('tr-TR')}</span>
                      <span>🎨 {comment.workTitle}</span>
                      {comment.likes > 0 && (
                        <span>❤️ {comment.likes}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState theme={theme}>
              <EmptyIcon>💬</EmptyIcon>
              <EmptyTitle theme={theme}>Yorumlarınız</EmptyTitle>
              <EmptyDescription theme={theme}>
                Eserlere yaptığınız yorumlar burada görünecek.
              </EmptyDescription>
            </EmptyState>
          )
        )}

        {activeTab === 'favorites' && (
          <EmptyState theme={theme}>
            <EmptyIcon>🏛️</EmptyIcon>
            <EmptyTitle theme={theme}>Favori müzeleriniz</EmptyTitle>
            <EmptyDescription theme={theme}>
              Beğendiğiniz müzeler burada görünecek.
            </EmptyDescription>
          </EmptyState>
        )}
      </ProfileContainer>
          </ContentInner>
        </Content>
      </MainLayout>

      {/* Avatar Expansion Overlay */}
      <AvatarOverlay show={isAvatarExpanded} onClick={() => setIsAvatarExpanded(false)}>
        {profile.avatar ? (
          <ExpandedAvatar 
            src={profile.avatar} 
            alt={profile.fullName}
            show={isAvatarExpanded}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <ExpandedAvatarText 
            theme={theme}
            show={isAvatarExpanded}
            onClick={(e) => e.stopPropagation()}
          >
            {profile.fullName.charAt(0).toUpperCase()}
          </ExpandedAvatarText>
        )}
      </AvatarOverlay>

      {/* Fotoğraf Yükleme Modalı */}
      {showPhotoUpload && (
        <PhotoUploadModal onClick={handleCancelPhoto}>
          <PhotoUploadContent theme={theme} onClick={(e) => e.stopPropagation()}>
            <PhotoUploadTitle theme={theme}>Profil Fotoğrafı Değiştir</PhotoUploadTitle>
            
            <PhotoPreview theme={theme}>
              {previewUrl ? (
                <PhotoPreviewImg src={previewUrl} alt="Önizleme" />
              ) : (
                <div style={{ color: theme.text, fontSize: '3rem' }}>
                  <FiCamera />
                </div>
              )}
            </PhotoPreview>

            <HiddenFileInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
            />

            <PhotoUploadActions>
              <PhotoUploadButton2 
                theme={theme} 
                onClick={() => fileInputRef.current?.click()}
              >
                Fotoğraf Seç
              </PhotoUploadButton2>
              
              {previewUrl && (
                <PhotoUploadButton2 
                  theme={theme} 
                  primary 
                  onClick={handleSavePhoto}
                >
                  Kaydet
                </PhotoUploadButton2>
              )}
              
              <PhotoUploadButton2 
                theme={theme} 
                onClick={handleCancelPhoto}
              >
                İptal
              </PhotoUploadButton2>
            </PhotoUploadActions>
          </PhotoUploadContent>
        </PhotoUploadModal>
      )}

      {/* Eser Ekleme Modalı */}
      {showWorkUpload && (
        <WorkUploadModal onClick={handleCancelWork}>
          <WorkUploadContent theme={theme} onClick={(e) => e.stopPropagation()}>
            <WorkUploadTitle theme={theme}>Yeni Gönderi Ekle</WorkUploadTitle>
            
            <WorkForm>
              <WorkInput
                theme={theme}
                type="text"
                placeholder="Eser Başlığı"
                value={workTitle}
                onChange={(e) => setWorkTitle(e.target.value)}
              />
              
              <WorkTextarea
                theme={theme}
                placeholder="Eser Açıklaması (İsteğe bağlı)"
                value={workDescription}
                onChange={(e) => setWorkDescription(e.target.value)}
              />
              
              
              {workPreviewUrl && (
                <WorkPreview>
                  <WorkPreviewImg src={workPreviewUrl} alt="Eser Önizleme" />
                </WorkPreview>
              )}
            </WorkForm>

            <WorkFileInput
              ref={workFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleWorkFileSelect}
            />

            <WorkUploadActions>
              <WorkUploadButton 
                theme={theme} 
                onClick={() => workFileInputRef.current?.click()}
              >
                Dosya Seç
              </WorkUploadButton>
              
              {workTitle && workFile && (
                <WorkUploadButton 
                  theme={theme} 
                  primary 
                  onClick={handleSaveWork}
                >
                  Gönderi Ekle
                </WorkUploadButton>
              )}
              
              <WorkUploadButton 
                theme={theme} 
                onClick={handleCancelWork}
              >
                İptal
              </WorkUploadButton>
            </WorkUploadActions>
          </WorkUploadContent>
        </WorkUploadModal>
      )}
      
      {/* Instagram tarzı Modal */}
      {isModalOpen && selectedWork && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent theme={theme} onClick={(e) => e.stopPropagation()}>
            <ModalHeader theme={theme}>
              <ModalAvatar>
                {(selectedWork.author && typeof selectedWork.author === 'string') ? selectedWork.author.charAt(0).toUpperCase() : 'A'}
              </ModalAvatar>
              <ModalUsername theme={theme}>
                {selectedWork.author?.username || selectedWork.author?.fullName || selectedWork.author || 'Artist'}
              </ModalUsername>
              <ModalCloseButton onClick={handleCloseModal}>
                <FiX size={24} />
              </ModalCloseButton>
            </ModalHeader>
            
            <ModalImageContainer>
              <ModalImage 
                src={selectedWork.imageUrl || selectedWork.image || selectedWork.images?.[0]?.url || ''} 
                alt={selectedWork.title || 'Eser'}
                onError={(e) => {
                  e.target.style.background = '#000';
                  e.target.src = '';
                }}
              />
            </ModalImageContainer>
            
            <ModalInfoSection theme={theme}>
              <ModalActions theme={theme}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ModalActionButton 
                      theme={theme} 
                      onClick={handleLike}
                      style={{ 
                        color: isLiked ? '#FF6B35' : theme.text,
                        transform: isLiked ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <FiHeart 
                        size={20} 
                        fill={isLiked ? '#FF6B35' : 'none'}
                      />
                    </ModalActionButton>
                    <span style={{ 
                      color: theme.text, 
                      fontSize: '14px', 
                      fontWeight: '600',
                      lineHeight: '1',
                      display: 'flex',
                      alignItems: 'center'
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
                    style={{ 
                      color: isSaved ? '#FF6B35' : theme.text,
                      transform: isSaved ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <FiBookmark 
                      size={20} 
                      fill={isSaved ? '#FF6B35' : 'none'}
                    />
                  </ModalActionButton>
                </div>
              </ModalActions>
              
              <ModalCaption theme={theme}>
                <ModalUsername theme={theme}>
                  {selectedWork.author?.username || selectedWork.author?.fullName || selectedWork.author || 'Artist'}
                </ModalUsername>
                {selectedWork.description && (
                  <span> {selectedWork.description}</span>
                )}
              </ModalCaption>
              
              <ModalComments theme={theme}>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <CommentItem key={comment._id} theme={theme}>
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
                          <CommentAuthor theme={theme}>{comment.username || 'Kullanıcı'} </CommentAuthor>
                          <CommentText theme={theme}>{comment.content}</CommentText>
                        </CommentTextContainer>
                      </CommentContent>
                    </CommentItem>
                  ))
                ) : (
                  <div style={{ 
                    textAlign: 'center',
                    color: theme.textSecondary,
                    fontSize: '14px',
                    padding: '20px'
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
      
      {/* Takipçiler Modal */}
      {showFollowersModal && (
        <FollowModal onClick={() => setShowFollowersModal(false)}>
          <FollowModalContent theme={theme} onClick={(e) => e.stopPropagation()}>
            <FollowModalHeader theme={theme}>
              <FollowModalTitle theme={theme}>Takipçiler</FollowModalTitle>
              <FollowModalCloseButton theme={theme} onClick={() => setShowFollowersModal(false)}>
                ×
              </FollowModalCloseButton>
            </FollowModalHeader>
            <FollowModalList>
              {followers.map((follower) => (
                <FollowUserItem key={follower._id} theme={theme}>
                  <FollowUserAvatar 
                    style={{
                      backgroundImage: follower.avatar ? `url(${process.env.PUBLIC_URL}${follower.avatar})` : 'none',
                      backgroundColor: follower.avatar ? 'transparent' : '#FF6B35'
                    }}
                  >
                    {!follower.avatar && follower.username.charAt(0).toUpperCase()}
                  </FollowUserAvatar>
                  <FollowUserInfo>
                    <FollowUsername theme={theme}>
                      {follower.username}
                      {follower.isVerified && <span>✓</span>}
                    </FollowUsername>
                    <FollowFullName theme={theme}>{follower.fullName}</FollowFullName>
                  </FollowUserInfo>
                    <FollowButton 
                      theme={theme} 
                      isFollowing={follower.isFollowing}
                      onClick={() => handleFollowerFollow(follower._id)}
                    >
                      {follower.isFollowing ? 'Takibi Bırak' : 'Takip Et'}
                    </FollowButton>
                </FollowUserItem>
              ))}
            </FollowModalList>
          </FollowModalContent>
        </FollowModal>
      )}
      
      {/* Takip Edilenler Modal */}
      {showFollowingModal && (
        <FollowModal onClick={() => setShowFollowingModal(false)}>
          <FollowModalContent theme={theme} onClick={(e) => e.stopPropagation()}>
            <FollowModalHeader theme={theme}>
              <FollowModalTitle theme={theme}>Takip Edilenler</FollowModalTitle>
              <FollowModalCloseButton theme={theme} onClick={() => setShowFollowingModal(false)}>
                ×
              </FollowModalCloseButton>
            </FollowModalHeader>
            <FollowModalList>
              {following.map((user) => (
                <FollowUserItem key={user._id} theme={theme}>
                  <FollowUserAvatar 
                    style={{
                      backgroundImage: user.avatar ? `url(${process.env.PUBLIC_URL}${user.avatar})` : 'none',
                      backgroundColor: user.avatar ? 'transparent' : '#FF6B35'
                    }}
                  >
                    {!user.avatar && user.username.charAt(0).toUpperCase()}
                  </FollowUserAvatar>
                  <FollowUserInfo>
                    <FollowUsername theme={theme}>
                      {user.username}
                      {user.isVerified && <span>✓</span>}
                    </FollowUsername>
                    <FollowFullName theme={theme}>{user.fullName}</FollowFullName>
                  </FollowUserInfo>
                    <FollowButton 
                      theme={theme} 
                      isFollowing={user.isFollowing}
                      onClick={() => handleFollowingUnfollow(user._id)}
                    >
                      {user.isFollowing ? 'Takibi Bırak' : 'Takip Et'}
                    </FollowButton>
                </FollowUserItem>
              ))}
            </FollowModalList>
          </FollowModalContent>
        </FollowModal>
      )}
      
      {/* Mesaj Modal */}
      <MessageOverlay show={message.show}>
        <MessageContent show={message.show} type={message.type}>
          <MessageIcon type={message.type}>
            {message.type === 'success' ? '✅' : '❌'}
          </MessageIcon>
          <MessageText>{message.text}</MessageText>
        </MessageContent>
      </MessageOverlay>
      
      {/* Onay Modal */}
      <ConfirmOverlay show={confirmModal.show}>
        <ConfirmContent show={confirmModal.show}>
          <ConfirmMessage>{confirmModal.message}</ConfirmMessage>
          <ConfirmButtons>
            <ConfirmButton onClick={closeConfirmModal}>
              İptal
            </ConfirmButton>
            <ConfirmButton variant="danger" onClick={handleConfirm}>
              Sil
            </ConfirmButton>
          </ConfirmButtons>
        </ConfirmContent>
      </ConfirmOverlay>

      {/* Sağ Tık Menüsü */}
      {contextMenu.visible && (
        <div
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            background: theme.isDark ? '#2a2a2a' : '#ffffff',
            border: `1px solid ${theme.isDark ? '#404040' : '#e0e0e0'}`,
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            minWidth: '150px',
            overflow: 'hidden'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handlePinFromMenu(contextMenu.commentId)}
            disabled={!pinnedComments.includes(contextMenu.commentId) && pinnedComments.length >= 3}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'none',
              border: 'none',
              color: pinnedComments.includes(contextMenu.commentId) 
                ? '#ff6b35' 
                : (!pinnedComments.includes(contextMenu.commentId) && pinnedComments.length >= 3)
                  ? (theme.isDark ? '#666' : '#999')
                  : theme.text,
              fontSize: '14px',
              textAlign: 'left',
              cursor: (!pinnedComments.includes(contextMenu.commentId) && pinnedComments.length >= 3) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s ease',
              opacity: (!pinnedComments.includes(contextMenu.commentId) && pinnedComments.length >= 3) ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!(!pinnedComments.includes(contextMenu.commentId) && pinnedComments.length >= 3)) {
                e.target.style.backgroundColor = theme.isDark ? '#333' : '#f5f5f5';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <span>{pinnedComments.includes(contextMenu.commentId) ? '📌' : '📍'}</span>
            <span>
              {pinnedComments.includes(contextMenu.commentId) 
                ? 'Sabitlemeyi Kaldır' 
                : 'Yorumu Sabitle'}
            </span>
          </button>
          
          <div style={{
            height: '1px',
            background: theme.isDark ? '#404040' : '#e0e0e0',
            margin: '0'
          }} />
          
          <button
            onClick={() => handleDeleteFromMenu(contextMenu.commentId)}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'none',
              border: 'none',
              color: '#ff4757',
              fontSize: '14px',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = theme.isDark ? '#333' : '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <span>🗑️</span>
            <span>Yorumu Sil</span>
          </button>
        </div>
      )}
    </Container>
  );
};

// Instagram tarzı Modal Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 40px;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.background};
  border-radius: 8px;
  max-width: 935px;
  width: 100%;
  max-height: 85vh;
  height: 80vh;
  display: flex;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const ModalAvatar = styled.div`
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
`;

const ModalUsername = styled.span`
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 14px;
`;

const ModalCloseButton = styled.button`
  position: absolute;
  right: 16px;
  top: 16px;
  background: none;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.surface};
  }
`;

const ModalImageContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
`;

const ModalImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
`;

const ModalInfoSection = styled.div`
  width: 335px;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.background};
  border-left: 1px solid ${props => props.theme.border};
`;

const ModalActions = styled.div`
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ModalActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 20px;
  
  &:hover {
    background: ${props => props.theme.surface};
  }
`;

const ModalCaption = styled.div`
  padding: 0 16px 8px;
  font-size: 14px;
  line-height: 1.4;
  color: ${props => props.theme.text};
`;

const ModalComments = styled.div`
  flex: 1;
  padding: 0 16px;
  overflow-y: auto;
  max-height: 400px;
`;

const CommentItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
  padding: 8px 0;
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
`;

const CommentTextContainer = styled.div`
  flex: 1;
`;

const CommentAuthor = styled.span`
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 14px;
  line-height: 1.2;
  display: inline;
`;

const CommentText = styled.span`
  color: ${props => props.theme.text};
  font-size: 14px;
  line-height: 1.4;
`;

const ModalCommentForm = styled.form`
  padding: 12px 16px;
  display: flex;
  gap: 8px;
  align-items: center;
  border-top: 1px solid ${props => props.theme.border};
`;

const CommentInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: ${props => props.theme.text};
  font-size: 14px;
  padding: 8px 0;
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
  
  &:focus {
    outline: none;
  }
`;

const PostButton = styled.button`
  background: none;
  border: none;
  color: #0095f6;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.7;
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

export default Profile;

