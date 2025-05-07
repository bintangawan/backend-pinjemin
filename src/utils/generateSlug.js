/**
 * Fungsi untuk menghasilkan slug dari string
 * @param {string} text - Teks yang akan diubah menjadi slug
 * @returns {string} Slug yang dihasilkan
 */
const generateSlug = (text) => {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Ganti spasi dengan tanda hubung
    .replace(/\s+/g, '-')
    // Hapus karakter yang tidak diinginkan
    .replace(/[^\w\-]+/g, '')
    // Hapus tanda hubung berulang
    .replace(/\-\-+/g, '-')
    // Hapus tanda hubung di awal dan akhir
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * Fungsi untuk menghasilkan slug unik dengan menambahkan timestamp
 * @param {string} text - Teks yang akan diubah menjadi slug
 * @returns {string} Slug unik yang dihasilkan
 */
const generateUniqueSlug = (text) => {
  const timestamp = new Date().getTime().toString().slice(-6);
  return `${generateSlug(text)}-${timestamp}`;
};

module.exports = {
  generateSlug,
  generateUniqueSlug
};