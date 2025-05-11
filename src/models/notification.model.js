const { pool } = require('../config/db');

/**
 * Model untuk mengelola data notifikasi
 */
class NotificationModel {
  /**
   * Mendapatkan notifikasi berdasarkan ID
   * @param {number} id - ID notifikasi
   * @returns {Promise<Object|null>} - Data notifikasi atau null jika tidak ditemukan
   */
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM notifications WHERE id = ?',
        [id]
      );
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mendapatkan semua notifikasi untuk pengguna tertentu
   * @param {number} userId - ID pengguna
   * @param {number} page - Nomor halaman
   * @param {number} limit - Jumlah notifikasi per halaman
   * @returns {Promise<Object>} - Data notifikasi dan metadata paginasi
   */
  static async findByUserId(userId, page = 1, limit = 10) {
    try {
      // Count total notifications for pagination
      const [countResult] = await pool.query(
        'SELECT COUNT(*) as total FROM notifications WHERE user_id = ?',
        [userId]
      );
      
      const total = countResult[0].total;
      
      // Add pagination
      const offset = (page - 1) * limit;
      
      // Pastikan limit dan offset adalah angka yang valid
      const parsedLimit = parseInt(limit) || 10; // Default ke 10 jika parsing gagal
      const parsedOffset = parseInt(offset) || 0; // Default ke 0 jika parsing gagal
      
      // Get notifications with pagination
      const [rows] = await pool.query(
        `SELECT * FROM notifications 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?`,
        [userId, parsedLimit, parsedOffset]
      );
      
      return {
        notifications: rows,
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
   * Membuat notifikasi baru
   * @param {Object} notificationData - Data notifikasi baru
   * @returns {Promise<Object>} - Data notifikasi yang baru dibuat
   */
  static async create(notificationData) {
    try {
      const { user_id, message } = notificationData;
      
      const [result] = await pool.query(
        'INSERT INTO notifications (user_id, message) VALUES (?, ?)',
        [user_id, message]
      );
      
      return this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Menandai notifikasi sebagai telah dibaca
   * @param {number} id - ID notifikasi
   * @param {number} userId - ID pengguna
   * @returns {Promise<boolean>} - true jika berhasil, false jika gagal
   */
  static async markAsRead(id, userId) {
    try {
      const [result] = await pool.query(
        'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Menandai semua notifikasi pengguna sebagai telah dibaca
   * @param {number} userId - ID pengguna
   * @returns {Promise<boolean>} - true jika berhasil, false jika gagal
   */
  static async markAllAsRead(userId) {
    try {
      const [result] = await pool.query(
        'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
        [userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Menghapus notifikasi
   * @param {number} id - ID notifikasi
   * @param {number} userId - ID pengguna
   * @returns {Promise<boolean>} - true jika berhasil, false jika gagal
   */
  static async delete(id, userId) {
    try {
      const [result] = await pool.query(
        'DELETE FROM notifications WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Membuat notifikasi transaksi baru
   * @param {number} sellerId - ID penjual/pemilik item
   * @param {Object} transaction - Data transaksi
   * @param {Object} item - Data item
   * @param {Object} buyer - Data pembeli
   * @returns {Promise<Object>} - Data notifikasi yang dibuat
   */
  static async createTransactionNotification(sellerId, transaction, item, buyer) {
    try {
      const transactionType = transaction.type === 'rent' ? 'penyewaan' : 'pembelian';
      const message = `${buyer.name} melakukan ${transactionType} untuk item "${item.name}" dengan harga ${transaction.total_price}`;
      
      return this.create({
        user_id: sellerId,
        message
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Membuat notifikasi pesan baru
   * @param {number} receiverId - ID penerima pesan
   * @param {Object} sender - Data pengirim pesan
   * @param {string} messageContent - Isi pesan
   * @returns {Promise<Object>} - Data notifikasi yang dibuat
   */
  static async createMessageNotification(receiverId, sender, messageContent) {
    try {
      // Potong pesan jika terlalu panjang
      const shortMessage = messageContent.length > 50 
        ? `${messageContent.substring(0, 47)}...` 
        : messageContent;
      
      const message = `${sender.name} mengirim pesan: "${shortMessage}"`;
      
      return this.create({
        user_id: receiverId,
        message
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Membuat notifikasi pengingat jatuh tempo sewa
   * @param {number} buyerId - ID penyewa
   * @param {Object} transaction - Data transaksi
   * @param {Object} item - Data item
   * @returns {Promise<Object>} - Data notifikasi yang dibuat
   */
  static async createRentDueNotification(buyerId, transaction, item) {
    try {
      const message = `Masa sewa untuk "${item.name}" akan berakhir besok. Harap segera kembalikan item atau perpanjang masa sewa.`;
      
      return this.create({
        user_id: buyerId,
        message
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mendapatkan subscription pengguna untuk web push
   * @param {number} userId - ID pengguna
   * @returns {Promise<Object|null>} - Data subscription atau null jika tidak ditemukan
   */
  static async getUserPushSubscription(userId) {
    try {
      const [rows] = await pool.query(
        'SELECT push_subscription FROM users WHERE id = ?',
        [userId]
      );
      
      if (rows.length === 0 || !rows[0].push_subscription) {
        return null;
      }
      
      return JSON.parse(rows[0].push_subscription);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Menyimpan subscription pengguna untuk web push
   * @param {number} userId - ID pengguna
   * @param {Object} subscription - Data subscription
   * @returns {Promise<boolean>} - true jika berhasil, false jika gagal
   */
  static async savePushSubscription(userId, subscription) {
    try {
      const [result] = await pool.query(
        'UPDATE users SET push_subscription = ? WHERE id = ?',
        [JSON.stringify(subscription), userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = NotificationModel;