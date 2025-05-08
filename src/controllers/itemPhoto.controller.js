const { validationResult } = require('express-validator');
const ItemPhotoModel = require('../models/itemPhoto.model');
const ItemModel = require('../models/item.model');
const fs = require('fs');
const path = require('path');

/**
 * Controller untuk mendapatkan semua foto item berdasarkan item_id
 */
exports.getItemPhotos = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    
    // Cek apakah item ada
    const item = await ItemModel.findById(itemId);
    
    if (!item) {
      return res.status(404).json({
        status: 'error',
        message: 'Item tidak ditemukan'
      });
    }
    
    const photos = await ItemPhotoModel.findByItemId(itemId);
    
    res.status(200).json({
      status: 'success',
      data: photos
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk menambahkan foto item
 */
exports.addItemPhoto = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    
    // Cek apakah item ada
    const item = await ItemModel.findById(itemId);
    
    if (!item) {
      return res.status(404).json({
        status: 'error',
        message: 'Item tidak ditemukan'
      });
    }
    
    // Cek apakah pengguna adalah pemilik item
    if (item.user_id !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Anda tidak memiliki izin untuk menambahkan foto ke item ini'
      });
    }
    
    // Jika tidak ada file yang diupload
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Tidak ada file yang diupload'
      });
    }
    
    // Simpan foto ke database
    const photoUrl = `/uploads/items/${req.file.filename}`;
    const newPhoto = await ItemPhotoModel.create(itemId, photoUrl);
    
    res.status(201).json({
      status: 'success',
      data: newPhoto
    });
  } catch (error) {
    // Jika terjadi error, hapus file yang sudah diupload (jika ada)
    if (req.file) {
      fs.unlink(path.join(__dirname, '../../uploads/items', req.file.filename), err => {
        if (err) console.error('Error menghapus file:', err);
      });
    }
    
    next(error);
  }
};

/**
 * Controller untuk menambahkan beberapa foto item sekaligus
 */
exports.addMultipleItemPhotos = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    
    // Cek apakah item ada
    const item = await ItemModel.findById(itemId);
    
    if (!item) {
      return res.status(404).json({
        status: 'error',
        message: 'Item tidak ditemukan'
      });
    }
    
    // Cek apakah pengguna adalah pemilik item
    if (item.user_id !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Anda tidak memiliki izin untuk menambahkan foto ke item ini'
      });
    }
    
    // Jika tidak ada file yang diupload
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Tidak ada file yang diupload'
      });
    }
    
    // Simpan foto-foto ke database
    const photoUrls = req.files.map(file => `/uploads/items/${file.filename}`);
    const newPhotos = await ItemPhotoModel.createMany(itemId, photoUrls);
    
    res.status(201).json({
      status: 'success',
      data: newPhotos
    });
  } catch (error) {
    // Jika terjadi error, hapus file yang sudah diupload (jika ada)
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        fs.unlink(path.join(__dirname, '../../uploads/items', file.filename), err => {
          if (err) console.error('Error menghapus file:', err);
        });
      });
    }
    
    next(error);
  }
};

/**
 * Controller untuk menghapus foto item
 */
exports.deleteItemPhoto = async (req, res, next) => {
  try {
    const { photoId } = req.params;
    
    // Cek apakah foto ada
    const photo = await ItemPhotoModel.findById(photoId);
    
    if (!photo) {
      return res.status(404).json({
        status: 'error',
        message: 'Foto tidak ditemukan'
      });
    }
    
    // Cek apakah pengguna adalah pemilik item
    const item = await ItemModel.findById(photo.item_id);
    
    if (item.user_id !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Anda tidak memiliki izin untuk menghapus foto ini'
      });
    }
    
    // Hapus file dari sistem
    const filePath = path.join(__dirname, '../..', photo.photo_url);
    fs.unlink(filePath, err => {
      if (err) console.error('Error menghapus file:', err);
    });
    
    // Hapus foto dari database
    await ItemPhotoModel.delete(photoId);
    
    res.status(200).json({
      status: 'success',
      message: 'Foto berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};