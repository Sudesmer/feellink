import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  FiDownload
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

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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
    
    fetchUsers();
    fetchStats();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Mock stats - gerçek uygulamada API'den gelecek
      setStats({
        totalUsers: users.length || 0,
        activeUsers: users.filter(u => u.isActive !== false).length || 0,
        totalPosts: 1247,
        totalLikes: 15689,
        totalComments: 3245,
        totalFollows: 892,
        totalNotifications: 156,
        systemHealth: 98
      });
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
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
          <StatValue>{stats.totalUsers}</StatValue>
          <StatLabel>Toplam Kullanıcı</StatLabel>
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
          <StatValue>{stats.activeUsers}</StatValue>
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
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
            <div style={{ textAlign: 'center' }}>
              <FiBarChart style={{ fontSize: '3rem', marginBottom: '1rem' }} />
              <p>Grafik burada görünecek</p>
            </div>
          </div>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>Sistem Sağlığı</ChartTitle>
            <StatusBadge status="active">{stats.systemHealth}%</StatusBadge>
          </ChartHeader>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
            <div style={{ textAlign: 'center' }}>
              <FiActivity style={{ fontSize: '3rem', marginBottom: '1rem' }} />
              <p>Sistem durumu: Mükemmel</p>
            </div>
          </div>
        </ChartCard>
      </ChartsContainer>
    </>
  );

  const renderUsers = () => (
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
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <StatusBadge status={user.isActive !== false ? 'active' : 'inactive'}>
                    {user.isActive !== false ? 'Aktif' : 'Pasif'}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                </TableCell>
                <TableCell>
                  <ActionButton>
                    <FiEye />
                  </ActionButton>
                  <ActionButton>
                    <FiEdit3 />
                  </ActionButton>
                  <ActionButton variant="danger">
                    <FiTrash2 />
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </UsersTable>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUsers();
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