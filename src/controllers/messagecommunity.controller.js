const { validationResult } = require('express-validator');
const MessageCommunityModel = require('../models/messagecommunity.model');
const UserModel = require('../models/user.model'); // asumsi sudah ada untuk ambil province_id

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

    const { content } = req.body;
    const sender_id = req.user.id;

    const [user] = await UserModel.findById(sender_id);
    if (!user || !user.province_id) {
      return res.status(400).json({ status: 'error', message: 'Pengguna tidak memiliki province_id' });
    }

    const newMessage = await MessageCommunityModel.create({
      sender_id,
      province_id: user.province_id,
      content
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`community_${user.province_id}`).emit('newCommunityMessage', newMessage);
    }

    res.status(201).json({
      status: 'success',
      data: newMessage
    });
  } catch (error) {
    next(error);
  }
};

exports.sendMessageSocket = async ({ sender_id, province_id, content }) => {
  console.log('DEBUG: sender_id=', sender_id, 'province_id=', province_id, 'content=', content);
  
  if (!sender_id || !province_id || !content) {
    throw new Error('Data pesan komunitas tidak lengkap');
  }

  const newMessage = await MessageCommunityModel.create({
    sender_id,
    province_id,
    content
  });

  return newMessage;
};


exports.getMessagesByProvince = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId);
    if (!user || !user.province_id) {
      return res.status(400).json({
        status: 'error',
        message: 'User tidak memiliki province_id'
      });
    }
    const messages = await MessageCommunityModel.findByProvinceId(user.province_id);
    res.status(200).json({
      status: 'success',
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await MessageCommunityModel.delete(id, userId);

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
