/**
 * Middleware untuk menangani error global
 */
const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error untuk development
  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR 💥', err);
  }

  // Menangani error validasi dari express-validator
  if (err.array && typeof err.array === 'function') {
    const validationErrors = err.array();
    return res.status(400).json({
      status: 'error',
      message: 'Validasi gagal',
      errors: validationErrors
    });
  }

  // Menangani error duplikat MySQL (kode error 1062)
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      status: 'error',
      message: 'Data sudah ada dalam database'
    });
  }

  // Menangani error foreign key MySQL (kode error 1451 atau 1452)
  if (err.code === 'ER_ROW_IS_REFERENCED' || err.code === 'ER_NO_REFERENCED_ROW') {
    return res.status(409).json({
      status: 'error',
      message: 'Operasi tidak dapat dilakukan karena terkait dengan data lain'
    });
  }

  // Menangani error umum
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message || 'Terjadi kesalahan pada server'
  });
};

module.exports = errorMiddleware;