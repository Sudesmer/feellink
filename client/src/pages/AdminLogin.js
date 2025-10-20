import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShield, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';

const AdminLoginContainer = styled(motion.div)`
  min-height: 100vh;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LoginCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  color: #666;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
    color: #333;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const LogoIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #FF6B35, #F7931E);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  color: white;
  font-size: 1.5rem;
`;

const LogoText = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin: 5px 0 0 0;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 1.5rem;
  font-weight: 600;
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
  padding: 15px 20px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #f8f9fa;

  &:focus {
    outline: none;
    border-color: #FF6B35;
    background: white;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: #333;
    background: #f0f0f0;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #FF6B35, #F7931E);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
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

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 12px 15px;
  border-radius: 8px;
  font-size: 0.9rem;
  border: 1px solid #fcc;
  margin-top: 10px;
`;

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Admin kimlik doğrulama
    const validAdmins = [
      { email: 'admin@feellink.com', username: 'admin', password: 'admin123' },
      { email: 'sude@feellink.com', username: 'sude', password: 'sude123' },
      { email: 'zeynep@feellink.com', username: 'zeynep', password: 'zeynep123' }
    ];

    const isValidAdmin = validAdmins.find(
      admin => admin.email === formData.email && 
      admin.username === formData.username && 
      admin.password === formData.password
    );

    if (isValidAdmin) {
      // Admin girişi başarılı
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminUser', formData.username);
      navigate('/admin');
    } else {
      setError('Geçersiz email, kullanıcı adı veya şifre. Lütfen tüm alanları kontrol edin.');
    }

    setLoading(false);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <AdminLoginContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <LoginCard
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <BackButton onClick={handleBack}>
          <FiArrowLeft />
        </BackButton>

        <Logo>
          <LogoIcon>
            <FiShield />
          </LogoIcon>
          <LogoText>Admin Panel</LogoText>
          <Subtitle>Yönetici Girişi</Subtitle>
        </Logo>

        <Title>Güvenli Giriş</Title>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Input
              type="email"
              name="email"
              placeholder="Admin Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Input
              type="text"
              name="username"
              placeholder="Admin Kullanıcı Adı"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Admin Şifre"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </PasswordToggle>
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <LoginButton type="submit" disabled={loading}>
            {loading ? 'Giriş Yapılıyor...' : 'Admin Girişi'}
          </LoginButton>
        </Form>
      </LoginCard>
    </AdminLoginContainer>
  );
};

export default AdminLogin;
