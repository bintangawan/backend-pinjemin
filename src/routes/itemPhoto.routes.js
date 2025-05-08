const express = require('express');
const itemPhotoController = require('../controllers/itemPhoto.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');

const router = express.Router();

// Route publik untuk mendapatkan semua foto item berdasarkan item_id
router.get('/item/:itemId', itemPhotoController.getItemPhotos);

// Semua route di bawah ini memerlukan autentikasi
router.use(authMiddleware.protect);

// Route untuk menambahkan foto item (single)
router.post(
  '/item/:itemId',
  uploadMiddleware.uploadItemPhoto,
  uploadMiddleware.handleMulterError,
  itemPhotoController.addItemPhoto
);

// Route untuk menambahkan beberapa foto item sekaligus (multiple)
router.post(
  '/item/:itemId/multiple',
  uploadMiddleware.uploadItemPhotos,
  uploadMiddleware.handleMulterError,
  itemPhotoController.addMultipleItemPhotos
);

// Route untuk menghapus foto item
router.delete('/:photoId', itemPhotoController.deleteItemPhoto);

module.exports = router;