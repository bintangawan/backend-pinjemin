const fs = require('fs');
const path = require('path');
const ItemModel = require('../models/item.model');
const ItemPhotoModel = require('../models/itemPhoto.model');

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
   * Menghapus semua foto item dari sistem file dan database
   * @param {number} itemId - ID item
   * @returns {Promise<boolean>} - true jika berhasil, false jika gagal
   */
  static async deleteAllItemPhotos(itemId) {
    try {
      // Ambil semua foto item
      const photos = await ItemPhotoModel.findByItemId(itemId);
      
      // Hapus file foto dari sistem file
      for (const photo of photos) {
        await this.deletePhotoFile(photo.photo_url);
      }
      
      // Hapus foto dari database
      await ItemPhotoModel.deleteByItemId(itemId);
      
      return true;
    } catch (error) {
      console.error('Error menghapus semua foto item:', error);
      return false;
    }
  }

  /**
   * Memperbarui foto item
   * @param {number} itemId - ID item
   * @param {Array<string>} newPhotoUrls - Array URL foto baru
   * @returns {Promise<boolean>} - true jika berhasil, false jika gagal
   */
  static async updateItemPhotos(itemId, newPhotoUrls) {
    try {
      // Hapus semua foto lama
      await this.deleteAllItemPhotos(itemId);
      
      // Tambahkan foto baru
      if (newPhotoUrls && newPhotoUrls.length > 0) {
        await ItemPhotoModel.createMany(itemId, newPhotoUrls);
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