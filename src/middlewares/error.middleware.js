/**
 * Middleware untuk menangani error
 */
const errorMiddleware = (err, req, res, next) => {
  // Log error untuk debugging
  console.error(err);

  // Default error status dan pesan
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan pada server';

  // Menangani error khusus
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      status: 'error',
      message: 'Data sudah ada dalam database'
    });
  }

  // Menangani error validasi dari MySQL
  if (err.code === 'ER_BAD_FIELD_ERROR') {
    return res.status(400).json({
      status: 'error',
      message: 'Kesalahan pada field database'
    });
  }

  // Menangani error koneksi database
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      status: 'error',
      message: 'Layanan database tidak tersedia'
    });
  }

  // Menangani error file terlalu besar
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      status: 'error',
      message: 'Ukuran file terlalu besar'
    });
  }

  // Menangani error tipe file tidak didukung
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      status: 'error',
      message: 'Tipe file tidak didukung'
    });
  }

  // Mengirim respons error
  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorMiddleware;