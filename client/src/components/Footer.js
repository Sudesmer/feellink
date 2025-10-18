import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const FooterContainer = styled.footer`
  background: ${props => props.theme.surface};
  border-top: 1px solid ${props => props.theme.border};
  padding: 40px 0 20px;
  margin-top: 80px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: 800;
  color: ${props => props.theme.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${props => props.theme.gradient};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

const Description = styled.p`
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
  max-width: 300px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
`;

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.surfaceHover};
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.primary};
    color: white;
    transform: translateY(-2px);
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h3`
  color: ${props => props.theme.text};
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const FooterLink = styled(Link)`
  color: ${props => props.theme.textSecondary};
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid ${props => props.theme.border};
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: ${props => props.theme.textMuted};
  font-size: 14px;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <Container>
        <FooterContent>
          <BrandSection>
            <Logo to="/">
              <LogoIcon>F</LogoIcon>
              Feellink
            </Logo>
            <Description>
              Yaratıcı tasarımcıların buluşma noktası. Eserlerinizi paylaşın, 
              ilham alın ve yaratıcı toplulukla bağlantı kurun.
            </Description>
            <SocialLinks>
              <SocialLink href="#" aria-label="GitHub">
                <FiGithub size={20} />
              </SocialLink>
              <SocialLink href="#" aria-label="Twitter">
                <FiTwitter size={20} />
              </SocialLink>
              <SocialLink href="#" aria-label="Instagram">
                <FiInstagram size={20} />
              </SocialLink>
              <SocialLink href="#" aria-label="LinkedIn">
                <FiLinkedin size={20} />
              </SocialLink>
            </SocialLinks>
          </BrandSection>

          <FooterSection>
            <SectionTitle>Platform</SectionTitle>
            <FooterLink to="/explore">Keşfet</FooterLink>
            <FooterLink to="/categories">Kategoriler</FooterLink>
            <FooterLink to="/featured">Öne Çıkanlar</FooterLink>
            <FooterLink to="/trending">Trendler</FooterLink>
          </FooterSection>

          <FooterSection>
            <SectionTitle>Topluluk</SectionTitle>
            <FooterLink to="/guidelines">Topluluk Kuralları</FooterLink>
            <FooterLink to="/help">Yardım</FooterLink>
            <FooterLink to="/contact">İletişim</FooterLink>
            <FooterLink to="/feedback">Geri Bildirim</FooterLink>
          </FooterSection>

          <FooterSection>
            <SectionTitle>Yasal</SectionTitle>
            <FooterLink to="/privacy">Gizlilik Politikası</FooterLink>
            <FooterLink to="/terms">Kullanım Şartları</FooterLink>
            <FooterLink to="/cookies">Çerez Politikası</FooterLink>
            <FooterLink to="/dmca">DMCA</FooterLink>
          </FooterSection>
        </FooterContent>

        <FooterBottom>
          <Copyright>
            © 2024 Feellink. Tüm hakları saklıdır.
          </Copyright>
          <FooterLinks>
            <FooterLink to="/privacy">Gizlilik</FooterLink>
            <FooterLink to="/terms">Şartlar</FooterLink>
            <FooterLink to="/cookies">Çerezler</FooterLink>
          </FooterLinks>
        </FooterBottom>
      </Container>
    </FooterContainer>
  );
};

export default Footer;

