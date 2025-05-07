const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Validasi untuk registrasi
const registerValidation = [
  body('name')
    .notEmpty().withMessage('Nama tidak boleh kosong')
    .isLength({ min: 3 }).withMessage('Nama minimal 3 karakter'),
  body('email')
    .notEmpty().withMessage('Email tidak boleh kosong')
    .isEmail().withMessage('Format email tidak valid'),
  body('password')
    .notEmpty().withMessage('Password tidak boleh kosong')
    .isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('province_id')
    .optional()
    .isInt().withMessage('ID provinsi harus berupa string'),
  body('province_name')
    .optional()
    .isString().withMessage('Nama provinsi harus berupa string'),
  body('city_id')
    .optional()
    .isInt().withMessage('ID kota harus berupa string'),
  body('city_name')
    .optional()
    .isString().withMessage('Nama kota harus berupa string')
];

// Validasi untuk login
const loginValidation = [
  body('email')
    .notEmpty().withMessage('Email tidak boleh kosong')
    .isEmail().withMessage('Format email tidak valid'),
  body('password')
    .notEmpty().withMessage('Password tidak boleh kosong')
];

// Route untuk registrasi
router.post('/register', registerValidation, authController.register);

// Route untuk login
router.post('/login', loginValidation, authController.login);

// Route untuk mendapatkan data pengguna yang sedang login
router.get('/me', authMiddleware.protect, authController.getMe);

module.exports = router;