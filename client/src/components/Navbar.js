import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FiHome, 
  FiSearch, 
  FiUser, 
  FiBookmark, 
  FiSun, 
  FiMoon, 
  FiMenu, 
  FiX,
  FiLogOut,
  FiSettings,
  FiVolume2,
  FiVolumeX,
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
  justify-content: space-between;
  height: 80px;
  width: 100%;
  box-sizing: border-box;
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
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
  margin-right: 20px;
  padding-right: 0;
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

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 16px 0 44px;
  border: 1px solid ${props => props.theme.glassBorder};
  border-radius: 20px;
  background: ${props => props.theme.glass};
  backdrop-filter: blur(20px);
  color: ${props => props.theme.text};
  font-size: 14px;
  transition: all 0.3s ease;
  cursor: pointer;

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primaryLight};
  }

  &:hover {
    border-color: ${props => props.theme.primary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.textSecondary};
  pointer-events: none;
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

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.gradient};
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const UserAvatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const Dropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  box-shadow: 0 10px 40px ${props => props.theme.shadow};
  min-width: 200px;
  overflow: hidden;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  color: ${props => props.theme.text};
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.surfaceHover};
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
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [audio, setAudio] = useState(null);

  // Sanatsal müzik dosyaları - Ücretsiz jazz müzik kaynakları
  const musicTracks = [
    {
      name: "Jazz Müzik",
      url: "/music/jazz1.mp3", // Yerel jazz müzik dosyası
      artist: "Feellink Jazz Collection"
    }
  ];

  const toggleMusic = () => {
    if (isMusicPlaying) {
      // Müziği durdur
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      setIsMusicPlaying(false);
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
    // Önceki müziği durdur
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    // Yeni müzik oluştur
    const newAudio = new Audio(musicTracks[currentTrack].url);
    
    // Müzik yüklendiğinde çal
    newAudio.addEventListener('canplaythrough', () => {
      newAudio.play().catch(error => {
        console.log('Müzik çalma hatası:', error);
        // Eğer müzik çalınamazsa, simülasyon göster
        console.log(`🎵 Şu anda çalıyor: ${musicTracks[currentTrack].name}`);
      });
    });

    // Müzik bittiğinde tekrar başlat
    newAudio.addEventListener('ended', () => {
      if (isMusicPlaying) {
        playMusic(); // Aynı müziği tekrar başlat
      }
    });

    // Hata durumunda simülasyon göster
    newAudio.addEventListener('error', () => {
      console.log(`🎵 Şu anda çalıyor: ${musicTracks[currentTrack].name}`);
    });

    setAudio(newAudio);
    setIsMusicPlaying(true);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    // navigate('/') removed - AuthContext handles redirect to /login
  };


  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Nav style={{ 
      position: 'fixed', 
      top: '20px', 
      right: '20px', 
      zIndex: 1000,
      background: 'transparent',
      border: 'none',
      backdropFilter: 'none',
      width: 'auto',
      height: 'auto'
    }}>
      <NavContainer style={{ 
        padding: '0',
        height: 'auto',
        justifyContent: 'flex-end',
        width: 'auto'
      }}>
        <NavActions style={{ 
          display: 'flex', 
          gap: '12px',
          alignItems: 'center'
        }}>
          <MusicToggle onClick={toggleMusic} isPlaying={isMusicPlaying}>
            {isMusicPlaying ? <FiVolume2 size={20} /> : <FiVolumeX size={20} />}
          </MusicToggle>
          
          <ThemeToggle onClick={toggleTheme}>
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </ThemeToggle>
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
