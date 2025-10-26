import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { 
  FiUsers, 
  FiBarChart, 
  FiSettings, 
  FiShield, 
  FiActivity,
  FiTrendingUp,
  FiEye,
  FiEdit3,
  FiTrash2,
  FiLogOut,
  FiBell,
  FiHeart,
  FiMessageCircle,
  FiImage,
  FiDatabase,
  FiFileText,
  FiUserCheck,
  FiFilter,
  FiDownload,
  FiUserPlus,
  FiLogIn
} from 'react-icons/fi';

// Animasyonlar
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 165, 0, 0.3); }
  50% { box-shadow: 0 0 40px rgba(255, 165, 0, 0.6); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// Ana Container
const AdminContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-x: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(255, 165, 0, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 99, 132, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(54, 162, 235, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

// Header
const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(15, 15, 35, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  h1 {
    font-size: 1.8rem;
    font-weight: 700;
    background: linear-gradient(135deg, #ffa500, #ff6b6b, #4ecdc4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NotificationButton = styled.button`
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 12px;
  padding: 0.75rem;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const LogoutButton = styled.button`
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(255, 107, 107, 0.3);
  }
`;

// Sidebar
const Sidebar = styled.aside`
  position: fixed;
  left: 0;
  top: 80px;
  width: 280px;
  height: calc(100vh - 80px);
  background: rgba(15, 15, 35, 0.9);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem 0;
  animation: ${slideIn} 0.6s ease-out;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 165, 0, 0.5);
    border-radius: 3px;
  }
`;

const SidebarSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 1rem 2rem;
`;

const SidebarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: rgba(255, 165, 0, 0.1);
    color: #ffa500;
    transform: translateX(5px);
  }
  
  &.active {
    background: linear-gradient(135deg, rgba(255, 165, 0, 0.2), rgba(255, 107, 107, 0.2));
    color: #ffa500;
    border-right: 3px solid #ffa500;
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

// Main Content
const MainContent = styled.main`
  margin-left: 280px;
  margin-top: 80px;
  padding: 2rem;
  min-height: calc(100vh - 80px);
`;

// Dashboard Grid
const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

// Stats Cards
const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.gradient || 'linear-gradient(135deg, #ffa500, #ff6b6b)'};
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 15px;
  background: ${props => props.gradient || 'linear-gradient(135deg, #ffa500, #ff6b6b)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
`;

const StatChange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: ${props => props.positive ? '#4ecdc4' : '#ff6b6b'};
  font-weight: 600;
`;

// Charts Container
const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

// Users Table
const UsersTable = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const TableTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const TableControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SearchInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  color: #ffffff;
  font-size: 0.9rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #ffa500;
    box-shadow: 0 0 0 3px rgba(255, 165, 0, 0.1);
  }
`;

const FilterButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: rgba(255, 255, 255, 0.05);
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 165, 0, 0.05);
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffa500, #ff6b6b);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
`;

const ActionButton = styled.button`
  background: ${props => props.variant === 'danger' ? 'linear-gradient(135deg, #ff6b6b, #ff8e8e)' : 'rgba(255, 255, 255, 0.1)'};
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 0.25rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => {
    switch(props.status) {
      case 'active': return 'linear-gradient(135deg, #4ecdc4, #44a08d)';
      case 'inactive': return 'linear-gradient(135deg, #ff6b6b, #ff8e8e)';
      case 'pending': return 'linear-gradient(135deg, #ffa500, #ffb84d)';
      case 'verified': return 'linear-gradient(135deg, #4caf50, #66bb6a)';
      case 'unverified': return 'linear-gradient(135deg, #ff9800, #ffb74d)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: white;
`;

// Loading Spinner
const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255, 165, 0, 0.3);
    border-top: 3px solid #ffa500;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Empty State
const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: rgba(255, 255, 255, 0.6);
  
  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

// Real-time Chart Components
const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  overflow: hidden;
`;

const ChartCanvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

const ChartLegend = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 15px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
`;

const ActivityFeed = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  height: 300px;
  overflow-y: auto;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  margin-bottom: 4px;
`;

const ActivityTime = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
`;

const SystemStatus = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
`;

const StatusItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
`;

const StatusIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  margin: 0 auto 15px;
`;

const StatusLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-bottom: 8px;
`;

const StatusValue = styled.div`
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
`;

const LiveIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4caf50;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [activities, setActivities] = useState([]);
  const [chartData, setChartData] = useState({
    users: [],
    posts: [],
    likes: [],
    comments: []
  });
  const chartRef = useRef(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    totalFollows: 0,
    totalNotifications: 0,
    systemHealth: 98
  });

  useEffect(() => {
    console.log('AdminPanel useEffect - user:', user);
    console.log('AdminPanel useEffect - user email:', user?.email);
    
    // Admin authentication check - hem AuthContext'ten hem de localStorage'dan kontrol et
    const adminAuth = localStorage.getItem('adminAuth');
    const adminUserData = localStorage.getItem('adminUserData');
    
    console.log('Admin auth from localStorage:', adminAuth);
    console.log('Admin user data from localStorage:', adminUserData);
    
    if (!user || user.email !== 'admin@feellink.com') {
      // AuthContext'ten admin değilse, localStorage'dan kontrol et
      if (adminAuth === 'true' && adminUserData) {
        try {
          const adminData = JSON.parse(adminUserData);
          console.log('Admin data from localStorage:', adminData);
          if (adminData.email === 'admin@feellink.com') {
            console.log('Admin authentication successful from localStorage');
            // Admin panel'e devam et
          } else {
            console.log('Admin authentication failed, redirecting to login');
            navigate('/admin-login');
            return;
          }
        } catch (error) {
          console.log('Error parsing admin data, redirecting to login');
          navigate('/admin-login');
          return;
        }
      } else {
        console.log('Admin authentication failed, redirecting to login');
        navigate('/admin-login');
        return;
      }
    } else {
      console.log('Admin authentication successful from AuthContext');
    }
    
    console.log('🚀 Admin paneli başlatılıyor...');
    fetchUsers();
    fetchStats();
    
    // Socket.IO bağlantısını kur
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    
    // Real-time event listener'ları ekle
    newSocket.on('user_registered', (userData) => {
      console.log('🆕 Yeni kullanıcı kaydı:', userData);
      
      // Kullanıcı listesini yenile
      fetchUsers();
      
      // Aktivite feed'ine ekle
      setActivities(prev => [{
        id: Date.now(),
        type: 'user_registered',
        message: `${userData.fullName} kayıt oldu`,
        timestamp: new Date(),
        icon: 'FiUserPlus',
        gradient: 'linear-gradient(135deg, #667eea, #764ba2)'
      }, ...prev.slice(0, 19)]);
    });
    
    newSocket.on('user_login', (userData) => {
      console.log('🔑 Kullanıcı girişi:', userData);
      
      // Aktivite feed'ine ekle
      setActivities(prev => [{
        id: Date.now(),
        type: 'user_login',
        message: `${userData.fullName} giriş yaptı`,
        timestamp: new Date(),
        icon: 'FiLogIn',
        gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)'
      }, ...prev.slice(0, 19)]);
    });
    
    newSocket.on('user_logout', (userData) => {
      console.log('🚪 Kullanıcı çıkışı:', userData);
      
      // Aktivite feed'ine ekle
      setActivities(prev => [{
        id: Date.now(),
        type: 'user_logout',
        message: `${userData.fullName} çıkış yaptı`,
        timestamp: new Date(),
        icon: 'FiLogOut',
        gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24)'
      }, ...prev.slice(0, 19)]);
    });
    
    newSocket.on('work_created', (workData) => {
      console.log('🎨 Yeni eser oluşturuldu:', workData);
      setStats(prev => ({
        ...prev,
        totalPosts: prev.totalPosts + 1
      }));
      
      // Aktivite feed'ine ekle
      setActivities(prev => [{
        id: Date.now(),
        type: 'work_created',
        message: `${workData.author} yeni eser oluşturdu: "${workData.title}"`,
        timestamp: new Date(),
        icon: 'FiImage',
        gradient: 'linear-gradient(135deg, #fa709a, #fee140)'
      }, ...prev.slice(0, 19)]);
    });
    
    newSocket.on('work_liked', (likeData) => {
      console.log('❤️ Eser beğenildi:', likeData);
      setStats(prev => ({
        ...prev,
        totalLikes: prev.totalLikes + 1
      }));
      
      // Aktivite feed'ine ekle
      setActivities(prev => [{
        id: Date.now(),
        type: 'work_liked',
        message: `"${likeData.workTitle}" eseri beğenildi`,
        timestamp: new Date(),
        icon: 'FiHeart',
        gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24)'
      }, ...prev.slice(0, 19)]);
    });
    
    newSocket.on('comment_added', (commentData) => {
      console.log('💬 Yeni yorum:', commentData);
      setStats(prev => ({
        ...prev,
        totalComments: prev.totalComments + 1
      }));
      
      // Aktivite feed'ine ekle
      setActivities(prev => [{
        id: Date.now(),
        type: 'comment_added',
        message: `${commentData.userName} yorum yaptı: "${commentData.content.substring(0, 30)}..."`,
        timestamp: new Date(),
        icon: 'FiMessageCircle',
        gradient: 'linear-gradient(135deg, #a8edea, #fed6e3)'
      }, ...prev.slice(0, 19)]);
    });
    
    newSocket.on('follow_request', (followData) => {
      console.log('👥 Takip isteği:', followData);
      setStats(prev => ({
        ...prev,
        totalFollows: prev.totalFollows + 1
      }));
      
      // Aktivite feed'ine ekle
      setActivities(prev => [{
        id: Date.now(),
        type: 'follow_request',
        message: `${followData.followerName} -> ${followData.followingName} takip isteği`,
        timestamp: new Date(),
        icon: 'FiUsers',
        gradient: 'linear-gradient(135deg, #667eea, #764ba2)'
      }, ...prev.slice(0, 19)]);
    });
    
    newSocket.on('notification_created', (notificationData) => {
      console.log('🔔 Yeni bildirim:', notificationData);
      setStats(prev => ({
        ...prev,
        totalNotifications: prev.totalNotifications + 1
      }));
      
      // Aktivite feed'ine ekle
      setActivities(prev => [{
        id: Date.now(),
        type: 'notification_created',
        message: `Yeni bildirim: ${notificationData.type}`,
        timestamp: new Date(),
        icon: 'FiBell',
        gradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)'
      }, ...prev.slice(0, 19)]);
    });

    // Kullanıcı tanıma event'leri
    newSocket.on('user_recognized', (userData) => {
      console.log('🔍 Kullanıcı tanındı:', userData);
      setActivities(prev => [{
        id: Date.now(),
        type: 'user_recognized',
        message: `${userData.fullName} tanındı (${userData.source})`,
        timestamp: new Date(),
        icon: 'FiUserCheck',
        gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)'
      }, ...prev.slice(0, 19)]);
    });

    newSocket.on('bulk_users_processed', (bulkData) => {
      console.log('📋 Toplu kullanıcı işlemi:', bulkData);
      setActivities(prev => [{
        id: Date.now(),
        type: 'bulk_users_processed',
        message: `${bulkData.totalUsers} kullanıcı işlendi (${bulkData.newUsers} yeni, ${bulkData.existingUsers} mevcut)`,
        timestamp: new Date(),
        icon: 'FiUsers',
        gradient: 'linear-gradient(135deg, #667eea, #764ba2)'
      }, ...prev.slice(0, 19)]);
      
      // Kullanıcı listesini yenile
      fetchUsers();
    });
    
    // Cleanup function
    return () => {
      newSocket.disconnect();
    };
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      console.log('🔍 Admin paneli fetchUsers başlatılıyor...');
      setLoading(true);
      const response = await axios.get('/api/admin/users');
      console.log('📡 Admin API response:', response.data);
      const apiUsers = response.data.users || [];
      console.log('👥 Admin API kullanıcıları:', apiUsers.length);
      
      // isActive field'ını kontrol et ve ekle
      const usersWithActive = apiUsers.map(user => ({
        ...user,
        isActive: user.isActive !== false // Default true if not specified
      }));
      
      console.log('✅ Admin kullanıcıları işlendi:', usersWithActive.length);
      setUsers(usersWithActive);
      
      console.log('👥 Admin paneli kullanıcıları güncellendi:', usersWithActive.length);
      console.log('👥 Kullanıcılar:', usersWithActive.map(u => ({ id: u._id, email: u.email, fullName: u.fullName })));
    } catch (error) {
      console.error('❌ Kullanıcılar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      console.log('📊 fetchStats başlatılıyor, users.length:', users.length);
      // Local users state'ini kullan (fetchUsers zaten API'den çekiyor)
      const totalUsers = users.length || 0;
      const activeUsers = users.filter(u => u.isActive === true).length || 0;
      
      console.log('📊 İstatistikler hesaplanıyor:', { totalUsers, activeUsers });
      
      setStats({
        totalUsers: totalUsers,
        activeUsers: activeUsers,
        totalPosts: 1247,
        totalLikes: 15689,
        totalComments: 3245,
        totalFollows: 892,
        totalNotifications: 156,
        systemHealth: 98
      });
      
      console.log('📊 Admin paneli istatistikleri güncellendi:', {
        totalUsers,
        activeUsers,
        users: users.map(u => ({ id: u._id, email: u.email, isActive: u.isActive }))
      });
    } catch (error) {
      console.error('❌ İstatistikler yüklenirken hata:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarItems = [
    {
      section: 'Dashboard',
      items: [
        { id: 'dashboard', label: 'Genel Bakış', icon: FiBarChart },
        { id: 'analytics', label: 'Analitik', icon: FiTrendingUp },
        { id: 'realtime', label: 'Gerçek Zamanlı', icon: FiActivity },
      ]
    },
    {
      section: 'Kullanıcılar',
      items: [
        { id: 'users', label: 'Kullanıcı Yönetimi', icon: FiUsers },
        { id: 'permissions', label: 'İzinler', icon: FiShield },
        { id: 'roles', label: 'Roller', icon: FiUserCheck },
      ]
    },
    {
      section: 'İçerik',
      items: [
        { id: 'posts', label: 'Gönderiler', icon: FiImage },
        { id: 'comments', label: 'Yorumlar', icon: FiMessageCircle },
        { id: 'likes', label: 'Beğeniler', icon: FiHeart },
        { id: 'follows', label: 'Takipçiler', icon: FiUsers },
      ]
    },
    {
      section: 'Sistem',
      items: [
        { id: 'notifications', label: 'Bildirimler', icon: FiBell },
        { id: 'settings', label: 'Ayarlar', icon: FiSettings },
        { id: 'logs', label: 'Sistem Logları', icon: FiFileText },
        { id: 'backup', label: 'Yedekleme', icon: FiDatabase },
      ]
    }
  ];

  // Grafik çizme fonksiyonu
  const drawChart = () => {
    const canvas = chartRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Canvas'ı temizle
    ctx.clearRect(0, 0, width, height);
    
    // Arka plan gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(255, 165, 0, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 165, 0, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Grid çizgileri
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Yatay grid çizgileri
    for (let i = 0; i <= 5; i++) {
      const y = (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Dikey grid çizgileri
    for (let i = 0; i <= 7; i++) {
      const x = (width / 7) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Örnek veri çizimi
    const data = [
      { label: 'Kullanıcılar', value: stats.totalUsers, color: '#ff6b6b' },
      { label: 'Eserler', value: stats.totalPosts, color: '#4ecdc4' },
      { label: 'Beğeniler', value: stats.totalLikes, color: '#45b7d1' },
      { label: 'Yorumlar', value: stats.totalComments, color: '#96ceb4' },
      { label: 'Takip', value: stats.totalFollows, color: '#feca57' },
      { label: 'Bildirimler', value: stats.totalNotifications, color: '#ff9ff3' },
      { label: 'Sistem', value: stats.systemHealth, color: '#54a0ff' }
    ];
    
    const maxValue = Math.max(...data.map(d => d.value));
    const barWidth = width / data.length * 0.8;
    const barSpacing = width / data.length * 0.2;
    
    // Bar grafik çizimi
    data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * height * 0.8;
      const x = index * (barWidth + barSpacing) + barSpacing / 2;
      const y = height - barHeight - 20;
      
      // Bar gradient
      const barGradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      barGradient.addColorStop(0, item.color);
      barGradient.addColorStop(1, item.color + '80');
      
      ctx.fillStyle = barGradient;
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Değer etiketi
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(item.value.toString(), x + barWidth / 2, y - 5);
      
      // Label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '10px Arial';
      ctx.fillText(item.label, x + barWidth / 2, height - 5);
    });
  };
  
  // Kullanıcılar değiştiğinde istatistikleri güncelle
  useEffect(() => {
    console.log('🔄 useEffect users değişti, users.length:', users.length);
    if (users.length > 0) {
      console.log('✅ Kullanıcılar var, fetchStats çağrılıyor');
      fetchStats();
    } else {
      console.log('⚠️ Kullanıcılar yok, fetchStats çağrılmıyor');
    }
  }, [users]);

  // Grafik güncelleme useEffect'i
  useEffect(() => {
    drawChart();
  }, [stats]);

  const renderDashboard = () => (
    <>
      <DashboardGrid>
        <StatCard gradient="linear-gradient(135deg, #ffa500, #ff6b6b)">
          <StatHeader>
            <StatIcon gradient="linear-gradient(135deg, #ffa500, #ff6b6b)">
              <FiUsers />
            </StatIcon>
            <StatChange positive>
              <FiTrendingUp />
              +12%
            </StatChange>
          </StatHeader>
          <StatValue>{users.length || 0}</StatValue>
          <StatLabel>Toplam Kullanıcı ({users.length})</StatLabel>
        </StatCard>

        <StatCard gradient="linear-gradient(135deg, #4ecdc4, #44a08d)">
          <StatHeader>
            <StatIcon gradient="linear-gradient(135deg, #4ecdc4, #44a08d)">
              <FiActivity />
            </StatIcon>
            <StatChange positive>
              <FiTrendingUp />
              +8%
            </StatChange>
          </StatHeader>
          <StatValue>{users.filter(u => u.isActive === true).length}</StatValue>
          <StatLabel>Aktif Kullanıcı</StatLabel>
        </StatCard>

        <StatCard gradient="linear-gradient(135deg, #ff6b6b, #ff8e8e)">
          <StatHeader>
            <StatIcon gradient="linear-gradient(135deg, #ff6b6b, #ff8e8e)">
              <FiImage />
            </StatIcon>
            <StatChange positive>
              <FiTrendingUp />
              +24%
            </StatChange>
          </StatHeader>
          <StatValue>{stats.totalPosts}</StatValue>
          <StatLabel>Toplam Gönderi</StatLabel>
        </StatCard>

        <StatCard gradient="linear-gradient(135deg, #a8e6cf, #88d8a3)">
          <StatHeader>
            <StatIcon gradient="linear-gradient(135deg, #a8e6cf, #88d8a3)">
              <FiHeart />
            </StatIcon>
            <StatChange positive>
              <FiTrendingUp />
              +18%
            </StatChange>
          </StatHeader>
          <StatValue>{stats.totalLikes}</StatValue>
          <StatLabel>Toplam Beğeni</StatLabel>
        </StatCard>

        <StatCard gradient="linear-gradient(135deg, #ffd93d, #ffb84d)">
          <StatHeader>
            <StatIcon gradient="linear-gradient(135deg, #ffd93d, #ffb84d)">
              <FiMessageCircle />
            </StatIcon>
            <StatChange positive>
              <FiTrendingUp />
              +15%
            </StatChange>
          </StatHeader>
          <StatValue>{stats.totalComments}</StatValue>
          <StatLabel>Toplam Yorum</StatLabel>
        </StatCard>

        <StatCard gradient="linear-gradient(135deg, #c44569, #f8b500)">
          <StatHeader>
            <StatIcon gradient="linear-gradient(135deg, #c44569, #f8b500)">
              <FiUsers />
            </StatIcon>
            <StatChange positive>
              <FiTrendingUp />
              +22%
            </StatChange>
          </StatHeader>
          <StatValue>{stats.totalFollows}</StatValue>
          <StatLabel>Takip İlişkisi</StatLabel>
        </StatCard>
      </DashboardGrid>

      <ChartsContainer>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Kullanıcı Aktivitesi</ChartTitle>
            <FilterButton>
              <FiFilter />
              Filtrele
            </FilterButton>
          </ChartHeader>
          <ChartContainer>
            <ChartCanvas 
              ref={chartRef}
              width={400}
              height={260}
            />
            <ChartLegend>
              <LegendItem>
                <LegendColor color="#ff6b6b" />
                Kullanıcılar
              </LegendItem>
              <LegendItem>
                <LegendColor color="#4ecdc4" />
                Eserler
              </LegendItem>
              <LegendItem>
                <LegendColor color="#45b7d1" />
                Beğeniler
              </LegendItem>
              <LegendItem>
                <LegendColor color="#96ceb4" />
                Yorumlar
              </LegendItem>
            </ChartLegend>
          </ChartContainer>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>Gerçek Zamanlı Aktivite</ChartTitle>
            <LiveIndicator>CANLI</LiveIndicator>
          </ChartHeader>
          <ActivityFeed>
            {activities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                <FiActivity style={{ fontSize: '2rem', marginBottom: '1rem' }} />
                <p>Henüz aktivite yok</p>
              </div>
            ) : (
              activities.map((activity) => {
                const IconComponent = {
                  'FiUserPlus': FiUserPlus,
                  'FiLogIn': FiLogIn,
                  'FiImage': FiImage,
                  'FiHeart': FiHeart,
                  'FiMessageCircle': FiMessageCircle,
                  'FiUsers': FiUsers,
                  'FiBell': FiBell
                }[activity.icon] || FiActivity;
                
                return (
                  <ActivityItem key={activity.id}>
                    <ActivityIcon gradient={activity.gradient}>
                      <IconComponent />
                    </ActivityIcon>
                    <ActivityContent>
                      <ActivityText>{activity.message}</ActivityText>
                      <ActivityTime>
                        {new Date(activity.timestamp).toLocaleTimeString('tr-TR')}
                      </ActivityTime>
                    </ActivityContent>
                  </ActivityItem>
                );
              })
            )}
          </ActivityFeed>
        </ChartCard>
        
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Kullanıcı Logları</ChartTitle>
            <LiveIndicator>CANLI</LiveIndicator>
          </ChartHeader>
          <div style={{ padding: '1rem', height: '300px', overflowY: 'auto' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>👥 Kayıtlı Kullanıcılar ({users.length})</h4>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.5rem' }}>
                sudesmer001@gmail.com, admin@feellink.com, designer@feellink.com, znp.esmer@gmail.com
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                {users.map(user => (
                  <div key={user._id} style={{ marginBottom: '0.5rem', padding: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '500', color: 'white' }}>{user.fullName}</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>{user.email}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {user.isVerified && <span style={{ color: '#4caf50', fontSize: '0.7rem' }}>✓</span>}
                        {user.isPrivate && <span style={{ color: '#ff9800', fontSize: '0.7rem' }}>🔒</span>}
                        <span style={{ color: user.isActive !== false ? '#4caf50' : '#ff6b6b', fontSize: '0.7rem' }}>
                          {user.isActive !== false ? '●' : '○'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ChartCard>
      </ChartsContainer>
      
      <SystemStatus>
        <StatusItem>
          <StatusIcon gradient="linear-gradient(135deg, #4facfe, #00f2fe)">
            <FiDatabase />
          </StatusIcon>
          <StatusLabel>MongoDB Bağlantısı</StatusLabel>
          <StatusValue>✅ Aktif</StatusValue>
        </StatusItem>
        
        <StatusItem>
          <StatusIcon gradient="linear-gradient(135deg, #43e97b, #38f9d7)">
            <FiActivity />
          </StatusIcon>
          <StatusLabel>Socket.IO</StatusLabel>
          <StatusValue>✅ Bağlı</StatusValue>
        </StatusItem>
        
        <StatusItem>
          <StatusIcon gradient="linear-gradient(135deg, #fa709a, #fee140)">
            <FiUsers />
          </StatusIcon>
          <StatusLabel>Aktif Kullanıcılar</StatusLabel>
          <StatusValue>{stats.activeUsers}</StatusValue>
        </StatusItem>
        
        <StatusItem>
          <StatusIcon gradient="linear-gradient(135deg, #667eea, #764ba2)">
            <FiBarChart />
          </StatusIcon>
          <StatusLabel>Sistem Sağlığı</StatusLabel>
          <StatusValue>{stats.systemHealth}%</StatusValue>
        </StatusItem>
      </SystemStatus>
    </>
  );

  const renderUsers = () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: 'white', marginBottom: '2rem', fontSize: '2rem' }}>👥 Kullanıcı Yönetimi</h2>
      
      {/* Kullanıcı Tanıma Arayüzü */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        borderRadius: '20px', 
        padding: '2rem', 
        marginBottom: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
          🔍 Kullanıcı Tanıma ve Kaydetme
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Tekil Kullanıcı Tanıma */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem' }}>Tekil Kullanıcı Tanıma</h4>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const email = formData.get('email');
              const fullName = formData.get('fullName');
              const source = formData.get('source');
              
              try {
                const response = await axios.post('/api/users/recognize', {
                  email,
                  fullName,
                  source
                });
                
                if (response.data.success) {
                  alert(response.data.message);
                  fetchUsers(); // Kullanıcı listesini yenile
                }
              } catch (error) {
                alert('Hata: ' + (error.response?.data?.message || error.message));
              }
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                  Email Adresi *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                  placeholder="ornek@email.com"
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                  Ad Soyad
                </label>
                <input
                  type="text"
                  name="fullName"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Ad Soyad"
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                  Kaynak
                </label>
                <select
                  name="source"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="manual">Manuel</option>
                  <option value="import">İçe Aktarım</option>
                  <option value="api">API</option>
                  <option value="social">Sosyal Medya</option>
                </select>
              </div>
              
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                🔍 Kullanıcıyı Tanı ve Kaydet
              </button>
            </form>
          </div>
          
          {/* Toplu Kullanıcı Tanıma */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem' }}>Toplu Kullanıcı Tanıma</h4>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const usersText = formData.get('usersText');
              const source = formData.get('bulkSource');
              
              try {
                // CSV formatında kullanıcıları parse et
                const lines = usersText.split('\n').filter(line => line.trim());
                const users = lines.map(line => {
                  const parts = line.split(',');
                  return {
                    email: parts[0]?.trim(),
                    fullName: parts[1]?.trim() || '',
                    source: source
                  };
                }).filter(user => user.email);
                
                if (users.length === 0) {
                  alert('Geçerli kullanıcı bulunamadı');
                  return;
                }
                
                const response = await axios.post('/api/users/recognize-bulk', { users });
                
                if (response.data.success) {
                  alert(`${response.data.summary.total} kullanıcı işlendi. ${response.data.summary.newUsers} yeni, ${response.data.summary.existingUsers} mevcut`);
                  fetchUsers(); // Kullanıcı listesini yenile
                }
              } catch (error) {
                alert('Hata: ' + (error.response?.data?.message || error.message));
              }
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                  Kullanıcı Listesi (CSV Format)
                </label>
                <textarea
                  name="usersText"
                  rows="6"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '0.9rem',
                    resize: 'vertical'
                  }}
                  placeholder="email@example.com, Ad Soyad&#10;email2@example.com, Ad Soyad 2&#10;email3@example.com, Ad Soyad 3"
                />
                <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '0.5rem' }}>
                  Format: email, ad soyad (her satırda bir kullanıcı)
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                  Kaynak
                </label>
                <select
                  name="bulkSource"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="bulk_import">Toplu İçe Aktarım</option>
                  <option value="csv_upload">CSV Yükleme</option>
                  <option value="api_bulk">API Toplu</option>
                  <option value="migration">Migrasyon</option>
                </select>
              </div>
              
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                📋 Toplu Kullanıcı Tanıma
              </button>
            </form>
          </div>
        </div>
      </div>

      <UsersTable>
      <TableHeader>
        <TableTitle>Kullanıcı Yönetimi</TableTitle>
        <TableControls>
          <SearchInput placeholder="Kullanıcı ara..." />
          <FilterButton>
            <FiFilter />
            Filtrele
          </FilterButton>
          <FilterButton>
            <FiDownload />
            Dışa Aktar
          </FilterButton>
        </TableControls>
      </TableHeader>

      {loading ? (
        <LoadingSpinner>
          <div className="spinner"></div>
        </LoadingSpinner>
      ) : (
        <Table>
          <TableHead>
            <tr>
              <TableHeaderCell>Kullanıcı</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Durum</TableHeaderCell>
              <TableHeaderCell>Doğrulama</TableHeaderCell>
              <TableHeaderCell>Kayıt Tarihi</TableHeaderCell>
              <TableHeaderCell>İşlemler</TableHeaderCell>
            </tr>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <UserAvatar>
                      {user.fullName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </UserAvatar>
                    <div>
                      <div style={{ fontWeight: '600' }}>{user.fullName || 'İsimsiz'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                        @{user.username || 'kullanici'}
                      </div>
                      {user.isPrivate && (
                        <div style={{ fontSize: '0.7rem', color: '#ff9800', marginTop: '0.25rem' }}>
                          🔒 Özel Hesap
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div style={{ fontWeight: '500' }}>{user.email}</div>
                    {user.bio && (
                      <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '0.25rem' }}>
                        {user.bio.length > 30 ? user.bio.substring(0, 30) + '...' : user.bio}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={user.isActive !== false ? 'active' : 'inactive'}>
                    {user.isActive !== false ? 'Aktif' : 'Pasif'}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <StatusBadge status={user.isVerified ? 'verified' : 'unverified'}>
                    {user.isVerified ? 'Doğrulanmış' : 'Doğrulanmamış'}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <div>
                    <div style={{ fontWeight: '500' }}>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                      {user.createdAt ? new Date(user.createdAt).toLocaleTimeString('tr-TR') : ''}
                    </div>
                    {user.followers && (
                      <div style={{ fontSize: '0.7rem', color: '#4caf50', marginTop: '0.25rem' }}>
                        👥 {user.followers.length} takipçi
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <ActionButton title="Detayları Görüntüle">
                      <FiEye />
                    </ActionButton>
                    <ActionButton title="Düzenle">
                      <FiEdit3 />
                    </ActionButton>
                    <ActionButton variant="danger" title="Sil">
                      <FiTrash2 />
                    </ActionButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </UsersTable>
    </div>
  );

  const renderAnalytics = () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: 'white', marginBottom: '2rem', fontSize: '2rem' }}>📊 Analitik & Raporlar</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Kullanıcı Büyümesi</ChartTitle>
            <LiveIndicator>CANLI</LiveIndicator>
          </ChartHeader>
          <ChartContainer>
            <ChartCanvas 
              ref={chartRef}
              width={400}
              height={260}
            />
          </ChartContainer>
        </ChartCard>
        
        <ChartCard>
          <ChartHeader>
            <ChartTitle>İçerik Performansı</ChartTitle>
            <FilterButton>
              <FiFilter />
              Filtrele
            </FilterButton>
          </ChartHeader>
          <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)' }}>
            <FiBarChart style={{ fontSize: '3rem', marginBottom: '1rem' }} />
            <h3>İçerik Analizi</h3>
            <p>En popüler eserler, beğeni oranları ve etkileşim metrikleri</p>
          </div>
        </ChartCard>
      </div>
      
      <SystemStatus>
        <StatusItem>
          <StatusIcon gradient="linear-gradient(135deg, #667eea, #764ba2)">
            <FiTrendingUp />
          </StatusIcon>
          <StatusLabel>Günlük Büyüme</StatusLabel>
          <StatusValue>+12%</StatusValue>
        </StatusItem>
        
        <StatusItem>
          <StatusIcon gradient="linear-gradient(135deg, #f093fb, #f5576c)">
            <FiHeart />
          </StatusIcon>
          <StatusLabel>Engagement Rate</StatusLabel>
          <StatusValue>68%</StatusValue>
        </StatusItem>
        
        <StatusItem>
          <StatusIcon gradient="linear-gradient(135deg, #4facfe, #00f2fe)">
            <FiUsers />
          </StatusIcon>
          <StatusLabel>Retention Rate</StatusLabel>
          <StatusValue>85%</StatusValue>
        </StatusItem>
        
        <StatusItem>
          <StatusIcon gradient="linear-gradient(135deg, #43e97b, #38f9d7)">
            <FiActivity />
          </StatusIcon>
          <StatusLabel>Conversion Rate</StatusLabel>
          <StatusValue>23%</StatusValue>
        </StatusItem>
      </SystemStatus>
    </div>
  );

  const renderRealtime = () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: 'white', marginBottom: '2rem', fontSize: '2rem' }}>⚡ Gerçek Zamanlı Monitoring</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Canlı Aktivite Akışı</ChartTitle>
            <LiveIndicator>CANLI</LiveIndicator>
          </ChartHeader>
          <ActivityFeed style={{ height: '400px' }}>
            {activities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                <FiActivity style={{ fontSize: '2rem', marginBottom: '1rem' }} />
                <p>Henüz aktivite yok</p>
              </div>
            ) : (
              activities.map((activity) => {
                const IconComponent = {
                  'FiUserPlus': FiUserPlus,
                  'FiLogIn': FiLogIn,
                  'FiImage': FiImage,
                  'FiHeart': FiHeart,
                  'FiMessageCircle': FiMessageCircle,
                  'FiUsers': FiUsers,
                  'FiBell': FiBell
                }[activity.icon] || FiActivity;
                
                return (
                  <ActivityItem key={activity.id}>
                    <ActivityIcon gradient={activity.gradient}>
                      <IconComponent />
                    </ActivityIcon>
                    <ActivityContent>
                      <ActivityText>{activity.message}</ActivityText>
                      <ActivityTime>
                        {new Date(activity.timestamp).toLocaleTimeString('tr-TR')}
                      </ActivityTime>
                    </ActivityContent>
                  </ActivityItem>
                );
              })
            )}
          </ActivityFeed>
        </ChartCard>
        
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Sistem Logları</ChartTitle>
            <LiveIndicator>CANLI</LiveIndicator>
          </ChartHeader>
          <div style={{ padding: '1rem', height: '400px', overflowY: 'auto' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>📊 Kullanıcı İstatistikleri</h4>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                <div>Toplam Kullanıcı: <strong style={{ color: '#4caf50' }}>{users.length}</strong></div>
                <div>Aktif Kullanıcı: <strong style={{ color: '#4caf50' }}>{users.filter(u => u.isActive === true).length}</strong></div>
                <div>Doğrulanmış: <strong style={{ color: '#4caf50' }}>{users.filter(u => u.isVerified).length}</strong></div>
                <div>Özel Hesap: <strong style={{ color: '#ff9800' }}>{users.filter(u => u.isPrivate).length}</strong></div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                  📧 sudesmer001@gmail.com, admin@feellink.com, designer@feellink.com, znp.esmer@gmail.com
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>👥 Kayıtlı Kullanıcılar ({users.length})</h4>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.5rem' }}>
                sudesmer001@gmail.com, admin@feellink.com, designer@feellink.com, znp.esmer@gmail.com
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                {users.map(user => (
                  <div key={user._id} style={{ marginBottom: '0.25rem', padding: '0.25rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px' }}>
                    <div style={{ fontWeight: '500' }}>{user.fullName}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>{user.email}</div>
                    <div style={{ fontSize: '0.7rem' }}>
                      {user.isVerified && <span style={{ color: '#4caf50' }}>✓ Doğrulanmış</span>}
                      {user.isPrivate && <span style={{ color: '#ff9800', marginLeft: '0.5rem' }}>🔒 Özel</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>🔌 Bağlantı Durumu</h4>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4caf50' }}></div>
                  <span>Socket.IO: Aktif</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4caf50' }}></div>
                  <span>MongoDB: Bağlı</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4caf50' }}></div>
                  <span>API: Çalışıyor</span>
                </div>
              </div>
            </div>
          </div>
        </ChartCard>
        
        <div>
          <ChartCard style={{ marginBottom: '1rem' }}>
            <ChartHeader>
              <ChartTitle>Sistem Durumu</ChartTitle>
            </ChartHeader>
            <div style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>CPU Kullanımı</span>
                <span style={{ color: 'white' }}>23%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>RAM Kullanımı</span>
                <span style={{ color: 'white' }}>67%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Disk Kullanımı</span>
                <span style={{ color: 'white' }}>45%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Network</span>
                <span style={{ color: '#4caf50' }}>✅ Aktif</span>
              </div>
            </div>
          </ChartCard>
          
          <ChartCard>
            <ChartHeader>
              <ChartTitle>Bağlantı Durumu</ChartTitle>
            </ChartHeader>
            <div style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4caf50' }}></div>
                <span style={{ color: 'white' }}>MongoDB: Bağlı</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4caf50' }}></div>
                <span style={{ color: 'white' }}>Socket.IO: Aktif</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4caf50' }}></div>
                <span style={{ color: 'white' }}>API: Çalışıyor</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4caf50' }}></div>
                <span style={{ color: 'white' }}>Frontend: Aktif</span>
              </div>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );

  const renderPermissions = () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: 'white', marginBottom: '2rem', fontSize: '2rem' }}>🔐 İzinler & Roller</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Kullanıcı Rolleri</ChartTitle>
          </ChartHeader>
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
              <div>
                <div style={{ color: 'white', fontWeight: '600' }}>Admin</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>Tam yetki</div>
              </div>
              <StatusBadge status="active">1 Kullanıcı</StatusBadge>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
              <div>
                <div style={{ color: 'white', fontWeight: '600' }}>Moderatör</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>İçerik yönetimi</div>
              </div>
              <StatusBadge status="inactive">0 Kullanıcı</StatusBadge>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
              <div>
                <div style={{ color: 'white', fontWeight: '600' }}>Kullanıcı</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>Standart kullanıcı</div>
              </div>
              <StatusBadge status="active">{stats.totalUsers - 1} Kullanıcı</StatusBadge>
            </div>
          </div>
        </ChartCard>
        
        <ChartCard>
          <ChartHeader>
            <ChartTitle>İzin Matrisi</ChartTitle>
          </ChartHeader>
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>Rol</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>Admin</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>Moderatör</div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ color: 'white', fontSize: '0.9rem' }}>Kullanıcı Yönetimi</div>
              <div style={{ color: '#4caf50', textAlign: 'center' }}>✅</div>
              <div style={{ color: '#ff9800', textAlign: 'center' }}>⚠️</div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ color: 'white', fontSize: '0.9rem' }}>İçerik Yönetimi</div>
              <div style={{ color: '#4caf50', textAlign: 'center' }}>✅</div>
              <div style={{ color: '#4caf50', textAlign: 'center' }}>✅</div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ color: 'white', fontSize: '0.9rem' }}>Sistem Ayarları</div>
              <div style={{ color: '#4caf50', textAlign: 'center' }}>✅</div>
              <div style={{ color: '#f44336', textAlign: 'center' }}>❌</div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <div style={{ color: 'white', fontSize: '0.9rem' }}>Analitik</div>
              <div style={{ color: '#4caf50', textAlign: 'center' }}>✅</div>
              <div style={{ color: '#ff9800', textAlign: 'center' }}>⚠️</div>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );

  const renderContentManagement = () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: 'white', marginBottom: '2rem', fontSize: '2rem' }}>📝 İçerik Yönetimi</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Gönderiler</ChartTitle>
            <FilterButton>
              <FiFilter />
              Filtrele
            </FilterButton>
          </ChartHeader>
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'white' }}>Toplam Gönderi</span>
              <span style={{ color: '#4caf50', fontWeight: '600' }}>{stats.totalPosts}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'white' }}>Bugün Eklenen</span>
              <span style={{ color: '#2196f3', fontWeight: '600' }}>3</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'white' }}>Bekleyen Onay</span>
              <span style={{ color: '#ff9800', fontWeight: '600' }}>1</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'white' }}>Silinen</span>
              <span style={{ color: '#f44336', fontWeight: '600' }}>0</span>
            </div>
          </div>
        </ChartCard>
        
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Yorumlar</ChartTitle>
            <FilterButton>
              <FiFilter />
              Filtrele
            </FilterButton>
          </ChartHeader>
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'white' }}>Toplam Yorum</span>
              <span style={{ color: '#4caf50', fontWeight: '600' }}>{stats.totalComments}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'white' }}>Bugün Eklenen</span>
              <span style={{ color: '#2196f3', fontWeight: '600' }}>7</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'white' }}>Bekleyen Onay</span>
              <span style={{ color: '#ff9800', fontWeight: '600' }}>2</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'white' }}>Silinen</span>
              <span style={{ color: '#f44336', fontWeight: '600' }}>1</span>
            </div>
          </div>
        </ChartCard>
        
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Beğeniler</ChartTitle>
            <LiveIndicator>CANLI</LiveIndicator>
          </ChartHeader>
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'white' }}>Toplam Beğeni</span>
              <span style={{ color: '#4caf50', fontWeight: '600' }}>{stats.totalLikes}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'white' }}>Bugün</span>
              <span style={{ color: '#2196f3', fontWeight: '600' }}>15</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'white' }}>Bu Hafta</span>
              <span style={{ color: '#9c27b0', fontWeight: '600' }}>89</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'white' }}>Bu Ay</span>
              <span style={{ color: '#ff5722', fontWeight: '600' }}>234</span>
            </div>
          </div>
        </ChartCard>
        
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Takipçiler</ChartTitle>
            <LiveIndicator>CANLI</LiveIndicator>
          </ChartHeader>
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'white' }}>Toplam Takip</span>
              <span style={{ color: '#4caf50', fontWeight: '600' }}>{stats.totalFollows}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'white' }}>Bugün</span>
              <span style={{ color: '#2196f3', fontWeight: '600' }}>5</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'white' }}>Bekleyen İstek</span>
              <span style={{ color: '#ff9800', fontWeight: '600' }}>3</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'white' }}>Reddedilen</span>
              <span style={{ color: '#f44336', fontWeight: '600' }}>1</span>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: 'white', marginBottom: '2rem', fontSize: '2rem' }}>⚙️ Sistem Ayarları</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Bildirimler</ChartTitle>
            <LiveIndicator>CANLI</LiveIndicator>
          </ChartHeader>
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'white' }}>Toplam Bildirim</span>
              <span style={{ color: '#4caf50', fontWeight: '600' }}>{stats.totalNotifications}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'white' }}>Okunmamış</span>
              <span style={{ color: '#ff9800', fontWeight: '600' }}>12</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'white' }}>Bugün Gönderilen</span>
              <span style={{ color: '#2196f3', fontWeight: '600' }}>8</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'white' }}>Sistem Bildirimleri</span>
              <span style={{ color: '#9c27b0', fontWeight: '600' }}>3</span>
            </div>
          </div>
        </ChartCard>
        
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Sistem Logları</ChartTitle>
            <FilterButton>
              <FiFilter />
              Filtrele
            </FilterButton>
          </ChartHeader>
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'white' }}>Toplam Log</span>
              <span style={{ color: '#4caf50', fontWeight: '600' }}>1,247</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'white' }}>Hata Logları</span>
              <span style={{ color: '#f44336', fontWeight: '600' }}>23</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'white' }}>Uyarı Logları</span>
              <span style={{ color: '#ff9800', fontWeight: '600' }}>45</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'white' }}>Bilgi Logları</span>
              <span style={{ color: '#2196f3', fontWeight: '600' }}>1,179</span>
            </div>
          </div>
        </ChartCard>
        
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Yedekleme</ChartTitle>
            <StatusBadge status="active">Aktif</StatusBadge>
          </ChartHeader>
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'white' }}>Son Yedekleme</span>
              <span style={{ color: '#4caf50', fontWeight: '600' }}>2 saat önce</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'white' }}>Yedek Boyutu</span>
              <span style={{ color: '#2196f3', fontWeight: '600' }}>2.3 GB</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'white' }}>Toplam Yedek</span>
              <span style={{ color: '#9c27b0', fontWeight: '600' }}>15</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'white' }}>Otomatik Yedek</span>
              <span style={{ color: '#4caf50', fontWeight: '600' }}>✅ Aktif</span>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'analytics':
        return renderAnalytics();
      case 'realtime':
        return renderRealtime();
      case 'users':
        return renderUsers();
      case 'permissions':
        return renderPermissions();
      case 'posts':
      case 'comments':
      case 'likes':
      case 'follows':
        return renderContentManagement();
      case 'notifications':
      case 'settings':
      case 'logs':
      case 'backup':
        return renderSystemSettings();
      default:
        return (
          <EmptyState>
            <FiSettings style={{ fontSize: '3rem', marginBottom: '1rem' }} />
            <h3>Bu bölüm yakında eklenecek</h3>
            <p>Gelişmiş özellikler için geliştirme devam ediyor...</p>
          </EmptyState>
        );
    }
  };

  return (
    <AdminContainer>
      <Header>
        <Logo>
          <h1>FeelLink Admin</h1>
        </Logo>
        <HeaderActions>
          <NotificationButton>
            <FiBell />
            <NotificationBadge>3</NotificationBadge>
          </NotificationButton>
          <LogoutButton onClick={handleLogout}>
            <FiLogOut />
            Çıkış Yap
          </LogoutButton>
        </HeaderActions>
      </Header>

      <Sidebar>
        {sidebarItems.map((section) => (
          <SidebarSection key={section.section}>
            <SectionTitle>{section.section}</SectionTitle>
            {section.items.map((item) => (
              <SidebarItem
                key={item.id}
                className={activeTab === item.id ? 'active' : ''}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon />
                {item.label}
              </SidebarItem>
            ))}
          </SidebarSection>
        ))}
      </Sidebar>

      <MainContent>
        {renderContent()}
      </MainContent>
    </AdminContainer>
  );
};

export default AdminPanel;