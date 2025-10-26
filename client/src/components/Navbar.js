import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FiHome, 
  FiSearch, 
  FiUser, 
  FiUserPlus,
  FiSun, 
  FiMoon, 
  FiMenu, 
  FiX,
  FiLogOut,
  FiSettings,
  FiVolume2,
  FiVolumeX,
  FiShield,
  FiMessageCircle,
  FiBell
} from 'react-icons/fi';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${props => props.theme.glass};
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${props => props.theme.glassBorder};
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
`;

const NavContainer = styled.div`
  max-width: 100%;
  margin: 0;
  padding: 0 20px 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: visible;
`;

const SearchContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  max-width: 90%;

  /* Tablet */
  @media (max-width: 1024px) and (min-width: 769px) {
    width: 300px;
    max-width: 85%;
  }

  /* Mobil tablet */
  @media (max-width: 768px) and (min-width: 481px) {
    width: 250px;
    max-width: 80%;
  }

  /* Küçük mobil */
  @media (max-width: 480px) {
    width: 180px;
    max-width: 70%;
  }

  /* Çok küçük ekranlar */
  @media (max-width: 375px) {
    width: 150px;
    max-width: 65%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 2px solid ${props => props.theme.border};
  border-radius: 25px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: #FF6B35;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.textSecondary};
  pointer-events: none;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: 800;
  color: ${props => props.theme.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    color: ${props => props.theme.primaryHover};
  }
`;

const LogoIcon = styled.div`
  width: 150px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: transparent;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.text};
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${props => props.theme.surfaceHover};
    color: ${props => props.theme.primary};
  }

  &.active {
    background: ${props => props.theme.primaryLight};
    color: ${props => props.theme.primary};
  }
`;

const NavActions = styled.div`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: visible;

  @media (max-width: 768px) {
    gap: 8px;
    right: 16px;
  }

  @media (max-width: 480px) {
    gap: 6px;
    right: 12px;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  overflow: visible;
`;

const UserIcon = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.surface};
  border: 2px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.surfaceHover};
    border-color: ${props => props.theme.primary};
    transform: scale(1.05);
  }
`;

const UserDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  min-width: 180px;
  z-index: 9999;
  overflow: visible;
`;

const DropdownHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${props => props.theme.border};
  margin-bottom: 4px;
`;

const DropdownUserName = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 4px;
`;

const DropdownUserEmail = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  min-height: 44px;
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;

  &:hover {
    background: ${props => props.theme.surfaceHover};
    color: ${props => props.theme.primary};
  }

  &:first-child {
    border-radius: 12px 12px 0 0;
  }

  &:last-child {
    border-radius: 0 0 12px 12px;
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: ${props => props.theme.border};
  margin: 4px 0;
`;

const LeftNavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: 0;
  margin-right: auto;
  padding-right: 0;
  min-width: 280px;
  padding-left: 20px;
`;


const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: #000000;
  border-right: 1px solid #262626;
  z-index: 9999;
  padding: 20px 0;
  overflow-y: auto;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.5);
`;

const MenuHeader = styled.div`
  padding: 0 24px 20px 24px;
  border-bottom: 1px solid #262626;
  margin-bottom: 20px;
`;

const MenuTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 4px 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const MenuSubtitle = styled.p`
  font-size: 13px;
  color: #8e8e8e;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const MenuItems = styled.div`
  padding: 0 20px;
  width: 100%;
`;

const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 12px;
  margin-bottom: 4px;
  border-radius: 8px;
  text-decoration: none;
  color: #ffffff;
  transition: all 0.2s ease;
  font-weight: 400;
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  &:hover {
    background: #262626;
    color: #ffffff;
  }

  &.active {
    background: #262626;
    color: #ffffff;
    font-weight: 600;
  }
`;

const MenuIcon = styled.div`
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MenuText = styled.span`
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const MenuFooter = styled.div`
  padding: 20px 24px;
  border-top: 1px solid #262626;
  margin-top: 20px;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  font-weight: 500;

  &:hover {
    background: ${props => props.theme.dangerLight};
    color: ${props => props.theme.danger};
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9998;
`;


const ThemeToggle = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.surfaceHover};
    transform: scale(1.05);
  }
`;

const MusicToggle = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  color: ${props => props.isPlaying ? props.theme.primary : props.theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: ${props => props.theme.surfaceHover};
    transform: scale(1.05);
  }

  &::after {
    content: "${props => props.isPlaying ? 'Müzik Çalıyor' : 'Müzik Çal'}";
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    background: ${props => props.theme.surface};
    color: ${props => props.theme.text};
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
    z-index: 1000;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const AdminButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 20px;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  border: none;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AuthButton = styled(Link)`
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &.primary {
    background: ${props => props.theme.primary};
    color: white;

    &:hover {
      background: ${props => props.theme.primaryHover};
      transform: translateY(-1px);
    }
  }

  &.secondary {
    background: ${props => props.theme.surface};
    color: ${props => props.theme.text};
    border: 1px solid ${props => props.theme.border};

    &:hover {
      background: ${props => props.theme.surfaceHover};
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    background: ${props => props.theme.surfaceHover};
  }
`;


const MobileNavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  color: ${props => props.theme.text};
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid ${props => props.theme.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme, isInitialized } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [audio, setAudio] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Sanatsal müzik dosyaları - Ücretsiz jazz müzik kaynakları
  const musicTracks = [
    {
      name: "Jazz Müzik",
      url: "/music/jazz1.mp3", // Yerel jazz müzik dosyası
      artist: "Feellink Jazz Collection"
    }
  ];

  const stopMusic = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      // Tüm event listener'ları temizle
      audio.removeEventListener('ended', () => {});
      audio.removeEventListener('canplaythrough', () => {});
      audio.removeEventListener('error', () => {});
      // Audio element'ini tamamen temizle
      audio.src = '';
      audio.load();
    }
    setIsMusicPlaying(false);
    setAudio(null);
  };

  const toggleMusic = () => {
    if (isMusicPlaying) {
      // Müziği durdur
      stopMusic();
    } else {
      // Müziği başlat
      playMusic();
    }
  };

  const nextTrack = () => {
    // Tek müzik olduğu için aynı müziği tekrar başlat
    if (isMusicPlaying) {
      playMusic();
    }
  };

  // Gerçek müzik çalma fonksiyonu
  const playMusic = () => {
    // Önceki müziği tamamen durdur
    stopMusic();

    // Yeni müzik oluştur
    const newAudio = new Audio(musicTracks[currentTrack].url);
    
    // Event listener'ları tanımla
    const handleCanPlay = () => {
      newAudio.play().catch(error => {
        console.log('Müzik çalma hatası:', error);
        console.log(`🎵 Şu anda çalıyor: ${musicTracks[currentTrack].name}`);
      });
    };

    const handleEnded = () => {
      if (isMusicPlaying) {
        playMusic(); // Aynı müziği tekrar başlat
      }
    };

    const handleError = () => {
      console.log(`🎵 Şu anda çalıyor: ${musicTracks[currentTrack].name}`);
    };
    
    // Event listener'ları ekle
    newAudio.addEventListener('canplaythrough', handleCanPlay);
    newAudio.addEventListener('ended', handleEnded);
    newAudio.addEventListener('error', handleError);

    // Audio referansını güncelle
    setAudio(newAudio);
    setIsMusicPlaying(true);
  };

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    // Force redirect to login page
    window.location.replace('/login');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Dropdown'ın dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserDropdown && !event.target.closest('.user-menu')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);



  const isActive = (path) => {
    return location.pathname === path;
  };

  // Don't render until theme is initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <Nav>
      <NavContainer>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Keşfet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <SearchIcon>
            <FiSearch size={18} />
          </SearchIcon>
        </SearchContainer>
        
        <NavActions>
          <MusicToggle onClick={toggleMusic} isPlaying={isMusicPlaying}>
            {isMusicPlaying ? <FiVolume2 size={20} /> : <FiVolumeX size={20} />}
          </MusicToggle>
          
          <ThemeToggle onClick={toggleTheme}>
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </ThemeToggle>
          
          {user && (user.email === 'admin@feellink.com' || user.username === 'admin') && (
            <>
              <AdminButton onClick={() => navigate('/admin-panel')}>
                <FiShield size={18} />
                Admin Panel
              </AdminButton>
              <AdminButton onClick={() => navigate('/admin-login')}>
                <FiShield size={18} />
                Admin Login
              </AdminButton>
            </>
          )}
          
          <UserMenu className="user-menu">
            <UserIcon onClick={() => setShowUserDropdown(!showUserDropdown)} title={user?.fullName || user?.username || 'Kullanıcı'}>
              <FiUser size={20} />
            </UserIcon>
              
              <AnimatePresence>
                {showUserDropdown && (
                  <UserDropdown
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {user && (
                      <DropdownHeader>
                        <DropdownUserName>{user.fullName || user.username || 'Kullanıcı'}</DropdownUserName>
                        <DropdownUserEmail>{user.email}</DropdownUserEmail>
                      </DropdownHeader>
                    )}
                    <DropdownItem onClick={() => navigate('/profile')}>
                      <FiUser size={16} />
                      Profilim
                    </DropdownItem>
                    <DropdownItem onClick={() => navigate('/dashboard')}>
                      <FiHome size={16} />
                      Dashboard
                    </DropdownItem>
                    <DropdownItem onClick={() => navigate('/messages')}>
                      <FiMessageCircle size={16} />
                      Mesajlar
                    </DropdownItem>
                    <DropdownItem onClick={() => navigate('/notifications')}>
                      <FiBell size={16} />
                      Bildirimler
                    </DropdownItem>
                    <DropdownItem onClick={handleLogout}>
                      <FiLogOut size={16} />
                      Çıkış Yap
                    </DropdownItem>
                  </UserDropdown>
                )}
              </AnimatePresence>
            </UserMenu>
        </NavActions>
      </NavContainer>

      <AnimatePresence>
        {showMobileMenu && (
          <MobileMenu
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {!user && (
              <>
                <MobileNavLink to="/login" onClick={() => setShowMobileMenu(false)}>
                  Giriş Yap
                </MobileNavLink>
                <MobileNavLink to="/register" onClick={() => setShowMobileMenu(false)}>
                  Kayıt Ol
                </MobileNavLink>
              </>
            )}
          </MobileMenu>
        )}
      </AnimatePresence>

    </Nav>
  );
};

export default Navbar;
