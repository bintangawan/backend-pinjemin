const { pool } = require('../config/db');

/**
 * Model untuk mengelola data item
 */
class ItemModel {
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
        city_name,
        thumbnail,
        photos
      } = itemData;
      
      // Konversi array photos menjadi string yang dipisahkan koma
      const photosString = photos && photos.length > 0 ? photos.join(',') : null;
      
      const [result] = await pool.query(
        `INSERT INTO items (
          user_id, category_id, name, description, price_sell, price_rent, 
          is_available_for_sell, is_available_for_rent, deposit_amount,
          province_id, province_name, city_id, city_name, thumbnail, photos
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          city_name || null,
          thumbnail || null,
          photosString
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
        'status', 'province_id', 'province_name', 'city_id', 'city_name',
        'thumbnail', 'photos'
      ];
      
      const updateFields = [];
      const queryParams = [];
      
      // Handle photos array conversion to comma-separated string
      if (updateData.photos && Array.isArray(updateData.photos)) {
        updateData.photos = updateData.photos.join(',');
      }
      
      for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key)) {
          updateFields.push(`${key} = ?`);
          queryParams.push(value);
        }
      }
      
      if (updateFields.length === 0) {
        return this.findById(id); // Tidak ada yang diupdate
      }
      
      queryParams.push(id);
      
      const [result] = await pool.query(
        `UPDATE items SET ${updateFields.join(', ')} WHERE id = ?`,
        queryParams
      );
      
      if (result.affectedRows === 0) {
        return null;
      }
      
      return this.findById(id);
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
      const [result] = await pool.query(
        'DELETE FROM items WHERE id = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Memperbarui status item
   * @param {number} id - ID item
   * @param {string} status - Status baru ('available', 'rented', 'sold')
   * @returns {Promise<Object|null>} - Data item yang diperbarui atau null jika tidak ditemukan
   */
  static async updateStatus(id, status) {
    try {
      const validStatuses = ['available', 'rented', 'sold'];
      
      if (!validStatuses.includes(status)) {
        throw new Error(`Status tidak valid. Harus salah satu dari: ${validStatuses.join(', ')}`);
      }
      
      const [result] = await pool.query(
        'UPDATE items SET status = ? WHERE id = ?',
        [status, id]
      );
      
      if (result.affectedRows === 0) {
        return null;
      }
      
      return this.findById(id);
    } catch (error) {
      throw error;
    }
  }

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
          c.name as category_name
        FROM items i
        LEFT JOIN users u ON i.user_id = u.id
        LEFT JOIN categories c ON i.category_id = c.id
        WHERE i.id = ?`,
        [id]
      );
      
      if (rows.length === 0) return null;
      
      // Format photos as array if exists
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
  static async findAll(filters = {}, page = 1, limit = 20) {
    try {
      // Parse page dan limit menjadi integer
      const parsedPage = parseInt(page) || 1;
      const parsedLimit = parseInt(limit) || 20;
      
      // Base query untuk SELECT items
      let baseQuery = `
        FROM items i
        LEFT JOIN users u ON i.user_id = u.id
        LEFT JOIN categories c ON i.category_id = c.id
        WHERE 1=1
      `;
      
      const queryParams = [];
      
      // Apply filters
      if (filters.name) {
        baseQuery += ' AND i.name LIKE ?';
        queryParams.push(`%${filters.name}%`);
      }
      
      if (filters.category_id) {
        baseQuery += ' AND i.category_id = ?';
        queryParams.push(filters.category_id);
      }
      
      if (filters.user_id) {
        baseQuery += ' AND i.user_id = ?';
        queryParams.push(filters.user_id);
      }
      
      if (filters.status) {
        baseQuery += ' AND i.status = ?';
        queryParams.push(filters.status);
      }
      
      if (filters.is_available_for_rent !== undefined) {
        baseQuery += ' AND i.is_available_for_rent = ?';
        queryParams.push(filters.is_available_for_rent);
      }
      
      if (filters.is_available_for_sell !== undefined) {
        baseQuery += ' AND i.is_available_for_sell = ?';
        queryParams.push(filters.is_available_for_sell);
      }
      
      // Count total items for pagination
      const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
      const [countResult] = await pool.query(countQuery, queryParams);
      
      // Pastikan total adalah number yang valid
      const total = countResult[0]?.total || 0;
      
      // Calculate pagination
      const totalPages = Math.ceil(total / parsedLimit);
      const offset = (parsedPage - 1) * parsedLimit;
      
      // Query untuk mendapatkan data items
      const itemsQuery = `
        SELECT i.*, 
          u.name as owner_name, 
          c.name as category_name
        ${baseQuery}
        ORDER BY i.created_at DESC 
        LIMIT ? OFFSET ?
      `;
      
      // Execute query with pagination
      const [rows] = await pool.query(itemsQuery, [...queryParams, parsedLimit, offset]);
      
      // Format photos as array for each item
      rows.forEach(item => {
        if (item.photos) {
          item.photos = item.photos.split(',');
        } else {
          item.photos = [];
        }
      });
      
      return {
        items: rows,
        pagination: {
          total: total,
          page: parsedPage,
          limit: parsedLimit,
          totalPages: totalPages
        }
      };
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }
}

module.exports = ItemModel;