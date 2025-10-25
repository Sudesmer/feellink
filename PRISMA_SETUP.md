# 🗄️ Prisma + PostgreSQL Kurulum Rehberi

Bu proje artık **Prisma ORM** ve **PostgreSQL** kullanarak kalıcı veritabanı desteğine sahip!

## 📋 İçindekiler

1. [Gereksinimler](#gereksinimler)
2. [PostgreSQL Kurulumu](#postgresql-kurulumu)
3. [Veritabanı Bağlantısı](#veritabanı-bağlantısı)
4. [Migrations](#migrations)
5. [Kullanım](#kullanım)

---

## 🎯 Gereksinimler

- Node.js 18+ 
- PostgreSQL 14+
- npm veya yarn

---

## 🐘 PostgreSQL Kurulumu

### macOS (Homebrew)
```bash
brew install postgresql@14
brew services start postgresql@14
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Windows
PostgreSQL'i [resmi site](https://www.postgresql.org/download/windows/)'den indirip kurun.

---

## 🔧 Veritabanı Kurulumu

### 1. PostgreSQL'e Bağlan
```bash
psql -U postgres
```

### 2. Veritabanı Oluştur
```sql
CREATE DATABASE feellink;
CREATE USER feellink_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE feellink TO feellink_user;
\q
```

### 3. .env Dosyasını Güncelle
```env
DATABASE_URL="postgresql://feellink_user:your_secure_password@localhost:5432/feellink?schema=public"
```

---

## 🚀 Migrations

### 1. İlk Migration
```bash
npx prisma migrate dev --name init
```

Bu komut:
- Prisma schema'yı veritabanına uygular
- `users` tablosunu oluşturur
- Migration geçmişini takip eder

### 2. Migration Sonrası
```bash
npx prisma generate
```

---

## 🎯 Kullanım

### Prisma Studio (Veritabanı Görselleştirme)
```bash
npx prisma studio
```
Tarayıcıda `http://localhost:5555` açılır.

### Veritabanını Sıfırla
```bash
npx prisma migrate reset
```

### Yeni Migration Oluştur
```bash
npx prisma migrate dev --name add_new_field
```

---

## ☁️ Production: Ücretsiz PostgreSQL Hosting

### Neon.tech (Önerilen)
1. [Neon.tech](https://neon.tech)'e kaydol
2. Yeni proje oluştur
3. Connection string'i kopyala
4. `.env` dosyasına ekle

### Railway
1. [Railway.app](https://railway.app)'e kaydol
2. "New Project" → "Provision PostgreSQL"
3. Connection string'i `.env` dosyasına ekle

### Render
1. [Render](https://render.com)'e kaydol
2. "New" → "PostgreSQL"
3. Connection string'i `.env` dosyasına ekle

---

## 📊 Veritabanı Şeması

### User Model
```prisma
model User {
  id          Int       @id @default(autoincrement())
  email       String    @unique
  password    String
  fullName    String?
  bio         String?   @default("")
  avatar      String?   @default("")
  isVerified  Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  followers   User[]    @relation("UserFollows")
  following   User[]    @relation("UserFollows")
}
```

---

## 🔒 Güvenlik

- **Şifre Hashleme**: `bcryptjs` ile bcrypt
- **JWT Token**: Kullanıcı oturumları için
- **Environment Variables**: Hassas bilgiler `.env` dosyasında
- **SQL Injection**: Prisma otomatik olarak korur

---

## 📝 API Endpoints

### Register
```bash
POST /api/auth/register
Body: {
  "email": "user@example.com",
  "password": "secure123",
  "fullName": "John Doe"
}
```

### Login
```bash
POST /api/auth/login
Body: {
  "email": "user@example.com",
  "password": "secure123"
}
```

### Me (Current User)
```bash
GET /api/auth/me
Headers: {
  "Authorization": "Bearer <token>"
}
```

---

## ✅ Test Et

### Sunucuyu Başlat
```bash
npm run dev
```

### Kayıt Ol
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","fullName":"Test User"}'
```

### Giriş Yap
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

## 🐛 Sorun Giderme

### "Can't reach database server"
- PostgreSQL servisinin çalıştığından emin ol
- Connection string'i kontrol et

### "Unique constraint failed"
- Email zaten kullanılıyor
- Veritabanında düzelt

### "Migration failed"
```bash
npx prisma migrate reset
npx prisma migrate dev
```

---

## 📚 Daha Fazla Bilgi

- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Neon.tech](https://neon.tech)

---

**Tebrikler! 🎉** Artık kalıcı veritabanına sahip bir kullanıcı sistemi kuruldu!
