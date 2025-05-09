# Pinjemin Web App

**Pinjemin** adalah aplikasi berbasis web yang menggabungkan fitur e-commerce dan penyewaan barang. Pengguna dapat menyewakan, meminjam, dan membeli barang hanya dengan satu akun.

## Fitur Utama

- Akun tunggal: pengguna dapat meng-upload barang dan melakukan checkout
- Upload produk untuk disewakan atau dijual
- Checkout gabungan untuk sewa dan beli
- Sistem transaksi berbasis jumpa langsung (COD)
- Riwayat transaksi & notifikasi
- Penilaian dan ulasan pengguna
- Komentar dan chat antar pengguna
- Lokasi dan janjian pengambilan barang
- Sistem pengingat pengembalian dan denda
- Fitur pencarian dan filter

## Struktur Tabel

- `users` - menyimpan data pengguna
- `categories` - kategori barang
- `items` - barang yang diupload
- `item_photos` - foto-foto produk
- `transactions` - transaksi peminjaman atau pembelian (dengan metode pembayaran COD)
- `reviews` - penilaian pengguna terhadap barang
- `messages` - komunikasi antar pengguna
- `notifications` - pengingat dan notifikasi sistem

## Teknologi

- MySQL (struktur database)
- Express.js (RESTful API backend)

## Penggunaan

1. Buat akun pengguna
2. Upload barang yang ingin disewakan/dijual
3. Cari barang untuk disewa atau dibeli
4. Komunikasi antar pengguna
5. Lakukan transaksi dengan sistem jumpa langsung (COD)
6. Lihat status transaksi dan ulasan

## Struktur Folder

pinjemin-api/
│
├── src/
│ ├── config/ # Konfigurasi aplikasi
│ │ └── db.js # Koneksi database
│
│ ├── controllers/ # Logic untuk handle request
│ │ ├── auth.controller.js
│ │ ├── user.controller.js
│ │ ├── item.controller.js
│ │ ├── itemPhoto.controller.js
│ │ ├── transaction.controller.js
│ │ ├── review.controller.js
│ │ ├── message.controller.js
│ │ └── notification.controller.js
│
│ ├── models/ # Abstraksi data & query database
│ │ ├── user.model.js
│ │ ├── item.model.js
│ │ ├── itemPhoto.model.js
│ │ ├── category.model.js
│ │ ├── transaction.model.js
│ │ ├── review.model.js
│ │ ├── message.model.js
│ │ └── notification.model.js
│
│ ├── routes/ # Definisi route per resource
│ │ ├── auth.routes.js
│ │ ├── user.routes.js
│ │ ├── item.routes.js
│ │ ├── itemPhoto.routes.js
│ │ ├── transaction.routes.js
│ │ ├── review.routes.js
│ │ ├── message.routes.js
│ │ └── notification.routes.js
│
│ ├── middlewares/ # Middleware global/spesifik
│ │ ├── auth.middleware.js
│ │ ├── upload.middleware.js # Untuk multer (upload thumbnail & galeri)
│ │ └── error.middleware.js
│
│ ├── services/ # Business logic terpisah dari controller
│ │ ├── item.service.js
│ │ └── transaction.service.js
│
│ ├── utils/ # Helper/helper function & formatter
│ │ ├── generateSlug.js
│ │ └── formatDate.js
│
│ ├── uploads/ # Folder simpanan file upload
│ │ ├── items/
│ │ └── users/
│
│ ├── app.js # Inisialisasi app (middleware, route)
│ └── server.js # Entry point (port listener)
│
├── .env # Variabel environment
├── .gitignore
├── package.json
└── README.md
