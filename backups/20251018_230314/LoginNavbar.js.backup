import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: transparent;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
`;

const NavContainer = styled.div`
  max-width: 100%;
  margin: 0;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: auto;
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
  gap: 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.theme.gradient};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
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

const LoginNavbar = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Nav>
      <NavContainer>
        <NavActions>
          <ThemeToggle onClick={toggleTheme}>
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </ThemeToggle>
        </NavActions>
      </NavContainer>
    </Nav>
  );
};

export default LoginNavbar;
