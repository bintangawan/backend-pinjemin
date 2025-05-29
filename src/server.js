const http = require('http');
const app = require('./app');
const { testConnection } = require('./config/db');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const { pool } = require('./config/db');
const notificationController = require('./controllers/notification.controller');
require('dotenv').config();
const server = http.createServer(app);


// Inisialisasi Socket.io
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:8080', // Ganti dengan domain frontend Anda di production
    methods: ['GET', 'POST']
  }
});
// Middleware Socket.io untuk autentikasi
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: Token required'));
    }
    
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Periksa apakah pengguna masih ada
    const [user] = await pool.query(
      'SELECT id, name, email FROM users WHERE id = ?',
      [decoded.id]
    );
    
    if (!user || user.length === 0) {
      return next(new Error('Authentication error: User not found'));
    }
    
    // Simpan data pengguna di socket
    socket.user = user[0];
    next();
  } catch (error) {
    return next(new Error('Authentication error: ' + error.message));
  }
});

// Koneksi Socket.io
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.id}`);
  
  // Bergabung ke room berdasarkan ID transaksi
  socket.on('joinTransaction', (transactionId) => {
    socket.join(`transaction_${transactionId}`);
    console.log(`User ${socket.user.id} joined transaction room ${transactionId}`);
  });
  
  // Mengirim pesan
  socket.on('sendMessage', async (data) => {
    try {
      const { transaction_id, content } = data;
      
      // Simpan pesan ke database melalui controller
      const messageController = require('./controllers/message.controller');
      const newMessage = await messageController.saveMessage({
        sender_id: socket.user.id,
        transaction_id,
        content
      });
      
      // Broadcast pesan ke semua pengguna di room transaksi
      io.to(`transaction_${transaction_id}`).emit('newMessage', newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('messageError', { error: error.message });
    }
  });
  
  // Disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.id}`);
  });
});

// Ekspor io agar bisa digunakan di controller
app.set('io', io);

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
    server.listen(PORT, () => {
      console.log(`Server berjalan pada port ${PORT} dalam mode ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Terjadi kesalahan saat memulai server:', error.message);
    process.exit(1);
  }

  // Setup cron job untuk memeriksa transaksi yang akan jatuh tempo setiap hari pada jam 8 pagi
  setInterval(async () => {
    const now = new Date();
    if (now.getHours() === 8 && now.getMinutes() === 0) {
      console.log('Memeriksa transaksi yang akan jatuh tempo...');
      const count = await notificationController.checkRentDueNotifications();
      console.log(`${count} notifikasi pengingat jatuh tempo telah dibuat`);
    }
  }, 60000); // Periksa setiap menit
};

// Tangani unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Mulai server
startServer();