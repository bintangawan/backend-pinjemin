const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios'); // Tambahkan import axios
const { pool } = require('../config/db');
const { validationResult } = require('express-validator');
require('dotenv').config();

/**
 * Fungsi untuk membuat token JWT
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

/**
 * Fungsi untuk mengirim token ke klien
 */
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  // Hapus password dari output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

/**
 * Fungsi untuk mendapatkan ID provinsi berdasarkan nama provinsi
 */
const getProvinceId = async (provinceName) => {
  try {
    const response = await axios.get('https://kanglerian.my.id/api-wilayah-indonesia/api/provinces.json');
    const provinces = response.data;
    
    // Cari provinsi berdasarkan nama (case insensitive)
    const province = provinces.find(p => 
      p.name.toLowerCase() === provinceName.toLowerCase()
    );
    
    return province ? province.id : null;
  } catch (error) {
    console.error('Error fetching province data:', error);
    return null;
  }
};

/**
 * Fungsi untuk mendapatkan ID kota berdasarkan nama kota dan ID provinsi
 */
const getCityId = async (cityName, provinceId) => {
  try {
    if (!provinceId) return null;
    
    const response = await axios.get(`https://kanglerian.my.id/api-wilayah-indonesia/api/regencies/${provinceId}.json`);
    const cities = response.data;
    
    // Cari kota berdasarkan nama (case insensitive)
    const city = cities.find(c => 
      c.name.toLowerCase() === cityName.toLowerCase()
    );
    
    return city ? city.id : null;
  } catch (error) {
    console.error('Error fetching city data:', error);
    return null;
  }
};

/**
 * Controller untuk mendaftarkan pengguna baru
 */
exports.register = async (req, res, next) => {
  try {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const { name, email, password, hobby, province_name, city_name } = req.body;

    // Cek apakah email sudah terdaftar
    const [existingUser] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        status: 'error',
        message: 'Email sudah terdaftar. Silakan gunakan email lain.'
      });
    }

    // Ambil province_id dan city_id dari API
    let province_id = null;
    let city_id = null;
    
    if (province_name) {
      province_id = await getProvinceId(province_name);
      
      if (city_name && province_id) {
        city_id = await getCityId(city_name, province_id);
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Simpan pengguna baru ke database
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, province_id, province_name, city_id, city_name, hobby) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, province_id, province_name, city_id, city_name, hobby]
    );

    // Ambil data pengguna yang baru dibuat
    const [newUser] = await pool.query(
      'SELECT id, name, email, photo, province_id, province_name, city_id, city_name, hobby, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    // Kirim token ke klien
    createSendToken(newUser[0], 201, res);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk login pengguna
 */
exports.login = async (req, res, next) => {
  try {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Cek apakah email dan password ada
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Harap berikan email dan password'
      });
    }

    // Cek apakah pengguna ada dan password benar
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Email atau password salah'
      });
    }

    const user = users[0];
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'error',
        message: 'Email atau password salah'
      });
    }

    // Kirim token ke klien
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk mendapatkan data pengguna yang sedang login
 */
exports.getMe = async (req, res, next) => {
  try {
    // Pengguna sudah tersedia dari middleware protect
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user
      }
    });
  } catch (error) {
    next(error);
  }
};