const express = require('express');
const { body } = require('express-validator');
const messageController = require('../controllers/message.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Validasi untuk pengiriman pesan
const sendMessageValidation = [
  body('transaction_id')
    .notEmpty().withMessage('ID transaksi tidak boleh kosong')
    .isInt().withMessage('ID transaksi harus berupa angka'),
  body('content')
    .notEmpty().withMessage('Konten pesan tidak boleh kosong')
    .isLength({ max: 1000 }).withMessage('Konten pesan maksimal 1000 karakter')
];

// Semua route di bawah ini memerlukan autentikasi
router.use(authMiddleware.protect);

// Route untuk mendapatkan pesan berdasarkan ID transaksi
router.get('/transaction/:transactionId', messageController.getMessagesByTransactionId);

// Route untuk mengirim pesan baru
router.post('/', sendMessageValidation, messageController.sendMessage);

// Route untuk menghapus pesan
router.delete('/:id', messageController.deleteMessage);

module.exports = router;