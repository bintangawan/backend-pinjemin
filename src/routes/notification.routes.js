const express = require('express');
const { body } = require('express-validator');
const notificationController = require('../controllers/notification.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Semua route di bawah ini memerlukan autentikasi
router.use(authMiddleware.protect);

// Route untuk mendapatkan semua notifikasi pengguna
router.get('/', notificationController.getUserNotifications);

// Route untuk menandai semua notifikasi sebagai telah dibaca
router.patch('/read-all', notificationController.markAllAsRead);

// Route untuk menandai notifikasi sebagai telah dibaca
router.patch('/:id/read', notificationController.markAsRead);

// Route untuk menghapus notifikasi
router.delete('/:id', notificationController.deleteNotification);

// Route untuk menyimpan subscription web push
router.post('/subscribe', [
  body('endpoint').notEmpty().withMessage('Endpoint tidak boleh kosong'),
  body('keys').isObject().withMessage('Keys harus berupa objek'),
  body('keys.p256dh').notEmpty().withMessage('Key p256dh tidak boleh kosong'),
  body('keys.auth').notEmpty().withMessage('Key auth tidak boleh kosong')
], notificationController.saveSubscription);

// Route untuk mendapatkan VAPID public key
router.get('/vapid-public-key', notificationController.getVapidPublicKey);

module.exports = router;