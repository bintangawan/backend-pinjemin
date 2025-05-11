// Script untuk mendaftarkan service worker dan mengelola notifikasi

const publicVapidKey = 'BPO-IPD42nX4i4zBiZKfCD1ab_zidEjSry6bs9FRrHjGkWKNkpH6lGB9tyJqIhXnKIXii63Hyka_8P2xu4yg1g0'; // Akan diisi dari respons server

// Fungsi untuk mendaftarkan service worker
async function registerServiceWorker() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      // Daftarkan service worker
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });
      console.log('Service Worker berhasil didaftarkan:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Gagal mendaftarkan Service Worker:', error);
      return null;
    }
  } else {
    console.warn('Push notifications tidak didukung oleh browser ini');
    return null;
  }
}

// Fungsi untuk meminta izin notifikasi
async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Izin notifikasi ditolak');
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error meminta izin notifikasi:', error);
    return false;
  }
}

// Fungsi untuk mendapatkan subscription dan mengirimkannya ke server
async function subscribeUserToPush(registration) {
  try {
    // Dapatkan public key dari server
    const response = await fetch('/api/notifications/vapid-public-key');
    if (!response.ok) {
      throw new Error('Gagal mendapatkan public key');
    }
    
    const data = await response.json();
    const publicKey = data.publicKey || publicVapidKey;
    
    // Konversi public key ke Uint8Array
    const applicationServerKey = urlBase64ToUint8Array(publicKey);
    
    // Dapatkan subscription
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey
    });
    
    console.log('User berhasil subscribe:', subscription);
    
    // Kirim subscription ke server
    await sendSubscriptionToServer(subscription);
    
    return subscription;
  } catch (error) {
    console.error('Gagal subscribe ke push notifications:', error);
    return null;
  }
}

// Fungsi untuk mengirim subscription ke server
async function sendSubscriptionToServer(subscription) {
  try {
    const token = localStorage.getItem('token'); // Ambil token dari localStorage
    
    if (!token) {
      console.warn('Token tidak ditemukan, user harus login terlebih dahulu');
      return false;
    }
    
    const response = await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(subscription)
    });
    
    if (!response.ok) {
      throw new Error('Gagal mengirim subscription ke server');
    }
    
    const data = await response.json();
    console.log('Subscription berhasil disimpan di server:', data);
    return true;
  } catch (error) {
    console.error('Error mengirim subscription ke server:', error);
    return false;
  }
}

// Fungsi untuk mengkonversi base64 ke Uint8Array (diperlukan untuk applicationServerKey)
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

// Fungsi utama untuk inisialisasi notifikasi
async function initializeNotifications() {
  // Cek apakah browser mendukung service worker dan push notifications
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notifications tidak didukung oleh browser ini');
    return;
  }
  
  // Daftarkan service worker
  const registration = await registerServiceWorker();
  if (!registration) return;
  
  // Minta izin notifikasi
  const permissionGranted = await requestNotificationPermission();
  if (!permissionGranted) return;
  
  // Subscribe user ke push notifications
  await subscribeUserToPush(registration);
}

// Panggil fungsi inisialisasi saat halaman dimuat
window.addEventListener('load', () => {
  // Cek apakah user sudah login (ada token)
  const token = localStorage.getItem('token');
  if (token) {
    initializeNotifications();
  } else {
    console.log('User belum login, notifikasi akan diinisialisasi setelah login');
  }
});

// Fungsi untuk dipanggil setelah login berhasil
function initNotificationsAfterLogin() {
  initializeNotifications();
}

// Ekspor fungsi untuk digunakan di file lain
window.PinjeminNotifications = {
  initialize: initializeNotifications,
  initAfterLogin: initNotificationsAfterLogin
};