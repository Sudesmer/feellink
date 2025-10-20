import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiHome, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
  }
`;

const LoginCard = styled(motion.div)`
  background: ${props => props.theme.surface};
  border-radius: 24px;
  padding: 48px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.15);
  border: 1px solid ${props => props.theme.border};
  backdrop-filter: blur(20px);
  position: relative;
  z-index: 10;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
    border-radius: 24px;
    z-index: -1;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const IconContainer = styled.div`
  width: 96px;
  height: 96px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: 0 16px 32px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
    transform: rotate(45deg);
    animation: shine 3s infinite;
  }

  @keyframes shine {
    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
    50% { transform: translateX(100%) translateY(100%) rotate(45deg); }
    100% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${props => props.theme.textSecondary};
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 18px 24px;
  border: 2px solid ${props => props.theme.border};
  border-radius: 16px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 16px;
  font-weight: 500;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  &:hover {
    border-color: ${props => props.theme.primary};
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
    font-weight: 400;
  }
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
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.theme.text};
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 18px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 16px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 32px rgba(102, 126, 234, 0.4);
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 20px;
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.theme.text};
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c53030;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;
  border: 1px solid #feb2b2;
`;

const SuccessMessage = styled.div`
  background: #f0fff4;
  color: #2f855a;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;
  border: 1px solid #9ae6b4;
`;

const TestInfoCard = styled.div`
  margin-top: 24px;
  padding: 20px;
  background: ${props => props.theme.background};
  border-radius: 16px;
  border: 1px solid ${props => props.theme.border};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const TestInfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const TestInfoIcon = styled.div`
  font-size: 20px;
`;

const TestInfoTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const TestInfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TestInfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: ${props => props.theme.surface};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
`;

const TestInfoLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.textSecondary};
`;

const TestInfoValue = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.primary};
  font-family: 'Courier New', monospace;
`;

const MuseumLogin = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Mock museum login - in real app, this would be an API call
      if (formData.email === 'muzesahibi@feellink.com' && formData.password === 'muzesahibi123') {
        // Store museum authentication
        localStorage.setItem('museumAuth', 'true');
        localStorage.setItem('museumUser', JSON.stringify({
          id: 'museum_1',
          email: formData.email,
          name: 'İstanbul Modern Sanat Müzesi',
          type: 'museum'
        }));
        
        setSuccess('Giriş başarılı! Yönlendiriliyorsunuz...');
        
        setTimeout(() => {
          navigate('/museum-panel');
        }, 1500);
      } else {
        setError('Geçersiz müze sahibi bilgileri!');
      }
    } catch (error) {
      setError('Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToMain = () => {
    navigate('/login');
  };

  return (
    <Container>
      <LoginCard
        theme={theme}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <BackButton theme={theme} onClick={handleBackToMain}>
          <FiArrowLeft size={16} />
          Ana Giriş Sayfasına Dön
        </BackButton>

        <Header>
          <IconContainer>
            <FiHome size={40} color="white" />
          </IconContainer>
          <Title theme={theme}>Müze Sahibi Girişi</Title>
          <Subtitle theme={theme}>Müzenizi yönetmek için giriş yapın</Subtitle>
        </Header>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Input
              theme={theme}
              type="email"
              name="email"
              placeholder="Müze e-posta adresi"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Input
              theme={theme}
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Şifre"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <PasswordToggle
              theme={theme}
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </PasswordToggle>
          </InputGroup>

          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? 'Giriş yapılıyor...' : 'Müze Sahibi Olarak Giriş Yap'}
          </LoginButton>
        </Form>

        <TestInfoCard theme={theme}>
          <TestInfoHeader>
            <TestInfoIcon>🔑</TestInfoIcon>
            <TestInfoTitle>Test Bilgileri</TestInfoTitle>
          </TestInfoHeader>
          <TestInfoContent>
            <TestInfoItem>
              <TestInfoLabel>E-posta:</TestInfoLabel>
              <TestInfoValue>muzesahibi@feellink.com</TestInfoValue>
            </TestInfoItem>
            <TestInfoItem>
              <TestInfoLabel>Şifre:</TestInfoLabel>
              <TestInfoValue>muzesahibi123</TestInfoValue>
            </TestInfoItem>
          </TestInfoContent>
        </TestInfoCard>
      </LoginCard>
    </Container>
  );
};

export default MuseumLogin;
