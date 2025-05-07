const app = require('./app');
const { testConnection } = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Fungsi untuk memulai server
const startServer = async () => {
  try {
    // Tes koneksi database sebelum memulai server
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('Server tidak dapat dimulai karena koneksi database gagal.');
      process.exit(1);
    }
    
    // Mulai server jika koneksi database berhasil
    app.listen(PORT, () => {
      console.log(`Server berjalan pada port ${PORT} dalam mode ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Terjadi kesalahan saat memulai server:', error.message);
    process.exit(1);
  }
};

// Tangani unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Mulai server
startServer();