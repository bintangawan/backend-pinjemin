const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Pastikan direktori uploads ada
const createUploadDirs = () => {
  const uploadDir = path.join(__dirname, '../../uploads');
  const itemsDir = path.join(uploadDir, 'items');
  const usersDir = path.join(uploadDir, 'users');
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  
  if (!fs.existsSync(itemsDir)) {
    fs.mkdirSync(itemsDir);
  }
  
  if (!fs.existsSync(usersDir)) {
    fs.mkdirSync(usersDir);
  }
};

// Buat direktori uploads jika belum ada
createUploadDirs();

// Konfigurasi penyimpanan untuk upload item
const itemStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/items'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'item-' + uniqueSuffix + ext);
  }
});

// Konfigurasi penyimpanan untuk upload user
const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/users'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'user-' + uniqueSuffix + ext);
  }
});

// Filter file untuk gambar
const fileFilter = (req, file, cb) => {
  // Hanya menerima file gambar
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};

// Middleware untuk upload foto item (photos saja, bisa multiple)
const upload = multer({
  storage: itemStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Middleware untuk memproses upload setelah autentikasi
exports.uploadItemPhotos = (req, res, next) => {
  // Multer akan menyimpan file setelah middleware ini dipanggil
  upload.array('photos', 5)(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            status: 'error',
            message: 'Ukuran file terlalu besar. Maksimal 5MB untuk foto item.'
          });
        }
        
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            status: 'error',
            message: 'Jumlah file melebihi batas. Maksimal 5 foto item.'
          });
        }
        
        return res.status(400).json({
          status: 'error',
          message: `Error upload: ${err.message}`
        });
      }
      
      return next(err);
    }
    
    next();
  });
};

// Middleware untuk upload foto profil user
exports.uploadUserPhoto = multer({
  storage: userStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
}).single('photo');

// Middleware untuk menangani error multer
exports.handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'Ukuran file terlalu besar. Maksimal 5MB untuk foto item dan 2MB untuk foto profil.'
      });
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        status: 'error',
        message: 'Jumlah file melebihi batas. Maksimal 5 foto item.'
      });
    }
    
    return res.status(400).json({
      status: 'error',
      message: `Error upload: ${err.message}`
    });
  }
  
  next(err);
};