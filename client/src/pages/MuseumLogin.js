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
`;

const LoginCard = styled(motion.div)`
  background: ${props => props.theme.surface};
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.border};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
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
  padding: 16px 20px;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
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
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
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
          navigate('/museum-dashboard');
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

        <div style={{ 
          marginTop: '20px', 
          padding: '16px', 
          background: theme.background, 
          borderRadius: '8px',
          fontSize: '12px',
          color: theme.textSecondary,
          textAlign: 'center'
        }}>
          <strong>Test Bilgileri:</strong><br />
          E-posta: muzesahibi@feellink.com<br />
          Şifre: muzesahibi123
        </div>
      </LoginCard>
    </Container>
  );
};

export default MuseumLogin;
