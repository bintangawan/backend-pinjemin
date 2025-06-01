const { pool } = require('../config/db');

class MessageCommunityModel {
  /**
   * Menyimpan pesan baru komunitas
   */
  static async create(messageData) {
    const { sender_id, province_id, content } = messageData;

    const [result] = await pool.query(
      `INSERT INTO messages_community (sender_id, province_id, content)
       VALUES (?, ?, ?)`,
      [sender_id, province_id, content]
    );

    return this.findById(result.insertId);
  }

  /**
   * Mengambil satu pesan komunitas berdasarkan ID
   */
  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT m.*, 
              u.name AS sender_name, 
              u.email AS sender_email,
              u.province_name AS sender_province_name
       FROM messages_community m
       LEFT JOIN users u ON m.sender_id = u.id
       WHERE m.id = ?`,
      [id]
    );

    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Mengambil semua pesan komunitas berdasarkan province_id dengan paginasi
   */
  static async findByProvinceId(province_id) {
    const [rows] = await pool.query(
      `SELECT m.*, 
              u.name AS sender_name, 
              u.email AS sender_email,
              u.province_name AS sender_province_name
       FROM messages_community m
       LEFT JOIN users u ON m.sender_id = u.id
       WHERE m.province_id = ?
       ORDER BY m.created_at ASC`,
      [province_id]
    );
    return rows;
  }

  /**
   * Menghapus pesan jika pengirimnya cocok dengan user
   */
  static async delete(id, userId) {
    const [rows] = await pool.query(
      'SELECT * FROM messages_community WHERE id = ? AND sender_id = ?',
      [id, userId]
    );

    if (rows.length === 0) return false;

    const [result] = await pool.query(
      'DELETE FROM messages_community WHERE id = ?', [id]
    );

    return result.affectedRows > 0;
  }
}

module.exports = MessageCommunityModel;
