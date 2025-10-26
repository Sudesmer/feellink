import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const StoriesContainer = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px 0;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const StoryItem = styled(motion.div)`
  min-width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.theme.surface};
  border: 2px solid ${props => props.isViewed ? props.theme.border : props.theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const StoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const StoryUsername = styled.div`
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: ${props => props.theme.text};
  white-space: nowrap;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StoryModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const StoryContent = styled.div`
  position: relative;
  max-width: 90%;
  max-height: 90%;
  border-radius: 12px;
  overflow: hidden;
`;

const StoryImageFull = styled.img`
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
`;

const Stories = () => {
  const { theme } = useTheme();
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = () => {
    // Mock stories data
    const mockStories = [
      {
        _id: '1',
        userId: '2',
        username: 'admin',
        avatar: '/zeynep.jpg',
        image: '/can.jpg',
        isViewed: false,
        createdAt: new Date()
      },
      {
        _id: '2',
        userId: '3',
        username: 'designer',
        avatar: '/can.jpg',
        image: '/sude.jpg',
        isViewed: true,
        createdAt: new Date()
      }
    ];
    setStories(mockStories);
  };

  return (
    <>
      <StoriesContainer>
        {stories.map((story) => (
          <StoryItem
            key={story._id}
            theme={theme}
            isViewed={story.isViewed}
            onClick={() => setSelectedStory(story)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <StoryImage src={story.avatar} alt={story.username} />
            <StoryUsername theme={theme}>{story.username}</StoryUsername>
          </StoryItem>
        ))}
      </StoriesContainer>

      {selectedStory && (
        <StoryModal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedStory(null)}
        >
          <StoryContent onClick={(e) => e.stopPropagation()}>
            <StoryImageFull src={selectedStory.image} alt="Story" />
            <CloseButton onClick={() => setSelectedStory(null)}>
              <FiX />
            </CloseButton>
          </StoryContent>
        </StoryModal>
      )}
    </>
  );
};

export default Stories;
