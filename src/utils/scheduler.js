const cron = require('node-cron');
const notificationController = require('../controllers/notification.controller');

/**
 * Setup cron jobs untuk sistem notifikasi
 */
function setupNotificationScheduler() {
  console.log('Setting up notification scheduler...');
  
  // ✅ Cron job untuk mengirim reminder setiap hari jam 8 pagi
  // Format: detik menit jam hari bulan hari_dalam_minggu
  cron.schedule('0 0 8 * * *', async () => {
    console.log('Running scheduled reminder notifications at 8:00 AM');
    try {
      const sentCount = await notificationController.checkRentDueNotifications();
      console.log(`Scheduled reminders completed. Sent: ${sentCount} notifications`);
    } catch (error) {
      console.error('Error in scheduled reminder job:', error);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Jakarta" // Sesuaikan dengan timezone Anda
  });

  // ✅ Tambahkan logging untuk debugging
  const now = new Date();
  console.log(`Notification scheduler initialized at ${now.toISOString()}`);
  
  // ✅ Hitung waktu hingga jam 8 pagi berikutnya
  const nextRunTime = new Date();
  if (now.getHours() >= 8) {
    nextRunTime.setDate(nextRunTime.getDate() + 1);
  }
  nextRunTime.setHours(8, 0, 0, 0);
  
  const timeUntilNextRun = nextRunTime.getTime() - now.getTime();
  const hoursUntilNextRun = Math.floor(timeUntilNextRun / (1000 * 60 * 60));
  const minutesUntilNextRun = Math.floor((timeUntilNextRun % (1000 * 60 * 60)) / (1000 * 60));
  
  console.log(`Next scheduled reminder check will run at ${nextRunTime.toISOString()}`);
  console.log(`Time until next run: ${hoursUntilNextRun} hours and ${minutesUntilNextRun} minutes`);
}

module.exports = { setupNotificationScheduler };