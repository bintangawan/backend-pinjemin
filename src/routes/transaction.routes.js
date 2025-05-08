const express = require('express');
const { body } = require('express-validator');
const transactionController = require('../controllers/transaction.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Validasi untuk pembuatan transaksi
const createTransactionValidation = [
  body('item_id')
    .notEmpty().withMessage('ID item tidak boleh kosong')
    .isInt().withMessage('ID item harus berupa angka'),
  body('type')
    .notEmpty().withMessage('Tipe transaksi tidak boleh kosong')
    .isIn(['rent', 'buy']).withMessage('Tipe transaksi harus rent atau buy'),
  body('rent_start_date')
    .if(body('type').equals('rent'))
    .notEmpty().withMessage('Tanggal mulai sewa diperlukan untuk transaksi sewa')
    .isDate().withMessage('Format tanggal mulai sewa tidak valid'),
  body('rent_end_date')
    .if(body('type').equals('rent'))
    .notEmpty().withMessage('Tanggal selesai sewa diperlukan untuk transaksi sewa')
    .isDate().withMessage('Format tanggal selesai sewa tidak valid'),
  body('deposit_paid')
    .optional()
    .isFloat({ min: 0 }).withMessage('Deposit harus berupa angka positif')
];

// Validasi untuk update status transaksi
const updateStatusValidation = [
  body('status')
    .notEmpty().withMessage('Status tidak boleh kosong')
    .isIn(['pending', 'ongoing', 'returned', 'late', 'cancelled', 'completed'])
    .withMessage('Status tidak valid')
];

// Semua route di bawah ini memerlukan autentikasi
router.use(authMiddleware.protect);

// Route untuk mendapatkan semua transaksi pengguna
router.get('/', transactionController.getUserTransactions);

// Route untuk mendapatkan transaksi sebagai pemilik item
router.get('/seller', transactionController.getSellerTransactions);

// Route untuk mendapatkan transaksi berdasarkan ID
router.get('/:id', transactionController.getTransactionById);

// Route untuk membuat transaksi baru
router.post('/', createTransactionValidation, transactionController.createTransaction);

// Route untuk memperbarui status transaksi
router.patch('/:id/status', updateStatusValidation, transactionController.updateTransactionStatus);

module.exports = router;