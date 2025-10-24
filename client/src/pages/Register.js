import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
`;

const LeafContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const Leaf = styled(motion.div)`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.color};
  border-radius: 0 100% 0 100%;
  opacity: 0.8;
  top: -10px;
  left: ${props => props.left}%;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-right: 60px;
  height: 100vh;
`;

const ArtworkTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 900;
  color: #000000;
  margin-bottom: 20px;
  text-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  animation: pulse 2s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); filter: brightness(1); }
    50% { transform: scale(1.05); filter: brightness(1.2); }
  }
`;

const ArtworkSubtitle = styled.p`
  font-size: 1.2rem;
  color: #FFFFFF;
  margin-bottom: 40px;
  line-height: 1.6;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
`;

const ArtworkContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  max-width: 400px;
`;

const FloatingElement = styled(motion.div)`
  width: 80px;
  height: 80px;
  background: ${props => props.gradient};
  border-radius: 20px;
  filter: blur(1px);
  opacity: 0.8;
`;

const RightSection = styled.div`
  flex: 0 0 400px;
  display: flex;
  align-items: flex-start;
  padding-top: 0px;
`;

const RegisterCard = styled.div`
  background: #1a1a1a;
  border: 1px solid ${props => props.theme.border};
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px ${props => props.theme.shadow};
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const LogoIcon = styled.div`
  width: 200px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

// const LogoText = styled.h1`
//   font-size: 2rem;
//   font-weight: 800;
//   color: ${props => props.theme.primary};
//   margin-bottom: 8px;
// `;

const LogoSubtext = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 1px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  background: #FFFFFF;
  color: #000000;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }

  &::placeholder {
    color: #666666;
  }
`;

const PasswordContainer = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;

  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background: ${props => props.theme.gradient};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px ${props => props.theme.primary}40;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Divider = styled.div`
  text-align: center;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  margin: 20px 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: ${props => props.theme.border};
    z-index: 1;
  }

  span {
    background: #1a1a1a;
    padding: 0 20px;
    position: relative;
    z-index: 2;
    display: inline-block;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;

  a {
    color: ${props => props.theme.primary};
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;

    &:hover {
      color: ${props => props.theme.primary};
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  border: 1px solid #fecaca;
`;

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPanel, setCurrentPanel] = useState('register'); // Panel state'i

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
        username: formData.email.split('@')[0] // Email'den username oluştur
      };
      
      const result = await register(userData);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Kayıt olurken bir hata oluştu');
      }
    } catch (err) {
      setError(err.message || 'Kayıt olurken bir hata oluştu');
    }
    
    setLoading(false);
  };

  // Panel geçiş fonksiyonları
  const switchToLogin = () => {
    window.location.href = '/login';
  };

  const switchToForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <Container>
      <RightSection>
        <RegisterCard>
          <Logo>
            <LogoIcon>
              <img src="/images/feellink.logo.png" alt="Feellink Logo" />
            </LogoIcon>
            <LogoSubtext>Hesap oluşturun</LogoSubtext>
          </Logo>

          <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <FormGroup>
              <Label htmlFor="name">Ad Soyad</Label>
              <InputContainer>
                <FiUser style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999', zIndex: 1 }} />
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Adınız ve soyadınız"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: '50px' }}
                />
              </InputContainer>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">E-posta</Label>
              <InputContainer>
                <FiMail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999', zIndex: 1 }} />
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="ornek@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: '50px' }}
                />
              </InputContainer>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Şifre</Label>
              <PasswordContainer>
                <FiLock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999', zIndex: 1 }} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Şifrenizi girin"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: '50px', paddingRight: '50px' }}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </PasswordToggle>
              </PasswordContainer>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
              <PasswordContainer>
                <FiLock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999', zIndex: 1 }} />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Şifrenizi tekrar girin"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: '50px', paddingRight: '50px' }}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </PasswordToggle>
              </PasswordContainer>
            </FormGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
              <FiArrowRight size={18} />
            </SubmitButton>
          </Form>

          <Divider>
            <span>veya</span>
          </Divider>

          <LoginLink>
            Zaten hesabınız var mı?{' '}
            <button 
              type="button" 
              onClick={switchToLogin}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#FF6B35', 
                textDecoration: 'none', 
                fontWeight: 600, 
                cursor: 'pointer',
                fontSize: 'inherit'
              }}
            >
              Giriş yapın
            </button>
          </LoginLink>
        </RegisterCard>
      </RightSection>
    </Container>
  );
};

export default Register;