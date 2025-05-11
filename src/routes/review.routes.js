const express = require('express');
const { body } = require('express-validator');
const ReviewController = require('../controllers/review.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Validasi untuk review
const reviewValidation = [
  body('comment')
    .notEmpty()
    .withMessage('Komentar tidak boleh kosong')
    .isLength({ min: 3, max: 1000 })
    .withMessage('Komentar harus memiliki panjang antara 3 dan 1000 karakter')
];

// Mendapatkan semua review untuk item tertentu (tidak perlu autentikasi)
router.get('/item/:itemId', ReviewController.getByItemId);

// Semua route di bawah ini memerlukan autentikasi
router.use(authMiddleware.protect);

// Membuat review baru
router.post(
  '/item/:itemId',
  reviewValidation,
  ReviewController.create
);

// Memperbarui review
router.patch(
  '/:id',
  reviewValidation,
  ReviewController.update
);

// Menghapus review
router.delete(
  '/:id',
  ReviewController.delete
);

module.exports = router;