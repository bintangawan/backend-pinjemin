# Dokumentasi API Pinjemin

## Deskripsi

**Pinjemin** adalah aplikasi berbasis web yang menggabungkan fitur e-commerce dan penyewaan barang. Pengguna dapat menyewakan, meminjam, dan membeli barang hanya dengan satu akun.

## Basis URL

```
http://localhost:5000/api
```

## Autentikasi

API ini menggunakan autentikasi berbasis JWT (JSON Web Token). Token harus disertakan di header permintaan untuk endpoint yang memerlukan autentikasi.

```
Authorization: Bearer <token>
```

## Endpoint

## Autentikasi

#### Registrasi Pengguna

- **URL**: `/auth/register`
- **Metode**: `POST`
- **Autentikasi**: Tidak
- **Deskripsi**: Mendaftarkan pengguna baru
- **Body**:
  ```json
  {
    "name": "Nama Pengguna",
    "email": "email@example.com",
    "password": "password123",
    "province_name": "Jawa Barat",
    "city_name": "Bandung"
  }
  ```
- **Respons Sukses**:
  ```json
  {
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "data": {
      "user": {
        "id": 1,
        "name": "Nama Pengguna",
        "email": "email@example.com",
        "photo": null,
        "province_id": 1,
        "province_name": "Jawa Barat",
        "city_id": 101,
        "city_name": "Bandung",
        "created_at": "2023-05-01T12:00:00.000Z"
      }
    }
  }
  ```

#### Login Pengguna

- **URL**: `/auth/login`
- **Metode**: `POST`
- **Autentikasi**: Tidak
- **Deskripsi**: Login pengguna yang sudah terdaftar
- **Body**:
  ```json
  {
    "email": "email@example.com",
    "password": "password123"
  }
  ```
- **Respons Sukses**:
  ```json
  {
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "data": {
      "user": {
        "id": 1,
        "name": "Nama Pengguna",
        "email": "email@example.com",
        "photo": null,
        "province_id": 1,
        "province_name": "Jawa Barat",
        "city_id": 101,
        "city_name": "Bandung",
        "created_at": "2023-05-01T12:00:00.000Z"
      }
    }
  }
  ```

#### Mendapatkan Data Pengguna yang Login

- **URL**: `/auth/me`
- **Metode**: `GET`
- **Autentikasi**: Ya
- **Deskripsi**: Mendapatkan data pengguna yang sedang login
- **Respons Sukses**:
  ```json
  {
    "status": "success",
    "data": {
      "user": {
        "id": 1,
        "name": "Nama Pengguna",
        "email": "email@example.com",
        "photo": null,
        "province_id": 1,
        "province_name": "Jawa Barat",
        "city_id": 101,
        "city_name": "Bandung",
        "created_at": "2023-05-01T12:00:00.000Z"
      }
    }
  }
  ```

### Pengguna

#### Mendapatkan Profil Pengguna

- **URL**: `/users/:id`
- **Metode**: `GET`
- **Autentikasi**: Ya
- **Deskripsi**: Mendapatkan profil pengguna berdasarkan ID
- **Parameter URL**: `id` - ID pengguna
- **Respons Sukses**:
  ```json
  {
    "status": "success",
    "data": {
      "user": {
        "id": 1,
        "name": "Nama Pengguna",
        "email": "email@example.com",
        "photo": null,
        "province_id": 1,
        "province_name": "Jawa Barat",
        "city_id": 101,
        "city_name": "Bandung",
        "created_at": "2023-05-01T12:00:00.000Z"
      }
    }
  }
  ```

#### Memperbarui Profil Pengguna

- **URL**: `/users/update-profile`
- **Metode**: `PATCH`
- **Autentikasi**: Ya
- **Deskripsi**: Memperbarui profil pengguna yang sedang login
- **Body**:
  ```json
  {
    "name": "Nama Baru",
    "province_id": 2,
    "province_name": "DKI Jakarta",
    "city_id": 201,
    "city_name": "Jakarta Selatan"
  }
  ```
- **Respons Sukses**:
  ```json
  {
    "status": "success",
    "data": {
      "user": {
        "id": 1,
        "name": "Nama Baru",
        "email": "email@example.com",
        "photo": null,
        "province_id": 2,
        "province_name": "DKI Jakarta",
        "city_id": 201,
        "city_name": "Jakarta Selatan",
        "created_at": "2023-05-01T12:00:00.000Z"
      }
    }
  }
  ```

#### Mengubah Password

- **URL**: `/users/update-password`
- **Metode**: `PATCH`
- **Autentikasi**: Ya
- **Deskripsi**: Mengubah password pengguna yang sedang login
- **Body**:
  ```json
  {
    "currentPassword": "password123",
    "newPassword": "newPassword123"
  }
  ```
- **Respons Sukses**:
  ```json
  {
    "status": "success",
    "message": "Password berhasil diperbarui"
  }
  ```

## Item

#### Membuat Item Baru

- **URL**: `/items`
- **Metode**: `POST`
- **Autentikasi**: Ya
- **Deskripsi**: Membuat item baru
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `name` - Nama item (wajib)
  - `category_id` - ID kategori (opsional)
  - `description` - Deskripsi item (opsional)
  - `price_sell` - Harga jual (opsional)
  - `price_rent` - Harga sewa (opsional)
  - `is_available_for_sell` - Ketersediaan untuk dijual (boolean, opsional) (values, true/false)
  - `is_available_for_rent` - Ketersediaan untuk disewa (boolean, opsional) (values, true/false)
  - `deposit_amount` - Jumlah deposit (opsional)
  - `province_name` - Nama provinsi (opsional)
  - `city_name` - Nama kota (opsional)
  - `photos` - File foto item (multiple, opsional)
- **Respons Sukses**:
  ```json
  {
    "status": "success",
    "data": {
      "id": 1,
      "user_id": 1,
      "category_id": 2,
      "name": "Laptop Gaming",
      "description": "Laptop gaming dengan spesifikasi tinggi",
      "price_sell": 15000000.0,
      "price_rent": 150000.0,
      "is_available_for_sell": 1,
      "is_available_for_rent": 1,
      "deposit_amount": 5000000.0,
      "status": "available",
      "province_id": 1,
      "province_name": "Jawa Barat",
      "city_id": 101,
      "city_name": "Bandung",
      "created_at": "2023-05-01T12:00:00.000Z",
      "owner_name": "Nama Pengguna",
      "owner_email": "email@example.com",
      "category_name": "Elektronik",
      "photos": ["/uploads/items/laptop1.jpg", "/uploads/items/laptop2.jpg"]
    }
  }
  ```

#### Memperbarui Item

- **URL**: `/items/:id`
- **Metode**: `PATCH`
- **Autentikasi**: Ya
- **Deskripsi**: Memperbarui item yang dimiliki pengguna
- **Parameter URL**: `id` - ID item
- **Body**:
  ```json
  {
    "name": "Laptop Gaming Pro",
    "description": "Laptop gaming dengan spesifikasi tinggi dan tambahan fitur",
    "price_sell": 16000000.0,
    "price_rent": 160000.0,
    "is_available_for_sell": true,
    "is_available_for_rent": true,
    "deposit_amount": 5500000.0,
    "status": "available"
  }
  ```
- **Respons Sukses**:
  ```json
  {
    "status": "success",
    "data": {
      "id": 1,
      "user_id": 1,
      "category_id": 2,
      "name": "Laptop Gaming Pro",
      "description": "Laptop gaming dengan spesifikasi tinggi dan tambahan fitur",
      "price_sell": 16000000.0,
      "price_rent": 160000.0,
      "is_available_for_sell": 1,
      "is_available_for_rent": 1,
      "deposit_amount": 5500000.0,
      "status": "available",
      "province_id": 1,
      "province_name": "Jawa Barat",
      "city_id": 101,
      "city_name": "Bandung",
      "created_at": "2023-05-01T12:00:00.000Z",
      "owner_name": "Nama Pengguna",
      "owner_email": "email@example.com",
      "category_name": "Elektronik",
      "photos": ["/uploads/items/laptop1.jpg", "/uploads/items/laptop2.jpg"]
    }
  }
  ```

#### Menghapus Item

- **URL**: `/items/:id`
- **Metode**: `DELETE`
- **Autentikasi**: Ya
- **Deskripsi**: Menghapus item yang dimiliki pengguna
- **Parameter URL**: `id` - ID item
- **Respons Sukses**:
  ```json
  {
    "status": "success",
    "message": "Item berhasil dihapus"
  }
  ```

#### Mendapatkan Semua Item

- **URL**: `/items`
- **Metode**: `GET`
- **Autentikasi**: Tidak
- **Deskripsi**: Mendapatkan semua item dengan filter dan pagination
- **Parameter Query**:
  - `name` - Filter berdasarkan nama item
  - `category_id` - Filter berdasarkan kategori
  - `user_id` - Filter berdasarkan pemilik
  - `status` - Filter berdasarkan status (available, rented, sold)
  - `is_available_for_rent` - Filter berdasarkan ketersediaan untuk disewa (true/false)
  - `is_available_for_sell` - Filter berdasarkan ketersediaan untuk dijual (true/false)
  - `page` - Nomor halaman (default: 1)
  - `limit` - Jumlah item per halaman (default: 10)
- **Respons Sukses**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "user_id": 1,
        "category_id": 2,
        "name": "Laptop Gaming",
        "description": "Laptop gaming dengan spesifikasi tinggi",
        "price_sell": 15000000.0,
        "price_rent": 150000.0,
        "is_available_for_sell": 1,
        "is_available_for_rent": 1,
        "deposit_amount": 5000000.0,
        "status": "available",
        "province_id": 1,
        "province_name": "Jawa Barat",
        "city_id": 101,
        "city_name": "Bandung",
        "created_at": "2023-05-01T12:00:00.000Z",
        "owner_name": "Nama Pengguna",
        "category_name": "Elektronik",
        "thumbnail": "/uploads/items/laptop1.jpg"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
  ```

#### Mendapatkan Item Berdasarkan ID

- **URL**: `/items/:id`
- **Metode**: `GET`
- **Autentikasi**: Tidak
- **Deskripsi**: Mendapatkan detail item berdasarkan ID
- **Parameter URL**: `id` - ID item
- **Respons Sukses**:
  ```json
  {
    "status": "success",
    "data": {
      "id": 1,
      "user_id": 1,
      "category_id": 2,
      "name": "Laptop Gaming",
      "description": "Laptop gaming dengan spesifikasi tinggi",
      "price_sell": 15000000.0,
      "price_rent": 150000.0,
      "is_available_for_sell": 1,
      "is_available_for_rent": 1,
      "deposit_amount": 5000000.0,
      "status": "available",
      "province_id": 1,
      "province_name": "Jawa Barat",
      "city_id": 101,
      "city_name": "Bandung",
      "created_at": "2023-05-01T12:00:00.000Z",
      "owner_name": "Nama Pengguna",
      "owner_email": "email@example.com",
      "category_name": "Elektronik",
      "photos": ["/uploads/items/laptop1.jpg", "/uploads/items/laptop2.jpg"]
    }
  }
  ```

### Foto Item

#### Menambahkan Foto Item

- **URL**: `/item-photos/item/:itemId`
- **Metode**: `POST`
- **Autentikasi**: Ya
- **Deskripsi**: Menambahkan foto untuk item tertentu
- **Parameter URL**: `itemId` - ID item
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `photo` - File foto (wajib)
- **Respons Sukses**:
  ```json
  {
    "status": "success",
    "data": {
      "id": 3,
      "item_id": 1,
      "photo_url": "/uploads/items/laptop3.jpg"
    }
  }
  ```

#### Menambahkan Beberapa Foto Item

- **URL**: `/item-photos/item/:itemId/multiple`
- **Metode**: `POST`
- **Autentikasi**: Ya
- **Deskripsi**: Menambahkan beberapa foto sekaligus untuk item tertentu
- **Parameter URL**: `itemId` - ID item
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `photos` - File foto (multiple, wajib)
- **Respons Sukses**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 4,
        "item_id": 1,
        "photo_url": "/uploads/items/laptop4.jpg"
      },
      {
        "id": 5,
        "item_id": 1,
        "photo_url": "/uploads/items/laptop5.jpg"
      }
    ]
  }
  ```

#### Menghapus Foto Item

- **URL**: `/item-photos/:photoId`
- **Metode**: `DELETE`
- **Autentikasi**: Ya
- **Deskripsi**: Menghapus foto item
- **Parameter URL**: `photoId` - ID foto
- **Respons Sukses**:
  ```json
  {
    "status": "success",
    "message": "Foto berhasil dihapus"
  }
  ```

#### Mendapatkan Foto Item

- **URL**: `/item-photos/item/:itemId`
- **Metode**: `GET`
- **Autentikasi**: Tidak
- **Deskripsi**: Mendapatkan semua foto untuk item tertentu
- **Parameter URL**: `itemId` - ID item
- **Respons Sukses**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "item_id": 1,
        "photo_url": "/uploads/items/laptop1.jpg"
      },
      {
        "id": 2,
        "item_id": 1,
        "photo_url": "/uploads/items/laptop2.jpg"
      }
    ]
  }
  ```

## Transaksi

### Membuat Transaksi Baru

- **URL**: `/transactions`
- **Metode**: `POST`
- **Autentikasi**: Ya
- **Deskripsi**: Membuat transaksi baru (pembelian atau penyewaan)
- **Body**:
  ```json
  {
    "item_id": 1,
    "type": "rent",
    "rent_start_date": "2023-06-01",
    "rent_end_date": "2023-06-04",
    "deposit_paid": 5000000.0
  }
  ```
  atau
  ```json
  {
    "item_id": 1,
    "type": "buy"
  }
  ```
- **Respons Sukses**:
  ```json
  {
    "status": "success",
    "data": {
      "id": 1,
      "buyer_id": 2,
      "item_id": 1,
      "type": "rent",
      "status": "pending",
      "payment_method": "cod",
      "total_price": 450000.0,
      "rent_start_date": "2023-06-01T00:00:00.000Z",
      "rent_end_date": "2023-06-04T00:00:00.000Z",
      "deposit_paid": 5000000.0,
      "created_at": "2023-05-15T12:00:00.000Z"
    }
  }
  ```

### Mendapatkan Semua Transaksi Pengguna (Sebagai Pembeli)

- **URL**: `/transactions`
- **Metode**: `GET`
- **Autentikasi**: Ya
- **Deskripsi**: Mendapatkan semua transaksi yang dilakukan oleh pengguna yang sedang login sebagai pembeli
- **Parameter Query**:
  - `type` - Filter berdasarkan tipe transaksi (rent/buy, opsional)
  - `status` - Filter berdasarkan status transaksi (pending/ongoing/returned/late/cancelled/completed, opsional)
  - `page` - Nomor halaman (default: 1)
  - `limit` - Jumlah transaksi per halaman (default: 10)
- **Respons Sukses**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "buyer_id": 2,
        "item_id": 1,
        "type": "rent",
        "status": "pending",
        "payment_method": "cod",
        "total_price": 450000.0,
        "rent_start_date": "2023-06-01T00:00:00.000Z",
        "rent_end_date": "2023-06-04T00:00:00.000Z",
        "deposit_paid": 5000000.0,
        "created_at": "2023-05-15T12:00:00.000Z",
        "item_name": "Laptop Gaming",
        "item_thumbnail": "/uploads/items/laptop1.jpg",
        "seller_name": "Nama Pemilik"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
  ```

### Mendapatkan Transaksi Sebagai Pemilik Item (Sebagai Penjual)

- **URL**: `/transactions/seller`
- **Metode**: `GET`
- **Autentikasi**: Ya
- **Deskripsi**: Mendapatkan semua transaksi yang diterima oleh pengguna sebagai pemilik item
- **Parameter Query**:
  - `type` - Filter berdasarkan tipe transaksi (rent/buy, opsional)
  - `status` - Filter berdasarkan status transaksi (pending/ongoing/returned/late/cancelled/completed, opsional)
  - `page` - Nomor halaman (default: 1)
  - `limit` - Jumlah transaksi per halaman (default: 10)
- **Respons Sukses**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "buyer_id": 2,
        "item_id": 1,
        "type": "rent",
        "status": "pending",
        "payment_method": "cod",
        "total_price": 450000.0,
        "rent_start_date": "2023-06-01T00:00:00.000Z",
        "rent_end_date": "2023-06-04T00:00:00.000Z",
        "deposit_paid": 5000000.0,
        "created_at": "2023-05-15T12:00:00.000Z",
        "item_name": "Laptop Gaming",
        "item_thumbnail": "/uploads/items/laptop1.jpg",
        "buyer_name": "Nama Pembeli"
      }
    ],
    "pagination": {
      "total": 3,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
  ```

### Mendapatkan Detail Transaksi

- **URL**: `/transactions/:id`
- **Metode**: `GET`
- **Autentikasi**: Ya
- **Deskripsi**: Mendapatkan detail transaksi berdasarkan ID
- **Parameter URL**: `id` - ID transaksi
- **Respons Sukses**:
  ```json
  {
    "status": "success",
    "data": {
      "id": 1,
      "buyer_id": 2,
      "item_id": 3,
      "type": "rent",
      "status": "ongoing",
      "payment_method": "cod",
      "total_price": "90000.00",
      "rent_start_date": "2025-05-31T17:00:00.000Z",
      "rent_end_date": "2025-06-03T17:00:00.000Z",
      "deposit_paid": "15000.00",
      "created_at": "2025-05-09T14:42:32.000Z",
      "buyer_name": "Yuda",
      "buyer_email": "yuda@example.com",
      "item_name": "Sepeda Gunung Lipat",
      "seller_id": 1,
      "seller_name": "Imma",
      "seller_email": "imma@example.com",
      "item_photo": "/uploads/items/item-1746725260240-634856281.svg"
    }
  }
  ```

### Memperbarui Status Transaksi

- **URL**: `/transactions/:id/status`
- **Metode**: `PATCH`
- **Autentikasi**: Ya
- **Deskripsi**: Memperbarui status transaksi (hanya dapat dilakukan oleh pemilik item atau pembeli)
- **Parameter URL**: `id` - ID transaksi
- **Body**:
  ```json
  {
    "status": "completed"
  }
  ```
  Status yang tersedia:
  - `pending` - Menunggu konfirmasi
  - `ongoing` - Sedang berlangsung
  - `returned` - Dikembalikan
  - `late` - Terlambat
  - `cancelled` - Dibatalkan
  - `completed` - Selesai
- **Respons Sukses**:
  ```json
  {
    "status": "success",
    "data": {
      "id": 1,
      "buyer_id": 2,
      "item_id": 3,
      "type": "rent",
      "status": "ongoing",
      "payment_method": "cod",
      "total_price": "90000.00",
      "rent_start_date": "2025-05-31T17:00:00.000Z",
      "rent_end_date": "2025-06-03T17:00:00.000Z",
      "deposit_paid": "15000.00",
      "created_at": "2025-05-09T14:42:32.000Z",
      "buyer_name": "Yuda",
      "buyer_email": "yuda@example.com",
      "item_name": "Sepeda Gunung Lipat",
      "seller_id": 1,
      "seller_name": "Imma",
      "seller_email": "imma@example.com",
      "item_photo": "/uploads/items/item-1746725260240-634856281.svg"
    }
  }
  ```

## Message

### Mengirim Pesan Baru

- **URL**: `/messages`
- **Metode**: `POST`
- **Autentikasi**: Ya
- **Deskripsi**: Mengirim pesan baru untuk transaksi tertentu
- **Body**:
  ```json
  {
    "transaction_id": 1,
    "content": "Halo, apakah barang masih tersedia?"
  }
  ```
- **Respons Sukses**:
  ```json
  {
    "status": "success",
    "data": {
      "id": 3,
      "sender_id": 2,
      "transaction_id": 5,
      "content": "Halo, apakah barang masih tersedia?",
      "created_at": "2023-06-15T09:00:00.000Z",
      "sender_name": "John Doe",
      "sender_email": "john@example.com"
    }
  }
  ```

### Mendapatkan Pesan Berdasarkan ID Transaksi

- **URL**: `/messages/transaction/:transactionId`
- **Metode**: `GET`
- **Autentikasi**: Ya
- **Deskripsi**: Mendapatkan semua pesan untuk transaksi tertentu
- **Parameter URL**: `transactionId` - ID transaksi
- **Parameter Query**:
  - `page` - Nomor halaman (default: 1)
  - `limit` - Jumlah pesan per halaman (default: 50)
- **Respons Sukses**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "sender_id": 2,
        "receiver_id": 1,
        "item_id": null,
        "transaction_id": 1,
        "content": "Halo, apakah barang masih tersedia?",
        "created_at": "2025-05-09T16:39:12.000Z",
        "sender_name": "Yuda",
        "sender_email": "yuda@example.com"
      },
      {
        "id": 2,
        "sender_id": 1,
        "receiver_id": 2,
        "item_id": null,
        "transaction_id": 1,
        "content": "Ya, barangnya masih tersedia. Datang langsung ajaya bang",
        "created_at": "2025-05-09T16:41:11.000Z",
        "sender_name": "Imma",
        "sender_email": "imma@example.com"
      }
    ],
    "pagination": {
      "total": 2,
      "page": 1,
      "limit": 50,
      "totalPages": 1
    }
  }
  ```

### Respons Error

#### Transaksi Tidak Ditemukan (404 Not Found)

```json
{
  "status": "error",
  "message": "Transaksi tidak ditemukan"
}
```

#### Tidak Memiliki Akses (403 Forbidden)

```json
{
  "status": "error",
  "message": "Anda tidak memiliki akses ke pesan transaksi ini"
}
```

### Respons Error

#### Validasi Gagal (400 Bad Request)

```json
{
  "status": "error",
  "message": "Validasi gagal",
  "errors": [
    {
      "msg": "ID transaksi tidak boleh kosong",
      "param": "transaction_id",
      "location": "body"
    }
  ]
}
```

#### Transaksi Tidak Ditemukan (404 Not Found)

```json
{
  "status": "error",
  "message": "Transaksi tidak ditemukan"
}
```

#### Tidak Memiliki Akses (403 Forbidden)

```json
{
  "status": "error",
  "message": "Anda tidak memiliki akses untuk mengirim pesan pada transaksi ini"
}
```

### Menghapus Pesan

- **URL**: `/messages/:id`
- **Metode**: `DELETE`
- **Autentikasi**: Ya
- **Deskripsi**: Menghapus pesan yang dikirim oleh pengguna
- **Parameter URL**: `id` - ID pesan
- **Respons Sukses**:
  ```json
  {
    "status": "success",
    "message": "Pesan berhasil dihapus"
  }
  ```

### Respons Error

#### Pesan Tidak Ditemukan atau Tidak Memiliki Izin (404 Not Found)

```json
{
  "status": "error",
  "message": "Pesan tidak ditemukan atau Anda tidak memiliki izin untuk menghapusnya"
}
```

## Integrasi Socket.io

API pesan juga mendukung komunikasi real-time menggunakan Socket.io. Berikut adalah event-event yang tersedia:

### Koneksi Socket.io

```javascript
// Koneksi ke server Socket.io dengan token JWT
const socket = io("http://localhost:5000", {
  auth: {
    token: "JWT_TOKEN_PENGGUNA",
  },
});

// Event ketika koneksi berhasil
socket.on("connect", () => {
  console.log("Terhubung ke server Socket.io");
});

// Event ketika terjadi error koneksi
socket.on("connect_error", (error) => {
  console.error("Koneksi Socket.io gagal:", error.message);
});
```

### Bergabung ke Room Transaksi

```javascript
// Bergabung ke room transaksi
socket.emit("joinTransaction", 5); // 5 adalah ID transaksi
```

### Mengirim Pesan via Socket.io

```javascript
// Mengirim pesan
socket.emit("sendMessage", {
  transaction_id: 5,
  content: "Halo, apakah barang masih tersedia?",
});
```

### Menerima Pesan Baru

```javascript
// Menerima pesan baru
socket.on("newMessage", (message) => {
  console.log("Pesan baru:", message);
  // Update UI dengan pesan baru
});
```

### Menerima Error Pesan

```javascript
// Menerima error pesan
socket.on("messageError", (error) => {
  console.error("Error pesan:", error.message);
  // Tampilkan pesan error ke pengguna
});
```

## Catatan Penting

1. Semua endpoint API memerlukan autentikasi dengan token JWT yang valid.
2. Hanya pengguna yang terlibat dalam transaksi (pembeli atau pemilik item) yang dapat mengakses atau mengirim pesan pada transaksi tersebut.
3. Pesan yang dikirim melalui Socket.io juga akan disimpan di database dan dapat diakses melalui API REST.
4. Pengguna hanya dapat menghapus pesan yang dikirim oleh mereka sendiri.
5. Konten pesan dibatasi maksimal 1000 karakter.
   Too many current requests. Your queue position is 1. Please wait for a while or switch to other models for a smoother experience.

## Kode Status

- `200 OK` - Permintaan berhasil
- `201 Created` - Sumber daya berhasil dibuat
- `400 Bad Request` - Permintaan tidak valid
- `401 Unauthorized` - Autentikasi diperlukan
- `403 Forbidden` - Tidak memiliki izin
- `404 Not Found` - Sumber daya tidak ditemukan
- `500 Internal Server Error` - Kesalahan server

## Format Respons Error

```json
{
  "status": "error",
  "message": "Pesan error"
}
```

atau

```json
{
  "status": "error",
  "message": "Validasi gagal",
  "errors": [
    {
      "param": "name",
      "msg": "Nama minimal 3 karakter",
      "location": "body"
    }
  ]
}
```
