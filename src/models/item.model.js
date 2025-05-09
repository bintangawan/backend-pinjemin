const { pool } = require('../config/db');

/**
 * Model untuk mengelola data item
 */
class ItemModel {
  /**
   * Mendapatkan item berdasarkan ID
   * @param {number} id - ID item
   * @returns {Promise<Object|null>} - Data item atau null jika tidak ditemukan
   */
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        `SELECT i.*, 
          u.name as owner_name, 
          u.email as owner_email,
          c.name as category_name,
          (SELECT GROUP_CONCAT(photo_url) FROM item_photos WHERE item_id = i.id) as photos
        FROM items i
        LEFT JOIN users u ON i.user_id = u.id
        LEFT JOIN categories c ON i.category_id = c.id
        WHERE i.id = ?`,
        [id]
      );
      
      if (rows.length === 0) return null;
      
      // Format photos as array
      const item = rows[0];
      if (item.photos) {
        item.photos = item.photos.split(',');
      } else {
        item.photos = [];
      }
      
      return item;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mendapatkan semua item dengan filter opsional
   * @param {Object} filters - Filter untuk pencarian
   * @param {number} page - Nomor halaman
   * @param {number} limit - Jumlah item per halaman
   * @returns {Promise<Object>} - Data item dan metadata paginasi
   */
  static async findAll(filters = {}, page = 1, limit = 10) {
    try {
      let query = `
        SELECT i.*, 
          u.name as owner_name, 
          c.name as category_name,
          (SELECT photo_url FROM item_photos WHERE item_id = i.id LIMIT 1) as thumbnail
        FROM items i
        LEFT JOIN users u ON i.user_id = u.id
        LEFT JOIN categories c ON i.category_id = c.id
        WHERE 1=1
      `;
      
      const queryParams = [];
      
      // Apply filters
      if (filters.name) {
        query += ' AND i.name LIKE ?';
        queryParams.push(`%${filters.name}%`);
      }
      
      if (filters.category_id) {
        query += ' AND i.category_id = ?';
        queryParams.push(filters.category_id);
      }
      
      if (filters.user_id) {
        query += ' AND i.user_id = ?';
        queryParams.push(filters.user_id);
      }
      
      if (filters.status) {
        query += ' AND i.status = ?';
        queryParams.push(filters.status);
      }
      
      if (filters.is_available_for_rent !== undefined) {
        query += ' AND i.is_available_for_rent = ?';
        queryParams.push(filters.is_available_for_rent);
      }
      
      if (filters.is_available_for_sell !== undefined) {
        query += ' AND i.is_available_for_sell = ?';
        queryParams.push(filters.is_available_for_sell);
      }
      
      // Count total items for pagination
      const [countResult] = await pool.query(
        query.replace('SELECT i.*, u.name as owner_name, c.name as category_name, (SELECT photo_url FROM item_photos WHERE item_id = i.id LIMIT 1) as thumbnail', 'SELECT COUNT(*) as total'),
        queryParams
      );
      
      const total = countResult[0].total;
      
      // Add pagination
      const offset = (page - 1) * limit;
      query += ' ORDER BY i.created_at DESC LIMIT ? OFFSET ?';
      
      // Pastikan limit dan offset adalah angka yang valid
      const parsedLimit = parseInt(limit) || 10; // Default ke 10 jika parsing gagal
      const parsedOffset = parseInt(offset) || 0; // Default ke 0 jika parsing gagal
      
      queryParams.push(parsedLimit, parsedOffset);
      
      // Execute query with pagination
      const [rows] = await pool.query(query, queryParams);
      
      return {
        items: rows,
        pagination: {
          total,
          page: parseInt(page) || 1,
          limit: parsedLimit,
          totalPages: Math.ceil(total / parsedLimit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Membuat item baru
   * @param {Object} itemData - Data item baru
   * @returns {Promise<Object>} - Data item yang baru dibuat
   */
  static async create(itemData) {
    try {
      const {
        user_id,
        category_id,
        name,
        description,
        price_sell,
        price_rent,
        is_available_for_sell,
        is_available_for_rent,
        deposit_amount,
        province_id,
        province_name,
        city_id,
        city_name
      } = itemData;
      
      const [result] = await pool.query(
        `INSERT INTO items (
          user_id, category_id, name, description, price_sell, price_rent, 
          is_available_for_sell, is_available_for_rent, deposit_amount,
          province_id, province_name, city_id, city_name
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id, 
          category_id || null, 
          name, 
          description || null, 
          price_sell || null, 
          price_rent || null, 
          is_available_for_sell ? 1 : 0, 
          is_available_for_rent ? 1 : 0, 
          deposit_amount || 0,
          province_id || null,
          province_name || null,
          city_id || null,
          city_name || null
        ]
      );
      
      return this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Memperbarui data item
   * @param {number} id - ID item
   * @param {Object} updateData - Data yang akan diperbarui
   * @returns {Promise<Object|null>} - Data item yang diperbarui atau null jika tidak ditemukan
   */
  static async update(id, updateData) {
    try {
      const allowedFields = [
        'category_id', 'name', 'description', 'price_sell', 'price_rent',
        'is_available_for_sell', 'is_available_for_rent', 'deposit_amount',
        'status', 'province_id', 'province_name', 'city_id', 'city_name'
      ];
      
      const updateFields = [];
      const queryParams = [];
      
      for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key)) {
          updateFields.push(`${key} = ?`);
          queryParams.push(value);
        }
      }
      
      if (updateFields.length === 0) {
        return this.findById(id);
      }
      
      queryParams.push(id);
      
      const [result] = await pool.query(
        `UPDATE items SET ${updateFields.join(', ')} WHERE id = ?`,
        queryParams
      );
      
      return result.affectedRows > 0 ? this.findById(id) : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Menghapus item
   * @param {number} id - ID item
   * @returns {Promise<boolean>} - true jika berhasil, false jika gagal
   */
  static async delete(id) {
    try {
      // Delete related photos first
      await pool.query('DELETE FROM item_photos WHERE item_id = ?', [id]);
      
      // Then delete the item
      const [result] = await pool.query('DELETE FROM items WHERE id = ?', [id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ItemModel;