const { validationResult } = require('express-validator');
const webpush = require('web-push');
const { pool } = require('../config/db');
const NotificationModel = require('../models/notification.model');
const TransactionModel = require('../models/transaction.model');
const ItemModel = require('../models/item.model');
const UserModel = require('../models/user.model');
require('dotenv').config();

// TODO: Ganti dengan VAPID keys yang sebenarnya
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY
};

// Konfigurasi web-push
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

/**
 * Controller untuk mendapatkan notifikasi pengguna
 */
exports.getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, type } = req.query;
    
    const result = await NotificationModel.findByUserId(userId, page, limit);
    const unreadCount = await NotificationModel.getUnreadCount(userId);
    
    res.status(200).json({
      status: 'success',
      message: 'Notifikasi berhasil diambil',
      data: {
        notifications: result.notifications,
        unread_count: unreadCount,
        pagination: result.pagination
      }
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
    
    const unreadCount = await NotificationModel.getUnreadCount(userId);
    
    res.status(200).json({
      status: 'success',
      message: 'Notifikasi telah ditandai sebagai dibaca',
      data: {
        unread_count: unreadCount
      }
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
      message: 'Semua notifikasi telah ditandai sebagai dibaca',
      data: {
        unread_count: 0
      }
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
 * Controller untuk unsubscribe dari push notification
 */
exports.unsubscribe = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await NotificationModel.removePushSubscription(userId);

    if (!result) {
      return res.status(500).json({
        status: 'error',
        message: 'Gagal melakukan unsubscribe'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Berhasil berhenti berlangganan push notification'
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
      icon: '/logo.png',
      badge: '/badge.png',
    });
    
    try {
  await webpush.sendNotification(subscription, payload);
  return true;
} catch (error) {
  console.error('Error sending push notification:', error);

  // ❗ Auto-remove expired or invalid subscription
  const expiredStatusCodes = [404, 410];
  if (error.statusCode && expiredStatusCodes.includes(error.statusCode)) {
    console.warn(`Subscription for user ${userId} is expired. Removing from database...`);
    await NotificationModel.removePushSubscription(userId);
  }

  return false;
}

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

    // Dapatkan data penjual
    const seller = await UserModel.findById(item.user_id);
    if (!seller) return null;
    
    // Buat notifikasi untuk buyer dan seller
    const notifications = await NotificationModel.createTransactionNotifications(
      transaction,
      item,
      buyer,
      seller
    );

    // Kirim push notification ke seller
    const transactionType = transaction.type === 'rent' ? 'Penyewaan' : 'Pembelian';
    await sendPushNotification(
      seller.id,
      `${transactionType} Baru`,
      `${buyer.name} melakukan ${transactionType.toLowerCase()} untuk item "${item.name}"`,
      {
        type: 'transaction',
        transactionId: transaction.id,
        userId: buyer.id
      }
    );

    // Kirim push notification ke buyer
    await sendPushNotification(
      buyer.id,
      `Transaksi ${transactionType} Berhasil`,
      `Transaksi ${transactionType.toLowerCase()} untuk "${item.name}" berhasil dibuat`,
      {
        type: 'transaction',
        transactionId: transaction.id,
        userId: seller.id
      }
    );
    
    return notifications;
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
      message.content,
      message.id
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
 * Fungsi untuk mengirim reminder notifications yang dijadwalkan
 * Dipanggil dari cron job setiap hari jam 8 pagi
 */
exports.sendScheduledReminders = async () => {
  try {
    const reminders = await NotificationModel.getTodayReminders();
    let sentCount = 0;

    for (const reminder of reminders) {
      // Kirim push notification
      const success = await sendPushNotification(
        reminder.user_id,
        'Pengingat Jatuh Tempo Sewa',
        reminder.message,
        {
          type: 'rent_reminder',
          transactionId: reminder.transaction_id,
          reminderDay: reminder.reminder_day
        }
      );

      if (success) {
        sentCount++;
      }

      // Mark notification as read setelah dikirim
      await NotificationModel.markAsRead(reminder.id, reminder.user_id);
    }

    console.log(`Sent ${sentCount} scheduled reminders out of ${reminders.length} total reminders`);
    return sentCount;
  } catch (error) {
    console.error('Error sending scheduled reminders:', error);
    return 0;
  }
};

/**
 * Controller untuk mengecek status subscription pengguna
 */
/**
 * Controller untuk mengecek status subscription pengguna
 */
exports.getSubscriptionStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Dapatkan subscription dari database
    const subscription = await NotificationModel.getUserPushSubscription(userId);
    
    if (!subscription) {
      return res.status(200).json({
        status: 'success',
        message: 'Status subscription berhasil diambil',
        data: {
          hasSubscription: false,
          isActive: false,
          subscription: null
        }
      });
    }

    // Cek apakah subscription masih valid (memiliki endpoint dan keys)
    const isActive = !!(
      subscription.endpoint && 
      subscription.keys && 
      subscription.keys.p256dh && 
      subscription.keys.auth
    );

    res.status(200).json({
      status: 'success',
      message: 'Status subscription berhasil diambil',
      data: {
        hasSubscription: true,
        isActive: isActive,
        subscription: {
          endpoint: subscription.endpoint
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk mendapatkan VAPID public key
 */
exports.getVapidPublicKey = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'VAPID public key berhasil diambil',
      data: {
        publicKey: vapidKeys.publicKey
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk mendapatkan jumlah notifikasi yang belum dibaca
 */
exports.getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const unreadCount = await NotificationModel.getUnreadCount(userId);
    
    res.status(200).json({
      status: 'success',
      message: 'Jumlah notifikasi yang belum dibaca berhasil diambil',
      data: {
        unread_count: unreadCount
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fungsi untuk memeriksa dan membuat notifikasi untuk transaksi yang akan jatuh tempo
 * Dipanggil dari cron job setiap hari jam 8 pagi
 */
exports.checkRentDueNotifications = async () => {
  try {
    // ✅ Dapatkan tanggal hari ini
    const today = new Date().toISOString().split('T')[0];
    
    // ✅ Ambil reminder yang dijadwalkan untuk hari ini
    const [reminders] = await pool.query(
      `SELECT n.* 
       FROM notifications n
       WHERE n.type = 'rent_reminder' 
       AND n.scheduled_date = ? 
       AND n.is_read = 0`,
      [today]
    );
    
    console.log(`Found ${reminders.length} reminders scheduled for today (${today})`);
    
    // ✅ Kirim reminder yang dijadwalkan untuk hari ini
    let sentCount = 0;
    for (const reminder of reminders) {
      try {
        // Kirim push notification
        const success = await sendPushNotification(
          reminder.user_id,
          'Pengingat Jatuh Tempo Sewa',
          reminder.message,
          {
            type: 'rent_reminder',
            transactionId: reminder.transaction_id,
            reminderDay: reminder.reminder_day
          }
        );
        
        if (success) {
          sentCount++;
          console.log(`Successfully sent reminder ${reminder.id} to user ${reminder.user_id}`);
        }
      } catch (error) {
        console.error(`Error sending reminder ${reminder.id}:`, error);
      }
    }
    
    console.log(`Sent ${sentCount} rent due reminders out of ${reminders.length} total reminders`);
    return sentCount;
  } catch (error) {
    console.error('Error checking rent due notifications:', error);
    return 0;
  }
};

module.exports = exports;