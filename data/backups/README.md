# 🔄 Backup Klasörü

Bu klasör, kullanıcı profil güncellemelerinde otomatik olarak oluşturulan yedek dosyalarını içerir.

## 📋 Açıklama

- **Otomatik Yedekleme**: Her profil güncellemesinde otomatik yedek oluşturulur
- **Yedek Dosya Formatı**: `users_backup_{timestamp}.json`
- **Yedek İçeriği**: Tüm kullanıcı verileri (şifreler hashlenmiş)

## 🛡️ Güvenlik

- Tüm yedekler sadece sunucuda saklanır
- Şifreler her zaman bcrypt ile hashlenmiş durumda
- .gitignore ile Git'e yüklenmez

## 📝 Not

Bu klasördeki dosyalar otomatik olarak oluşturulur ve silinir. Manuel müdahale gerekmez.
