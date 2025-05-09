const { validationResult } = require('express-validator');
const MessageModel = require('../models/message.model');
const TransactionModel = require('../models/transaction.model');
const ItemModel = require('../models/item.model');

/**
 * Fungsi untuk menyimpan pesan (digunakan oleh Socket.io)
 * @param {Object} messageData - Data pesan
 * @returns {Promise<Object>} - Pesan yang disimpan
 */
exports.saveMessage = async (messageData) => {
  try {
    const { sender_id, transaction_id, content } = messageData;
    
    // Validasi data
    if (!sender_id || !transaction_id || !content) {
      throw new Error('Data pesan tidak lengkap');
    }
    
    // Simpan pesan ke database
    const newMessage = await MessageModel.create({
      sender_id,
      transaction_id,
      content
    });
    
    return newMessage;
  } catch (error) {
    throw error;
  }
};

/**
 * Controller untuk mendapatkan pesan berdasarkan ID transaksi
 */
exports.getMessagesByTransactionId = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user.id;
    
    // Cek apakah transaksi ada
    const transaction = await TransactionModel.findById(transactionId);
    
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
        message: 'Anda tidak memiliki akses ke pesan transaksi ini'
      });
    }
    
    // Ambil pesan
    const result = await MessageModel.findByTransactionId(transactionId, page, limit);
    
    res.status(200).json({
      status: 'success',
      data: result.messages,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk mengirim pesan baru (REST API)
 */
exports.sendMessage = async (req, res, next) => {
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
    
    const { transaction_id, content } = req.body;
    const userId = req.user.id;
    
    // Cek apakah transaksi ada
    const transaction = await TransactionModel.findById(transaction_id);
    
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
        message: 'Anda tidak memiliki akses untuk mengirim pesan pada transaksi ini'
      });
    }
    
    // Tentukan receiver_id berdasarkan sender
    let receiver_id;
    if (transaction.buyer_id === userId) {
    // Jika pengirim adalah pembeli, penerima adalah pemilik item
      receiver_id = item.user_id;
    } else {
    // Jika pengirim adalah pemilik item, penerima adalah pembeli
      receiver_id = transaction.buyer_id;
    }

    // Simpan pesan
    const newMessage = await MessageModel.create({
      sender_id: userId,
      transaction_id,
      receiver_id,
      content
    }); 
    
    // Emit event ke Socket.io jika tersedia
    const io = req.app.get('io');
    if (io) {
      io.to(`transaction_${transaction_id}`).emit('newMessage', newMessage);
    }
    
    res.status(201).json({
      status: 'success',
      data: newMessage
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk menghapus pesan
 */
exports.deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Hapus pesan
    const result = await MessageModel.delete(id, userId);
    
    if (!result) {
      return res.status(404).json({
        status: 'error',
        message: 'Pesan tidak ditemukan atau Anda tidak memiliki izin untuk menghapusnya'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Pesan berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};