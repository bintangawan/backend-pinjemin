const { pool } = require('../config/db');

/**
 * Model untuk mengelola foto item
 */
class ItemPhotoModel {
  /**
   * Mendapatkan foto berdasarkan ID
   * @param {number} id - ID foto
   * @returns {Promise<Object|null>} - Data foto atau null jika tidak ditemukan
   */
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM item_photos WHERE id = ?',
        [id]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mendapatkan semua foto untuk item tertentu
   * @param {number} itemId - ID item
   * @returns {Promise<Array>} - Array data foto
   */
  static async findByItemId(itemId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM item_photos WHERE item_id = ?',
        [itemId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Menambahkan foto baru untuk item
   * @param {number} itemId - ID item
   * @param {string} photoUrl - URL foto
   * @returns {Promise<Object>} - Data foto yang baru ditambahkan
   */
  static async create(itemId, photoUrl) {
    try {
      const [result] = await pool.query(
        'INSERT INTO item_photos (item_id, photo_url) VALUES (?, ?)',
        [itemId, photoUrl]
      );
      
      return this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Menambahkan beberapa foto sekaligus untuk item
   * @param {number} itemId - ID item
   * @param {Array<string>} photoUrls - Array URL foto
   * @returns {Promise<Array>} - Array data foto yang baru ditambahkan
   */
  static async createMany(itemId, photoUrls) {
    try {
      if (!photoUrls || photoUrls.length === 0) {
        return [];
      }
      
      const values = photoUrls.map(url => [itemId, url]);
      
      await pool.query(
        'INSERT INTO item_photos (item_id, photo_url) VALUES ?',
        [values]
      );
      
      return this.findByItemId(itemId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Menghapus foto
   * @param {number} id - ID foto
   * @returns {Promise<boolean>} - true jika berhasil, false jika gagal
   */
  static async delete(id) {
    try {
      const [result] = await pool.query(
        'DELETE FROM item_photos WHERE id = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Menghapus semua foto untuk item tertentu
   * @param {number} itemId - ID item
   * @returns {Promise<boolean>} - true jika berhasil, false jika gagal
   */
  static async deleteByItemId(itemId) {
    try {
      const [result] = await pool.query(
        'DELETE FROM item_photos WHERE item_id = ?',
        [itemId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ItemPhotoModel;