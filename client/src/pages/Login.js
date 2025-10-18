import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
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


const LoginCard = styled(motion.div)`
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
  width: 600px;
  height: 240px;
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

  const { login } = useAuth();
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

  return (
    <Container>
        <LoginCard
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Logo>
            <LogoIcon>
              <img src="/images/feellink.logo.png" alt="Feellink Logo" />
            </LogoIcon>
            <LogoSubtext>Hesabınıza giriş yapın</LogoSubtext>
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

            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              <FiArrowRight size={18} />
            </SubmitButton>
          </Form>

          <Divider>
            <span>veya</span>
          </Divider>

          <SignupLink>
            Hesabınız yok mu?{' '}
            <Link to="/register">Kayıt olun</Link>
          </SignupLink>
        </LoginCard>
    </Container>
  );
};

export default Login;