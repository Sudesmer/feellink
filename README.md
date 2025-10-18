# FEELLINK - Sanat Platformu

## 🎨 Proje Hakkında
FEELLINK, modern sanat eserlerini keşfetmek ve paylaşmak için tasarlanmış bir platformdur. Instagram benzeri kullanıcı arayüzü ile sanatçılar ve sanat severler arasında bağlantı kurar.

## ✨ Özellikler

### 🏠 Ana Sayfa
- Modern sanatsal tema (turuncu-beyaz)
- "Ayın Öne Çıkanları" bölümü
- Keşfet bölümü (3x4 grid layout)
- Sol sidebar menü sistemi
- Sağ sidebar (müzeler ve sanatçılar)

### 👤 Profil Sayfası
- Instagram benzeri modern tasarım
- Büyük avatar (150px)
- Takip et/Çık butonları
- Bio ve istatistikler
- 3x5 grid eser düzeni
- Hover efektleri

### 🔔 Bildirimler
- Instagram benzeri bildirim sistemi
- Filtreleme (Tümü, Okunmamış, Beğeniler, Yorumlar, Takip)
- Okundu/okunmadı durumu
- Etkileşim butonları

### 🎨 Tasarım Sistemi
- **Dark/Light Mode:** Tam destek
- **Responsive:** Mobil ve desktop uyumlu
- **Modern UI:** Yumuşak köşeler, hover efektleri
- **Renk Paleti:** Turuncu (#FF6B35) ve Beyaz

## 🚀 Kurulum

### Gereksinimler
- Node.js (v14+)
- npm veya yarn

### Adımlar
```bash
# Projeyi klonlayın
git clone [repository-url]
cd FEELLINK

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
cd client
npm start
```

## 📁 Proje Yapısı

```
FEELLINK/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React bileşenleri
│   │   ├── pages/         # Sayfa bileşenleri
│   │   ├── contexts/      # React Context'ler
│   │   └── index.js       # Ana giriş noktası
│   └── public/            # Statik dosyalar
├── routes/                # Backend route'ları
├── models/                # Veritabanı modelleri
├── middleware/            # Middleware fonksiyonları
└── server.js              # Ana sunucu dosyası
```

## 🎯 Son Güncellemeler

### Profil Sayfası Tasarımı (Son)
- Instagram benzeri modern estetik tasarım
- Avatar boyutu 150px'e çıkarıldı
- Grid gap 28px'e artırıldı
- Border-radius 8px eklendi
- Butonlar büyütüldü ve iyileştirildi

### Önceki Güncellemeler
- Ana sayfa layout ve tasarım
- Sol sidebar menü sistemi
- Header ve navigation
- Bildirimler sayfası
- Dark/Light mode uyumluluğu
- Responsive tasarım

## 🔧 Geliştirme

### Çalıştırma
```bash
# Frontend (React)
cd client
npm start

# Backend (Node.js)
npm start
```

### Build
```bash
cd client
npm run build
```

## 📱 Responsive Tasarım
- **Desktop:** 1200px+
- **Tablet:** 768px - 1199px
- **Mobile:** 320px - 767px

## 🎨 Tema Sistemi
- **Light Mode:** Beyaz arkaplan, koyu metin
- **Dark Mode:** Koyu arkaplan, açık metin
- **Renk Geçişleri:** Smooth transitions

## 📊 Teknolojiler
- **Frontend:** React, Styled Components, React Router
- **Backend:** Node.js, Express
- **State Management:** React Context
- **Styling:** CSS-in-JS (Styled Components)
- **Icons:** React Icons (Feather)

## 🚀 Gelecek Planları
- Backstage entegrasyonu
- Gerçek veritabanı bağlantısı
- Kullanıcı authentication
- Eser yükleme sistemi
- Sosyal etkileşim özellikleri

## 📝 Lisans
Bu proje MIT lisansı altında lisanslanmıştır.

---
*Son güncelleme: $(date)*