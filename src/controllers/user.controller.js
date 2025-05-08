const bcrypt = require('bcryptjs');
const axios = require('axios'); // Tambahkan import axios
const { pool } = require('../config/db');
const { validationResult } = require('express-validator');

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
 * Controller untuk mendapatkan profil pengguna berdasarkan ID
 */
exports.getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Ambil data pengguna dari database
    const [users] = await pool.query(
      'SELECT id, name, email, photo, province_id, province_name, city_id, city_name, province_name, city_name, created_at FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Pengguna tidak ditemukan'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: users[0]
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk memperbarui profil pengguna
 */
exports.updateProfile = async (req, res, next) => {
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

    const userId = req.user.id;
    const { name, province_name, city_name } = req.body;

    // Ambil province_id dan city_id dari API
    let province_id = null;
    let city_id = null;
    
    if (province_name) {
      province_id = await getProvinceId(province_name);
      
      if (city_name && province_id) {
        city_id = await getCityId(city_name, province_id);
      }
    }

    // Persiapkan query dan parameter untuk update
    let query = 'UPDATE users SET ';
    const queryParams = [];
    const updateFields = [];

    if (name) {
      updateFields.push('name = ?');
      queryParams.push(name);
    }

    if (province_name) {
      updateFields.push('province_id = ?');
      updateFields.push('province_name = ?');
      queryParams.push(province_id);
      queryParams.push(province_name);
    }

    if (city_name && province_id) {
      updateFields.push('city_id = ?');
      updateFields.push('city_name = ?');
      queryParams.push(city_id);
      queryParams.push(city_name);
    }

    // Jika tidak ada field yang diupdate
    if (updateFields.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Tidak ada data yang diperbarui'
      });
    }

    // Selesaikan query
    query += updateFields.join(', ');
    query += ' WHERE id = ?';
    queryParams.push(userId);

    // Eksekusi query update
    await pool.query(query, queryParams);

    // Ambil data pengguna yang telah diperbarui
    const [updatedUser] = await pool.query(
      'SELECT id, name, email, photo, province_id, province_name, city_id, city_name, created_at FROM users WHERE id = ?',
      [userId]
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser[0]
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk mengubah password pengguna
 */
exports.updatePassword = async (req, res, next) => {
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

    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Ambil data pengguna dari database
    const [users] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Pengguna tidak ditemukan'
      });
    }

    const user = users[0];

    // Verifikasi password saat ini
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'error',
        message: 'Password saat ini salah'
      });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password di database
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );

    res.status(200).json({
      status: 'success',
      message: 'Password berhasil diperbarui'
    });
  } catch (error) {
    next(error);
  }
};