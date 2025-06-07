const { validationResult } = require("express-validator")
const MessageHobbyModel = require("../models/messagehobby.model")
const UserModel = require("../models/user.model") // asumsi sudah ada untuk ambil hobby

exports.sendMessage = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validasi gagal",
        errors: errors.array(),
      })
    }

    const { content } = req.body
    const sender_id = req.user.id

    const [user] = await UserModel.findById(sender_id)
    if (!user || !user.hobby) {
      return res.status(400).json({
        status: "error",
        message: "Pengguna tidak memiliki hobby",
      })
    }

    const newMessage = await MessageHobbyModel.create({
      sender_id,
      hobby: user.hobby,
      content,
    })

    const io = req.app.get("io")
    if (io) {
      io.to(`hobby_${user.hobby}`).emit("newHobbyMessage", newMessage)
    }

    res.status(201).json({
      status: "success",
      data: newMessage,
    })
  } catch (error) {
    next(error)
  }
}

exports.sendMessageSocket = async ({ sender_id, hobby, content }) => {
  console.log("DEBUG: sender_id=", sender_id, "hobby=", hobby, "content=", content)

  if (!sender_id || !hobby || !content) {
    throw new Error("Data pesan hobby tidak lengkap")
  }

  const newMessage = await MessageHobbyModel.create({
    sender_id,
    hobby,
    content,
  })

  return newMessage
}

exports.getMessagesByHobby = async (req, res, next) => {
  try {
    const userId = req.user.id
    const user = await UserModel.findById(userId)
    if (!user || !user.hobby) {
      return res.status(400).json({
        status: "error",
        message: "User tidak memiliki hobby",
      })
    }
    const messages = await MessageHobbyModel.findByHobby(user.hobby)
    res.status(200).json({
      status: "success",
      data: messages,
    })
  } catch (error) {
    next(error)
  }
}

exports.deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const result = await MessageHobbyModel.delete(id, userId)

    if (!result) {
      return res.status(404).json({
        status: "error",
        message: "Pesan tidak ditemukan atau Anda tidak memiliki izin untuk menghapusnya",
      })
    }

    res.status(200).json({
      status: "success",
      message: "Pesan berhasil dihapus",
    })
  } catch (error) {
    next(error)
  }
}
