const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Validasi untuk update profil
const updateProfileValidation = [
  body('name')
    .optional()
    .isLength({ min: 3 }).withMessage('Nama minimal 3 karakter'),
  body('province_name')
    .optional()
    .isString().withMessage('Nama provinsi harus berupa string'),
  body('city_name')
    .optional()
    .isString().withMessage('Nama kota harus berupa string')
];

// Validasi untuk update password
const updatePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Password saat ini tidak boleh kosong'),
  body('newPassword')
    .notEmpty().withMessage('Password baru tidak boleh kosong')
    .isLength({ min: 6 }).withMessage('Password baru minimal 6 karakter')
];

// Semua route di bawah ini memerlukan autentikasi
router.use(authMiddleware.protect);

// Route untuk mendapatkan profil pengguna berdasarkan ID
router.get('/:id', userController.getUserProfile);

// Route untuk memperbarui profil pengguna
router.patch('/update-profile', updateProfileValidation, userController.updateProfile);

// Route untuk mengubah password
router.patch('/update-password', updatePasswordValidation, userController.updatePassword);

module.exports = router;