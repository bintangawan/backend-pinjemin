const { validationResult } = require('express-validator');
const webpush = require('web-push');
const { pool } = require('../config/db');
const NotificationModel = require('../models/notification.model');
const TransactionModel = require('../models/transaction.model');
const ItemModel = require('../models/item.model');
const UserModel = require('../models/user.model');

// TODO: Ganti dengan VAPID keys yang sebenarnya
const vapidKeys = {
  publicKey: 'BPO-IPD42nX4i4zBiZKfCD1ab_zidEjSry6bs9FRrHjGkWKNkpH6lGB9tyJqIhXnKIXii63Hyka_8P2xu4yg1g0',
  privateKey: 'W7NAOpMRO7YsD1eWdbnl-e59TL-JeiDf1mHbdsfksFk'
};

// Konfigurasi web-push
webpush.setVapidDetails(
  'mailto:infopinjemin@gmail.com', // Ganti dengan email kontak
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

/**
 * Controller untuk mendapatkan notifikasi pengguna
 */
exports.getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    
    const result = await NotificationModel.findByUserId(userId, page, limit);
    
    res.status(200).json({
      status: 'success',
      data: result.notifications,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk menandai notifikasi sebagai telah dibaca
 */
exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const result = await NotificationModel.markAsRead(id, userId);
    
    if (!result) {
      return res.status(404).json({
        status: 'error',
        message: 'Notifikasi tidak ditemukan atau Anda tidak memiliki akses'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Notifikasi telah ditandai sebagai dibaca'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk menandai semua notifikasi sebagai telah dibaca
 */
exports.markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    await NotificationModel.markAllAsRead(userId);
    
    res.status(200).json({
      status: 'success',
      message: 'Semua notifikasi telah ditandai sebagai dibaca'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk menghapus notifikasi
 */
exports.deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const result = await NotificationModel.delete(id, userId);
    
    if (!result) {
      return res.status(404).json({
        status: 'error',
        message: 'Notifikasi tidak ditemukan atau Anda tidak memiliki akses'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Notifikasi berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk menyimpan subscription web push
 */
exports.saveSubscription = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const subscription = req.body;
    
    // Bersihkan endpoint dari karakter backtick jika ada
    if (subscription.endpoint) {
      subscription.endpoint = subscription.endpoint.replace(/`/g, '').trim();
    }
    
    // Validasi endpoint dengan query yang benar
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE JSON_EXTRACT(push_subscription, "$.endpoint") = ? AND id != ?',
      [subscription.endpoint, userId]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Endpoint subscription sudah digunakan oleh pengguna lain'
      });
    }

    const result = await NotificationModel.savePushSubscription(userId, subscription);

    if (!result) {
      return res.status(500).json({
        status: 'error',
        message: 'Gagal menyimpan subscription'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Subscription berhasil disimpan',
      data: {
        publicKey: vapidKeys.publicKey
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fungsi untuk mengirim notifikasi push ke pengguna
 * @param {number} userId - ID pengguna
 * @param {string} title - Judul notifikasi
 * @param {string} body - Isi notifikasi
 * @param {Object} data - Data tambahan untuk notifikasi
 */
async function sendPushNotification(userId, title, body, data = {}) {
  try {
    const subscription = await NotificationModel.getUserPushSubscription(userId);
    
    if (!subscription) {
      console.log(`User ${userId} tidak memiliki subscription untuk push notification`);
      return false;
    }
    // Pastikan endpoint tidak mengandung karakter backtick
    if (subscription.endpoint) {
      subscription.endpoint = subscription.endpoint.replace(/`/g, '').trim();
    }
    const payload = JSON.stringify({
      title,
      body,
      data,
      icon: '/logo.png', // Path ke icon notifikasi
      badge: '/badge.png', // Path ke badge notifikasi
    });
    
    await webpush.sendNotification(subscription, payload);
    return true;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
}

/**
 * Fungsi untuk membuat notifikasi transaksi baru
 * Dipanggil dari transaction.controller.js saat transaksi dibuat
 */
exports.createTransactionNotification = async (transaction) => {
  try {
    // Dapatkan data item
    const item = await ItemModel.findById(transaction.item_id);
    if (!item) return null;
    
    // Dapatkan data pembeli
    const buyer = await UserModel.findById(transaction.buyer_id);
    if (!buyer) return null;
    
    // Buat notifikasi untuk pemilik item
    const notification = await NotificationModel.createTransactionNotification(
      item.user_id, // seller ID
      transaction,
      item,
      buyer
    );

    // Kirim push notification
    const transactionType = transaction.type === 'rent' ? 'Penyewaan' : 'Pembelian';
    await sendPushNotification(
      item.user_id,
      `${transactionType} Baru`,
      `${buyer.name} melakukan ${transactionType.toLowerCase()} untuk item "${item.name}"`,
      {
        type: 'transaction',
        transactionId: transaction.id
      }
    );
    
    return notification;
  } catch (error) {
    console.error('Error creating transaction notification:', error);
    return null;
  }
};

/**
 * Fungsi untuk membuat notifikasi pesan baru
 * Dipanggil dari message.controller.js saat pesan dibuat
 */
exports.createMessageNotification = async (message) => {
  try {
    // Dapatkan data pengirim
    const sender = await UserModel.findById(message.sender_id);
    if (!sender) return null;
    
    // Buat notifikasi untuk penerima pesan
    const notification = await NotificationModel.createMessageNotification(
      message.receiver_id,
      sender,
      message.content
    );

    // Kirim push notification
    const shortMessage = message.content.length > 50 
      ? `${message.content.substring(0, 47)}...` 
      : message.content;

    await sendPushNotification(
      message.receiver_id,
      `Pesan Baru dari ${sender.name}`,
      shortMessage,
      {
        type: 'message',
        messageId: message.id,
        senderId: message.sender_id
      }
    );
    
    return notification;
  } catch (error) {
    console.error('Error creating message notification:', error);
    return null;
  }
};

/**
 * Fungsi untuk memeriksa dan membuat notifikasi jatuh tempo sewa
 * Dipanggil dari cron job di server.js
 */
exports.checkRentDueNotifications = async () => {
  try {
    // Dapatkan semua transaksi sewa yang masih berlangsung
    const [transactions] = await TransactionModel.findOngoingRentals();
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];
    
    // Filter transaksi yang berakhir besok
    const dueTransactions = transactions.filter(transaction => {
      const endDate = new Date(transaction.rent_end_date).toISOString().split('T')[0];
      return endDate === tomorrowDate;
    });
    
    // Buat notifikasi untuk setiap transaksi yang akan jatuh tempo
    for (const transaction of dueTransactions) {
      const item = await ItemModel.findById(transaction.item_id);
      if (item) {
        // Buat notifikasi di database
        const notification = await NotificationModel.createRentDueNotification(
          transaction.buyer_id,
          transaction,
          item
        );

        // Kirim push notification
        await sendPushNotification(
          transaction.buyer_id,
          'Pengingat Jatuh Tempo Sewa',
          `Masa sewa untuk "${item.name}" akan berakhir besok. Harap segera kembalikan item atau perpanjang masa sewa.`,
          {
            type: 'rent_due',
            transactionId: transaction.id,
            itemId: item.id
          }
        );
      }
    }
    
    return dueTransactions.length;
  } catch (error) {
    console.error('Error checking rent due notifications:', error);
    return 0;
  }
};

/**
 * Controller untuk mendapatkan VAPID public key
 */
exports.getVapidPublicKey = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      publicKey: vapidKeys.publicKey
    });
  } catch (error) {
    next(error);
  }
};