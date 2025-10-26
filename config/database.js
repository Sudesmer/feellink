const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB bağlantısı
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/feellink', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB bağlandı: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB bağlantı hatası:', error);
    // Production'da sunucuyu kapat
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
