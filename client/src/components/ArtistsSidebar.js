import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiHeart, FiMessageCircle, FiCalendar, FiTrendingUp } from 'react-icons/fi';

const SidebarContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: ${props => props.theme.surface};
  border-radius: 0 0 0 16px;
  padding: 24px;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};
  border-right: none;
  border-top: 1px solid ${props => props.theme.border};
  overflow-y: auto;
  position: relative;
  z-index: 10;
  display: flex !important;
  flex-direction: column;
  visibility: visible !important;
  opacity: 1 !important;
  margin-top: 0;
  padding-top: 24px;

  @media (max-width: 1200px) {
    display: none;
  }
`;

const SidebarTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ArticleCard = styled.div`
  background: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  transition: none; /* Hover efektlerini kaldır */

  &:hover {
    /* Hover efektleri kaldırıldı */
  }
`;

const ArticleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  position: relative;
`;

const AuthorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.text};
  font-weight: 600;
  font-size: 0.9rem;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const AuthorInfo = styled.div`
  flex: 1;
`;

const AuthorName = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0 0 2px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WaveIcon = styled.span`
  font-size: 1.2rem;
  animation: wave 2s ease-in-out infinite;
  transform-origin: 70% 70%;
  
  @keyframes wave {
    0%, 100% { transform: rotate(0deg); }
    10%, 30% { transform: rotate(14deg); }
    20% { transform: rotate(-8deg); }
    40% { transform: rotate(14deg); }
    50% { transform: rotate(-4deg); }
    60% { transform: rotate(10deg); }
    70% { transform: rotate(0deg); }
  }
`;

const VerifiedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 50%;
  margin-left: 6px;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
  font-size: 10px;
  color: ${props => props.theme.text};
  font-weight: bold;
  border: 2px solid ${props => props.theme.surface};
`;

const ArticleDate = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ArticleTitle = styled.h5`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0 0 8px 0;
  line-height: 1.4;
`;

const ArticleExcerpt = styled.p`
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
  line-height: 1.5;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ArticleStats = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TrendingBadge = styled.div`
  background: ${props => props.theme.gradient};
  color: ${props => props.theme.text};
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  position: absolute;
  right: 0;
  top: 20%;
  transform: translateY(-50%);
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 16px;
`;

const ButtonArea = styled.div`
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.border};
`;

const ViewAllButton = styled.button`
  width: 100%;
  padding: 12px;
  background: ${props => props.theme.gradient};
  color: ${props => props.theme.text};
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: none; /* Hover efektlerini kaldır */

  &:hover {
    /* Hover efektleri kaldırıldı */
  }
`;

// Müze kartları için CSS
const MuseumsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
`;

const MuseumCard = styled.div`
  background: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.shadow};
  }
`;

const MuseumImage = styled.div`
  width: 100%;
  height: 80px;
  border-radius: 8px;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  margin-bottom: 8px;
`;

const MuseumName = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0 0 4px 0;
`;

const MuseumVisitors = styled.p`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
  margin: 0;
`;



const ArtistsSidebar = () => {
  const navigate = useNavigate();
  
  // Mock data for artist articles
  const articles = [
    {
      id: 1,
      author: {
        name: "Zeynep Esmer",
        avatar: "/zeynep.jpg",
        isVerified: true
      },
      title: "Dijital Sanatta Yeni Dönem: AI ile Yaratıcılık",
      excerpt: "Yapay zeka teknolojilerinin sanat dünyasına etkisi ve yaratıcı süreçlerdeki rolü hakkında düşüncelerim...",
      date: "2 gün önce",
      likes: 124,
      comments: 23,
      isTrending: true
    },
    {
      id: 2,
      author: {
        name: "Mehmet Özkan",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format",
        isVerified: true
      },
      title: "Minimalist Tasarımın Gücü",
      excerpt: "Sade ve etkili tasarım prensipleri ile nasıl daha güçlü görsel hikayeler anlatabiliriz?",
      date: "4 gün önce",
      likes: 89,
      comments: 15,
      isTrending: false
    },
    {
      id: 3,
      author: {
        name: "Sude Esmer",
        avatar: "/sude.jpg",
        isVerified: false
      },
      title: "Renk Teorisi ve Duygusal Tasarım",
      excerpt: "Renklerin psikolojik etkileri ve kullanıcı deneyimindeki önemi üzerine bir analiz...",
      date: "1 hafta önce",
      likes: 67,
      comments: 12,
      isTrending: false
    },
    {
      id: 4,
      author: {
        name: "Can Yılmaz",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format",
        isVerified: true
      },
      title: "Sürdürülebilir Tasarım Yaklaşımları",
      excerpt: "Çevre dostu tasarım prensipleri ve gelecek nesillere bırakacağımız miras...",
      date: "1 hafta önce",
      likes: 156,
      comments: 31,
      isTrending: true
    }
  ];

  // Ayın öne çıkan müzeleri
  const featuredMuseums = [
    {
      id: 1,
      name: "İstanbul Modern",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=200&fit=crop",
      visitors: "2.4K ziyaretçi"
    },
    {
      id: 2,
      name: "Pera Müzesi",
      image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=200&h=200&fit=crop",
      visitors: "1.8K ziyaretçi"
    },
    {
      id: 3,
      name: "Sakıp Sabancı Müzesi",
      image: "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=200&h=200&fit=crop",
      visitors: "3.2K ziyaretçi"
    },
    {
      id: 4,
      name: "Rahmi Koç Müzesi",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=200&fit=crop",
      visitors: "1.5K ziyaretçi"
    }
  ];

  return (
    <SidebarContainer>
      <SidebarTitle>
        <FiTrendingUp size={20} />
        Ayın Öne Çıkan Müzeleri
      </SidebarTitle>

      <MuseumsGrid>
        {featuredMuseums.map((museum) => (
          <MuseumCard key={museum.id}>
            <MuseumImage image={museum.image} />
            <MuseumName>{museum.name}</MuseumName>
            <MuseumVisitors>{museum.visitors}</MuseumVisitors>
          </MuseumCard>
        ))}
      </MuseumsGrid>

      <SidebarTitle>
        <FiTrendingUp size={20} />
        Sanatçı Köşe Yazıları
      </SidebarTitle>

      <ContentArea>
        {articles.map((article) => (
          <ArticleCard key={article.id}>
            <ArticleHeader>
              <AuthorAvatar>
                <img 
                  src={article.author.avatar} 
                  alt={article.author.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div style={{ display: 'none', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                  {article.author.name.split(' ').map(n => n[0]).join('')}
                </div>
              </AuthorAvatar>
              <AuthorInfo>
                <AuthorName>
                  {article.author.name}
                  {article.author.isVerified && <VerifiedBadge>✓</VerifiedBadge>}
                  <WaveIcon>👋</WaveIcon>
                </AuthorName>
                <ArticleDate>
                  <FiCalendar size={12} />
                  {article.date}
                </ArticleDate>
              </AuthorInfo>
              {article.isTrending && (
                <TrendingBadge>
                  <FiTrendingUp size={10} />
                </TrendingBadge>
              )}
            </ArticleHeader>

            <ArticleTitle>{article.title}</ArticleTitle>
            <ArticleExcerpt>{article.excerpt}</ArticleExcerpt>

            <ArticleStats>
              <StatItem>
                <FiHeart size={12} />
                {article.likes}
              </StatItem>
              <StatItem>
                <FiMessageCircle size={12} />
                {article.comments}
              </StatItem>
            </ArticleStats>
          </ArticleCard>
        ))}
      </ContentArea>

      <ButtonArea>
        <ViewAllButton onClick={() => navigate('/articles')}>
          Tüm Yazıları Gör
        </ViewAllButton>
      </ButtonArea>
    </SidebarContainer>
  );
};

export default ArtistsSidebar;
