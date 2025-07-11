const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const itemRoutes = require('./routes/item.routes');
const transactionRoutes = require('./routes/transaction.routes');
const reviewRoutes = require('./routes/review.routes');
const messageRoutes = require('./routes/message.routes');
const notificationRoutes = require('./routes/notification.routes');
const messageCommunityRoutes = require('./routes/messagecommunity.routes');
const messageHobbyRoutes = require('./routes/messagehobby.routes');
// Import middlewares
const errorMiddleware = require('./middlewares/error.middleware');

// Inisialisasi aplikasi Express
const app = express();

// Middleware global
app.use(helmet()); // Keamanan HTTP header
app.use(cors()); // Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request body

// Definisi routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/community-messages', messageCommunityRoutes);
app.use('/api/hobby-messages', messageHobbyRoutes);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', 'https://pinjemin.netlify.app');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));
// Serve static files from public folder
app.use(express.static(path.join(__dirname, '..', 'public')));

// Route untuk health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server berjalan dengan baik',
    timestamp: new Date().toISOString()
  });
});

// Middleware untuk handle 404 Not Found - pendekatan alternatif
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Tidak dapat menemukan ${req.originalUrl} pada server ini!`
  });
});

// Middleware untuk handle error
app.use(errorMiddleware);

module.exports = app;
