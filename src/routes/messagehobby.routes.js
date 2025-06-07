const express = require("express")
const { body } = require("express-validator")
const messageHobbyController = require("../controllers/messagehobby.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const router = express.Router()

const sendMessageValidation = [
  body("content")
    .notEmpty()
    .withMessage("Konten pesan tidak boleh kosong")
    .isLength({ max: 1000 })
    .withMessage("Konten pesan maksimal 1000 karakter"),
]

router.use(authMiddleware.protect)

router.post("/", sendMessageValidation, messageHobbyController.sendMessage)
router.get("/", messageHobbyController.getMessagesByHobby)
router.delete("/:id", messageHobbyController.deleteMessage)

module.exports = router
