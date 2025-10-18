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
  FiVolumeX
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
  position: relative;
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
  width: 120px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

// const NavLinks = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 32px;

//   @media (max-width: 768px) {
//     display: none;
//   }
// `;

// const NavLink = styled(Link)`
//   color: ${props => props.theme.text};
//   text-decoration: none;
//   font-weight: 500;
//   padding: 8px 16px;
//   border-radius: 8px;
//   transition: all 0.2s ease;
//   display: flex;
//   align-items: center;
//   gap: 8px;

//   &:hover {
//     background: ${props => props.theme.surfaceHover};
//     color: ${props => props.theme.primary};
//   }

//   &.active {
//     background: ${props => props.theme.primaryLight};
//     color: ${props => props.theme.primary};
//   }
// `;

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
  gap: 16px;
  margin-left: 0;
  margin-right: auto;
  padding-right: 0;
`;


const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: ${props => props.theme.surface};
  border-right: 1px solid ${props => props.theme.border};
  z-index: 9999;
  padding: 20px 0;
  overflow-y: auto;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.5);
`;

const MenuHeader = styled.div`
  padding: 0 24px 20px 24px;
  border-bottom: 1px solid ${props => props.theme.border};
  margin-bottom: 20px;
`;

const MenuTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0 0 4px 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const MenuSubtitle = styled.p`
  font-size: 13px;
  color: ${props => props.theme.textSecondary};
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const MenuItems = styled.div`
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 12px;
  margin-bottom: 4px;
  border-radius: 8px;
  text-decoration: none;
  color: ${props => props.theme.text};
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  opacity: 1;
  width: 100%;
  max-width: 200px;

  &:hover {
    background: ${props => props.theme.surfaceHover};
    color: ${props => props.theme.text};
    opacity: 1;
  }

  &.active {
    background: ${props => props.theme.surfaceHover};
    color: ${props => props.theme.text};
    font-weight: 600;
    opacity: 1;
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

const CenterSearch = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 500px;
  z-index: 10;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 50px;
  padding: 0 20px 0 50px;
  border: 2px solid ${props => props.theme.border};
  border-radius: 25px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateY(0);

  &::placeholder {
    color: ${props => props.theme.textMuted};
    font-weight: 400;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 
      0 12px 35px rgba(255, 107, 53, 0.3),
      0 6px 20px rgba(255, 107, 53, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  &:hover {
    border-color: ${props => props.theme.primary};
    box-shadow: 
      0 10px 30px rgba(0, 0, 0, 0.2),
      0 5px 15px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.primary};
  pointer-events: none;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  
  ${SearchInput}:focus + & {
    color: ${props => props.theme.primary};
    transform: translateY(-50%) scale(1.1);
    filter: drop-shadow(0 4px 8px rgba(255, 107, 53, 0.3));
  }
  
  ${SearchInput}:hover + & {
    color: ${props => props.theme.primary};
    transform: translateY(-50%) scale(1.05);
  }
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
  color: ${props => props.theme.text};
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
    color: ${props => props.theme.text};

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
  transition: color 0.3s ease, background-color 0.3s ease;

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
  const [currentTrack] = useState(0);
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
    <Nav>
      <NavContainer>
        <LeftNavActions>
          <Logo to="/">
            <LogoIcon>
              <img src="/images/feellink.logo.png" alt="Feellink Logo" />
            </LogoIcon>
          </Logo>
          
          <MenuItems>
            {user && (
              <>
                <MenuItem to="/saved" className={isActive('/saved') ? 'active' : ''}>
                  <MenuIcon>
                    <FiBookmark size={20} />
                  </MenuIcon>
                  Kaydedilenler
                </MenuItem>
                <MenuItem to={`/profile/${user.username}`} className={isActive(`/profile/${user.username}`) ? 'active' : ''}>
                  <MenuIcon>
                    <FiUser size={20} />
                  </MenuIcon>
                  Profil
                </MenuItem>
              </>
            )}
          </MenuItems>
        </LeftNavActions>

        <CenterSearch>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Sanat eserleri, sanatçılar ara..."
              onClick={() => navigate('/explore')}
            />
            <SearchIcon>
              <FiSearch size={18} />
            </SearchIcon>
          </SearchContainer>
        </CenterSearch>

        <NavActions>
          <MusicToggle onClick={toggleMusic} isPlaying={isMusicPlaying}>
            {isMusicPlaying ? <FiVolume2 size={20} /> : <FiVolumeX size={20} />}
          </MusicToggle>
          
          <ThemeToggle onClick={toggleTheme}>
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </ThemeToggle>

          {user ? (
            <UserMenu>
              <UserButton onClick={() => setShowUserMenu(!showUserMenu)}>
                {user.avatar ? (
                  <UserAvatar src={user.avatar} alt={user.fullName} />
                ) : (
                  user.fullName.charAt(0).toUpperCase()
                )}
              </UserButton>

              <AnimatePresence>
                {showUserMenu && (
                  <Dropdown
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DropdownItem onClick={() => navigate(`/profile/${user.username}`)}>
                      <FiUser size={14} />
                      Profilim
                    </DropdownItem>
                    <DropdownItem onClick={() => navigate('/saved')}>
                      <FiBookmark size={18} />
                      Kaydedilenler
                    </DropdownItem>
                    <DropdownItem onClick={() => navigate('/settings')}>
                      <FiSettings size={18} />
                      Ayarlar
                    </DropdownItem>
                    <DropdownItem onClick={handleLogout}>
                      <FiLogOut size={18} />
                      Çıkış Yap
                    </DropdownItem>
                  </Dropdown>
                )}
              </AnimatePresence>
            </UserMenu>
          ) : (
            <AuthButtons>
              <AuthButton to="/login" className="secondary">
                Giriş Yap
              </AuthButton>
              <AuthButton to="/register" className="primary">
                Kayıt Ol
              </AuthButton>
            </AuthButtons>
          )}

          <MobileMenuButton onClick={() => setShowMobileMenu(!showMobileMenu)}>
            {showMobileMenu ? <FiX size={20} /> : <FiMenu size={20} />}
          </MobileMenuButton>
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
            <MobileNavLink to="/" onClick={() => setShowMobileMenu(false)}>
              <FiHome size={18} />
              Ana Sayfa
            </MobileNavLink>
            <MobileNavLink to="/explore" onClick={() => setShowMobileMenu(false)}>
              <FiSearch size={18} />
              Keşfet
            </MobileNavLink>
            {user && (
              <>
                <MobileNavLink to="/saved" onClick={() => setShowMobileMenu(false)}>
                  <FiBookmark size={18} />
                  Kaydedilenler
                </MobileNavLink>
                <MobileNavLink to={`/profile/${user.username}`} onClick={() => setShowMobileMenu(false)}>
                  <FiUser size={14} />
                  Profil
                </MobileNavLink>
                <MobileNavLink to="/settings" onClick={() => setShowMobileMenu(false)}>
                  <FiSettings size={18} />
                  Ayarlar
                </MobileNavLink>
                <MobileNavLink to="#" onClick={handleLogout}>
                  <FiLogOut size={18} />
                  Çıkış Yap
                </MobileNavLink>
              </>
            )}
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
