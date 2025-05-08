const ItemModel = require('../models/item.model');
const TransactionModel = require('../models/transaction.model');
const ItemService = require('./item.service');

/**
 * Service untuk mengelola transaksi
 */
class TransactionService {
  /**
   * Membuat transaksi baru
   * @param {Object} transactionData - Data transaksi
   * @param {number} userId - ID pengguna yang melakukan transaksi
   * @returns {Promise<Object>} - Transaksi yang dibuat dan status operasi
   */
  static async createTransaction(transactionData, userId) {
    try {
      const { item_id, type } = transactionData;
      
      // Cek ketersediaan item
      const availability = await ItemService.checkItemAvailability(item_id, type);
      
      if (!availability.available) {
        return {
          success: false,
          message: availability.message
        };
      }
      
      // Cek apakah pengguna bukan pemilik item
      if (availability.item.user_id === userId) {
        return {
          success: false,
          message: 'Anda tidak dapat melakukan transaksi pada item milik Anda sendiri'
        };
      }
      
      // Hitung total harga
      let totalPrice = 0;
      
      if (type === 'rent') {
        if (!transactionData.rent_start_date || !transactionData.rent_end_date) {
          return {
            success: false,
            message: 'Tanggal mulai dan selesai sewa diperlukan untuk transaksi sewa'
          };
        }
        
        // Hitung durasi sewa dalam hari
        const startDate = new Date(transactionData.rent_start_date);
        const endDate = new Date(transactionData.rent_end_date);
        const durationDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        if (durationDays <= 0) {
          return {
            success: false,
            message: 'Tanggal selesai sewa harus setelah tanggal mulai sewa'
          };
        }
        
        totalPrice = availability.item.price_rent * durationDays;
      } else if (type === 'buy') {
        totalPrice = availability.item.price_sell;
      }
      
      // Buat transaksi baru
      const newTransactionData = {
        buyer_id: userId,
        item_id,
        type,
        status: 'pending',
        payment_method: 'cod',
        total_price: totalPrice,
        rent_start_date: type === 'rent' ? transactionData.rent_start_date : null,
        rent_end_date: type === 'rent' ? transactionData.rent_end_date : null,
        deposit_paid: type === 'rent' ? (transactionData.deposit_paid || 0) : 0
      };
      
      const newTransaction = await TransactionModel.create(newTransactionData);
      
      // Update status item menjadi 'rented' atau 'sold' jika transaksi berhasil
      if (type === 'rent') {
        await ItemModel.update(item_id, { status: 'rented' });
      } else if (type === 'buy') {
        await ItemModel.update(item_id, { status: 'sold' });
      }
      
      return {
        success: true,
        data: newTransaction
      };
    } catch (error) {
      console.error('Error membuat transaksi:', error);
      return {
        success: false,
        message: 'Terjadi kesalahan saat membuat transaksi'
      };
    }
  }

  /**
   * Memperbarui status transaksi
   * @param {number} transactionId - ID transaksi
   * @param {string} status - Status baru
   * @param {number} userId - ID pengguna yang melakukan update
   * @returns {Promise<Object>} - Transaksi yang diperbarui dan status operasi
   */
  static async updateTransactionStatus(transactionId, status, userId) {
    try {
      // Cek apakah transaksi ada
      const transaction = await TransactionModel.findById(transactionId);
      
      if (!transaction) {
        return {
          success: false,
          message: 'Transaksi tidak ditemukan'
        };
      }
      
      // Cek apakah pengguna adalah pembeli atau pemilik item
      if (transaction.buyer_id !== userId && transaction.seller_id !== userId) {
        return {
          success: false,
          message: 'Anda tidak memiliki akses untuk memperbarui transaksi ini'
        };
      }
      
      // Validasi perubahan status
      const validStatusTransitions = {
        pending: ['ongoing', 'cancelled'],
        ongoing: ['completed', 'returned', 'late'],
        returned: ['completed'],
        late: ['completed'],
        cancelled: [],
        completed: []
      };
      
      if (!validStatusTransitions[transaction.status].includes(status)) {
        return {
          success: false,
          message: `Tidak dapat mengubah status dari '${transaction.status}' ke '${status}'`
        };
      }
      
      // Update status transaksi
      const updatedTransaction = await TransactionModel.updateStatus(transactionId, status);
      
      // Update status item jika diperlukan
      if (status === 'cancelled' && transaction.status === 'pending') {
        await ItemModel.update(transaction.item_id, { status: 'available' });
      } else if (status === 'completed' && transaction.type === 'rent') {
        await ItemModel.update(transaction.item_id, { status: 'available' });
      }
      
      return {
        success: true,
        data: updatedTransaction
      };
    } catch (error) {
      console.error('Error memperbarui status transaksi:', error);
      return {
        success: false,
        message: 'Terjadi kesalahan saat memperbarui status transaksi'
      };
    }
  }

  /**
   * Mendapatkan transaksi berdasarkan ID
   * @param {number} transactionId - ID transaksi
   * @param {number} userId - ID pengguna yang melakukan request
   * @returns {Promise<Object>} - Transaksi dan status operasi
   */
  static async getTransactionById(transactionId, userId) {
    try {
      const transaction = await TransactionModel.findById(transactionId);
      
      if (!transaction) {
        return {
          success: false,
          message: 'Transaksi tidak ditemukan'
        };
      }
      
      // Cek apakah pengguna adalah pembeli atau pemilik item
      if (transaction.buyer_id !== userId && transaction.seller_id !== userId) {
        return {
          success: false,
          message: 'Anda tidak memiliki akses untuk melihat transaksi ini'
        };
      }
      
      return {
        success: true,
        data: transaction
      };
    } catch (error) {
      console.error('Error mendapatkan transaksi:', error);
      return {
        success: false,
        message: 'Terjadi kesalahan saat mendapatkan transaksi'
      };
    }
  }

  /**
   * Mendapatkan semua transaksi pengguna sebagai pembeli
   * @param {number} userId - ID pengguna
   * @param {Object} filters - Filter untuk pencarian
   * @param {number} page - Nomor halaman
   * @param {number} limit - Jumlah transaksi per halaman
   * @returns {Promise<Object>} - Daftar transaksi dan status operasi
   */
  static async getUserTransactions(userId, filters = {}, page = 1, limit = 10) {
    try {
      // Tambahkan buyer_id ke filter
      const userFilters = { ...filters, buyer_id: userId };
      
      const result = await TransactionModel.findAll(userFilters, page, limit);
      
      return {
        success: true,
        data: result.transactions,
        pagination: result.pagination
      };
    } catch (error) {
      console.error('Error mendapatkan transaksi pengguna:', error);
      return {
        success: false,
        message: 'Terjadi kesalahan saat mendapatkan transaksi pengguna'
      };
    }
  }

  /**
   * Mendapatkan semua transaksi pengguna sebagai penjual
   * @param {number} userId - ID pengguna
   * @param {Object} filters - Filter untuk pencarian
   * @param {number} page - Nomor halaman
   * @param {number} limit - Jumlah transaksi per halaman
   * @returns {Promise<Object>} - Daftar transaksi dan status operasi
   */
  static async getSellerTransactions(userId, filters = {}, page = 1, limit = 10) {
    try {
      const result = await TransactionModel.findAllBySellerId(userId, filters, page, limit);
      
      return {
        success: true,
        data: result.transactions,
        pagination: result.pagination
      };
    } catch (error) {
      console.error('Error mendapatkan transaksi penjual:', error);
      return {
        success: false,
        message: 'Terjadi kesalahan saat mendapatkan transaksi penjual'
      };
    }
  }
}

module.exports = TransactionService;