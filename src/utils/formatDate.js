/**
 * Fungsi untuk memformat tanggal ke format yang diinginkan
 * @param {Date} date - Objek Date yang akan diformat
 * @param {string} format - Format yang diinginkan (default: 'DD/MM/YYYY')
 * @returns {string} Tanggal yang sudah diformat
 */
const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '';
  
  const d = new Date(date);
  
  // Pastikan tanggal valid
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  // Ganti placeholder dengan nilai yang sesuai
  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * Fungsi untuk mendapatkan tanggal dalam format ISO
 * @param {Date} date - Objek Date
 * @returns {string} Tanggal dalam format ISO (YYYY-MM-DD)
 */
const toISODate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  
  // Pastikan tanggal valid
  if (isNaN(d.getTime())) return '';
  
  return d.toISOString().split('T')[0];
};

/**
 * Fungsi untuk mendapatkan tanggal dan waktu dalam format ISO
 * @param {Date} date - Objek Date
 * @returns {string} Tanggal dan waktu dalam format ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
 */
const toISODateTime = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  
  // Pastikan tanggal valid
  if (isNaN(d.getTime())) return '';
  
  return d.toISOString();
};

module.exports = {
  formatDate,
  toISODate,
  toISODateTime
};