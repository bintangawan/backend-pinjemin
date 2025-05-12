const fs = require('fs');
const path = require('path');
const ItemModel = require('../models/item.model');

/**
 * Service untuk mengelola item
 */
class ItemService {
  /**
   * Menghapus foto item dari sistem file
   * @param {string} photoUrl - URL foto yang akan dihapus
   * @returns {Promise<boolean>} - true jika berhasil, false jika gagal
   */
  static async deletePhotoFile(photoUrl) {
    try {
      if (!photoUrl) return false;
      
      // Hapus leading slash jika ada
      const relativePath = photoUrl.startsWith('/') ? photoUrl.substring(1) : photoUrl;
      const filePath = path.join(__dirname, '../../', relativePath);
      
      // Cek apakah file ada
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error menghapus file foto:', error);
      return false;
    }
  }

  /**
   * Menghapus semua foto item dari sistem file
   * @param {Object} item - Item dengan foto yang akan dihapus
   * @returns {Promise<boolean>} - true jika berhasil, false jika gagal
   */
  static async deleteAllItemPhotos(item) {
    try {
      // Hapus thumbnail jika ada
      if (item.thumbnail) {
        await this.deletePhotoFile(item.thumbnail);
      }
      
      // Hapus semua foto item
      if (item.photos && item.photos.length > 0) {
        for (const photoUrl of item.photos) {
          await this.deletePhotoFile(photoUrl);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error menghapus semua foto item:', error);
      return false;
    }
  }

  /**
   * Memperbarui foto item
   * @param {number} itemId - ID item
   * @param {string} thumbnail - URL thumbnail baru
   * @param {Array<string>} photoUrls - Array URL foto baru
   * @returns {Promise<boolean>} - true jika berhasil, false jika gagal
   */
  static async updateItemPhotos(itemId, thumbnail, photoUrls) {
    try {
      // Ambil item untuk mendapatkan foto lama
      const item = await ItemModel.findById(itemId);
      if (!item) return false;
      
      // Hapus foto lama jika ada foto baru
      if (thumbnail || (photoUrls && photoUrls.length > 0)) {
        // Jika ada thumbnail baru, hapus thumbnail lama
        if (thumbnail && item.thumbnail) {
          await this.deletePhotoFile(item.thumbnail);
        }
        
        // Jika ada foto baru, hapus foto lama
        if (photoUrls && photoUrls.length > 0 && item.photos && item.photos.length > 0) {
          for (const photoUrl of item.photos) {
            await this.deletePhotoFile(photoUrl);
          }
        }
      }
      
      // Update item dengan foto baru
      const updateData = {};
      if (thumbnail) {
        updateData.thumbnail = thumbnail;
      }
      
      if (photoUrls && photoUrls.length > 0) {
        updateData.photos = photoUrls;
      }
      
      if (Object.keys(updateData).length > 0) {
        await ItemModel.update(itemId, updateData);
      }
      
      return true;
    } catch (error) {
      console.error('Error memperbarui foto item:', error);
      return false;
    }
  }

  /**
   * Memeriksa apakah item tersedia untuk transaksi
   * @param {number} itemId - ID item
   * @param {string} transactionType - Tipe transaksi ('rent' atau 'buy')
   * @returns {Promise<Object>} - Status ketersediaan dan pesan
   */
  static async checkItemAvailability(itemId, transactionType) {
    try {
      const item = await ItemModel.findById(itemId);
      
      if (!item) {
        return {
          available: false,
          message: 'Item tidak ditemukan'
        };
      }
      
      if (item.status !== 'available') {
        return {
          available: false,
          message: `Item tidak tersedia (status: ${item.status})`
        };
      }
      
      if (transactionType === 'rent' && !item.is_available_for_rent) {
        return {
          available: false,
          message: 'Item tidak tersedia untuk disewa'
        };
      }
      
      if (transactionType === 'buy' && !item.is_available_for_sell) {
        return {
          available: false,
          message: 'Item tidak tersedia untuk dibeli'
        };
      }
      
      return {
        available: true,
        message: 'Item tersedia',
        item
      };
    } catch (error) {
      console.error('Error memeriksa ketersediaan item:', error);
      return {
        available: false,
        message: 'Terjadi kesalahan saat memeriksa ketersediaan item'
      };
    }
  }
}

module.exports = ItemService;