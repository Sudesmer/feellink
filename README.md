# Feellink - Yaratıcı Tasarım Platformu

Behance benzeri modern bir tasarım platformu. Yaratıcı tasarımcıların eserlerini paylaştığı, ilham aldığı ve toplulukla bağlantı kurduğu bir platform.

## 🚀 Özellikler

### Genel Özellikler
- ✅ **Responsive Tasarım**: Web ve mobil uyumlu
- ✅ **Dark/Light Mode**: Koyu ve açık tema desteği
- ✅ **Modern UI**: Turuncu-beyaz renk teması
- ✅ **Animasyonlar**: Framer Motion ile smooth animasyonlar
- ✅ **Responsive Grid**: 5x5 eser görüntüleme sistemi

### Kullanıcı Özellikleri
- ✅ **Kullanıcı Kayıt/Giriş**: JWT tabanlı authentication
- ✅ **Profil Yönetimi**: Avatar, bio, sosyal medya linkleri
- ✅ **Eser Paylaşımı**: Çoklu resim, açıklama, kategori
- ✅ **Beğeni Sistemi**: Eserleri beğenme/beğenmeme
- ✅ **Kaydetme Sistemi**: Eserleri kaydetme
- ✅ **Takip Sistemi**: Kullanıcıları takip etme

### Platform Özellikleri
- ✅ **Ana Sayfa**: Öne çıkan eserler ve istatistikler
- ✅ **Keşfet**: Filtreleme, arama, sıralama
- ✅ **Profil**: Kullanıcı profilleri ve eserleri
- ✅ **Kaydedilenler**: Kaydedilen eserler
- ✅ **Eser Detayı**: Tam ekran görüntüleme

## 🛠️ Teknolojiler

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL veritabanı
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Şifre hashleme
- **Multer** - Dosya yükleme
- **CORS** - Cross-origin requests
- **Helmet** - Güvenlik
- **Rate Limiting** - API koruması

### Frontend
- **React 18** - UI kütüphanesi
- **React Router** - Sayfa yönlendirme
- **Styled Components** - CSS-in-JS
- **Framer Motion** - Animasyonlar
- **React Query** - Data fetching
- **Axios** - HTTP client
- **React Icons** - İkonlar
- **React Hot Toast** - Bildirimler

## 📁 Proje Yapısı

```
FEELLINK/
├── server.js                 # Ana server dosyası
├── package.json              # Backend dependencies
├── config.env                # Environment variables
├── models/                   # MongoDB modelleri
│   ├── User.js
│   ├── Work.js
│   └── Category.js
├── routes/                   # API route'ları
│   ├── auth.js
│   ├── users.js
│   ├── works.js
│   └── categories.js
├── middleware/               # Middleware'ler
│   └── auth.js
└── client/                   # React frontend
    ├── package.json
    ├── public/
    └── src/
        ├── components/       # React bileşenleri
        ├── pages/           # Sayfalar
        ├── contexts/       # Context providers
        └── App.js
```

## 🚀 Kurulum

### Gereksinimler
- Node.js (v16+)
- MongoDB
- npm veya yarn

### Backend Kurulumu

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Environment dosyasını düzenleyin:**
```bash
cp config.env.example config.env
# config.env dosyasını düzenleyin
```

3. **MongoDB'yi başlatın:**
```bash
mongod
```

4. **Server'ı başlatın:**
```bash
# Development
npm run dev

# Production
npm start
```

### Frontend Kurulumu

1. **Client dizinine gidin:**
```bash
cd client
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Development server'ı başlatın:**
```bash
npm start
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Mevcut kullanıcı bilgileri
- `POST /api/auth/refresh` - Token yenileme

### Users
- `GET /api/users/profile/:username` - Kullanıcı profili
- `PUT /api/users/profile` - Profil güncelleme
- `POST /api/users/follow/:userId` - Kullanıcı takip etme
- `DELETE /api/users/unfollow/:userId` - Takibi bırakma
- `GET /api/users/followers/:userId` - Takipçiler
- `GET /api/users/following/:userId` - Takip edilenler

### Works
- `GET /api/works` - Tüm eserler (filtreleme, arama, sayfalama)
- `GET /api/works/:id` - Eser detayı
- `POST /api/works` - Yeni eser oluşturma
- `PUT /api/works/:id` - Eser güncelleme
- `DELETE /api/works/:id` - Eser silme
- `POST /api/works/:id/like` - Eser beğenme/beğenmeme
- `POST /api/works/:id/save` - Eser kaydetme/kaydetmeme
- `GET /api/works/saved` - Kaydedilen eserler

### Categories
- `GET /api/categories` - Tüm kategoriler
- `GET /api/categories/:id` - Kategori detayı
- `GET /api/categories/:id/works` - Kategoriye ait eserler
- `POST /api/categories` - Yeni kategori (Admin)
- `PUT /api/categories/:id` - Kategori güncelleme (Admin)
- `DELETE /api/categories/:id` - Kategori silme (Admin)

## 🎨 Tasarım Sistemi

### Renkler
- **Primary**: #FF6B35 (Turuncu)
- **Primary Hover**: #E55A2B
- **Background**: #FFFFFF (Light) / #0D1117 (Dark)
- **Surface**: #F8F9FA (Light) / #161B22 (Dark)
- **Text**: #212529 (Light) / #F0F6FC (Dark)

### Typography
- **Font**: Inter
- **Weights**: 300, 400, 500, 600, 700, 800

### Spacing
- **Container**: max-width: 1200px
- **Padding**: 20px (desktop), 16px (mobile)
- **Gap**: 24px (grid), 16px (flex)

## 📱 Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: 768px - 1024px
- **Large**: > 1024px

## 🔒 Güvenlik

- JWT token authentication
- Password hashing (bcrypt)
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- XSS protection

## 🚀 Deployment

### Backend (Heroku/Railway)
```bash
# Environment variables ayarlayın
NODE_ENV=production
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

# Deploy
git push heroku main
```

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Build dosyalarını deploy edin
```

## 📝 Geliştirme Notları

### Yapılacaklar
- [ ] Dosya yükleme sistemi (Cloudinary)
- [ ] Real-time bildirimler
- [ ] Gelişmiş arama (Elasticsearch)
- [ ] Admin paneli
- [ ] Analytics
- [ ] PWA desteği
- [ ] Çoklu dil desteği

### Bilinen Sorunlar
- Dosya yükleme henüz implement edilmedi
- Real-time özellikler eksik
- Admin paneli yok

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👥 Geliştirici

**Feellink Team**
- Modern web teknolojileri
- Responsive tasarım
- User experience odaklı geliştirme

---

**Feellink** - Yaratıcılığınızı dünyayla paylaşın! 🎨✨

