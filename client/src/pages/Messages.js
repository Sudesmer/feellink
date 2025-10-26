import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

const ChatContainer = styled.div`
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', sans-serif;
`;

const Sidebar = styled.div`
  width: 300px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
`;

const SidebarTitle = styled.h2`
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.5rem;
  font-weight: 600;
`;

const UserList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 8px;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    transform: translateX(5px);
  }
  
  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  border: 2px solid rgba(102, 126, 234, 0.2);
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
`;

const UserStatus = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const OnlineDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
`;

const ChatHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
  display: flex;
  align-items: center;
`;

const ChatUserAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
  border: 3px solid rgba(102, 126, 234, 0.2);
`;

const ChatUserInfo = styled.div`
  flex: 1;
`;

const ChatUserName = styled.h3`
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.2rem;
`;

const ChatUserStatus = styled.div`
  font-size: 0.9rem;
  opacity: 0.7;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  word-wrap: break-word;
  
  &.sent {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 5px;
  }
  
  &.received {
    background: rgba(102, 126, 234, 0.1);
    color: #2d3748;
    align-self: flex-start;
    border-bottom-left-radius: 5px;
  }
`;

const MessageTime = styled.div`
  font-size: 0.7rem;
  opacity: 0.6;
  margin-top: 5px;
`;

const MessageInput = styled.div`
  padding: 20px;
  border-top: 1px solid rgba(102, 126, 234, 0.1);
  display: flex;
  gap: 10px;
`;

const InputField = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 25px;
  outline: none;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #667eea;
    background: white;
  }
`;

const SendButton = styled.button`
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #4a5568;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
`;

const EmptyText = styled.h3`
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const EmptySubtext = styled.p`
  margin: 0;
  opacity: 0.7;
`;

const Messages = () => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    // Socket.IO bağlantısı
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Bağlantı durumu
    newSocket.on('connect', () => {
      console.log('Socket.IO bağlandı');
      setIsConnected(true);
      newSocket.emit('user_login', user._id);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket.IO bağlantısı kesildi');
      setIsConnected(false);
    });

    // Yeni mesaj geldiğinde
    newSocket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // Mesaj gönderildiğinde
    newSocket.on('message_sent', (data) => {
      console.log('Mesaj gönderildi:', data);
    });

    // Mesaj hatası
    newSocket.on('message_error', (error) => {
      console.error('Mesaj hatası:', error);
    });

    return () => {
      newSocket.emit('user_logout', user._id);
      newSocket.disconnect();
    };
  }, [user]);

  // Kullanıcıları yükle
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();
        
        if (data.success) {
          // Kendi kullanıcısını filtrele
          const otherUsers = data.users.filter(u => u._id !== user._id);
          setUsers(otherUsers);
        }
      } catch (error) {
        console.error('Kullanıcılar yüklenirken hata:', error);
      }
    };

    if (user) {
      loadUsers();
    }
  }, [user]);

  // Mesajları yükle
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedUser || !socket) return;

      try {
        // Chat room'a katıl
        socket.emit('join_chat_room', {
          userId1: user._id,
          userId2: selectedUser._id
        });

        // Mesajları API'den yükle
        const response = await fetch(`http://localhost:5000/api/chat-rooms/${user._id}`);
        const data = await response.json();
        
        if (data.success) {
          const room = data.chatRooms.find(r => 
            r.participants.some(p => p._id === selectedUser._id)
          );
          
          if (room) {
            const messagesResponse = await fetch(`http://localhost:5000/api/messages/${room._id}`);
            const messagesData = await messagesResponse.json();
            
            if (messagesData.success) {
              setMessages(messagesData.messages);
            }
          }
        }
      } catch (error) {
        console.error('Mesajlar yüklenirken hata:', error);
      }
    };

    loadMessages();
  }, [selectedUser, socket, user]);

  // Mesajları scroll et
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !socket) return;

    const messageData = {
      senderId: user._id,
      receiverId: selectedUser._id,
      content: newMessage.trim(),
      messageType: 'text'
    };

    try {
      // Socket.IO ile mesaj gönder
      socket.emit('send_message', messageData);
      
      // Local state'i güncelle
      const tempMessage = {
        _id: Date.now().toString(),
        senderId: user._id,
        receiverId: selectedUser._id,
        content: newMessage.trim(),
        timestamp: new Date(),
        isRead: false,
        messageType: 'text'
      };
      
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!user) {
    return (
      <EmptyState>
        <EmptyIcon>🔒</EmptyIcon>
        <EmptyText>Giriş Yapın</EmptyText>
        <EmptySubtext>Mesajlaşmak için giriş yapmanız gerekiyor</EmptySubtext>
      </EmptyState>
    );
  }

  return (
    <ChatContainer>
      <Sidebar>
        <SidebarHeader>
          <SidebarTitle>💬 Mesajlar</SidebarTitle>
        </SidebarHeader>
        
        <UserList>
          {users.map(userItem => (
            <UserItem
              key={userItem._id}
              className={selectedUser?._id === userItem._id ? 'active' : ''}
              onClick={() => setSelectedUser(userItem)}
            >
              <UserAvatar 
                src={userItem.avatar || '/images/default-avatar.png'} 
                alt={userItem.fullName}
                onError={(e) => {
                  e.target.src = '/images/default-avatar.png';
                }}
              />
              <UserInfo>
                <UserName>{userItem.fullName}</UserName>
                <UserStatus>
                  <OnlineDot />
                  Çevrimiçi
                </UserStatus>
              </UserInfo>
            </UserItem>
          ))}
        </UserList>
      </Sidebar>

      <ChatArea>
        {selectedUser ? (
          <>
            <ChatHeader>
              <ChatUserAvatar 
                src={selectedUser.avatar || '/images/default-avatar.png'} 
                alt={selectedUser.fullName}
                onError={(e) => {
                  e.target.src = '/images/default-avatar.png';
                }}
              />
              <ChatUserInfo>
                <ChatUserName>{selectedUser.fullName}</ChatUserName>
                <ChatUserStatus>
                  <OnlineDot />
                  Çevrimiçi
                </ChatUserStatus>
              </ChatUserInfo>
            </ChatHeader>

            <MessagesContainer>
              {messages.map(message => (
                <MessageBubble
                  key={message._id}
                  className={message.senderId === user._id ? 'sent' : 'received'}
                >
                  {message.content}
                  <MessageTime>
                    {formatTime(message.timestamp)}
                  </MessageTime>
                </MessageBubble>
              ))}
              <div ref={messagesEndRef} />
            </MessagesContainer>

            <MessageInput>
              <InputField
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Mesajınızı yazın..."
                disabled={!isConnected}
              />
              <SendButton
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !isConnected}
              >
                Gönder
              </SendButton>
            </MessageInput>
          </>
        ) : (
          <EmptyState>
            <EmptyIcon>💬</EmptyIcon>
            <EmptyText>Mesajlaşmaya Başlayın</EmptyText>
            <EmptySubtext>Sol taraftan bir kullanıcı seçerek mesajlaşmaya başlayabilirsiniz</EmptySubtext>
          </EmptyState>
        )}
      </ChatArea>
    </ChatContainer>
  );
};

export default Messages;