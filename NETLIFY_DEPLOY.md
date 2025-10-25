# Netlify Deployment Rehberi

Bu dosya Feellink projesini Netlify'e deploy etmek için gereken adımları içerir.

## Gereksinimler

- GitHub hesabı
- Netlify hesabı (ücretsiz kayıt: https://www.netlify.com)
- Node.js 18+ (yerel build için)

## Deployment Adımları

### 1. GitHub'a Push Et

```bash
git add .
git commit -m "Netlify deployment için hazırlandı"
git push origin main
```

### 2. Netlify'da Site Oluştur

1. https://app.netlify.com adresine git
2. "Add new site" > "Import an existing project" tıkla
3. GitHub'ı seç ve repository'ni bağla
4. Import settings'i kullan (netlify.toml otomatik algılanacak)

### 3. Build Ayarları (Otomatik)

Netlify aşağıdaki ayarları otomatik olarak algılayacak:

- **Build command**: `cd client && npm ci && npm run build`
- **Publish directory**: `client/build`
- **Base directory**: `client`
- **Node version**: 18

### 4. Environment Variables (Opsiyonel)

Eğer backend API endpoint'i kullanacaksanız, Netlify dashboard'da şu environment variables'ları ekleyebilirsiniz:

```
REACT_APP_API_URL=https://your-api.com
```

### 5. Deploy

Netlify otomatik olarak deploy edecek. Deploy işlemi tamamlandıktan sonra site URL'ini alacaksınız.

## Manuel Build Test

Yerel olarak build'i test etmek için:

```bash
cd client
npm install
npm run build
```

Build başarılı olursa, `client/build` klasörü oluşacak.

## Güncelleme

Kodda değişiklik yaptıktan sonra:

```bash
git add .
git commit -m "Update description"
git push origin main
```

Netlify otomatik olarak yeniden deploy edecektir.

## Sorun Giderme

### Build Hatası

- `client/package.json` dosyasının doğru olduğundan emin olun
- Node versiyonunun 18+ olduğunu kontrol edin
- Netlify loglarını kontrol edin

### Sayfa Bulunamadı (404)

- `client/public/_redirects` dosyasının olduğundan emin olun
- `netlify.toml` dosyasındaki redirect kurallarını kontrol edin

### API İstekleri Çalışmıyor

- CORS ayarlarını kontrol edin
- Environment variables'ların doğru set edildiğinden emin olun

## Önemli Notlar

1. Bu deployment sadece frontend için geçerlidir
2. Backend API ayrı bir serviste host edilmelidir
3. Mock data kullanılıyorsa backend gerekmez
4. SPA (Single Page Application) routing için redirect kuralları eklendi

## İletişim

Sorular için: support@feellink.com
