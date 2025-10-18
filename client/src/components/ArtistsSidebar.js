import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
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
  display: flex;
  flex-direction: column;

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

const ArticleCard = styled(motion.div)`
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
`;

const AuthorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
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
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
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

const ViewAllButton = styled(motion.button)`
  width: 100%;
  padding: 12px;
  background: ${props => props.theme.gradient};
  color: white;
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



const ArtistsSidebar = () => {
  // Mock data for artist articles
  const articles = [
    {
      id: 1,
      author: {
        name: "Zeynep Kaya",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face&auto=format",
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
        name: "Ayşe Demir",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format",
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

  return (
    <SidebarContainer>
      <SidebarTitle>
        <FiTrendingUp size={20} />
        Sanatçı Köşe Yazıları
      </SidebarTitle>

      <ContentArea>
        {articles.map((article, index) => (
          <ArticleCard
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
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
                  {article.author.isVerified && " ✓"}
                </AuthorName>
                <ArticleDate>
                  <FiCalendar size={12} />
                  {article.date}
                </ArticleDate>
              </AuthorInfo>
              {article.isTrending && (
                <TrendingBadge>
                  <FiTrendingUp size={10} />
                  Trend
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
        <ViewAllButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Tüm Yazıları Gör
        </ViewAllButton>
      </ButtonArea>
    </SidebarContainer>
  );
};

export default ArtistsSidebar;
