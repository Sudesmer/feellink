# 📧 Email Kurulum Rehberi

## Hoş Geldin Email Sistemi

Feellink'e yeni kayıt olan kullanıcılara otomatik olarak hoş geldin email'i gönderilir.

## 🔧 Kurulum

### 1. Gmail ile Email Gönderme

#### Gmail App Password Oluşturma:

1. **Google Hesabı Ayarları**
   - https://myaccount.google.com adresine gidin
   - **Güvenlik** bölümüne gidin

2. **2 Adımlı Doğrulamayı Etkinleştirin**
   - Eğer etkin değilse, 2 adımlı doğrulamayı açın
   - Telefon numaranızı doğrulayın

3. **Uygulama Şifresi Oluşturun**
   - "Uygulama şifreleri" bölümüne gidin
   - "Uygulama seçin" → "E-posta" seçin
   - "Cihaz seçin" → "Diğer (Özel ad)" → "Feellink" yazın
   - **Oluştur** butonuna tıklayın
   - 16 haneli şifreyi kopyalayın (örn: `abcd efgh ijkl mnop`)

### 2. Environment Variables Ayarlama

`config.env` dosyasını açın ve şu değişkenleri ayarlayın:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password
```

**Örnek:**
```env
EMAIL_USER=feellink.app@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

### 3. Server'ı Yeniden Başlatın

```bash
# Server'ı durdurun (Ctrl+C)
# Sonra tekrar başlatın
node server.js
```

## 📨 Email İçeriği

Yeni kullanıcılara şu bilgileri içeren bir email gönderilir:

- 🎨 Feellink logosu ve hoş geldin mesajı
- ✨ Platformun özellikleri
- 🚀 "Keşfetmeye Başla" butonu
- 💬 Destek email adresi

## 🧪 Test Etme

1. Yeni bir kullanıcı kaydedin:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "123456",
       "fullName": "Test Kullanıcı"
     }'
   ```

2. Email'inizde hoş geldin mesajını kontrol edin

## ⚠️ Önemli Notlar

- Email gönderimi hatalı olsa bile kayıt işlemi tamamlanır
- Email gönderme asenkron çalışır, kullanıcı kaydı bekletilmez
- Gmail günlük gönderim limiti: 500 email/gün
- Production için daha profesyonel bir email servisi (SendGrid, Mailgun) kullanabilirsiniz

## 🔄 Alternatif Email Servisleri

### SendGrid Kullanımı:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

### Mailgun Kullanımı:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.mailgun.org',
  port: 587,
  auth: {
    user: process.env.MAILGUN_SMTP_LOGIN,
    pass: process.env.MAILGUN_SMTP_PASSWORD
  }
});
```

## 📞 Destek

Sorularınız için: support@feellink.io
