const { validationResult } = require("express-validator")
const ItemModel = require("../models/item.model")
const fs = require("fs")
const path = require("path")
const axios = require("axios") // Tambahkan import axios

/**
 * Fungsi untuk mendapatkan ID provinsi berdasarkan nama provinsi
 */
const getProvinceId = async (provinceName) => {
  try {
    const response = await axios.get("https://kanglerian.my.id/api-wilayah-indonesia/api/provinces.json")
    const provinces = response.data

    // Cari provinsi berdasarkan nama (case insensitive)
    const province = provinces.find((p) => p.name.toLowerCase() === provinceName.toLowerCase())

    return province ? province.id : null
  } catch (error) {
    console.error("Error fetching province data:", error)
    return null
  }
}

/**
 * Fungsi untuk mendapatkan ID kota berdasarkan nama kota dan ID provinsi
 */
const getCityId = async (cityName, provinceId) => {
  try {
    if (!provinceId) return null

    const response = await axios.get(`https://kanglerian.my.id/api-wilayah-indonesia/api/regencies/${provinceId}.json`)
    const cities = response.data

    // Cari kota berdasarkan nama (case insensitive)
    const city = cities.find((c) => c.name.toLowerCase() === cityName.toLowerCase())

    return city ? city.id : null
  } catch (error) {
    console.error("Error fetching city data:", error)
    return null
  }
}

/**
 * Controller untuk mendapatkan semua item dengan filter dan pagination
 */
exports.getAllItems = async (req, res, next) => {
  try {
    const {
      name,
      category_id,
      user_id,
      status,
      is_available_for_rent,
      is_available_for_sell,
      page = 1,
      limit = 20,
    } = req.query

    const filters = {
      name,
      category_id,
      user_id,
      status,
      is_available_for_rent: is_available_for_rent === "true" ? 1 : is_available_for_rent === "false" ? 0 : undefined,
      is_available_for_sell: is_available_for_sell === "true" ? 1 : is_available_for_sell === "false" ? 0 : undefined,
    }

    // Hapus filter yang undefined
    Object.keys(filters).forEach((key) => {
      if (filters[key] === undefined) {
        delete filters[key]
      }
    })

    const result = await ItemModel.findAll(filters, page, limit)

    res.status(200).json({
      status: "success",
      data: result.items,
      pagination: result.pagination,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller untuk mendapatkan item berdasarkan ID
 */
exports.getItemById = async (req, res, next) => {
  try {
    const { id } = req.params

    const item = await ItemModel.findById(id)

    if (!item) {
      return res.status(404).json({
        status: "error",
        message: "Item tidak ditemukan",
      })
    }

    res.status(200).json({
      status: "success",
      data: item,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller untuk membuat item baru
 */
exports.createItem = async (req, res, next) => {
  try {
    // Validasi input
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validasi gagal",
        errors: errors.array(),
      })
    }

    const {
      category_id,
      name,
      description,
      price_sell,
      price_rent,
      is_available_for_sell,
      is_available_for_rent,
      deposit_amount,
      province_name,
      city_name,
      latitude,
      longitude,
    } = req.body

    // Pastikan pengguna telah login
    const userId = req.user.id

    // Ambil province_id dan city_id dari API
    let province_id = null
    let city_id = null

    if (province_name) {
      province_id = await getProvinceId(province_name)

      if (city_name && province_id) {
        city_id = await getCityId(city_name, province_id)
      }
    }

    // Siapkan thumbnail dan photos
    let thumbnail = null
    let photoUrls = []

    if (req.files && req.files.length > 0) {
      // Gunakan file pertama sebagai thumbnail
      thumbnail = `/uploads/items/${req.files[0].filename}`

      // Gunakan semua file sebagai photos
      photoUrls = req.files.map((file) => `/uploads/items/${file.filename}`)
    }

    // Validasi koordinat
    let validLatitude = null
    let validLongitude = null

    if (latitude && longitude) {
      const lat = Number.parseFloat(latitude)
      const lng = Number.parseFloat(longitude)

      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        validLatitude = lat
        validLongitude = lng
      }
    }

    // Buat item baru
    const itemData = {
      user_id: userId,
      category_id,
      name,
      description,
      price_sell,
      price_rent,
      is_available_for_sell: is_available_for_sell === "true" || is_available_for_sell === true ? 1 : 0,
      is_available_for_rent: is_available_for_rent === "true" || is_available_for_rent === true ? 1 : 0,
      deposit_amount,
      province_id,
      province_name,
      city_id,
      city_name,
      latitude: validLatitude,
      longitude: validLongitude,
      thumbnail,
      photos: photoUrls,
    }

    const newItem = await ItemModel.create(itemData)
    res.status(201).json({
      status: "success",
      data: newItem,
    })
  } catch (error) {
    // Jika terjadi error, hapus file yang sudah diupload (jika ada)
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        fs.unlink(path.join(__dirname, "../../uploads/items", file.filename), (err) => {
          if (err) console.error("Error menghapus file:", err)
        })
      })
    }

    next(error)
  }
}

/**
 * Controller untuk memperbarui item
 */
exports.updateItem = async (req, res, next) => {
  try {
    // Validasi input
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validasi gagal",
        errors: errors.array(),
      })
    }

    const { id } = req.params

    // Cek apakah item ada
    const existingItem = await ItemModel.findById(id)

    if (!existingItem) {
      return res.status(404).json({
        status: "error",
        message: "Item tidak ditemukan",
      })
    }

    // Cek apakah pengguna adalah pemilik item
    if (existingItem.user_id !== req.user.id) {
      // Hapus file yang sudah diupload jika ada
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          fs.unlink(path.join(__dirname, "../../uploads/items", file.filename), (err) => {
            if (err) console.error("Error menghapus file:", err)
          })
        })
      }

      return res.status(403).json({
        status: "error",
        message: "Anda tidak memiliki izin untuk memperbarui item ini",
      })
    }

    const {
      category_id,
      name,
      description,
      price_sell,
      price_rent,
      is_available_for_sell,
      is_available_for_rent,
      deposit_amount,
      status,
      province_name,
      city_name,
      latitude,
      longitude,
    } = req.body

    // Ambil province_id dan city_id dari API jika province_name atau city_name diubah
    let province_id = undefined
    let city_id = undefined

    if (province_name !== undefined) {
      province_id = await getProvinceId(province_name)

      // Jika province berubah, kota juga harus diupdate
      if (city_name !== undefined && province_id) {
        city_id = await getCityId(city_name, province_id)
      } else if (province_id) {
        // Jika hanya province yang berubah, reset city
        city_id = null
      }
    } else if (city_name !== undefined && existingItem.province_id) {
      // Jika hanya city yang berubah, gunakan province_id yang ada
      city_id = await getCityId(city_name, existingItem.province_id)
    }

    // Persiapkan data yang akan diupdate
    const updateData = {}

    if (category_id !== undefined) updateData.category_id = category_id
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (price_sell !== undefined) updateData.price_sell = price_sell
    if (price_rent !== undefined) updateData.price_rent = price_rent
    if (is_available_for_sell !== undefined) {
      updateData.is_available_for_sell = is_available_for_sell === "true" || is_available_for_sell === true ? 1 : 0
    }
    if (is_available_for_rent !== undefined) {
      updateData.is_available_for_rent = is_available_for_rent === "true" || is_available_for_rent === true ? 1 : 0
    }
    if (deposit_amount !== undefined) updateData.deposit_amount = deposit_amount
    if (status !== undefined) updateData.status = status
    if (province_name !== undefined) updateData.province_name = province_name
    if (province_id !== undefined) updateData.province_id = province_id
    if (city_name !== undefined) updateData.city_name = city_name
    if (city_id !== undefined) updateData.city_id = city_id

    // Handle koordinat
    if (latitude !== undefined && longitude !== undefined) {
      const lat = Number.parseFloat(latitude)
      const lng = Number.parseFloat(longitude)

      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        updateData.latitude = lat
        updateData.longitude = lng
      } else {
        updateData.latitude = null
        updateData.longitude = null
      }
    }

    // Jika ada file yang diupload, perbarui foto
    if (req.files && req.files.length > 0) {
      const photoUrls = req.files.map((file) => `/uploads/items/${file.filename}`)

      // Hapus foto lama dari sistem file
      if (existingItem.photos && existingItem.photos.length > 0) {
        for (const photoUrl of existingItem.photos) {
          const filePath = path.join(__dirname, "../..", photoUrl)
          fs.unlink(filePath, (err) => {
            if (err && err.code !== "ENOENT") {
              console.error("Error menghapus file:", err)
            }
          })
        }
      }

      // Perbarui thumbnail jika belum ada atau jika ingin menggantinya
      updateData.thumbnail = photoUrls[0]

      // Perbarui photos
      updateData.photos = photoUrls
    }

    // Update item
    const updatedItem = await ItemModel.update(id, updateData)

    res.status(200).json({
      status: "success",
      data: updatedItem,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller untuk menghapus item
 */
exports.deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params

    // Cek apakah item ada
    const existingItem = await ItemModel.findById(id)

    if (!existingItem) {
      return res.status(404).json({
        status: "error",
        message: "Item tidak ditemukan",
      })
    }

    // Cek apakah pengguna adalah pemilik item
    if (existingItem.user_id !== req.user.id) {
      return res.status(403).json({
        status: "error",
        message: "Anda tidak memiliki izin untuk menghapus item ini",
      })
    }

    // Hapus file foto dari sistem file
    if (existingItem.thumbnail) {
      const thumbnailPath = path.join(__dirname, "../..", existingItem.thumbnail)
      fs.unlink(thumbnailPath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Error menghapus thumbnail:", err)
        }
      })
    }

    if (existingItem.photos && existingItem.photos.length > 0) {
      for (const photoUrl of existingItem.photos) {
        const filePath = path.join(__dirname, "../..", photoUrl)
        fs.unlink(filePath, (err) => {
          if (err && err.code !== "ENOENT") {
            console.error("Error menghapus file foto:", err)
          }
        })
      }
    }

    // Hapus item dari database
    await ItemModel.delete(id)

    res.status(200).json({
      status: "success",
      message: "Item berhasil dihapus",
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller untuk mendapatkan item milik pengguna yang sedang login
 */
exports.getMyItems = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { page = 1, limit = 20 } = req.query

    const result = await ItemModel.findAll({ user_id: userId }, page, limit)

    res.status(200).json({
      status: "success",
      data: result.items,
      pagination: result.pagination,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller untuk mendapatkan item berdasarkan lokasi
 */
exports.getItemsByLocation = async (req, res, next) => {
  try {
    const { latitude, longitude, radius = 50 } = req.query

    if (!latitude || !longitude) {
      return res.status(400).json({
        status: "error",
        message: "Latitude dan longitude harus disediakan",
      })
    }

    const lat = Number.parseFloat(latitude)
    const lng = Number.parseFloat(longitude)
    const radiusKm = Number.parseFloat(radius)

    if (isNaN(lat) || isNaN(lng) || isNaN(radiusKm)) {
      return res.status(400).json({
        status: "error",
        message: "Latitude, longitude, dan radius harus berupa angka yang valid",
      })
    }

    const filters = {
      status: "available", // Hanya tampilkan item yang tersedia
    }

    const items = await ItemModel.findByLocation(lat, lng, radiusKm, filters)

    res.status(200).json({
      status: "success",
      data: items,
    })
  } catch (error) {
    next(error)
  }
}
