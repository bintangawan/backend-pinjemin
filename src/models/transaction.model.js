const { pool } = require('../config/db');

/**
 * Model untuk mengelola data transaksi
 */
class TransactionModel {
  /**
   * Mendapatkan transaksi berdasarkan ID
   * @param {number} id - ID transaksi
   * @returns {Promise<Object|null>} - Data transaksi atau null jika tidak ditemukan
   */
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        `SELECT t.*, 
          u.name as buyer_name, 
          u.email as buyer_email,
          i.name as item_name,
          i.user_id as seller_id,
          (SELECT name FROM users WHERE id = i.user_id) as seller_name,
          (SELECT email FROM users WHERE id = i.user_id) as seller_email,
          (SELECT photo_url FROM item_photos WHERE item_id = i.id LIMIT 1) as item_photo
        FROM transactions t
        LEFT JOIN users u ON t.buyer_id = u.id
        LEFT JOIN items i ON t.item_id = i.id
        WHERE t.id = ?`,
        [id]
      );
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mendapatkan semua transaksi dengan filter opsional
   * @param {Object} filters - Filter untuk pencarian
   * @param {number} page - Nomor halaman
   * @param {number} limit - Jumlah transaksi per halaman
   * @returns {Promise<Object>} - Data transaksi dan metadata paginasi
   */
  static async findAll(filters = {}, page = 1, limit = 10) {
    try {
      let query = `
        SELECT t.*, 
          u.name as buyer_name,
          i.name as item_name,
          (SELECT name FROM users WHERE id = i.user_id) as seller_name,
          (SELECT photo_url FROM item_photos WHERE item_id = i.id LIMIT 1) as item_photo
        FROM transactions t
        LEFT JOIN users u ON t.buyer_id = u.id
        LEFT JOIN items i ON t.item_id = i.id
        WHERE 1=1
      `;
      
      const queryParams = [];
      
      // Apply filters
      if (filters.buyer_id) {
        query += ' AND t.buyer_id = ?';
        queryParams.push(filters.buyer_id);
      }
      
      if (filters.item_id) {
        query += ' AND t.item_id = ?';
        queryParams.push(filters.item_id);
      }
      
      if (filters.type) {
        query += ' AND t.type = ?';
        queryParams.push(filters.type);
      }
      
      if (filters.status) {
        query += ' AND t.status = ?';
        queryParams.push(filters.status);
      }
      
      // Count total transactions for pagination
      const [countResult] = await pool.query(
        query.replace('SELECT t.*, u.name as buyer_name, i.name as item_name, (SELECT name FROM users WHERE id = i.user_id) as seller_name, (SELECT photo_url FROM item_photos WHERE item_id = i.id LIMIT 1) as item_photo', 'SELECT COUNT(*) as total'),
        queryParams
      );
      
      // Pastikan countResult[0] ada sebelum mengakses total
      const total = countResult && countResult[0] ? countResult[0].total : 0;
      
      // Add pagination
      const offset = (page - 1) * limit;
      query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
      
      // Pastikan limit dan offset adalah angka yang valid
      const parsedLimit = parseInt(limit) || 10; // Default ke 10 jika parsing gagal
      const parsedOffset = parseInt(offset) || 0; // Default ke 0 jika parsing gagal
      
      queryParams.push(parsedLimit, parsedOffset);
      
      // Execute query with pagination
      const [rows] = await pool.query(query, queryParams);
      
      return {
        transactions: rows || [],
        pagination: {
          total,
          page: parseInt(page) || 1,
          limit: parsedLimit,
          totalPages: Math.ceil(total / parsedLimit) || 1
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mendapatkan semua transaksi berdasarkan pemilik item (seller)
   * @param {number} sellerId - ID pemilik item
   * @param {Object} filters - Filter untuk pencarian
   * @param {number} page - Nomor halaman
   * @param {number} limit - Jumlah transaksi per halaman
   * @returns {Promise<Object>} - Data transaksi dan metadata paginasi
   */
  static async findAllBySellerId(sellerId, filters = {}, page = 1, limit = 10) {
    try {
      let query = `
        SELECT t.*, 
          u.name as buyer_name,
          i.name as item_name,
          (SELECT name FROM users WHERE id = i.user_id) as seller_name,
          (SELECT photo_url FROM item_photos WHERE item_id = i.id LIMIT 1) as item_photo
        FROM transactions t
        LEFT JOIN users u ON t.buyer_id = u.id
        LEFT JOIN items i ON t.item_id = i.id
        WHERE i.user_id = ?
      `;
      
      const queryParams = [sellerId];
      
      // Apply filters
      if (filters.type) {
        query += ' AND t.type = ?';
        queryParams.push(filters.type);
      }
      
      if (filters.status) {
        query += ' AND t.status = ?';
        queryParams.push(filters.status);
      }
      
      // Count total transactions for pagination
      const [countResult] = await pool.query(
        query.replace('SELECT t.*, u.name as buyer_name, i.name as item_name, (SELECT name FROM users WHERE id = i.user_id) as seller_name, (SELECT photo_url FROM item_photos WHERE item_id = i.id LIMIT 1) as item_photo', 'SELECT COUNT(*) as total'),
        queryParams
      );
      
      const total = countResult[0].total;
      
      // Add pagination
      const offset = (page - 1) * limit;
      query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
      
      // Pastikan limit dan offset adalah angka yang valid
      const parsedLimit = parseInt(limit) || 10; // Default ke 10 jika parsing gagal
      const parsedOffset = parseInt(offset) || 0; // Default ke 0 jika parsing gagal
      
      queryParams.push(parsedLimit, parsedOffset);
      
      // Execute query with pagination
      const [rows] = await pool.query(query, queryParams);
      
      return {
        transactions: rows,
        pagination: {
          total,
          page: parseInt(page) || 1,
          limit: parsedLimit,
          totalPages: Math.ceil(total / parsedLimit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Membuat transaksi baru
   * @param {Object} transactionData - Data transaksi baru
   * @returns {Promise<Object>} - Data transaksi yang baru dibuat
   */
  static async create(transactionData) {
    try {
      const {
        buyer_id,
        item_id,
        type,
        status,
        payment_method,
        total_price,
        rent_start_date,
        rent_end_date,
        deposit_paid
      } = transactionData;
      
      const [result] = await pool.query(
        `INSERT INTO transactions (
          buyer_id, item_id, type, status, payment_method, 
          total_price, rent_start_date, rent_end_date, deposit_paid
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          buyer_id,
          item_id,
          type,
          status || 'pending',
          payment_method || 'cod',
          total_price || 0,
          rent_start_date || null,
          rent_end_date || null,
          deposit_paid || 0
        ]
      );
      
      return this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Memperbarui status transaksi
   * @param {number} id - ID transaksi
   * @param {string} status - Status baru
   * @returns {Promise<Object|null>} - Data transaksi yang diperbarui atau null jika tidak ditemukan
   */
  static async updateStatus(id, status) {
    try {
      const [result] = await pool.query(
        'UPDATE transactions SET status = ? WHERE id = ?',
        [status, id]
      );
      
      return result.affectedRows > 0 ? this.findById(id) : null;
    } catch (error) {
      throw error;
    }
  }

  /**
 * Mendapatkan semua transaksi sewa yang sedang berlangsung
 * @returns {Promise<Array>} - Data transaksi sewa yang sedang berlangsung
 */
  static async findOngoingRentals() {
    try {
      return await pool.query(
        `SELECT * FROM transactions 
        WHERE type = 'rent' 
        AND status = 'ongoing'`
      );
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TransactionModel;