# Instagram-Style Follow System

Bu modül, mevcut Feellink projesine Instagram tarzı takipleşme sistemi ekler. Hiçbir mevcut kod silinmez, sadece yeni özellikler eklenir.

## 🏗️ Sistem Mimarisi

### Backend Modülleri

1. **models/Follow.js** - Takipleşme ilişkilerini yönetir
2. **routes/follow.js** - Takip API endpoint'leri
3. **routes/notifications.js** - Bildirim API endpoint'leri
4. **Socket.io Events** - Gerçek zamanlı bildirimler

### Frontend Modülleri

1. **hooks/useInstagramFollow.js** - React hook'u
2. **components/InstagramFollowButton.js** - Takip butonu
3. **components/InstagramNotifications.js** - Bildirimler

## 🚀 API Endpoints

### Takip İşlemleri

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/follow/request` | POST | Takip isteği gönder |
| `/api/follow/accept/:id` | POST | İsteği kabul et |
| `/api/follow/reject/:id` | POST | İsteği reddet |
| `/api/follow/unfollow` | POST | Takibi bırak |
| `/api/follow/status` | GET | Takip durumu kontrol et |
| `/api/follow/counts/:userId` | GET | Takip sayıları |
| `/api/follow/followers/:userId` | GET | Takipçileri listele |
| `/api/follow/following/:userId` | GET | Takip edilenleri listele |

### Bildirim İşlemleri

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/notifications` | GET | Bildirimleri listele |
| `/api/notifications/read/:id` | POST | Bildirimi okundu yap |
| `/api/notifications/read-all` | POST | Tüm bildirimleri okundu yap |
| `/api/notifications/:id` | DELETE | Bildirimi sil |
| `/api/notifications/unread-count` | GET | Okunmamış sayısı |

## 🔌 Socket.io Events

### Client → Server

- `instagram_follow_request` - Takip isteği gönder
- `instagram_follow_accept` - Takip isteğini kabul et
- `instagram_follow_reject` - Takip isteğini reddet

### Server → Client

- `newFollowRequest` - Yeni takip isteği bildirimi
- `followAccepted` - Takip kabul edildi bildirimi
- `followRejected` - Takip reddedildi bildirimi
- `instagram_follow_success` - İşlem başarılı
- `instagram_follow_error` - İşlem hatası

## 📱 Frontend Kullanımı

### 1. React Hook Kullanımı

```jsx
import { useInstagramFollow } from './hooks/useInstagramFollow';

function ProfilePage({ userId }) {
  const {
    followStatus,
    sendFollowRequest,
    unfollow,
    checkFollowStatus,
    notifications,
    unreadCount
  } = useInstagramFollow();

  useEffect(() => {
    checkFollowStatus(userId);
  }, [userId]);

  const handleFollow = async () => {
    if (followStatus === 'not_following') {
      await sendFollowRequest(userId);
    } else if (followStatus === 'accepted') {
      await unfollow(userId);
    }
  };

  return (
    <div>
      <button onClick={handleFollow}>
        {followStatus === 'not_following' ? 'Takip Et' : 'Takiptesin'}
      </button>
      <span>Okunmamış: {unreadCount}</span>
    </div>
  );
}
```

### 2. Hazır Component Kullanımı

```jsx
import InstagramFollowButton from './components/InstagramFollowButton';
import InstagramNotifications from './components/InstagramNotifications';

function UserProfile({ user }) {
  return (
    <div>
      <InstagramFollowButton
        targetUserId={user._id}
        targetUserName={user.fullName}
        showCounts={true}
        onStatusChange={(status) => console.log('Takip durumu:', status)}
      />
      
      <InstagramNotifications
        onFollowRequestAction={(action, notification) => {
          console.log('Takip isteği:', action, notification);
        }}
      />
    </div>
  );
}
```

## 🔒 Güvenlik

- JWT token ile kimlik doğrulama
- Kendini takip etme engelleme
- Duplicate takip isteği engelleme
- Rate limiting (mevcut sistem)
- CORS koruması

## 📊 Veritabanı Şeması

### Follow Collection

```javascript
{
  _id: ObjectId,
  senderId: String,      // İsteği gönderen
  receiverId: String,     // İsteği alan
  status: String,         // pending/accepted/rejected/blocked
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Collection

```javascript
{
  _id: ObjectId,
  userId: String,         // Bildirimi alan
  fromUserId: String,     // Bildirimi gönderen
  type: String,           // follow_request/follow_accepted/like/comment
  message: String,        // Bildirim metni
  status: String,         // unread/read
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Test Senaryoları

### 1. Takip İsteği Gönderme

```bash
curl -X POST http://localhost:5000/api/follow/request \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"receiverId": "USER_ID"}'
```

### 2. Takip Durumu Kontrol

```bash
curl -X GET "http://localhost:5000/api/follow/status?userId=USER_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Bildirimleri Listele

```bash
curl -X GET http://localhost:5000/api/notifications \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔄 Takip Akışı

1. **Kullanıcı A, B'ye takip isteği gönderir**
   - `Follow` collection'a `status: 'pending'` kaydı eklenir
   - `Notification` collection'a bildirim eklenir
   - Socket.io ile B'ye gerçek zamanlı bildirim gönderilir

2. **Kullanıcı B isteği kabul eder**
   - `Follow` kaydı `status: 'accepted'` olur
   - A'ya kabul bildirimi gönderilir
   - Socket.io ile A'ya gerçek zamanlı bildirim gönderilir

3. **Kullanıcı B isteği reddeder**
   - `Follow` kaydı `status: 'rejected'` olur
   - A'ya red bildirimi gönderilir
   - Socket.io ile A'ya gerçek zamanlı bildirim gönderilir

## 🎯 Özellikler

- ✅ Gerçek zamanlı takip istekleri
- ✅ Gerçek zamanlı bildirimler
- ✅ Takip durumu kontrolü
- ✅ Takip sayıları
- ✅ Bildirim yönetimi
- ✅ Socket.io entegrasyonu
- ✅ JWT kimlik doğrulama
- ✅ Responsive tasarım
- ✅ Error handling
- ✅ Loading states

## 🚀 Kurulum

Sistem otomatik olarak mevcut projeye entegre edilmiştir. Ek kurulum gerekmez.

## 📝 Notlar

- Mevcut kodlar korunmuştur
- Yeni endpoint'ler `/api/follow` ve `/api/notifications` altında
- Socket.io event'leri `instagram_` prefix'i ile
- Frontend component'leri `Instagram` prefix'i ile
- Tüm işlemler geriye dönük uyumludur

## 🔧 Geliştirme

Yeni özellik eklemek için:

1. `models/` altında yeni model oluştur
2. `routes/` altında yeni route'lar ekle
3. `server.js`'e route'ları bağla
4. Socket.io event'leri ekle
5. Frontend hook'u güncelle
6. Component'leri güncelle

Bu sistem Instagram, Twitter ve LinkedIn gibi sosyal platformların takipleşme mantığını tam olarak implement eder.
