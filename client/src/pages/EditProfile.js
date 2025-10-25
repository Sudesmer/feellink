import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FiArrowLeft,
  FiSave,
  FiCamera,
  FiX,
  FiUser,
  FiMail,
  FiMapPin,
  FiGlobe,
  FiEdit3,
  FiLock,
  FiUnlock
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
  padding: 0;
  margin: 0;
`;

const Header = styled.div`
  background: ${props => props.theme.background};
  border-bottom: 1px solid ${props => props.theme.border};
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const BackButton = styled.button`
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
    background: ${props => props.theme.hover};
  }
`;

const HeaderTitle = styled.h1`
  color: ${props => props.theme.text};
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

const SaveButton = styled.button`
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-left: auto;

  &:hover {
    background: ${props => props.theme.primaryHover};
  }

  &:disabled {
    background: ${props => props.theme.border};
    cursor: not-allowed;
  }
`;

const Content = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h3`
  color: ${props => props.theme.text};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  background: ${props => props.theme.background};
`;

const AvatarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  border: 3px solid ${props => props.theme.border};
`;

const AvatarImg = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${props => props.theme.border};
`;

const PhotoUploadButton = styled.button`
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.theme.primary};
  border: 2px solid ${props => props.theme.background};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.primaryHover};
    transform: scale(1.1);
  }
`;

const AvatarText = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  text-align: center;
  margin: 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: ${props => props.theme.text};
  font-weight: 600;
  font-size: 0.9rem;
`;

const Input = styled.input`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 12px 16px;
  color: ${props => props.theme.text};
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const TextArea = styled.textarea`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 12px 16px;
  color: ${props => props.theme.text};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
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
  max-width: 400px;
  width: 90%;
`;

const PhotoUploadTitle = styled.h3`
  color: ${props => props.theme.text};
  margin: 0 0 20px 0;
  font-size: 1.25rem;
  font-weight: 600;
`;

const PhotoPreview = styled.div`
  width: 150px;
  height: 150px;
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
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
`;

const PhotoUploadButton2 = styled.button`
  flex: 0 0 auto;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  
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

const ToggleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.background};
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${props => props.theme.text};
  font-weight: 500;
  cursor: pointer;
  
  svg {
    font-size: 1.2rem;
    color: ${props => props.isPrivate ? '#FF6B35' : props.theme.textSecondary};
  }
`;

const ToggleSwitch = styled.button`
  position: relative;
  width: 48px;
  height: 26px;
  border-radius: 13px;
  border: none;
  background: ${props => props.isActive ? '#FF6B35' : props.theme.border};
  cursor: pointer;
  transition: background 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.isActive ? '22px' : '2px'};
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: white;
    transition: left 0.3s ease;
  }
`;

const EditProfile = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();
  
  // localStorage'dan profil verilerini yükle - her kullanıcı kendi bilgilerini girebilsin
  const getUserKey = (key) => {
    // Kullanıcı email'ini key'e ekle (her kullanıcı için ayrı localStorage)
    const userEmail = user?.email || 'anonymous';
    return `${key}_${userEmail}`;
  };

  const getStoredProfileData = () => {
    try {
      // Kullanıcıya özel localStorage key'leri kullan
      const userBio = localStorage.getItem(getUserKey('userBio')) || '';
      const userWebsite = localStorage.getItem(getUserKey('userWebsite')) || '';
      const userLocation = localStorage.getItem(getUserKey('userLocation')) || '';
      
      return {
        fullName: user?.fullName || '',
        username: user?.username || user?.email?.split('@')[0] || '',
        email: user?.email || '',
        bio: userBio,
        website: userWebsite,
        location: userLocation
      };
    } catch (error) {
      console.error('Profil verileri okuma hatası:', error);
      return {
        fullName: user?.fullName || '',
        username: user?.username || user?.email?.split('@')[0] || '',
        email: user?.email || '',
        bio: '',
        website: '',
        location: ''
      };
    }
  };

  const [formData, setFormData] = useState(getStoredProfileData());
  
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(() => {
    // Önce localStorage'dan kullanıcıya özel profil fotoğrafını kontrol et
    const storedPhoto = localStorage.getItem(getUserKey('userProfilePhoto'));
    if (storedPhoto) {
      return storedPhoto;
    }
    // Yoksa user'dan avatar'ı al
    return user?.avatar || null;
  });
  const [isLoading, setIsLoading] = useState(false);
  // Gizli hesap durumu
  const [isPrivate, setIsPrivate] = useState(() => {
    const stored = localStorage.getItem(getUserKey('isPrivate'));
    return stored ? JSON.parse(stored) : false;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      // Fotoğrafı kullanıcıya özel localStorage'a kaydet
      localStorage.setItem(getUserKey('userProfilePhoto'), previewUrl);
      
      console.log('Fotoğraf kaydediliyor:', selectedFile);
      setShowPhotoUpload(false);
      setSelectedFile(null);
    }
  };

  const handleCancelPhoto = () => {
    setShowPhotoUpload(false);
    setSelectedFile(null);
    setPreviewUrl(user?.avatar || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Backend'e profil bilgilerini gönder (kalıcı kayıt için)
      const token = localStorage.getItem('feellink-token');
      
      try {
        const response = await axios.put('http://localhost:5000/api/auth/profile', 
          {
            bio: formData.bio,
            website: formData.website,
            location: formData.location,
            avatar: previewUrl || ''
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('✅ Profil backend\'e kaydedildi:', response.data);
      } catch (apiError) {
        console.error('Backend kayıt hatası:', apiError);
        // Backend hatası olsa bile localStorage'a kaydet (fallback)
      }
      
      // Her kullanıcı kendi bilgilerini ayrı ayrı kaydet (kullanıcıya özel localStorage)
      localStorage.setItem(getUserKey('userBio'), formData.bio);
      localStorage.setItem(getUserKey('userWebsite'), formData.website);
      localStorage.setItem(getUserKey('userLocation'), formData.location);
      
      // Profil fotoğrafını da kullanıcıya özel key'e kaydet
      if (previewUrl) {
        localStorage.setItem(getUserKey('userProfilePhoto'), previewUrl);
      }
      
      // Gizli hesap ayarını kaydet (email ve kullanıcı ID'sine göre)
      localStorage.setItem(getUserKey('isPrivate'), isPrivate.toString());
      
      // Ayrıca kullanıcı ID'sine göre de kaydet
      if (user?._id) {
        const isPrivateUserIdKey = `isPrivate_user_${user._id}`;
        localStorage.setItem(isPrivateUserIdKey, isPrivate.toString());
      }
      
      console.log('✅ Profil localStorage\'a kaydedildi');
      console.log('✅ Gizli hesap durumu:', isPrivate);
      
      // Başarılı güncelleme sonrası profil sayfasına yönlendir
      navigate('/profile');
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container theme={theme}>
      <Header theme={theme}>
        <BackButton theme={theme} onClick={() => navigate(-1)}>
          <FiArrowLeft size={20} />
        </BackButton>
        <HeaderTitle theme={theme}>Profili Düzenle</HeaderTitle>
        <SaveButton 
          theme={theme} 
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
        </SaveButton>
      </Header>

      <Content>
        <Form onSubmit={handleSubmit}>
          <Section>
            <SectionTitle theme={theme}>Profil Fotoğrafı</SectionTitle>
            <AvatarSection theme={theme}>
              <AvatarContainer>
                {previewUrl ? (
                  <AvatarImg src={previewUrl} alt="Profil" theme={theme} />
                ) : (
                  <Avatar theme={theme}>
                    {formData.fullName.charAt(0).toUpperCase()}
                  </Avatar>
                )}
                <PhotoUploadButton theme={theme} onClick={handlePhotoUpload}>
                  <FiCamera size={16} />
                </PhotoUploadButton>
              </AvatarContainer>
              <AvatarText theme={theme}>
                Profil fotoğrafınızı değiştirmek için kamera ikonuna tıklayın
              </AvatarText>
            </AvatarSection>
          </Section>

          <Section>
            <SectionTitle theme={theme}>Kişisel Bilgiler</SectionTitle>
            
            <FormGroup>
              <Label theme={theme}>Ad Soyad</Label>
              <Input
                theme={theme}
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Adınızı ve soyadınızı girin"
              />
            </FormGroup>

            <FormGroup>
              <Label theme={theme}>Kullanıcı Adı</Label>
              <Input
                theme={theme}
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Kullanıcı adınızı girin"
              />
            </FormGroup>

            <FormGroup>
              <Label theme={theme}>E-posta</Label>
              <Input
                theme={theme}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="E-posta adresinizi girin"
              />
            </FormGroup>

            <FormGroup>
              <Label theme={theme}>Hakkında</Label>
              <TextArea
                theme={theme}
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
              />
            </FormGroup>

            <FormGroup>
              <Label theme={theme}>Web Sitesi</Label>
              <Input
                theme={theme}
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </FormGroup>

            <FormGroup>
              <Label theme={theme}>Konum</Label>
              <Input
                theme={theme}
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Şehir, Ülke"
              />
            </FormGroup>
          </Section>
          
          <Section>
            <SectionTitle theme={theme}>Hesap Gizliliği</SectionTitle>
            <ToggleSection theme={theme}>
              <ToggleLabel 
                theme={theme} 
                isPrivate={isPrivate}
                onClick={() => setIsPrivate(!isPrivate)}
              >
                {isPrivate ? <FiLock /> : <FiUnlock />}
                Gizli Hesap
              </ToggleLabel>
              <ToggleSwitch 
                isActive={isPrivate} 
                onClick={() => setIsPrivate(!isPrivate)}
              />
            </ToggleSection>
            <p style={{ 
              color: theme.textSecondary, 
              fontSize: '0.875rem',
              marginTop: '8px',
              margin: '8px 0 0 0'
            }}>
              Gizli hesapta, sadece onayladığınız kişiler profilinizi, eserlerinizi ve yorumlarınızı görebilir.
            </p>
          </Section>
        </Form>
      </Content>

      {/* Fotoğraf Yükleme Modalı */}
      {showPhotoUpload && (
        <PhotoUploadModal onClick={handleCancelPhoto}>
          <PhotoUploadContent theme={theme} onClick={(e) => e.stopPropagation()}>
            <PhotoUploadTitle theme={theme}>Profil Fotoğrafı Değiştir</PhotoUploadTitle>
            
            <PhotoPreview theme={theme}>
              {previewUrl ? (
                <PhotoPreviewImg src={previewUrl} alt="Önizleme" />
              ) : (
                <div style={{ color: theme.text, fontSize: '2.5rem' }}>
                  <FiCamera />
                </div>
              )}
            </PhotoPreview>

            <HiddenFileInput
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
            />

            <PhotoUploadActions>
              <PhotoUploadButton2 
                theme={theme} 
                onClick={() => document.querySelector('input[type="file"]').click()}
              >
                Fotoğraf Seç
              </PhotoUploadButton2>
              
              {selectedFile && (
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
    </Container>
  );
};

export default EditProfile;
