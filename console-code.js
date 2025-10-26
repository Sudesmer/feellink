// Browser Console'da çalıştırılacak kod
// http://localhost:3000/notifications sayfasında F12 -> Console'da çalıştır

// Test kullanıcı verisi
const testUser = {
    _id: "1",
    username: "sudesmer001", 
    email: "sudesmer001@gmail.com",
    fullName: "Sude Esmer",
    avatar: "/sude.jpg",
    followers: [],
    following: [],
    isVerified: false,
    createdAt: new Date().toISOString()
};

// Test token
const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiaWF0IjoxNzYxNDcwNDYwLCJleHAiOjE3NjIwNzUyNjB9.test";

// LocalStorage'a kaydet
localStorage.setItem('feellink-user', JSON.stringify(testUser));
localStorage.setItem('feellink-token', testToken);

console.log('✅ Test verisi localStorage\'a eklendi!');
console.log('Kullanıcı:', testUser.fullName);
console.log('ID:', testUser._id);

// Sayfayı yenile
window.location.reload();
