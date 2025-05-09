const { pool } = require('../config/db');

/**
 * Model untuk mengelola data pesan
 */
class MessageModel {
  /**
   * Mendapatkan pesan berdasarkan ID
   * @param {number} id - ID pesan
   * @returns {Promise<Object|null>} - Data pesan atau null jika tidak ditemukan
   */
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        `SELECT m.*, 
          u.name as sender_name, 
          u.email as sender_email
        FROM messages m
        LEFT JOIN users u ON m.sender_id = u.id
        WHERE m.id = ?`,
        [id]
      );
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mendapatkan semua pesan untuk transaksi tertentu
   * @param {number} transactionId - ID transaksi
   * @param {number} page - Nomor halaman
   * @param {number} limit - Jumlah pesan per halaman
   * @returns {Promise<Object>} - Data pesan dan metadata paginasi
   */
  static async findByTransactionId(transactionId, page = 1, limit = 50) {
    try {
      // Count total messages for pagination
      const [countResult] = await pool.query(
        'SELECT COUNT(*) as total FROM messages WHERE transaction_id = ?',
        [transactionId]
      );
      
      const total = countResult[0].total;
      
      // Add pagination
      const offset = (page - 1) * limit;
      
      // Pastikan limit dan offset adalah angka yang valid
      const parsedLimit = parseInt(limit) || 50; // Default ke 50 jika parsing gagal
      const parsedOffset = parseInt(offset) || 0; // Default ke 0 jika parsing gagal
      
      // Get messages with pagination
      const [rows] = await pool.query(
        `SELECT m.*, 
          u.name as sender_name, 
          u.email as sender_email
        FROM messages m
        LEFT JOIN users u ON m.sender_id = u.id
        WHERE m.transaction_id = ?
        ORDER BY m.created_at ASC
        LIMIT ? OFFSET ?`,
        [transactionId, parsedLimit, parsedOffset]
      );
      
      return {
        messages: rows,
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
   * Membuat pesan baru
   * @param {Object} messageData - Data pesan baru
   * @returns {Promise<Object>} - Data pesan yang baru dibuat
   */
  static async create(messageData) {
    try {
      const {
        sender_id,
        transaction_id,
        receiver_id, // Tambahkan receiver_id
        content
      } = messageData;
      
      const [result] = await pool.query(
        `INSERT INTO messages (
          sender_id, transaction_id, receiver_id, content
        ) VALUES (?, ?, ?, ?)`,
        [sender_id, transaction_id, receiver_id, content]
      );
      
      return this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Menghapus pesan
   * @param {number} id - ID pesan
   * @param {number} userId - ID pengguna yang menghapus
   * @returns {Promise<boolean>} - true jika berhasil, false jika gagal
   */
  static async delete(id, userId) {
    try {
      // Cek apakah pengguna adalah pengirim pesan
      const [message] = await pool.query(
        'SELECT * FROM messages WHERE id = ? AND sender_id = ?',
        [id, userId]
      );
      
      if (message.length === 0) {
        return false;
      }
      
      const [result] = await pool.query('DELETE FROM messages WHERE id = ?', [id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MessageModel;