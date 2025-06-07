const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
require('dotenv').config();

/**
 * Middleware untuk melindungi route yang memerlukan autentikasi
 */
exports.protect = async (req, res, next) => {
  try {
    // 1) Periksa apakah token ada
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Anda tidak login! Silakan login untuk mendapatkan akses.'
      });
    }

    // 2) Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Periksa apakah pengguna masih ada
    const [user] = await pool.query(
      'SELECT id, name, email, photo, province_id, province_name, city_id, city_name, hobby FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!user || user.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Pengguna dengan token ini tidak lagi ada.'
      });
    }

    // 4) Berikan akses ke route yang dilindungi
    req.user = user[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token tidak valid. Silakan login kembali.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token Anda telah kedaluwarsa! Silakan login kembali.'
      });
    }
    
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat memverifikasi token.'
    });
  }
};