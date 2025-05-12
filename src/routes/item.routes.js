const express = require('express');
const { body } = require('express-validator');
const itemController = require('../controllers/item.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');

const router = express.Router();

// Validasi untuk pembuatan dan update item
const itemValidation = [
  body('name')
    .notEmpty().withMessage('Nama item tidak boleh kosong')
    .isLength({ min: 3, max: 150 }).withMessage('Nama item harus antara 3-150 karakter'),
  body('category_id')
    .optional()
    .isInt().withMessage('ID kategori harus berupa angka'),
  body('description')
    .optional()
    .isLength({ max: 1000 }).withMessage('Deskripsi maksimal 1000 karakter'),
  body('price_sell')
    .optional()
    .isFloat({ min: 0 }).withMessage('Harga jual harus berupa angka positif'),
  body('price_rent')
    .optional()
    .isFloat({ min: 0 }).withMessage('Harga sewa harus berupa angka positif'),
  body('is_available_for_sell')
    .optional()
    .isBoolean().withMessage('Ketersediaan untuk dijual harus berupa boolean'),
  body('is_available_for_rent')
    .optional()
    .isBoolean().withMessage('Ketersediaan untuk disewa harus berupa boolean'),
  body('deposit_amount')
    .optional()
    .isFloat({ min: 0 }).withMessage('Jumlah deposit harus berupa angka positif'),
  body('province_id')
    .optional()
    .isInt().withMessage('ID provinsi harus berupa angka'),
  body('province_name')
    .optional()
    .isString().withMessage('Nama provinsi harus berupa string'),
  body('city_id')
    .optional()
    .isInt().withMessage('ID kota harus berupa angka'),
  body('city_name')
    .optional()
    .isString().withMessage('Nama kota harus berupa string')
];

// Route publik untuk mendapatkan semua item dengan filter dan pagination
router.get('/', itemController.getAllItems);

// Route publik untuk mendapatkan item berdasarkan ID
router.get('/:id', itemController.getItemById);

// Semua route di bawah ini memerlukan autentikasi
router.use(authMiddleware.protect);

// Route untuk membuat item baru dengan upload foto
// Autentikasi dilakukan sebelum upload
router.post(
  '/',
  uploadMiddleware.uploadItemPhotos,
  itemValidation,
  itemController.createItem
);

// Route untuk memperbarui item dengan upload foto
// Autentikasi dilakukan sebelum upload
router.patch(
  '/:id',
  uploadMiddleware.uploadItemPhotos,
  itemValidation,
  itemController.updateItem
);

// Route untuk menghapus item
router.delete('/:id', itemController.deleteItem);

module.exports = router;