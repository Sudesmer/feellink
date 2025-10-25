# 🚀 Deploy Kılavuzu - Feellink

## Hızlı Deploy

Her değişiklikten sonra otomatik olarak deploy olur. Manuel deploy gerekmez!

## ✅ Deploy Öncesi Kontrol Listesi

### 1. Kod Değişiklikleri
- [ ] `client/` klasöründeki değişiklikler commit edildi
- [ ] Linter hataları düzeltildi
- [ ] Test edildi (varsa)

### 2. Git Commit
```bash
git add .
git commit -m "🎨 UI improvements"
git push origin main
```

### 3. Otomatik Deploy
- GitHub'a push edilir
- Netlify otomatik build başlatır
- ~2-3 dakika içinde canlıya alınır

## 🔍 Deploy Sonrası Kontrol

1. **Netlify Dashboard**: https://app.netlify.com
2. Build log'larını kontrol et
3. Live site'i test et: https://feellink.io

## 🐛 Hata Durumunda

### Build Hataları
1. Netlify deploy log'larına bak
2. ESLint uyarıları genellikle problem değil (CI=false)
3. Gerçek build hatalarını düzelt

### Site Açılmıyor
1. DNS kontrolü (feellink.io)
2. SSL sertifikası kontrolü
3. Cache temizle (hard refresh: Cmd+Shift+R)

## 📝 Notlar

- **Build süresi**: ~2 dakika
- **Deploy URL**: https://feellink.io
- **Fallback URL**: https://fellink.netlify.app
