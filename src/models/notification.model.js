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
      const parsedLimit = parseInt(limit) || 10;
      const parsedOffset = parseInt(offset) || 0;
      
      // Get notifications with pagination
      const [rows] = await pool.query(
        `SELECT n.*, 
                CASE 
                  WHEN n.related_user_id IS NOT NULL THEN u.name 
                  ELSE NULL 
                END as related_user_name
         FROM notifications n
         LEFT JOIN users u ON n.related_user_id = u.id
         WHERE n.user_id = ? 
         ORDER BY n.created_at DESC 
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
      const { 
        user_id, 
        message, 
        type = 'transaction', 
        transaction_id = null, 
        related_user_id = null,
        scheduled_date = null,
        reminder_day = 0
      } = notificationData;
      
      const [result] = await pool.query(
        `INSERT INTO notifications 
         (user_id, message, type, transaction_id, related_user_id, scheduled_date, reminder_day) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user_id, message, type, transaction_id, related_user_id, scheduled_date, reminder_day]
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
   * Membuat notifikasi transaksi untuk buyer dan seller
   * @param {Object} transaction - Data transaksi
   * @param {Object} item - Data item
   * @param {Object} buyer - Data pembeli
   * @param {Object} seller - Data penjual
   * @returns {Promise<Array>} - Array notifikasi yang dibuat
   */
  static async createTransactionNotifications(transaction, item, buyer, seller) {
    try {
      const transactionType = transaction.type === 'rent' ? 'penyewaan' : 'pembelian';
      const notifications = [];

      // Notifikasi untuk seller
      const sellerMessage = `${buyer.name} melakukan ${transactionType} untuk item "${item.name}" dengan total ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaction.total_price)}`;
      const sellerNotification = await this.create({
        user_id: seller.id,
        message: sellerMessage,
        type: 'transaction',
        transaction_id: transaction.id,
        related_user_id: buyer.id
      });
      notifications.push(sellerNotification);

      // Notifikasi untuk buyer
      const buyerMessage = `Transaksi ${transactionType} untuk item "${item.name}" berhasil dibuat dengan total ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaction.total_price)}`;
      const buyerNotification = await this.create({
        user_id: buyer.id,
        message: buyerMessage,
        type: 'transaction',
        transaction_id: transaction.id,
        related_user_id: seller.id
      });
      notifications.push(buyerNotification);

      // Jika transaksi adalah rental, buat reminder notifications
      if (transaction.type === 'rent' && transaction.rent_end_date) {
        await this.createRentReminders(transaction, item, buyer);
      }

      return notifications;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Membuat reminder notifications untuk rental (3 hari berturut-turut)
   * @param {Object} transaction - Data transaksi
   * @param {Object} item - Data item
   * @param {Object} buyer - Data pembeli
   */
  static async createRentReminders(transaction, item, buyer) {
  try {
    const endDate = new Date(transaction.rent_end_date);
    const startDate = new Date(transaction.rent_start_date);
    
    // ✅ Hitung durasi sewa dalam hari
    const rentalDurationMs = endDate.getTime() - startDate.getTime();
    const rentalDurationDays = Math.ceil(rentalDurationMs / (1000 * 60 * 60 * 24));
    
    // ✅ Tentukan berapa hari reminder yang akan dibuat berdasarkan durasi sewa
    // Jika sewa 1 hari, buat 1 reminder. Jika 2 hari, buat 2 reminder. Jika 3+ hari, buat 3 reminder.
    const reminderDays = Math.min(rentalDurationDays, 3);
    
    // ✅ Hanya buat reminder untuk hari yang valid (tidak di masa lalu)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = reminderDays; i >= 1; i--) {
      const reminderDate = new Date(endDate);
      reminderDate.setDate(endDate.getDate() - i);
      
      // ✅ Lewati reminder yang jatuh pada masa lalu
      if (reminderDate < today) {
        console.log(`Skipping past reminder for transaction ${transaction.id}, day ${i}`);
        continue;
      }
      
      const dayText = i === 1 ? 'besok' : `${i} hari lagi`;
      const message = `Pengingat: Masa sewa untuk "${item.name}" akan berakhir ${dayText}. Harap segera kembalikan item atau perpanjang masa sewa.`;
      
      await this.create({
        user_id: buyer.id,
        message: message,
        type: 'rent_reminder',
        transaction_id: transaction.id,
        related_user_id: null,
        scheduled_date: reminderDate.toISOString().split('T')[0],
        reminder_day: 4 - i // 1, 2, 3
      });
    }
  } catch (error) {
    throw error;
  }
}

  /**
   * Membuat notifikasi pesan baru
   * @param {number} receiverId - ID penerima pesan
   * @param {Object} sender - Data pengirim pesan
   * @param {string} messageContent - Isi pesan
   * @param {number} messageId - ID pesan
   * @returns {Promise<Object>} - Data notifikasi yang dibuat
   */
  static async createMessageNotification(receiverId, sender, messageContent, messageId) {
    try {
      // Potong pesan jika terlalu panjang
      const shortMessage = messageContent.length > 50 
        ? `${messageContent.substring(0, 47)}...` 
        : messageContent;
      
      const message = `${sender.name} mengirim pesan: "${shortMessage}"`;
      
      return this.create({
        user_id: receiverId,
        message: message,
        type: 'message',
        transaction_id: null,
        related_user_id: sender.id
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mendapatkan reminder notifications yang harus dikirim hari ini
   * @returns {Promise<Array>} - Array notifikasi reminder
   */
  static async getTodayReminders() {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const [rows] = await pool.query(
        `SELECT n.*, u.name as user_name, i.name as item_name
         FROM notifications n
         JOIN users u ON n.user_id = u.id
         JOIN transactions t ON n.transaction_id = t.id
         JOIN items i ON t.item_id = i.id
         WHERE n.type = 'rent_reminder' 
         AND n.scheduled_date = ? 
         AND n.is_read = 0`,
        [today]
      );
      
      return rows;
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

  /**
 * Menghapus subscription push notification pengguna
 * @param {number} userId - ID pengguna
 * @returns {Promise<boolean>} - true jika berhasil
 */
  static async removePushSubscription(userId) {
    try {
      const [result] = await pool.query(
        'UPDATE users SET push_subscription = NULL WHERE id = ?',
        [userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }


  /**
   * Mendapatkan jumlah notifikasi yang belum dibaca
   * @param {number} userId - ID pengguna
   * @returns {Promise<number>} - Jumlah notifikasi yang belum dibaca
   */
  static async getUnreadCount(userId) {
    try {
      const [rows] = await pool.query(
        'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
        [userId]
      );
      
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = NotificationModel;