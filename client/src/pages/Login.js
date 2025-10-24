import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiHome, FiShield } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  
  /* Giriş sayfasına özel sınıf - Feellink logo renkleri ile uyumlu */
  &.login-page-container {
    background: ${props => props.theme.background};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(255, 107, 53, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(247, 147, 30, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 60% 60%, rgba(255, 107, 53, 0.08) 0%, transparent 50%);
    pointer-events: none;
  }
`;


const LoginCard = styled.div`
  background: ${props => props.theme.surface};
  border: 3px solid ${props => props.theme.surface};
  border-radius: 28px;
  padding: 4px 40px 12px 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 
    0 25px 80px rgba(0, 0, 0, 0.1),
    0 12px 35px rgba(0, 0, 0, 0.05),
    0 5px 15px rgba(0, 0, 0, 0.1),
    inset 0 2px 0 rgba(255, 255, 255, 0.8);
  position: relative;
  z-index: 10;
  
  /* Giriş sayfasına özel sınıf */
  &.login-page-card {
    background: ${props => props.theme.surface};
    border: 3px solid ${props => props.theme.surface};
    padding: 4px 40px 12px 40px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: ${props => props.theme.surface};
    border-radius: 28px;
    z-index: -1;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 0px;
`;

const LogoIcon = styled.div`
  width: 600px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  transform: translateX(-150px);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;


const LogoSubtext = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: -10px;
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
  color: #2C1810;
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid ${props => props.theme.primary};
  border-radius: 18px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 
    0 6px 20px rgba(255, 107, 53, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primaryHover};
    background: ${props => props.theme.surfaceHover};
    box-shadow: 
      0 0 0 4px rgba(255, 107, 53, 0.3),
      0 12px 35px rgba(255, 107, 53, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    transform: translateY(-3px);
  }

  &::placeholder {
    color: ${props => props.theme.primary};
    font-weight: 400;
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
  padding: 18px;
  background: ${props => props.theme.gradient};
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  box-shadow: 
    0 8px 25px rgba(255, 107, 53, 0.4),
    0 4px 15px rgba(247, 147, 30, 0.3),
    inset 0 2px 0 rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 15px 45px rgba(255, 107, 53, 0.5),
      0 8px 25px rgba(247, 147, 30, 0.4),
      inset 0 2px 0 rgba(255, 255, 255, 0.4);
    background: ${props => props.theme.primaryHover};
  }

  &:active {
    transform: translateY(-2px);
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
  margin: 15px 0;
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
    background: ${props => props.theme.surface};
    padding: 0 20px;
    position: relative;
    z-index: 2;
    display: inline-block;
  }
`;

const SignupLink = styled.div`
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

const AlternativeLogins = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AlternativeLoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 20px;
  border: 2px solid ${props => props.theme.border};
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.color || props.theme.primary};
    background: ${props => props.color ? props.color + '10' : props.theme.primary + '10'};
    transform: translateY(-1px);
  }

  svg {
    font-size: 18px;
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

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPanel, setCurrentPanel] = useState('login'); // Panel state'i

  const { login } = useAuth();
  const { theme } = useTheme();
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

    console.log('Login attempt:', { email: formData.email, password: formData.password });

    try {
      const result = await login(formData.email, formData.password);
      console.log('Login result:', result);
      if (result.success) {
        console.log('Login successful, navigating to home');
        navigate('/');
      } else {
        setError(result.message || 'Giriş yapılırken bir hata oluştu');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Giriş yapılırken bir hata oluştu');
    }
    
    setLoading(false);
  };

  // Panel geçiş fonksiyonları
  const switchToRegister = () => {
    navigate('/register');
  };

  const switchToLogin = () => {
    navigate('/login');
  };

  const switchToForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <Container className="login-page-container" theme={theme}>
        <LoginCard
          className="login-page-card"
          theme={theme}
        >
          <Logo>
            <LogoIcon>
              <img src="/images/feellink.logo.png" alt="Feellink Logo" />
            </LogoIcon>
          </Logo>

          <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}

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
                  theme={theme}
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
                  theme={theme}
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

            <SubmitButton type="submit" disabled={loading} theme={theme}>
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              <FiArrowRight size={18} />
            </SubmitButton>
          </Form>

          <Divider>
            <span>veya</span>
          </Divider>

          <SignupLink theme={theme}>
            Hesabınız yok mu?{' '}
            <button 
              type="button" 
              onClick={switchToRegister}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: theme.primary, 
                textDecoration: 'none', 
                fontWeight: 600, 
                cursor: 'pointer',
                fontSize: 'inherit'
              }}
            >
              Kayıt olun
            </button>
          </SignupLink>

          <AlternativeLogins>
            <AlternativeLoginButton 
              theme={theme} 
              color="#667eea"
              onClick={() => navigate('/museum-login')}
            >
              <FiHome />
              Müze Sahibi Girişi
            </AlternativeLoginButton>
            
            <AlternativeLoginButton 
              theme={theme} 
              color="#f093fb"
              onClick={() => navigate('/admin-login')}
            >
              <FiShield />
              Admin Girişi
            </AlternativeLoginButton>
          </AlternativeLogins>
        </LoginCard>
    </Container>
  );
};

export default Login;