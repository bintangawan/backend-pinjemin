const { pool } = require('../config/db');

/**
 * Model untuk mengelola data pengguna
 */
class UserModel {
  /**
   * Mendapatkan pengguna berdasarkan ID
   * @param {number} id - ID pengguna
   * @returns {Promise<Object|null>} - Data pengguna atau null jika tidak ditemukan
   */
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT id, name, email, photo, province_id, province_name, city_id, city_name, created_at FROM users WHERE id = ?',
        [id]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mendapatkan pengguna berdasarkan email
   * @param {string} email - Email pengguna
   * @returns {Promise<Object|null>} - Data pengguna atau null jika tidak ditemukan
   */
  static async findByEmail(email) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Membuat pengguna baru
   * @param {Object} userData - Data pengguna baru
   * @returns {Promise<Object>} - Data pengguna yang baru dibuat
   */
  static async create(userData) {
    try {
      const { name, email, password, province_id, province_name, city_id, city_name } = userData;
      
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, province_id, province_name, city_id, city_name) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, email, password, province_id || null, province_name || null, city_id || null, city_name || null]
      );
      
      return this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Memperbarui data pengguna
   * @param {number} id - ID pengguna
   * @param {Object} updateData - Data yang akan diperbarui
   * @returns {Promise<Object|null>} - Data pengguna yang diperbarui atau null jika tidak ditemukan
   */
  static async update(id, updateData) {
    try {
      const allowedFields = ['name', 'photo', 'province_id', 'province_name', 'city_id', 'city_name'];
      
      const updateFields = [];
      const queryParams = [];
      
      for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key)) {
          updateFields.push(`${key} = ?`);
          queryParams.push(value);
        }
      }
      
      if (updateFields.length === 0) {
        return this.findById(id);
      }
      
      queryParams.push(id);
      
      const [result] = await pool.query(
        `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
        queryParams
      );
      
      return result.affectedRows > 0 ? this.findById(id) : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Memperbarui password pengguna
   * @param {number} id - ID pengguna
   * @param {string} password - Password baru yang sudah di-hash
   * @returns {Promise<boolean>} - true jika berhasil, false jika gagal
   */
  static async updatePassword(id, password) {
    try {
      const [result] = await pool.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [password, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserModel;