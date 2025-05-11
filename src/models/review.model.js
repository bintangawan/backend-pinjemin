const { pool } = require('../config/db');

class Review {
  // Mendapatkan semua review berdasarkan item ID
  static async getByItemId(itemId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const [reviews] = await pool.query(
      `SELECT r.*, u.name as user_name, u.email as user_email 
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.item_id = ?
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [itemId, limit, offset]
    );
    
    const [count] = await pool.query(
      'SELECT COUNT(*) as total FROM reviews WHERE item_id = ?',
      [itemId]
    );
    
    const total = count[0].total;
    
    return {
      reviews,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  
  // Mendapatkan review berdasarkan ID
  static async getById(id) {
    const [reviews] = await pool.query(
      `SELECT r.*, u.name as user_name, u.email as user_email 
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.id = ?`,
      [id]
    );
    
    return reviews[0];
  }
  
  // Memeriksa apakah pengguna memiliki transaksi yang selesai untuk item tertentu
  static async hasCompletedTransaction(userId, itemId) {
    const [transactions] = await pool.query(
      `SELECT * FROM transactions 
       WHERE buyer_id = ? AND item_id = ? AND status = 'completed'`,
      [userId, itemId]
    );
    
    return transactions.length > 0;
  }
  
  // Memeriksa apakah pengguna sudah memberikan review untuk item tertentu
  static async hasReviewed(userId, itemId) {
    const [reviews] = await pool.query(
      'SELECT * FROM reviews WHERE user_id = ? AND item_id = ?',
      [userId, itemId]
    );
    
    return reviews.length > 0;
  }
  
  // Membuat review baru
  static async create(userId, itemId, comment) {
    const [result] = await pool.query(
      'INSERT INTO reviews (user_id, item_id, comment) VALUES (?, ?, ?)',
      [userId, itemId, comment]
    );
    
    const id = result.insertId;
    return this.getById(id);
  }
  
  // Memperbarui review
  static async update(id, comment) {
    await pool.query(
      'UPDATE reviews SET comment = ? WHERE id = ?',
      [comment, id]
    );
    
    return this.getById(id);
  }
  
  // Menghapus review
  static async delete(id) {
    await pool.query('DELETE FROM reviews WHERE id = ?', [id]);
    return { id };
  }
  
  // Memeriksa apakah review dimiliki oleh pengguna tertentu
  static async isOwnedByUser(id, userId) {
    const [reviews] = await pool.query(
      'SELECT * FROM reviews WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    return reviews.length > 0;
  }
}

module.exports = Review;