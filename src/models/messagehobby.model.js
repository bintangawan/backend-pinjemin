const { pool } = require("../config/db")

class MessageHobbyModel {
  /**
   * Menyimpan pesan baru hobby
   */
  static async create(messageData) {
    const { sender_id, hobby, content } = messageData

    const [result] = await pool.query(
      `INSERT INTO messages_hobby (sender_id, hobby, content)
       VALUES (?, ?, ?)`,
      [sender_id, hobby, content],
    )

    return this.findById(result.insertId)
  }

  /**
   * Mengambil satu pesan hobby berdasarkan ID
   */
  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT m.*, 
              u.name AS sender_name, 
              u.email AS sender_email,
              u.hobby AS sender_hobby
       FROM messages_hobby m
       LEFT JOIN users u ON m.sender_id = u.id
       WHERE m.id = ?`,
      [id],
    )

    return rows.length > 0 ? rows[0] : null
  }

  /**
   * Mengambil semua pesan hobby berdasarkan hobby dengan paginasi
   */
  static async findByHobby(hobby) {
    const [rows] = await pool.query(
      `SELECT m.*, 
              u.name AS sender_name, 
              u.email AS sender_email,
              u.hobby AS sender_hobby
       FROM messages_hobby m
       LEFT JOIN users u ON m.sender_id = u.id
       WHERE m.hobby = ?
       ORDER BY m.created_at ASC`,
      [hobby],
    )
    return rows
  }

  /**
   * Menghapus pesan jika pengirimnya cocok dengan user
   */
  static async delete(id, userId) {
    const [rows] = await pool.query("SELECT * FROM messages_hobby WHERE id = ? AND sender_id = ?", [id, userId])

    if (rows.length === 0) return false

    const [result] = await pool.query("DELETE FROM messages_hobby WHERE id = ?", [id])

    return result.affectedRows > 0
  }
}

module.exports = MessageHobbyModel
