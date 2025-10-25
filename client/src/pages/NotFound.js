import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft, FiSearch } from 'react-icons/fi';

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Content = styled.div`
  text-align: center;
  max-width: 600px;
`;

const ErrorCode = styled(motion.h1)`
  font-size: 8rem;
  font-weight: 800;
  color: ${props => props.theme.primary};
  margin-bottom: 24px;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 6rem;
  }
`;

const ErrorTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ErrorDescription = styled(motion.p)`
  font-size: 1.1rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 40px;
  line-height: 1.6;
`;

const Actions = styled(motion.div)`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

const ActionButton = styled(Link)`
  padding: 12px 24px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &.primary {
    background: ${props => props.theme.primary};
    color: white;

    &:hover {
      background: ${props => props.theme.primaryHover};
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(255, 107, 53, 0.3);
    }
  }

  &.secondary {
    background: ${props => props.theme.surface};
    color: ${props => props.theme.text};
    border: 1px solid ${props => props.theme.border};

    &:hover {
      background: ${props => props.theme.surfaceHover};
      transform: translateY(-2px);
    }
  }
`;

const Illustration = styled(motion.div)`
  font-size: 8rem;
  margin-bottom: 32px;
  opacity: 0.8;
`;

const NotFound = () => {
  return (
    <Container>
      <Content>
        <Illustration
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          🔍
        </Illustration>

        <ErrorCode
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          404
        </ErrorCode>

        <ErrorTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Sayfa Bulunamadı
        </ErrorTitle>

        <ErrorDescription
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Aradığınız sayfa mevcut değil veya taşınmış olabilir. 
          Ana sayfaya dönerek aramaya devam edebilirsiniz.
        </ErrorDescription>

        <Actions
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <ActionButton to="/" className="primary">
            <FiHome size={18} />
            Ana Sayfa
          </ActionButton>
          
          <ActionButton to="/explore" className="secondary">
            <FiSearch size={18} />
            Keşfet
          </ActionButton>
          
          <ActionButton to="#" onClick={() => window.history.back()} className="secondary">
            <FiArrowLeft size={18} />
            Geri Dön
          </ActionButton>
        </Actions>
      </Content>
    </Container>
  );
};

export default NotFound;














