const { validationResult } = require('express-validator');
const MessageModel = require('../models/message.model');
const TransactionModel = require('../models/transaction.model');
const ItemModel = require('../models/item.model');

/**
 * Fungsi untuk menyimpan pesan (digunakan oleh Socket.io dan REST API)
 * @param {Object} messageData - Data pesan { sender_id, transaction_id, content }
 * @returns {Promise<Object>} - Pesan yang disimpan beserta info sender
 */
exports.saveMessage = async (messageData) => {
  try {
    const { sender_id, transaction_id, content } = messageData;

    if (!sender_id || !transaction_id || !content) {
      const error = new Error('Data pesan tidak lengkap');
      error.status = 400;
      error.errors = [{ msg: 'Data pesan tidak lengkap', param: 'messageData' }];
      throw error;
    }

    const transaction = await TransactionModel.findById(transaction_id);
    if (!transaction) {
      const error = new Error('Transaksi tidak ditemukan');
      error.status = 404;
      throw error;
    }

    let receiver_id;
    if (transaction.buyer_id === sender_id) {
      receiver_id = transaction.seller_id;
    } else if (transaction.seller_id === sender_id) {
      receiver_id = transaction.buyer_id;
    } else {
      const error = new Error('Pengirim bukan bagian dari transaksi ini.');
      error.status = 403;
      throw error;
    }

    const newMessage = await MessageModel.create({
      sender_id,
      transaction_id,
      receiver_id,
      content
    });

    const fullMessage = {
      ...newMessage,
    };

    return fullMessage;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

/**
 * Controller untuk mengirim pesan baru (REST API)
 */
exports.sendMessage = async (req, res, next) => {
  try {
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

    const newMessage = await exports.saveMessage({
      sender_id: userId,
      transaction_id,
      content
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`transaction_${transaction_id}`).emit('newMessage', newMessage);
    }

    const notificationController = require('./notification.controller');
    const notification = await notificationController.createMessageNotification(newMessage);

    if (notification) {
      console.log('Created message notification');
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
 * Controller untuk mendapatkan pesan berdasarkan ID transaksi
 */
exports.getMessagesByTransactionId = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user.id;

    const transaction = await TransactionModel.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaksi tidak ditemukan'
      });
    }

    if (transaction.buyer_id !== userId && transaction.seller_id !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Anda tidak memiliki akses ke pesan transaksi ini'
      });
    }

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
 * Controller untuk menghapus pesan
 */
exports.deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

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
