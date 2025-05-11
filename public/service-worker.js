// Service Worker untuk Pinjemin App

self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  return self.clients.claim();
});

// Menangani notifikasi push
self.addEventListener('push', (event) => {
  if (!event.data) {
    console.log('Push event tanpa data');
    return;
  }

  try {
    const payload = event.data.json();
    console.log('Push notification received:', payload);

    const options = {
      body: payload.body || 'Notifikasi baru dari Pinjemin',
      icon: payload.icon || '/logo.png',
      badge: payload.badge || '/badge.png',
      data: payload.data || {},
      actions: [
        {
          action: 'view',
          title: 'Lihat'
        }
      ],
      vibrate: [100, 50, 100],
      timestamp: Date.now()
    };

    event.waitUntil(
      self.registration.showNotification(payload.title || 'Pinjemin', options)
    );
  } catch (error) {
    console.error('Error menampilkan notifikasi:', error);
  }
});

// Menangani klik pada notifikasi
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const notificationData = event.notification.data;
  let url = '/';

  // Tentukan URL berdasarkan tipe notifikasi
  if (notificationData) {
    switch (notificationData.type) {
      case 'transaction':
        url = `/transactions/${notificationData.transactionId}`;
        break;
      case 'message':
        url = `/messages?transaction=${notificationData.transactionId}`;
        break;
      case 'rent_due':
        url = `/transactions/${notificationData.transactionId}`;
        break;
      default:
        url = '/';
    }
  }

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Cek apakah ada jendela yang sudah terbuka
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // Jika tidak ada jendela yang terbuka, buka jendela baru
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});