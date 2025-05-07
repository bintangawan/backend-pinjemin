const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

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