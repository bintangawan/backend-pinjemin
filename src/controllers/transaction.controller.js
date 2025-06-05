const { validationResult } = require('express-validator');
const TransactionModel = require('../models/transaction.model');
const ItemModel = require('../models/item.model');
const transactionService = require('../services/transaction.service');

/**
 * Controller untuk mendapatkan semua transaksi pengguna
 */
exports.getUserTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type, status, page = 1, limit = 10 } = req.query;
    
    const filters = {
      buyer_id: userId,
      type,
      status
    };
    
    // Hapus filter yang undefined
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });
    
    const result = await TransactionModel.findAll(filters, page, limit);
    
    // Jika tidak ada transaksi, kembalikan array kosong dengan pesan yang sesuai
    if (result.transactions.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'Belum ada transaksi',
        data: [],
        pagination: result.pagination
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: result.transactions,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk mendapatkan transaksi berdasarkan ID
 */
exports.getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const transaction = await TransactionModel.findById(id);
    
    if (!transaction) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaksi tidak ditemukan'
      });
    }
    
    // Cek apakah pengguna adalah pembeli atau pemilik item
    const item = await ItemModel.findById(transaction.item_id);
    
    if (transaction.buyer_id !== userId && item.user_id !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Anda tidak memiliki akses ke transaksi ini'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk membuat transaksi baru
 */
exports.createTransaction = async (req, res, next) => {
  try {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }
    
    const {
      item_id,
      type,
      rent_start_date,
      rent_end_date,
      deposit_paid
    } = req.body;
    
    // Pastikan pengguna telah login
    const userId = req.user.id;
    
    // Cek apakah item ada dan tersedia
    const item = await ItemModel.findById(item_id);
    
    if (!item) {
      return res.status(404).json({
        status: 'error',
        message: 'Item tidak ditemukan'
      });
    }
    
    // Cek apakah pengguna bukan pemilik item
    if (item.user_id === userId) {
      return res.status(400).json({
        status: 'error',
        message: 'Anda tidak dapat melakukan transaksi pada item milik Anda sendiri'
      });
    }
    
    // Cek ketersediaan item berdasarkan tipe transaksi
    if (type === 'rent' && (!item.is_available_for_rent || item.status !== 'available')) {
      return res.status(400).json({
        status: 'error',
        message: 'Item tidak tersedia untuk disewa'
      });
    }
    
    if (type === 'buy' && (!item.is_available_for_sell || item.status !== 'available')) {
      return res.status(400).json({
        status: 'error',
        message: 'Item tidak tersedia untuk dibeli'
      });
    }
    
    // Hitung total harga
    let totalPrice = 0;
    
    if (type === 'rent') {
      if (!rent_start_date || !rent_end_date) {
        return res.status(400).json({
          status: 'error',
          message: 'Tanggal mulai dan selesai sewa diperlukan untuk transaksi sewa'
        });
      }
      
      // Hitung durasi sewa dalam hari
      const startDate = new Date(rent_start_date);
      const endDate = new Date(rent_end_date);
      const durationDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      
      if (durationDays <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Tanggal selesai sewa harus setelah tanggal mulai sewa'
        });
      }
      
      totalPrice = item.price_rent * durationDays;
    } else if (type === 'buy') {
      totalPrice = item.price_sell;
    }
    
    // Buat transaksi baru
    const transactionData = {
      buyer_id: userId,
      item_id,
      type,
      status: 'pending',
      payment_method: 'cod',
      total_price: totalPrice,
      rent_start_date: type === 'rent' ? rent_start_date : null,
      rent_end_date: type === 'rent' ? rent_end_date : null,
      deposit_paid: type === 'rent' ? (deposit_paid || 0) : 0
    };
    
    const newTransaction = await TransactionModel.create(transactionData);

    // Buat notifikasi untuk pemilik item
    const notificationController = require('./notification.controller');
    const notifications = await notificationController.createTransactionNotification(newTransaction);
    if (notifications) {
      console.log(`Created ${notifications.length} transaction notifications`);
    }
    
    // Update status item menjadi 'rented' atau 'sold' jika transaksi berhasil
    if (type === 'rent') {
      await ItemModel.update(item_id, { status: 'rented' });
    } else if (type === 'buy') {
      await ItemModel.update(item_id, { status: 'sold' });
    }
    
    res.status(201).json({
      status: 'success',
      data: newTransaction
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk memperbarui status transaksi
 */
exports.updateTransactionStatus = async (req, res, next) => {
  try {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }
    
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    
    // Gunakan metode updateTransactionStatus dari service
    const result = await transactionService.updateTransactionStatus(id, status, userId);
    
    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.message
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk mendapatkan transaksi sebagai pemilik item
 */
exports.getSellerTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type, status, page = 1, limit = 10 } = req.query;
    
    const result = await TransactionModel.findAllBySellerId(userId, { type, status }, page, limit);
    
    res.status(200).json({
      status: 'success',
      data: result.transactions,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error in getSellerTransactions controller:', error);
    next(error);
  }
};