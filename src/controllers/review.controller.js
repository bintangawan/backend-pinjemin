const Review = require('../models/review.model');
const { validationResult } = require('express-validator');

class ReviewController {
  // Mendapatkan semua review untuk item tertentu
  static async getByItemId(req, res, next) {
    try {
      const { itemId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      
      const result = await Review.getByItemId(itemId, page, limit);
      
      // Cek apakah ada review
      if (result.pagination.total === 0) {
        return res.status(200).json({
          status: 'success',
          message: 'Belum ada review untuk item ini',
          data: [],
          pagination: result.pagination
        });
      }
      
      res.status(200).json({
        status: 'success',
        data: result.reviews,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Membuat review baru
  static async create(req, res, next) {
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
      const { itemId } = req.params;
      const { comment } = req.body;
      
      // Memeriksa apakah pengguna memiliki transaksi yang selesai untuk item ini
      const hasCompletedTransaction = await Review.hasCompletedTransaction(userId, itemId);
      if (!hasCompletedTransaction) {
        return res.status(403).json({
          status: 'error',
          message: 'Anda hanya dapat memberikan review untuk item yang telah Anda selesaikan transaksinya'
        });
      }
      
      // Memeriksa apakah pengguna sudah memberikan review untuk item ini
      const hasReviewed = await Review.hasReviewed(userId, itemId);
      if (hasReviewed) {
        return res.status(400).json({
          status: 'error',
          message: 'Anda sudah memberikan review untuk item ini'
        });
      }
      
      const review = await Review.create(userId, itemId, comment);
      
      res.status(201).json({
        status: 'success',
        data: review
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Memperbarui review
  static async update(req, res, next) {
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
      const { id } = req.params;
      const { comment } = req.body;
      
      // Memeriksa apakah review dimiliki oleh pengguna
      const isOwned = await Review.isOwnedByUser(id, userId);
      if (!isOwned) {
        return res.status(403).json({
          status: 'error',
          message: 'Anda tidak memiliki akses untuk memperbarui review ini'
        });
      }
      
      const review = await Review.update(id, comment);
      
      res.status(200).json({
        status: 'success',
        data: review
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Menghapus review
  static async delete(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      // Memeriksa apakah review dimiliki oleh pengguna
      const isOwned = await Review.isOwnedByUser(id, userId);
      if (!isOwned) {
        return res.status(403).json({
          status: 'error',
          message: 'Anda tidak memiliki akses untuk menghapus review ini'
        });
      }
      
      await Review.delete(id);
      
      res.status(200).json({
        status: 'success',
        message: 'Review berhasil dihapus'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReviewController;