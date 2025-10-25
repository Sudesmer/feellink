# 💰 Netlify Kredi Sistemi Açıklaması

## ⚠️ Kredi Ne İçin Kullanılır?

### Kullanılır ✅
- **Build İşlemleri**: Her `git push` sonrası otomatik build
- **Build süre x sunucu = kredi kullanımı**
- Örnek: 2 dakikalık build = 2 kredi

### Kullanılmaz ❌
- **Kullanıcı trafiği**: Kayıt, giriş, paylaşım
- **API çağrıları**: Backend istekleri
- **Static dosya sunumu**: HTML, CSS, JS, resimler
- **Bandwidth**: Veri transfer

## 📊 Netlify Ücretsiz Plan Limitleri

### Build Minutes (Kredi)
- **300 dakika/ay** (5 saat)
- Her build ~2-3 dakika
- = **100-150 build/ay** ücretsiz

### Aylık Kullanım
- **100GB bandwidth** (sınırsız gibi)
- **300 build minutes**
- Sonra ücretli

## 💡 Çözüm Önerileri

### 1️⃣ Render (Önerilen)
- **750 saat/ay** ücretsiz!
- Build ücretsiz
- Deployment otomatik
- [render.com](https://render.com)

### 2️⃣ Vercel
- **Build sınırı yok** (ücretsiz plan)
- Trafik sınırı yok
- CDN dahil
- [vercel.com](https://vercel.com)

### 3️⃣ Railway
- **500 saat/ay** ücretsiz
- Full-stack hosting
- PostgreSQL dahil
- [railway.app](https://railway.app)

## 🔥 Krediyi Düşürmek İçin

### Build Optimize Et
1. **Sadece değişikliklerde deploy**
2. **Build cache** kullan
3. **Build script** optimize et

### Netlify.toml Optimize
```toml
[build]
  command = "cd client && npm ci && npm run build"
  publish = "client/build"

# Cache ekle
[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
```

### Build Süresini Azalt
- Sadece gerekli dosyaları deploy et
- Büyük dosyaları .gitignore'a ekle
- Node modules cache kullan

## 📈 Aylık Tahmin

### Sizin Durum
- **300 kredi aşıldı** = >5 saat build
- = **>150 build/ay** yapıyorsunuz
- Veya **çok uzun build süresi**

### Netlify'da Kalacaksanız
- **Build sıklığını azaltın**
- Sadece önemli değişikliklerde deploy
- Local'de test edin, sonra push

### Render'a Geçerseniz
- **750 saat/ay** ücretsiz
- Build sayısı sınırı yok
- Çok daha rahat!

## ⚡ Hızlı Çözüm

1. **Render.com'a git**
2. GitHub ile kayıt ol
3. Repo'yu bağla
4. **DEPLOY_ALTERNATIVES.md** dosyasına göre deploy
5. **feellink.io** domain'ini bağla
6. Sorun çözüldü! 🎉

## 📚 Detaylı Bilgi

- [Netlify Pricing](https://www.netlify.com/pricing/)
- [Render Pricing](https://render.com/pricing)
- [Vercel Pricing](https://vercel.com/pricing)

---

**Sonuç**: Kullanıcı trafiği ücretsiz! Sadece build işlemleri kredi tüketir. Render'a geçince sorun kalmaz! 🚀

