# Feellink - Behance Benzeri Tasarım Platformu

## 🚀 Teknoloji Stack

### **Backend (Node.js/Express)**
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT + bcryptjs
- **Security:** Helmet, CORS, Rate Limiting
- **File Upload:** Multer

### **Frontend (React)**
- **Framework:** React 18
- **Routing:** React Router DOM
- **State Management:** React Query
- **UI Components:** Custom CSS
- **Notifications:** React Hot Toast

### **Deployment**
- **Vercel:** Full-stack deployment (Frontend + Backend)
- **Netlify:** Static site deployment (Frontend only)

## 📁 Proje Yapısı

```
feellink/
├── api/                    # Vercel serverless functions
│   └── index.js
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── api/            # Mock API for static deployment
│   └── package.json
├── middleware/             # Express middleware
├── models/                 # MongoDB models
├── routes/                 # Express routes
├── server.js               # Main server file
├── vercel.json             # Vercel configuration
├── netlify.toml            # Netlify configuration
└── package.json            # Root package.json
```

## 🛠️ Kurulum

### **Geliştirme Ortamı**
```bash
# Root dependencies
npm install

# Client dependencies
npm run install-client

# Development server
npm run dev
```

### **Production Build**
```bash
# Build client
npm run build

# Start production server
npm start
```

## 🚀 Deployment

### **Vercel (Önerilen)**
- Full-stack deployment
- Backend API çalışır
- Otomatik SSL
- Domain: feellink.io

### **Netlify**
- Static site deployment
- Mock API kullanır
- Backend API çalışmaz

## 📝 Scripts

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "build": "cd client && npm run build",
  "install-client": "cd client && npm install",
  "build-client": "cd client && npm run build"
}
```

## 🔧 Konfigürasyon

### **Vercel (vercel.json)**
- Build command: `npm run build`
- Output directory: `client/build`
- Functions: `api/index.js`

### **Netlify (netlify.toml)**
- Build command: `npm run build`
- Publish directory: `client/build`
- Node version: 18

## 📱 Özellikler

- ✅ Kullanıcı kayıt/giriş
- ✅ İş yükleme ve paylaşım
- ✅ Beğeni ve kaydetme
- ✅ Yorum sistemi
- ✅ Profil yönetimi
- ✅ Admin paneli
- ✅ Responsive tasarım

## 🎨 UI/UX

- Modern ve temiz tasarım
- Behance benzeri arayüz
- Responsive grid layout
- Dark/Light theme desteği
- Smooth animations

## 🔒 Güvenlik

- JWT authentication
- Password hashing (bcrypt)
- CORS protection
- Rate limiting
- Helmet security headers
- Input validation

## 📊 Performans

- React Query caching
- Image optimization
- Lazy loading
- Code splitting
- Bundle optimization

---

**Feellink Team** - 2024