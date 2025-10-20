import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiEye, FiBell, FiUser, FiBookmark, FiMessageCircle, FiSend, FiSearch, FiMoreVertical } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
  display: flex;
`;

const MainLayout = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
`;

const LeftSidebar = styled.div`
  width: 280px;
  background: ${props => props.theme.surface};
  border-right: 1px solid ${props => props.theme.border};
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 100;

  @media (max-width: 1200px) {
    display: none;
  }
`;

const SidebarMenu = styled.div`
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.active ? props.theme.primary : props.theme.text};
  background: ${props => props.active ? props.theme.primary + '15' : 'transparent'};
  border-right: ${props => props.active ? `3px solid ${props.theme.primary}` : '3px solid transparent'};

  &:hover {
    background: ${props => props.theme.primary + '10'};
  }
`;

const MenuIcon = styled.div`
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MenuText = styled.span`
  font-size: 16px;
  font-weight: 500;
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
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid ${props => props.theme.border};
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${props => props.theme.textSecondary};
  margin: 8px 0 0 0;
`;

const MessagesContainer = styled.div`
  display: flex;
  flex: 1;
  background: ${props => props.theme.surface};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const ConversationsList = styled.div`
  width: 350px;
  border-right: 1px solid ${props => props.theme.border};
  background: ${props => props.theme.surface};
  display: flex;
  flex-direction: column;
`;

const ConversationsHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ConversationsTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0;
`;

const SearchContainer = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.primary};
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const Conversations = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ConversationItem = styled.div`
  padding: 16px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid ${props => props.theme.border};
  background: ${props => props.active ? props.theme.primary + '10' : 'transparent'};

  &:hover {
    background: ${props => props.theme.primary + '05'};
  }
`;

const ConversationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
`;

const ConversationInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const Username = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 4px;
`;

const LastMessage = styled.div`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MessageTime = styled.div`
  font-size: ${props => props.isOwn !== undefined ? '11px' : '12px'};
  color: ${props => props.isOwn !== undefined 
    ? (props.isOwn ? 'rgba(255,255,255,0.7)' : props.theme.textSecondary)
    : props.theme.textSecondary
  };
  margin-top: 4px;
  text-align: ${props => props.isOwn !== undefined ? (props.isOwn ? 'right' : 'left') : 'left'};
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.background};
`;

const ChatHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.theme.surface};
`;

const ChatUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ChatAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
`;

const ChatUsername = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const ChatActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 8px;
  border: none;
  background: transparent;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.primary + '10'};
    color: ${props => props.theme.primary};
  }
`;

const MessagesList = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
  
  ${props => props.isOwn ? `
    background: ${props.theme.primary};
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  ` : `
    background: ${props.theme.surface};
    color: ${props.theme.text};
    align-self: flex-start;
    border-bottom-left-radius: 4px;
    border: 1px solid ${props.theme.border};
  `}
`;


const MessageInput = styled.div`
  padding: 20px;
  border-top: 1px solid ${props => props.theme.border};
  background: ${props => props.theme.surface};
`;

const InputContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

const MessageTextarea = styled.textarea`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 20px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 14px;
  outline: none;
  resize: none;
  min-height: 20px;
  max-height: 100px;
  font-family: inherit;
  line-height: 1.4;

  &:focus {
    border-color: ${props => props.theme.primary};
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const SendButton = styled.button`
  padding: 12px;
  border: none;
  background: ${props => props.theme.primary};
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  min-width: 44px;
  height: 44px;

  &:hover {
    background: ${props => props.theme.primary};
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.textSecondary};
  text-align: center;
  padding: 40px;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: ${props => props.theme.text};
`;

const EmptyDescription = styled.p`
  font-size: 14px;
  margin: 0;
  max-width: 300px;
`;

const Messages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Konuşmaları yükle
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setConversations(result.conversations);
        }
      }
    } catch (error) {
      console.error('Konuşmalar yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Seçili konuşma değiştiğinde mesajları yükle
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const loadMessages = async (conversationId) => {
    try {
      const response = await fetch(`/api/messages/${conversationId}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setMessages(prev => ({
            ...prev,
            [conversationId]: result.messages
          }));
        }
      }
    } catch (error) {
      console.error('Mesajlar yüklenirken hata:', error);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) return;
    
    setIsSending(true);
    try {
      const response = await fetch(`/api/messages/${selectedConversation.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newMessage.trim(),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Yeni mesajı listeye ekle
          setMessages(prev => ({
            ...prev,
            [selectedConversation.id]: [
              ...(prev[selectedConversation.id] || []),
              {
                ...result.message,
                isOwn: true
              }
            ]
          }));
          setNewMessage('');
        }
      } else {
        console.error('Mesaj gönderilemedi');
      }
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container theme={theme}>
      <LeftSidebar theme={theme}>
        <SidebarMenu>
          <MenuItem theme={theme} active={location.pathname === '/'} onClick={() => navigate('/')}>
            <MenuIcon><FiHome /></MenuIcon><MenuText>Ana Sayfa</MenuText>
          </MenuItem>
          <MenuItem theme={theme} active={location.pathname === '/explore'} onClick={() => navigate('/explore')}>
            <MenuIcon><FiEye /></MenuIcon><MenuText>Keşfet</MenuText>
          </MenuItem>
          <MenuItem theme={theme} active={location.pathname === '/notifications'} onClick={() => navigate('/notifications')}>
            <MenuIcon><FiBell /></MenuIcon><MenuText>Bildirimler</MenuText>
          </MenuItem>
          <MenuItem theme={theme} active={location.pathname.startsWith('/profile')} onClick={() => navigate('/profile')}>
            <MenuIcon><FiUser /></MenuIcon><MenuText>Profil</MenuText>
          </MenuItem>
          <MenuItem theme={theme} active={location.pathname === '/saved'} onClick={() => navigate('/saved')}>
            <MenuIcon><FiBookmark /></MenuIcon><MenuText>Kaydedilenler</MenuText>
          </MenuItem>
          <MenuItem theme={theme} active={location.pathname === '/messages'} onClick={() => navigate('/messages')}>
            <MenuIcon><FiMessageCircle /></MenuIcon><MenuText>Mesajlar</MenuText>
          </MenuItem>
        </SidebarMenu>
      </LeftSidebar>
      
      <MainLayout>
        <Content theme={theme}>
          <ContentInner>
            <Header theme={theme}>
              <Title theme={theme}>Mesajlar</Title>
              <Subtitle theme={theme}>Arkadaşlarınla ve sanatçılarla iletişim kur</Subtitle>
            </Header>

            <MessagesContainer theme={theme}>
              <ConversationsList theme={theme}>
                <ConversationsHeader theme={theme}>
                  <ConversationsTitle theme={theme}>Konuşmalar</ConversationsTitle>
                </ConversationsHeader>
                
                <SearchContainer theme={theme}>
                  <SearchInput
                    theme={theme}
                    type="text"
                    placeholder="Kişi ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </SearchContainer>

                <Conversations>
                  {isLoading ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: theme.textSecondary }}>
                      Konuşmalar yükleniyor...
                    </div>
                  ) : filteredConversations.length > 0 ? (
                    filteredConversations.map((conversation) => {
                      const lastMessageTime = new Date(conversation.lastMessage.timestamp).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      });
                      
                      return (
                        <ConversationItem
                          key={conversation.id}
                          theme={theme}
                          active={selectedConversation?.id === conversation.id}
                          onClick={() => setSelectedConversation(conversation)}
                        >
                          <ConversationHeader>
                            <Avatar theme={theme}>
                              {conversation.user.username.charAt(0).toUpperCase()}
                            </Avatar>
                            <ConversationInfo>
                              <Username theme={theme}>{conversation.user.fullName}</Username>
                              <LastMessage theme={theme}>{conversation.lastMessage.text}</LastMessage>
                            </ConversationInfo>
                          </ConversationHeader>
                          <MessageTime theme={theme}>{lastMessageTime}</MessageTime>
                        </ConversationItem>
                      );
                    })
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: theme.textSecondary }}>
                      Henüz konuşma yok
                    </div>
                  )}
                </Conversations>
              </ConversationsList>

              <ChatArea theme={theme}>
                {selectedConversation ? (
                  <>
                    <ChatHeader theme={theme}>
                      <ChatUserInfo>
                        <ChatAvatar theme={theme}>
                          {selectedConversation.user.username.charAt(0).toUpperCase()}
                        </ChatAvatar>
                        <ChatUsername theme={theme}>{selectedConversation.user.fullName}</ChatUsername>
                      </ChatUserInfo>
                      <ChatActions>
                        <ActionButton theme={theme}>
                          <FiMoreVertical size={20} />
                        </ActionButton>
                      </ChatActions>
                    </ChatHeader>

                    <MessagesList theme={theme}>
                      {messages[selectedConversation.id]?.map((message) => {
                        const isOwn = message.senderId === '1'; // Mock current user ID
                        const timestamp = new Date(message.timestamp).toLocaleTimeString('tr-TR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        });
                        
                        return (
                          <MessageBubble
                            key={message.id}
                            theme={theme}
                            isOwn={isOwn}
                          >
                            {message.text}
                            <MessageTime theme={theme} isOwn={isOwn}>
                              {timestamp}
                            </MessageTime>
                          </MessageBubble>
                        );
                      })}
                    </MessagesList>

                    <MessageInput theme={theme}>
                      <InputContainer>
                        <MessageTextarea
                          theme={theme}
                          placeholder="Mesaj yazın..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          rows={1}
                        />
                        <SendButton
                          theme={theme}
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || isSending}
                        >
                          <FiSend size={20} />
                        </SendButton>
                      </InputContainer>
                    </MessageInput>
                  </>
                ) : (
                  <EmptyState theme={theme}>
                    <EmptyIcon><FiMessageCircle /></EmptyIcon>
                    <EmptyTitle theme={theme}>Mesaj Seçin</EmptyTitle>
                    <EmptyDescription theme={theme}>
                      Sol taraftan bir konuşma seçerek mesajlaşmaya başlayın
                    </EmptyDescription>
                  </EmptyState>
                )}
              </ChatArea>
            </MessagesContainer>
          </ContentInner>
        </Content>
      </MainLayout>
    </Container>
  );
};

export default Messages;
