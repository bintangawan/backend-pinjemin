const express = require('express');
const { body } = require('express-validator');
const messageCommunityController = require('../controllers/messagecommunity.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

const sendMessageValidation = [
  body('content')
    .notEmpty().withMessage('Konten pesan tidak boleh kosong')
    .isLength({ max: 1000 }).withMessage('Konten pesan maksimal 1000 karakter')
];

router.use(authMiddleware.protect);

router.post('/', sendMessageValidation, messageCommunityController.sendMessage);
router.get('/', messageCommunityController.getMessagesByProvince);
router.delete('/:id', messageCommunityController.deleteMessage);

module.exports = router;
