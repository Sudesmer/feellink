import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { mockComments, mockWorks, artistPermissionTypes, mockArtistPermissions } from '../mock-data';
import {
  FiUsers,
  FiImage,
  FiHeart,
  FiEye,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiBarChart,
  FiSettings,
  FiLogOut,
  FiArrowLeft,
  FiMessageSquare,
  FiCheck,
  FiX,
  FiUserCheck,
  FiAward,
  FiShield,
  FiStar,
  FiSun,
  FiMoon
} from 'react-icons/fi';

const AdminContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme === 'dark' ? '#000' : '#f8f9fa'};
  color: ${props => props.theme === 'dark' ? '#fff' : '#333'};
  transition: all 0.3s ease;
`;

const AdminHeader = styled.div`
  background: ${props => props.theme === 'dark' ? '#1a1a1a' : '#fff'};
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#333' : '#e0e0e0'};
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const AdminTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #FF6B35, #F7931E);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
`;

const BackButton = styled.button`
  background: linear-gradient(135deg, #FF6B35, #F7931E);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
  }
`;

const ThemeToggleButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme === 'dark' ? '#fff' : '#333'};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme === 'dark' ? '#333' : '#f0f0f0'};
    color: #FF6B35;
  }
`;

const AdminContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme === 'dark' ? '#1a1a1a' : '#fff'};
  border: 1px solid ${props => props.theme === 'dark' ? '#333' : '#e0e0e0'};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B35, #F7931E);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  font-size: 1.5rem;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme === 'dark' ? '#fff' : '#333'};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${props => props.theme === 'dark' ? '#ccc' : '#666'};
  font-size: 0.9rem;
`;

const AdminTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#333' : '#e0e0e0'};
`;

const TabButton = styled.button`
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.active ? '#FF6B35' : (props.theme === 'dark' ? '#ccc' : '#666')};
  border-bottom: 2px solid ${props => props.active ? '#FF6B35' : 'transparent'};
  transition: all 0.3s ease;

  &:hover {
    color: #FF6B35;
  }
`;

const TabContent = styled.div`
  background: ${props => props.theme === 'dark' ? '#1a1a1a' : '#fff'};
  border: 1px solid ${props => props.theme === 'dark' ? '#333' : '#e0e0e0'};
  border-radius: 12px;
  padding: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#333' : '#e0e0e0'};
  font-weight: 600;
  color: ${props => props.theme === 'dark' ? '#fff' : '#333'};
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#333' : '#e0e0e0'};
  color: ${props => props.theme === 'dark' ? '#ccc' : '#666'};
`;

const ActionButton = styled.button`
  background: ${props => props.variant === 'danger' ? '#dc3545' : '#FF6B35'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-right: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
    transform: translateY(-1px);
  }
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #FF6B35, #F7931E);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
  }
`;

// Yorum yönetimi için styled components
const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const CommentCard = styled.div`
  background: ${props => props.theme === 'dark' ? '#1a1a1a' : '#fff'};
  border: 1px solid ${props => props.theme === 'dark' ? '#333' : '#e0e0e0'};
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.2s ease;
  border-left: 4px solid ${props => props.isApproved ? '#4CAF50' : '#FF9800'};

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const CommentUser = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CommentAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B35, #F7931E);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.8rem;
`;

const CommentInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const CommentUsername = styled.span`
  font-weight: 600;
  color: ${props => props.theme === 'dark' ? '#fff' : '#333'};
  font-size: 0.9rem;
`;

const CommentTime = styled.span`
  color: ${props => props.theme === 'dark' ? '#888' : '#666'};
  font-size: 0.8rem;
`;

const CommentStatus = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.isApproved ? '#E8F5E8' : '#FFF3E0'};
  color: ${props => props.isApproved ? '#2E7D32' : '#F57C00'};
`;

const CommentContent = styled.p`
  color: ${props => props.theme === 'dark' ? '#ccc' : '#555'};
  line-height: 1.5;
  margin: 0.5rem 0;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const CommentActionButton = styled.button`
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  transition: all 0.2s ease;

  &.approve {
    background: #E8F5E8;
    color: #2E7D32;
    
    &:hover {
      background: #C8E6C9;
    }
  }

  &.reject {
    background: #FFEBEE;
    color: #C62828;
    
    &:hover {
      background: #FFCDD2;
    }
  }

  &.delete {
    background: #F3E5F5;
    color: #7B1FA2;
    
    &:hover {
      background: #E1BEE7;
    }
  }
`;

const CommentStats = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: ${props => props.theme === 'dark' ? '#888' : '#666'};
`;

const CommentWorkInfo = styled.div`
  background: ${props => props.theme === 'dark' ? '#2a2a2a' : '#f8f9fa'};
  padding: 0.5rem;
  border-radius: 6px;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: ${props => props.theme === 'dark' ? '#aaa' : '#666'};
`;

// Sanatçı Yetki Yönetimi Styled Components
const ArtistPermissionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ArtistPermissionCard = styled.div`
  background: ${props => props.theme === 'dark' ? '#1a1a1a' : '#fff'};
  border: 1px solid ${props => props.theme === 'dark' ? '#333' : '#e0e0e0'};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const ArtistHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ArtistAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.theme === 'dark' ? '#333' : '#f0f0f0'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => props.theme === 'dark' ? '#fff' : '#333'};
  flex-shrink: 0;
`;

const ArtistAvatarImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const ArtistInfo = styled.div`
  flex: 1;
`;

const ArtistName = styled.h3`
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  color: ${props => props.theme === 'dark' ? '#fff' : '#333'};
`;

const ArtistUsername = styled.p`
  margin: 0 0 0.25rem 0;
  color: ${props => props.theme === 'dark' ? '#888' : '#666'};
  font-size: 0.9rem;
`;

const ArtistEmail = styled.p`
  margin: 0;
  color: ${props => props.theme === 'dark' ? '#666' : '#999'};
  font-size: 0.8rem;
`;

const ArtistStatus = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => {
    if (props.status === 'active') return '#4CAF50';
    if (props.status === 'pending') return '#FF9800';
    return '#f44336';
  }};
  color: white;
`;

const PermissionsSection = styled.div`
  margin-top: 1rem;
`;

const PermissionsTitle = styled.h4`
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  color: ${props => props.theme === 'dark' ? '#fff' : '#333'};
`;

const PermissionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const PermissionBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: ${props => props.color || '#e0e0e0'};
  color: white;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const PermissionActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const PermissionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.grant {
    background: #4CAF50;
    color: white;
    
    &:hover {
      background: #45a049;
    }
  }
  
  &.revoke {
    background: #f44336;
    color: white;
    
    &:hover {
      background: #da190b;
    }
  }
  
  &.edit {
    background: #2196F3;
    color: white;
    
    &:hover {
      background: #1976D2;
    }
  }
`;

const ArtistNotes = styled.div`
  background: ${props => props.theme === 'dark' ? '#2a2a2a' : '#f8f9fa'};
  padding: 0.75rem;
  border-radius: 6px;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: ${props => props.theme === 'dark' ? '#aaa' : '#666'};
  font-style: italic;
`;

const AddPermissionModal = styled.div`
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

const ModalContent = styled.div`
  background: ${props => props.theme === 'dark' ? '#1a1a1a' : '#fff'};
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  margin: 0 0 1.5rem 0;
  color: ${props => props.theme === 'dark' ? '#fff' : '#333'};
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${props => props.theme === 'dark' ? '#fff' : '#333'};
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme === 'dark' ? '#333' : '#ddd'};
  border-radius: 6px;
  background: ${props => props.theme === 'dark' ? '#2a2a2a' : '#fff'};
  color: ${props => props.theme === 'dark' ? '#fff' : '#333'};
  font-size: 0.9rem;
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme === 'dark' ? '#333' : '#ddd'};
  border-radius: 6px;
  background: ${props => props.theme === 'dark' ? '#2a2a2a' : '#fff'};
  color: ${props => props.theme === 'dark' ? '#fff' : '#333'};
  font-size: 0.9rem;
  min-height: 80px;
  resize: vertical;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: ${props => props.theme === 'dark' ? '#fff' : '#333'};
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const ModalButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background: #4CAF50;
    color: white;
    
    &:hover {
      background: #45a049;
    }
  }
  
  &.secondary {
    background: #f44336;
    color: white;
    
    &:hover {
      background: #da190b;
    }
  }
`;

const Admin = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWorks: 0,
    totalLikes: 0,
    totalViews: 0
  });
  const [comments, setComments] = useState([]);
  const [works, setWorks] = useState([]);
  const [artistPermissions, setArtistPermissions] = useState([]);
  const [showAddPermissionModal, setShowAddPermissionModal] = useState(false);
  const [editingArtist, setEditingArtist] = useState(null);

  // Admin authentication kontrolü
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    const adminUser = localStorage.getItem('adminUser');
    
    if (adminAuth === 'true' && adminUser) {
      setIsAdminAuthenticated(true);
    } else {
      // Admin girişi yapılmamış, login sayfasına yönlendir
      navigate('/admin-login');
    }
  }, [navigate]);


  // Yorum yönetimi fonksiyonları
  const handleApproveComment = async (commentId) => {
    try {
      const response = await fetch(`/api/admin/comments/${commentId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setComments(prev => prev.map(comment => 
          comment._id === commentId 
            ? { ...comment, isApproved: true }
            : comment
        ));
        alert('Yorum onaylandı!');
      } else {
        alert('Yorum onaylanırken hata oluştu.');
      }
    } catch (error) {
      console.error('Yorum onaylama hatası:', error);
      alert('Yorum onaylanırken hata oluştu.');
    }
  };

  const handleRejectComment = async (commentId) => {
    try {
      const response = await fetch(`/api/admin/comments/${commentId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setComments(prev => prev.map(comment => 
          comment._id === commentId 
            ? { ...comment, isApproved: false }
            : comment
        ));
        alert('Yorum reddedildi!');
      } else {
        alert('Yorum reddedilirken hata oluştu.');
      }
    } catch (error) {
      console.error('Yorum reddetme hatası:', error);
      alert('Yorum reddedilirken hata oluştu.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setComments(prev => prev.filter(comment => comment._id !== commentId));
        alert('Yorum silindi!');
      } else {
        alert('Yorum silinirken hata oluştu.');
      }
    } catch (error) {
      console.error('Yorum silme hatası:', error);
      alert('Yorum silinirken hata oluştu.');
    }
  };

  // Zaman formatı fonksiyonu
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - new Date(date)) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Az önce';
    if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} gün önce`;
  };

  // Eser bilgisi getirme fonksiyonu
  const getWorkInfo = (workId) => {
    return works && works.length > 0 ? works.find(work => work._id === workId) : null;
  };

  // Admin kontrolü - localStorage'dan admin auth kontrolü
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // API'den yorumları yükleme fonksiyonu
  const loadCommentsFromAPI = async () => {
    try {
      const response = await fetch('/api/admin/comments');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setComments(result.data);
        } else {
          setComments([]);
        }
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error('Yorumlar yüklenirken hata:', error);
      setComments([]);
    }
  };

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    const adminUser = localStorage.getItem('adminUser');
    
    if (adminAuth === 'true' && adminUser) {
      setIsAdminAuthenticated(true);
    } else {
      navigate('/admin-login');
      return;
    }

    // Mock istatistikler
    setStats({
      totalUsers: 1247,
      totalWorks: 3421,
      totalLikes: 15678,
      totalViews: 89432
    });

    // Mock yorum, eser ve sanatçı yetki verilerini yükle
    setComments(mockComments);
    setWorks(mockWorks);
    setArtistPermissions(mockArtistPermissions);
    
    // API'den yorumları yükle
    loadCommentsFromAPI();
  }, [navigate]);

  if (!isAdminAuthenticated) {
    return null;
  }

  const handleAdminLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    navigate('/admin-login');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Sanatçı yetki yönetimi fonksiyonları
  const handleGrantPermission = (artistId, permissionId) => {
    setArtistPermissions(prev => prev.map(artist => 
      artist._id === artistId 
        ? { 
            ...artist, 
            permissions: [...artist.permissions, permissionId],
            status: 'active'
          }
        : artist
    ));
  };

  const handleRevokePermission = (artistId, permissionId) => {
    setArtistPermissions(prev => prev.map(artist => 
      artist._id === artistId 
        ? { 
            ...artist, 
            permissions: artist.permissions.filter(p => p !== permissionId)
          }
        : artist
    ));
  };

  const handleAddNewArtist = (artistData) => {
    const newArtist = {
      _id: Date.now().toString(),
      ...artistData,
      grantedBy: user?.username || 'admin',
      grantedAt: new Date(),
      status: 'active'
    };
    setArtistPermissions(prev => [...prev, newArtist]);
    setShowAddPermissionModal(false);
  };

  const getPermissionInfo = (permissionId) => {
    return artistPermissionTypes.find(p => p.id === permissionId);
  };

  return (
    <AdminContainer theme={theme}>
      <AdminHeader theme={theme}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <BackButton onClick={handleBackToHome}>
            <FiArrowLeft />
            Ana Sayfaya Dön
          </BackButton>
          <AdminTitle>Admin Paneli</AdminTitle>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ThemeToggleButton theme={theme} onClick={toggleTheme}>
            {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </ThemeToggleButton>
          <span>Hoş geldiniz, {user?.username || user?.email}</span>
          <ActionButton onClick={handleAdminLogout}>
            <FiLogOut />
            Admin Çıkışı
          </ActionButton>
        </div>
      </AdminHeader>

      <AdminContent>
        <StatsGrid>
          <StatCard theme={theme}>
            <StatIcon>
              <FiUsers />
            </StatIcon>
            <StatNumber theme={theme}>{stats.totalUsers.toLocaleString()}</StatNumber>
            <StatLabel theme={theme}>Toplam Kullanıcı</StatLabel>
          </StatCard>

          <StatCard theme={theme}>
            <StatIcon>
              <FiImage />
            </StatIcon>
            <StatNumber theme={theme}>{stats.totalWorks.toLocaleString()}</StatNumber>
            <StatLabel theme={theme}>Toplam Eser</StatLabel>
          </StatCard>

          <StatCard theme={theme}>
            <StatIcon>
              <FiHeart />
            </StatIcon>
            <StatNumber theme={theme}>{stats.totalLikes.toLocaleString()}</StatNumber>
            <StatLabel theme={theme}>Toplam Beğeni</StatLabel>
          </StatCard>

          <StatCard theme={theme}>
            <StatIcon>
              <FiEye />
            </StatIcon>
            <StatNumber theme={theme}>{stats.totalViews.toLocaleString()}</StatNumber>
            <StatLabel theme={theme}>Toplam Görüntülenme</StatLabel>
          </StatCard>
        </StatsGrid>

        <AdminTabs theme={theme}>
          <TabButton 
            active={activeTab === 'stats'} 
            onClick={() => setActiveTab('stats')}
            theme={theme}
          >
            <FiBarChart style={{ marginRight: '0.5rem' }} />
            İstatistikler
          </TabButton>
          <TabButton 
            active={activeTab === 'works'} 
            onClick={() => setActiveTab('works')}
            theme={theme}
          >
            <FiImage style={{ marginRight: '0.5rem' }} />
            Eser Yönetimi
          </TabButton>
          <TabButton 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')}
            theme={theme}
          >
            <FiUsers style={{ marginRight: '0.5rem' }} />
            Kullanıcı Yönetimi
          </TabButton>
          <TabButton 
            active={activeTab === 'comments'} 
            onClick={() => setActiveTab('comments')}
            theme={theme}
          >
            <FiMessageSquare style={{ marginRight: '0.5rem' }} />
            Yorumlar ({comments && comments.filter ? comments.filter(c => !c.isApproved).length : 0})
          </TabButton>
          <TabButton 
            active={activeTab === 'artist-permissions'} 
            onClick={() => setActiveTab('artist-permissions')}
            theme={theme}
          >
            <FiUserCheck style={{ marginRight: '0.5rem' }} />
            Sanatçı Yetkileri ({artistPermissions && artistPermissions.length ? artistPermissions.length : 0})
          </TabButton>
          <TabButton 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')}
            theme={theme}
          >
            <FiSettings style={{ marginRight: '0.5rem' }} />
            Ayarlar
          </TabButton>
        </AdminTabs>

        <TabContent theme={theme}>
          {activeTab === 'stats' && (
            <div>
              <h3>Platform İstatistikleri</h3>
              <p>Detaylı istatistikler burada görüntülenecek...</p>
            </div>
          )}

          {activeTab === 'works' && (
            <div>
              <AddButton>
                <FiPlus />
                Yeni Eser Ekle
              </AddButton>
              <Table>
                <thead>
                  <tr>
                    <TableHeader theme={theme}>Eser</TableHeader>
                    <TableHeader theme={theme}>Sanatçı</TableHeader>
                    <TableHeader theme={theme}>Beğeni</TableHeader>
                    <TableHeader theme={theme}>Görüntülenme</TableHeader>
                    <TableHeader theme={theme}>İşlemler</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <TableCell theme={theme}>Dijital Rüyalar</TableCell>
                    <TableCell theme={theme}>Zeynep Esmer</TableCell>
                    <TableCell theme={theme}>156</TableCell>
                    <TableCell theme={theme}>1,234</TableCell>
                    <TableCell>
                      <ActionButton>
                        <FiEdit />
                      </ActionButton>
                      <ActionButton variant="danger">
                        <FiTrash2 />
                      </ActionButton>
                    </TableCell>
                  </tr>
                </tbody>
              </Table>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <Table>
                <thead>
                  <tr>
                    <TableHeader theme={theme}>Kullanıcı</TableHeader>
                    <TableHeader theme={theme}>Email</TableHeader>
                    <TableHeader theme={theme}>Kayıt Tarihi</TableHeader>
                    <TableHeader theme={theme}>Eser Sayısı</TableHeader>
                    <TableHeader theme={theme}>İşlemler</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <TableCell theme={theme}>Zeynep Esmer</TableCell>
                    <TableCell theme={theme}>zeynep@example.com</TableCell>
                    <TableCell theme={theme}>2024-01-15</TableCell>
                    <TableCell theme={theme}>12</TableCell>
                    <TableCell>
                      <ActionButton>
                        <FiEdit />
                      </ActionButton>
                      <ActionButton variant="danger">
                        <FiTrash2 />
                      </ActionButton>
                    </TableCell>
                  </tr>
                </tbody>
              </Table>
            </div>
          )}

          {activeTab === 'comments' && (
            <div>
              <h3>Yorum Yönetimi</h3>
              <p>Platformdaki tüm yorumları buradan yönetebilirsiniz.</p>
              
              <CommentsList>
                {comments && Array.isArray(comments) && comments.length > 0 ? comments
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map(comment => {
                    const workInfo = getWorkInfo(comment.workId);
                    return (
                      <CommentCard key={comment._id} theme={theme} isApproved={comment.isApproved}>
                        <CommentHeader>
                          <CommentUser>
                            <CommentAvatar>
                              {comment.username.charAt(0).toUpperCase()}
                            </CommentAvatar>
                            <CommentInfo>
                              <CommentUsername theme={theme}>{comment.username}</CommentUsername>
                              <CommentTime theme={theme}>{formatTimeAgo(comment.createdAt)}</CommentTime>
                            </CommentInfo>
                          </CommentUser>
                          <CommentStatus isApproved={comment.isApproved}>
                            {comment.isApproved ? 'Onaylandı' : 'Beklemede'}
                          </CommentStatus>
                        </CommentHeader>
                        
                        <CommentContent theme={theme}>{comment.content}</CommentContent>
                        
                        {workInfo && (
                          <CommentWorkInfo theme={theme}>
                            <strong>Eser:</strong> {workInfo.title} - {workInfo.author?.username || workInfo.author?.fullName || workInfo.author || 'Bilinmeyen Sanatçı'}
                          </CommentWorkInfo>
                        )}
                        
                        <CommentStats theme={theme}>
                          <span>❤️ {comment.likes} beğeni</span>
                        </CommentStats>
                        
                        <CommentActions>
                          {!comment.isApproved && (
                            <CommentActionButton 
                              className="approve"
                              onClick={() => handleApproveComment(comment._id)}
                            >
                              <FiCheck size={12} />
                              Onayla
                            </CommentActionButton>
                          )}
                          {comment.isApproved && (
                            <CommentActionButton 
                              className="reject"
                              onClick={() => handleRejectComment(comment._id)}
                            >
                              <FiX size={12} />
                              Reddet
                            </CommentActionButton>
                          )}
                          <CommentActionButton 
                            className="delete"
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            <FiTrash2 size={12} />
                            Sil
                          </CommentActionButton>
                        </CommentActions>
                      </CommentCard>
                    );
                  }) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: theme === 'dark' ? '#888' : '#666' }}>
                      Henüz yorum bulunmuyor.
                    </div>
                  )}
              </CommentsList>
            </div>
          )}
          {activeTab === 'artist-permissions' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <h3>Sanatçı Yetki Yönetimi</h3>
                  <p>Platformdaki sanatçılara yetki verme ve yönetme sistemi</p>
                </div>
                <ActionButton onClick={() => setShowAddPermissionModal(true)}>
                  <FiPlus style={{ marginRight: '0.5rem' }} />
                  Yeni Sanatçı Ekle
                </ActionButton>
              </div>
              
              <ArtistPermissionsList>
                {artistPermissions.map(artist => (
                  <ArtistPermissionCard key={artist._id} theme={theme}>
                    <ArtistHeader>
                      {artist.avatar ? (
                        <ArtistAvatarImg src={artist.avatar} alt={artist.fullName} />
                      ) : (
                        <ArtistAvatar theme={theme}>
                          {artist.fullName.charAt(0).toUpperCase()}
                        </ArtistAvatar>
                      )}
                      <ArtistInfo>
                        <ArtistName theme={theme}>{artist.fullName}</ArtistName>
                        <ArtistUsername theme={theme}>@{artist.username}</ArtistUsername>
                        <ArtistEmail theme={theme}>{artist.email}</ArtistEmail>
                      </ArtistInfo>
                      <ArtistStatus status={artist.status}>
                        {artist.status === 'active' ? 'Aktif' : 
                         artist.status === 'pending' ? 'Beklemede' : 'Pasif'}
                      </ArtistStatus>
                    </ArtistHeader>
                    
                    <PermissionsSection>
                      <PermissionsTitle theme={theme}>Mevcut Yetkiler</PermissionsTitle>
                      <PermissionsList>
                        {artist.permissions.map(permissionId => {
                          const permission = getPermissionInfo(permissionId);
                          return permission ? (
                            <PermissionBadge key={permissionId} color={permission.color}>
                              <span>{permission.icon}</span>
                              <span>{permission.name}</span>
                            </PermissionBadge>
                          ) : null;
                        })}
                        {artist.permissions && artist.permissions.length === 0 && (
                          <p style={{ color: theme === 'dark' ? '#888' : '#666', fontStyle: 'italic' }}>
                            Henüz yetki verilmemiş
                          </p>
                        )}
                      </PermissionsList>
                      
                      <PermissionsTitle theme={theme}>Yetki İşlemleri</PermissionsTitle>
                      <PermissionsList>
                        {artistPermissionTypes.map(permission => (
                          <PermissionBadge 
                            key={permission.id} 
                            color={artist.permissions.includes(permission.id) ? permission.color : '#e0e0e0'}
                            style={{ 
                              opacity: artist.permissions.includes(permission.id) ? 1 : 0.6,
                              cursor: 'pointer'
                            }}
                            onClick={() => {
                              if (artist.permissions.includes(permission.id)) {
                                handleRevokePermission(artist._id, permission.id);
                              } else {
                                handleGrantPermission(artist._id, permission.id);
                              }
                            }}
                          >
                            <span>{permission.icon}</span>
                            <span>{permission.name}</span>
                            <span style={{ fontSize: '0.7rem' }}>
                              {artist.permissions.includes(permission.id) ? '✓' : '+'}
                            </span>
                          </PermissionBadge>
                        ))}
                      </PermissionsList>
                    </PermissionsSection>
                    
                    {artist.notes && (
                      <ArtistNotes theme={theme}>
                        <strong>Notlar:</strong> {artist.notes}
                      </ArtistNotes>
                    )}
                    
                    <div style={{ 
                      marginTop: '1rem', 
                      padding: '0.5rem', 
                      background: theme === 'dark' ? '#2a2a2a' : '#f8f9fa',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      color: theme === 'dark' ? '#888' : '#666'
                    }}>
                      Yetki veren: {artist.grantedBy} • {formatTimeAgo(artist.grantedAt)}
                    </div>
                  </ArtistPermissionCard>
                ))}
              </ArtistPermissionsList>
            </div>
          )}
          {activeTab === 'settings' && (
            <div>
              <h3>Platform Ayarları</h3>
              <p>Genel ayarlar burada yapılacak...</p>
            </div>
          )}
        </TabContent>
      </AdminContent>

      {/* Yeni Sanatçı Ekleme Modal */}
      {showAddPermissionModal && (
        <AddPermissionModal>
          <ModalContent theme={theme}>
            <ModalTitle theme={theme}>Yeni Sanatçı Yetkisi Ekle</ModalTitle>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const artistData = {
                userId: formData.get('userId'),
                username: formData.get('username'),
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                avatar: formData.get('avatar'),
                permissions: Array.from(e.target.querySelectorAll('input[name="permissions"]:checked')).map(cb => cb.value),
                notes: formData.get('notes')
              };
              handleAddNewArtist(artistData);
            }}>
              <FormGroup>
                <FormLabel theme={theme}>Kullanıcı ID</FormLabel>
                <FormInput 
                  type="text" 
                  name="userId" 
                  required 
                  placeholder="Kullanıcı ID'si"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel theme={theme}>Kullanıcı Adı</FormLabel>
                <FormInput 
                  type="text" 
                  name="username" 
                  required 
                  placeholder="Kullanıcı adı"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel theme={theme}>Tam Ad</FormLabel>
                <FormInput 
                  type="text" 
                  name="fullName" 
                  required 
                  placeholder="Tam ad"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel theme={theme}>Email</FormLabel>
                <FormInput 
                  type="email" 
                  name="email" 
                  required 
                  placeholder="Email adresi"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel theme={theme}>Avatar URL (Opsiyonel)</FormLabel>
                <FormInput 
                  type="url" 
                  name="avatar" 
                  placeholder="Avatar resmi URL'si"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel theme={theme}>Yetkiler</FormLabel>
                <CheckboxGroup>
                  {artistPermissionTypes.map(permission => (
                    <CheckboxItem key={permission.id} theme={theme}>
                      <input 
                        type="checkbox" 
                        name="permissions" 
                        value={permission.id}
                        id={`permission-${permission.id}`}
                      />
                      <span style={{ color: permission.color, marginRight: '0.5rem' }}>
                        {permission.icon}
                      </span>
                      <div>
                        <div style={{ fontWeight: '500' }}>{permission.name}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                          {permission.description}
                        </div>
                      </div>
                    </CheckboxItem>
                  ))}
                </CheckboxGroup>
              </FormGroup>
              
              <FormGroup>
                <FormLabel theme={theme}>Notlar (Opsiyonel)</FormLabel>
                <FormTextarea 
                  name="notes" 
                  placeholder="Sanatçı hakkında notlar..."
                />
              </FormGroup>
              
              <ModalActions>
                <ModalButton 
                  type="button" 
                  className="secondary"
                  onClick={() => setShowAddPermissionModal(false)}
                >
                  İptal
                </ModalButton>
                <ModalButton type="submit" className="primary">
                  Sanatçı Ekle
                </ModalButton>
              </ModalActions>
            </form>
          </ModalContent>
        </AddPermissionModal>
      )}
    </AdminContainer>
  );
};

export default Admin;
