-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 07, 2025 at 03:49 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pinjemin`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'masak'),
(2, 'fotografi'),
(3, 'membaca');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `category_id` int DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `description` text,
  `price_sell` decimal(10,2) DEFAULT NULL,
  `price_rent` decimal(10,2) DEFAULT NULL,
  `is_available_for_sell` tinyint(1) DEFAULT '0',
  `is_available_for_rent` tinyint(1) DEFAULT '0',
  `deposit_amount` decimal(10,2) DEFAULT '0.00',
  `status` enum('available','rented','sold') DEFAULT 'available',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `province_id` varchar(10) DEFAULT NULL,
  `province_name` varchar(100) DEFAULT NULL,
  `city_id` varchar(10) DEFAULT NULL,
  `city_name` varchar(100) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `photos` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `user_id`, `category_id`, `name`, `description`, `price_sell`, `price_rent`, `is_available_for_sell`, `is_available_for_rent`, `deposit_amount`, `status`, `created_at`, `province_id`, `province_name`, `city_id`, `city_name`, `latitude`, `longitude`, `thumbnail`, `photos`) VALUES
(1, 4, 1, 'Cuisinart Petit Gourment Tabletop Portable Gas Grill', 'Nikmati pengalaman memanggang praktis di mana saja dengan Cuisinart Petit Gourmet Tabletop Portable Gas Grill. Didesain ringkas dan portabel, grill gas ini cocok untuk piknik, camping, hingga BBQ di balkon apartemen. Dilengkapi dengan sistem pemanasan cepat dan merata, serta kontrol suhu yang presisi. Kaki yang dapat dilipat memudahkan penyimpanan dan transportasi. Material stainless steel tahan lama, mudah dibersihkan, dan siap menemani momen memasak favorit Anda.', '500000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-01 22:35:41', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59518000', '98.67222000', '/uploads/items/item-1748847167694-891258296.svg', '/uploads/items/item-1748847167694-891258296.svg'),
(2, 4, 1, 'Ultra Grill Pan Alat Panggangan Barbeque Bulat 32cm Anti Lengket', 'Buat momen barbeque jadi lebih menyenangkan dengan Ultra Grill Pan 32cm! Wajan panggangan bulat ini terbuat dari material berkualitas tinggi yang anti lengket, memastikan daging dan sayuran matang sempurna tanpa lengket di permukaan. Cocok digunakan di atas kompor gas, ideal untuk panggangan gaya Korea atau Yakiniku. Mudah dibersihkan dan aman digunakan sehari-hari.', '150000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-01 22:35:41', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58411900', '98.66579300', '/uploads/items/item-1748847370325-820996115.svg', '/uploads/items/item-1748847370325-820996115.svg'),
(3, 4, 1, 'Grill Pan BBQ Yakiniku 37x26cm Panggangan Anti-Lengket untuk Rumah dan Outdoor', 'Lengkapi peralatan masak Anda dengan Grill Pan BBQ Yakiniku 37x26cm, panggangan anti-lengket multifungsi untuk kebutuhan rumah maupun kegiatan outdoor. Desainnya yang lebar memungkinkan memasak dalam jumlah banyak sekaligus. Permukaan bertekstur memberikan efek grill yang menggugah selera. Cocok untuk memanggang daging, seafood, dan sayuran tanpa minyak berlebih.', '175000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-01 22:35:41', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58682100', '98.67566900', '/uploads/items/item-1748847479307-315850902.svg', '/uploads/items/item-1748847479307-315850902.svg'),
(4, 4, 1, 'Dash Mini Toaster Oven', 'Minimalis, serbaguna, dan hemat ruang! Dash Mini Toaster Oven adalah pilihan tepat untuk dapur kecil atau kebutuhan cepat sehari-hari. Dengan desain kompak dan gaya retro modern, oven ini ideal untuk memanggang roti, pizza mini, biskuit, dan makanan ringan lainnya. Dilengkapi dengan timer otomatis, kontrol suhu, serta tray yang mudah dilepas dan dibersihkan.', '300000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-01 22:35:41', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59384500', '98.67912400', '/uploads/items/item-1748847491662-965373690.svg', '/uploads/items/item-1748847491662-965373690.svg'),
(5, 4, 1, 'Lodge Cast Iron Baking Pan', 'Masak dengan hasil sempurna menggunakan Lodge Cast Iron Baking Pan, loyang legendaris dari Amerika yang terkenal karena daya tahan dan distribusi panasnya yang merata. Terbuat dari besi tuang pre-seasoned, pan ini ideal untuk memanggang kue dan sajian oven lainnya. Dapat digunakan di oven, kompor, bahkan di atas api terbuka. Investasi jangka panjang untuk dapur profesional maupun rumahan.', '400000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-01 22:35:41', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58823100', '98.66987200', '/uploads/items/item-1748847506330-217616864.svg', '/uploads/items/item-1748847506330-217616864.svg,/uploads/items/item-1748847506336-178364864.svg'),
(6, 4, 2, 'Lensa Super Wide Angle Lensa Makro Smartphone Aksesoris Fotografi Ponsel', 'Ubah smartphone Anda menjadi kamera profesional dengan Lensa Super Wide Angle & Lensa Makro ini. Cocok untuk foto lanskap lebar maupun detail close-up yang tajam. Praktis digunakan, cukup pasang pada kamera ponsel dan hasilkan foto memukau dalam sekejap. Kompatibel dengan berbagai tipe smartphone dan ideal untuk hobi fotografi atau konten media sosial.', NULL, '10000.00', 0, 1, '0.00', 'available', '2025-06-01 22:35:41', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59012300', '98.67845600', '/uploads/items/item-1748847767127-311901848.svg', '/uploads/items/item-1748847767127-311901848.svg'),
(7, 4, 2, 'Meja Putar Fotografi JAKIA – Stand Tampilan Berputar 360◦', 'Tampilkan produk Anda secara profesional dengan Meja Putar Fotografi JAKIA 360°. Cocok untuk keperluan foto katalog, video showcase, dan konten online shop. Platform berputar secara otomatis dan stabil, mendukung pengambilan gambar dari berbagai sudut. Desain minimalis, ringan, dan mudah digunakan, baik untuk fotografer profesional maupun pemula.', NULL, '25000.00', 0, 1, '0.00', 'available', '2025-06-01 22:35:41', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58298700', '98.67123400', '/uploads/items/item-1748847898333-369472055.svg', '/uploads/items/item-1748847898333-369472055.svg'),
(8, 4, 2, 'Kamera Drone Q13 Drone Penghindar Rintangan 360, Drone Mini Fotografi Udara 4K', 'Jelajahi dunia dari atas dengan Kamera Drone Q13, dilengkapi kamera 4K untuk hasil jepretan dan video udara berkualitas tinggi. Fitur penghindar rintangan 360° membuat penerbangan lebih aman dan stabil. Desain mini dan ringan, mudah dikendalikan, cocok untuk pemula maupun penghobi drone.', NULL, '80000.00', 0, 1, '0.00', 'available', '2025-06-01 22:35:41', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59678900', '98.66890100', '/uploads/items/item-1748847925316-467474628.svg', '/uploads/items/item-1748847925316-467474628.svg'),
(9, 4, 2, 'Lensa Original Camera Digital Profesional Fotografer Hasil HD', 'Tingkatkan performa kamera digital Anda dengan Lensa Original Profesional ini. Didesain khusus untuk fotografer yang mengutamakan kualitas, lensa ini memberikan kejernihan dan ketajaman HD dalam setiap bidikan. Cocok untuk berbagai kebutuhan, mulai dari potret, lanskap, hingga pemotretan profesional. Material berkualitas tinggi, presisi, dan tahan lama.', '150000.00', NULL, 1, 0, '0.00', 'available', '2025-06-01 22:35:41', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58123400', '98.67789000', '/uploads/items/item-1748847959999-476177492.svg', '/uploads/items/item-1748847959999-476177492.svg,/uploads/items/item-1748847960002-96880923.svg'),
(10, 4, 2, 'Fujifilm Instax Mini 12 Kamera Instan', 'Abadikan momen spesial dan cetak langsung dengan Fujifilm Instax Mini 12! Kamera instan ini hadir dengan desain stylish dan warna-warna ceria, cocok untuk anak muda, hadiah, atau dokumentasi acara. Dilengkapi dengan mode close-up, auto exposure, dan pengoperasian mudah. Praktis dibawa ke mana saja, hasilkan foto instan berukuran mini yang bisa langsung dibagikan.', '700000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-01 22:35:41', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59123400', '98.66543200', '/uploads/items/item-1748847972826-465648542.svg', '/uploads/items/item-1748847972826-465648542.svg'),
(11, 4, 3, 'Performing Under Pressure: The Science of Doing Your Best When it Matters Most', 'Buku ini mengungkap rahasia bagaimana orang-orang sukses tampil maksimal di situasi paling menegangkan. Berdasarkan riset ilmiah dan kisah nyata dari atlet, dokter, dan eksekutif top, Performing Under Pressure menawarkan strategi praktis untuk mengelola stres dan tetap fokus saat hasil benar-benar dipertaruhkan. Cocok untuk siapa pun yang ingin unggul di momen penting, baik di dunia kerja, pendidikan, maupun kehidupan pribadi.', '120000.00', NULL, 1, 0, '0.00', 'available', '2025-06-01 22:35:41', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58098700', '98.67012300', '/uploads/items/item-1748849333775-612827446.svg', '/uploads/items/item-1748849333775-612827446.svg'),
(12, 4, 3, 'Lords of Easy Money: How the Federal Reserve Broke the American Economy', 'Melalui investigasi mendalam dan narasi yang kuat, buku ini membongkar kebijakan moneter The Federal Reserve yang dianggap menjadi biang keladi ketimpangan ekonomi dan ketidakstabilan keuangan di Amerika. Lords of Easy Money menyajikan pandangan tajam tentang bagaimana \"uang mudah\" memengaruhi masyarakat dan masa depan ekonomi global. Wajib baca bagi yang tertarik pada ekonomi makro dan dunia keuangan.', '135000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-01 22:35:41', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59876500', '98.67345600', '/uploads/items/item-1748849345094-593733649.svg', '/uploads/items/item-1748849345094-593733649.svg'),
(13, 4, 3, 'How to Listen When Markets Speak: Risks, Myths, and Investment Opportunities in A Radically Reshaped Economy', 'Pasar selalu berbicara—tapi tidak semua orang bisa mendengarnya. Buku ini membimbing pembaca memahami sinyal-sinyal tersembunyi di balik pergerakan pasar. Dengan pendekatan tajam dan jernih, How to Listen When Markets Speak membedah mitos investasi dan mengungkap peluang nyata di tengah perubahan ekonomi global. Ideal bagi investor, analis keuangan, dan pembaca yang ingin mengambil keputusan cerdas dalam dunia investasi.', '150000.00', NULL, 1, 0, '0.00', 'available', '2025-06-01 22:35:41', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58567800', '98.66456700', '/uploads/items/item-1748849392225-118971955.svg', '/uploads/items/item-1748849392225-118971955.svg'),
(14, 4, 3, 'You’re Paid What You’re Worth: And Other Myths of the Modern Economy', 'Apakah gaji benar-benar mencerminkan nilai kerja Anda? Buku ini menantang mitos ekonomi modern dan menunjukkan bagaimana sistem kerja, negosiasi, dan diskriminasi membentuk realitas penghasilan. You’re Paid What You’re Worth menyajikan analisis tajam dan menggugah pikiran tentang ketidaksetaraan ekonomi di era sekarang. Cocok untuk pembaca yang tertarik pada isu ketenagakerjaan, keadilan sosial, dan ekonomi kerja.', '110000.00', NULL, 1, 0, '0.00', 'available', '2025-06-01 22:35:41', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59987600', '98.67123400', '/uploads/items/item-1748849427378-689352733.svg', '/uploads/items/item-1748849427378-689352733.svg'),
(15, 4, 3, 'The Road to Freedom: Economics and the Good Society', 'Dalam pencarian makna ekonomi yang manusiawi, The Road to Freedom menyajikan visi tentang masyarakat yang adil, bebas, dan sejahtera. Dengan pendekatan filosofis dan praktis, buku ini menggugah pemikiran tentang bagaimana ekonomi seharusnya melayani kehidupan, bukan sebaliknya. Bacaan reflektif untuk mereka yang mencari perpaduan antara kebijakan ekonomi dan nilai-nilai kemanusiaan.', '100000.00', NULL, 1, 0, '0.00', 'available', '2025-06-01 22:35:41', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58888800', '98.67888800', '/uploads/items/item-1748849470465-232907890.svg', '/uploads/items/item-1748849470465-232907890.svg'),
(20, 5, 1, 'Alat Pemotong Sayur Multifungsi 8 in 1', 'Alat pemotong sayur praktis dengan 8 jenis mata pisau berbeda untuk memotong, mengiris, dan memarut. Dilengkapi wadah penampung dan pelindung tangan. Mempersingkat waktu persiapan memasak.', NULL, '40000.00', 0, 1, '0.00', 'available', '2025-06-01 22:44:17', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59222200', '98.67555500', '/uploads/items/item-1748871155593-430182460.jpg', '/uploads/items/item-1748871155593-430182460.jpg,/uploads/items/item-1748871155594-197773990.jpg'),
(23, 5, 1, 'Blender Serbaguna Dengan Gelas Kaca', 'Blender bertenaga dengan gelas kaca kokoh berkapasitas 1.5 Liter. Ideal untuk membuat jus, smoothie, bumbu halus, hingga menghancurkan es. Mata pisau stainless steel tajam.', NULL, '50000.00', 0, 1, '0.00', 'available', '2025-06-01 22:44:17', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58333300', '98.66444400', '/uploads/items/item-1748871109498-305440012.jpg', '/uploads/items/item-1748871109498-305440012.jpg,/uploads/items/item-1748871109498-150760739.jpg'),
(26, 5, 2, 'Kamera Mirrorless Profesional Sony Alpha A7 IV', 'Kamera mirrorless full-frame canggih dengan sensor 33MP, perekaman video 4K 60p, dan sistem autofokus yang superior. Pilihan utama fotografer dan videografer profesional. Unit tersedia untuk periode tertentu.', NULL, '100000.00', 0, 1, '0.00', 'available', '2025-06-01 22:44:17', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59444400', '98.67333300', '/uploads/items/item-1748871057140-111717124.jpg', '/uploads/items/item-1748871057140-111717124.jpg,/uploads/items/item-1748871057140-833428290.jpg'),
(27, 5, 2, 'Drone Lipat DJI Mini 3 Pro (Untuk Fotografi Udara)', 'Drone lipat yang ringan dengan kamera 4K/60fps dan sensor 48MP. Ideal untuk membuat konten fotografi dan videografi udara berkualitas tinggi dari perspektif baru. Fitur intelligent flight yang mudah digunakan.', NULL, '120000.00', 0, 1, '0.00', 'available', '2025-06-01 22:44:17', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58777700', '98.66777700', '/uploads/items/item-1748871021193-412528154.jpg', '/uploads/items/item-1748871021193-412528154.jpg,/uploads/items/item-1748871021195-770003052.jpg,/uploads/items/item-1748871021195-993904868.jpg'),
(28, 5, 1, 'Set Panci & Penggorengan Anti Lengket 7 Buah', 'Set peralatan masak lengkap terdiri dari panci, wajan, dan tutup kaca. Dilapisi bahan anti lengket premium, mudah dibersihkan dan memasak jadi lebih sehat. Handle ergonomis tahan panas. Cocok untuk kebutuhan dapur sehari-hari.', '200000.00', NULL, 1, 0, '0.00', 'available', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59666600', '98.67222200', '/uploads/items/item-1748870787509-130421747.jpg', '/uploads/items/item-1748870787509-130421747.jpg,/uploads/items/item-1748870787510-533815079.jpg'),
(29, 5, 1, 'Mixer Tangan Elektrik 5 Kecepatan', 'Mixer tangan serbaguna dengan motor bertenaga 250W dan 5 pilihan kecepatan, serta fungsi turbo. Dilengkapi 2 pengocok adonan dan 2 pengait adonan. Ideal untuk membuat kue, krim, dan adonan lainnya.', '180000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58111100', '98.66111100', '/uploads/items/item-1748870820542-297860014.jpg', '/uploads/items/item-1748870820542-297860014.jpg,/uploads/items/item-1748870820542-541944421.jpg'),
(30, 5, 1, 'Spatula Silikon Tahan Panas (Set 3 Buah)', 'Set 3 spatula silikon berkualitas tinggi, tahan panas hingga 230°C. Fleksibel dan kokoh, tidak akan menggores permukaan panci anti lengket. Mudah dibersihkan dan higienis.', NULL, '30000.00', 0, 1, '0.00', 'rented', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59111100', '98.67999900', '/uploads/items/item-1748870751101-68560523.jpg', '/uploads/items/item-1748870751101-68560523.jpg,/uploads/items/item-1748870751102-845791587.jpg'),
(31, 5, 1, 'Kompor Induksi Portabel 1200W', 'Kompor induksi ringkas dan portabel dengan daya 1200W. Panel kontrol digital dengan beberapa mode masak. Aman digunakan, tidak menghasilkan api, dan mudah dibersihkan. Cocok untuk apartemen kecil atau bepergian.', '250000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58222200', '98.67111100', '/uploads/items/item-1748870858937-741742191.jpg', '/uploads/items/item-1748870858937-741742191.jpg,/uploads/items/item-1748870858937-23593806.jpg'),
(32, 5, 1, 'Alat Pemotong Sayur Multifungsi 8 in 1', 'Alat pemotong sayur praktis dengan 8 jenis mata pisau berbeda untuk memotong, mengiris, dan memarut. Dilengkapi wadah penampung dan pelindung tangan. Mempersingkat waktu persiapan memasak.', NULL, '40000.00', 0, 1, '0.00', 'available', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59777700', '98.66333300', '/uploads/items/item-1748870888124-492392036.jpg', '/uploads/items/item-1748870888124-492392036.jpg,/uploads/items/item-1748870888125-879822445.jpg'),
(33, 5, 1, 'Timbangan Dapur Digital Akurat 5kg', 'Timbangan dapur digital dengan kapasitas maksimal 5kg dan akurasi 1 gram. Dilengkapi layar LCD, fungsi tare (untuk menimbang dalam wadah), dan indikator baterai lemah. Penting untuk resep yang membutuhkan takaran presisi.', '60000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58555500', '98.67666600', '/uploads/items/item-1748870913663-601686361.jpg', '/uploads/items/item-1748870913663-601686361.jpg,/uploads/items/item-1748870913663-631295783.jpg'),
(34, 5, 1, 'Cetakan Kue Silikon Bentuk Muffin (12 Rongga)', 'Cetakan kue berbahan silikon food-grade untuk membuat 12 buah muffin atau cupcake sekaligus. Fleksibel, anti lengket, dan mudah dilepaskan. Tahan suhu tinggi.', '35000.00', NULL, 1, 0, '0.00', 'available', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59333300', '98.66222200', '/uploads/items/item-1748870951549-242402199.jpg', '/uploads/items/item-1748870951549-242402199.jpg,/uploads/items/item-1748870951550-125578016.jpg'),
(35, 5, 1, 'Blender Serbaguna Dengan Gelas Kaca', 'Blender bertenaga dengan gelas kaca kokoh berkapasitas 1.5 Liter. Ideal untuk membuat jus, smoothie, bumbu halus, hingga menghancurkan es. Mata pisau stainless steel tajam.', NULL, '50000.00', 0, 1, '0.00', 'rented', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58666600', '98.67444400', '/uploads/items/item-1748869352121-603239517.jpg', '/uploads/items/item-1748869352121-603239517.jpg'),
(36, 5, 1, 'Termometer Makanan Digital Probe', 'Termometer digital dengan probe stainless steel panjang untuk mengukur suhu internal daging, cairan, atau adonan. Layar LCD instan read. Penting untuk memastikan masakan matang sempurna dan aman.', '55000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59555500', '98.66999900', '/uploads/items/item-1748869988700-885311951.jpg', '/uploads/items/item-1748869988700-885311951.jpg,/uploads/items/item-1748869988700-728537538.jpg,/uploads/items/item-1748869988701-241391587.jpg'),
(37, 5, 1, 'Buku Resep Masakan Nusantara Klasik', 'Kumpulan resep masakan tradisional Indonesia yang legendaris. Dilengkapi panduan langkah demi langkah yang mudah diikuti dan tips memasak. Buku wajib bagi pecinta kuliner nusantara.', '70000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58444400', '98.66333300', '/uploads/items/item-1748870021975-699944997.jpg', '/uploads/items/item-1748870021975-699944997.jpg,/uploads/items/item-1748870021975-357978801.jpg,/uploads/items/item-1748870022006-535506056.jpg'),
(38, 5, 2, 'Kamera DSLR Canon EOS 2000D Kit 18-55mm', 'Kamera DSLR ideal untuk pemula dengan sensor 24.1MP. Dilengkapi lensa kit serbaguna 18-55mm IS II. Konektivitas Wi-Fi & NFC memudahkan transfer foto. Belajar fotografi dengan kualitas gambar profesional.', '3500000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59222200', '98.67888800', '/uploads/items/item-1748870050049-769896161.jpg', '/uploads/items/item-1748870050049-769896161.jpg,/uploads/items/item-1748870050049-512726165.jpg'),
(39, 5, 2, 'Tripod Kamera Aluminium Ringan', 'Tripod tiga kaki berbahan aluminium yang ringan dan portabel. Ketinggian maksimal 160cm. Kepala tripod ball head memungkinkan pergerakan fleksibel. Cocok untuk stabilitas saat memotret atau merekam video.', NULL, '30000.00', 0, 1, '0.00', 'rented', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58999900', '98.66222200', '/uploads/items/item-1748870110254-509335967.jpg', '/uploads/items/item-1748870110254-509335967.jpg,/uploads/items/item-1748870110255-757011384.jpg'),
(40, 5, 2, 'Tas Kamera Selempang Dengan Pelindung Hujan', 'Tas kamera selempang yang ringkas namun muat 1 bodi kamera dan 2-3 lensa kecil/aksesoris. Padding tebal melindungi gear. Dilengkapi pelindung hujan terintegrasi. Nyaman untuk penggunaan sehari-hari atau traveling.', '120000.00', NULL, 1, 0, '0.00', 'available', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58333300', '98.67777700', '/uploads/items/item-1748870135435-964705194.jpg', '/uploads/items/item-1748870135435-964705194.jpg,/uploads/items/item-1748870135435-968033761.jpg'),
(41, 5, 2, 'Filter Lensa UV 58mm Kualitas Optik', 'Filter UV bening untuk melindungi elemen depan lensa dari debu, goresan, dan sinar UV yang dapat mengurangi kejernihan gambar. Kualitas optik tinggi, tidak mengurangi ketajaman. Ukuran diameter 58mm.', NULL, '20000.00', 0, 1, '0.00', 'available', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59111100', '98.66444400', '/uploads/items/item-1748870167721-314509787.jpg', '/uploads/items/item-1748870167721-314509787.jpg,/uploads/items/item-1748870167722-429510688.jpg'),
(42, 5, 2, 'Kit Lampu Studio Mini LED (2 Lampu)', 'Set 2 lampu studio mini LED dengan tripod dan diffuser. Memberikan pencahayaan tambahan yang lembut untuk foto produk, portrait kecil, atau video call. Ringkas dan mudah dipasang.', '75000.00', NULL, 1, 0, '0.00', 'available', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58777700', '98.67333300', '/uploads/items/item-1748870199051-289802130.jpg', '/uploads/items/item-1748870199051-289802130.jpg,/uploads/items/item-1748870199052-734887434.jpg'),
(43, 5, 2, 'Reflektor Cahaya Lipat 5 in 1 (Diameter 60cm)', 'Reflektor fotografi multifungsi berdiameter 60cm, dapat dilipat ringkas. Terdiri dari 5 permukaan: Emas, Perak, Putih, Hitam, dan Transparan. Membantu mengontrol pencahayaan alami atau buatan.', '50000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59444400', '98.66666600', '/uploads/items/item-1748870262999-408446624.jpg', '/uploads/items/item-1748870262999-408446624.jpg,/uploads/items/item-1748870263000-379582490.jpg'),
(44, 5, 2, 'Kartu Memori SDXC SanDisk Extreme Pro 128GB', 'Kartu memori SDXC berkecepatan tinggi (V30, U3) dengan kapasitas 128GB. Ideal untuk merekam video 4K dan foto burst. Transfer data cepat ke komputer. Wajib untuk fotografer/videografer.', NULL, '40000.00', 0, 1, '0.00', 'available', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58222200', '98.67555500', '/uploads/items/item-1748870291372-824466092.jpg', '/uploads/items/item-1748870291372-824466092.jpg,/uploads/items/item-1748870291373-527637983.jpg'),
(45, 5, 2, 'Lensa Fix Portrait Nifty Fifty 50mm f/1.8', 'Lensa prime (fix) dengan focal length 50mm dan aperture lebar f/1.8. Menghasilkan bokeh (latar belakang blur) yang indah dan sangat baik di kondisi cahaya minim. Cocok untuk portrait.', '650000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59888800', '98.67111100', '/uploads/items/item-1748870319739-616235827.jpg', '/uploads/items/item-1748870319739-616235827.jpg,/uploads/items/item-1748870319739-352462680.jpg'),
(46, 5, 3, 'E-reader Kindle Paperwhite 2024', 'E-reader terbaru dengan layar 6.8 inci bebas silau seperti kertas sungguhan. Cahaya latar yang hangat dan dapat disesuaikan. Tahan air. Baterai tahan hingga mingguan. Ribuan buku dalam genggaman.', '1700000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58666600', '98.66555500', '/uploads/items/item-1748870379316-367554518.jpg', '/uploads/items/item-1748870379316-367554518.jpg,/uploads/items/item-1748870379317-364970542.jpg'),
(47, 5, 3, 'Lampu Baca Jepit LED (Rechargeable)', 'Lampu baca kecil dengan klip kuat untuk dijepitkan di buku atau e-reader. Menggunakan LED yang nyaman di mata, tingkat kecerahan dapat diatur. Baterai isi ulang via USB. Ideal untuk membaca di malam hari tanpa mengganggu orang lain.', NULL, '20000.00', 0, 1, '0.00', 'available', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59333300', '98.67999900', '/uploads/items/item-1748870408854-592834542.jpg', '/uploads/items/item-1748870408854-592834542.jpg,/uploads/items/item-1748870408854-837052478.jpg'),
(48, 5, 3, 'Pembatas Buku Metal Motif Etnik', 'Pembatas buku unik terbuat dari metal dengan ukiran motif etnik yang indah. Kokoh dan tahan lama. Menjadi penanda halaman buku favorit Anda sekaligus aksesoris yang cantik.', '15000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58111100', '98.67222200', '/uploads/items/item-1748870443678-318055280.jpg', '/uploads/items/item-1748870443678-318055280.jpg,/uploads/items/item-1748870443678-665134689.jpg'),
(49, 5, 3, 'Penyangga Buku Meja Kayu (Adjustable)', 'Penyangga buku portabel berbahan kayu berkualitas. Sudut kemiringan dapat diatur untuk posisi baca yang paling nyaman. Membantu mengurangi pegal pada leher dan tangan saat membaca buku tebal. Dilipat datar untuk penyimpanan.', NULL, '40000.00', 0, 1, '0.00', 'available', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59777700', '98.66777700', '/uploads/items/item-1748870472542-812144542.jpg', '/uploads/items/item-1748870472542-812144542.jpg,/uploads/items/item-1748870472542-528480159.jpg'),
(50, 5, 3, 'Buku Fiksi Best-seller: \"Atomic Habits\"', 'Buku non-fiksi inspiratif karya James Clear tentang cara membangun kebiasaan baik dan menghilangkan kebiasaan buruk dengan metode perubahan kecil yang konsisten. Edisi terjemahan Bahasa Indonesia.', '95000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58555500', '98.67444400', '/uploads/items/item-1748870502181-969825112.jpg', '/uploads/items/item-1748870502181-969825112.jpg,/uploads/items/item-1748870502181-943452663.jpg'),
(51, 5, 3, 'Buku Non-fiksi Populer: \"Sapiens: A Brief History of Humankind\"', 'Buku non-fiksi terkenal karya Yuval Noah Harari yang mengulas sejarah peradaban manusia dari sudut pandang baru. Edisi terjemahan Bahasa Indonesia. Wawasan mendalam tentang evolusi kita.', '120000.00', NULL, 1, 0, '0.00', 'available', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59222200', '98.66111100', '/uploads/items/item-1748870529390-777797080.jpg', '/uploads/items/item-1748870529390-777797080.jpg,/uploads/items/item-1748870529390-598168217.jpg'),
(52, 5, 3, 'Sarung Pelindung E-reader Universal 6 Inci', 'Sarung pelindung universal yang kompatibel dengan sebagian besar e-reader berukuran 6 inci. Bahan kulit sintetis berkualitas melindungi dari goresan dan benturan ringan. Desain elegan.', '45000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58444400', '98.67888800', '/uploads/items/item-1748870558235-908164944.jpg', '/uploads/items/item-1748870558235-908164944.jpg,/uploads/items/item-1748870558235-246633209.jpg'),
(53, 5, 3, 'Kaca Pembesar Dengan Lampu LED', 'Kaca pembesar genggam dengan pembesaran optik dan 2 lampu LED terintegrasi. Membantu membaca teks yang sangat kecil, peta, atau detail halus lainnya. Ringan dan mudah dibawa.', NULL, '25000.00', 0, 1, '0.00', 'available', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59666600', '98.66555500', '/uploads/items/item-1748870587694-70919606.jpg', '/uploads/items/item-1748870587694-70919606.jpg,/uploads/items/item-1748870587694-584530797.jpg'),
(54, 5, 3, 'Meja Lipat Portabel Untuk Laptop & Membaca', 'Meja lipat ringkas yang dapat digunakan di atas kasur atau sofa. Kaki dapat dilipat, dilengkapi slot untuk tablet/ponsel dan cup holder. Permukaan luas untuk menopang buku atau laptop saat membaca/bekerja.', NULL, '70000.00', 0, 1, '0.00', 'available', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58888800', '98.67222200', '/uploads/items/item-1748870625101-991759715.jpg', '/uploads/items/item-1748870625101-991759715.jpg,/uploads/items/item-1748870625102-67686853.jpg'),
(55, 5, 3, 'Set Pulpen Gel Warna-warni (12 Warna)', 'Set 12 pulpen gel dengan tinta berbagai warna cerah. Ujung pena halus 0.5mm. Ideal untuk membuat catatan, menandai bagian penting di buku (jika diizinkan), atau membuat jurnal bacaan.', '20000.00', NULL, 1, 0, '0.00', 'available', '2025-06-01 22:47:18', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59999900', '98.67666600', '/uploads/items/item-1748870674083-124650353.jpg', '/uploads/items/item-1748870674083-124650353.jpg,/uploads/items/item-1748870674084-873593785.jpg,/uploads/items/item-1748870674087-856845978.jpg'),
(56, 5, 1, 'Set Pisau Dapur Stainless Steel 5-in-1', 'Paket lengkap pisau dapur anti karat dengan pegangan ergonomis, ideal untuk kebutuhan memasak harian.', '85000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-02 06:30:27', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58234500', '98.67123400', '/uploads/items/item-1748869098536-396252396.jpg', '/uploads/items/item-1748869098536-396252396.jpg'),
(57, 5, 1, 'Panci Anti Lengket Teflon 24cm', 'Panci masak dengan lapisan anti lengket berkualitas tinggi, cocok untuk menumis dan memasak dengan sedikit minyak.', '90000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-02 06:30:27', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59654300', '98.66876500', '/uploads/items/item-1748869315520-377753291.png', '/uploads/items/item-1748869315520-377753291.png'),
(58, 5, 1, 'Kompor Induksi Digital 2000W', 'Kompor hemat energi dengan kontrol suhu digital dan fitur pengaman otomatis, praktis dan efisien.', NULL, '70000.00', 0, 1, '0.00', 'rented', '2025-06-02 06:30:27', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58198700', '98.67765400', '/uploads/items/item-1748869327166-178616130.jpg', '/uploads/items/item-1748869327166-178616130.jpg'),
(59, 5, 1, 'Blender Serbaguna Philips 600W', 'Blender dengan 3 kecepatan, cocok untuk membuat jus, smoothie, dan menghaluskan bumbu dapur.', '210000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-02 06:30:27', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59012300', '98.66432100', '/uploads/items/item-1748869520836-185181686.jpg', '/uploads/items/item-1748869520836-185181686.jpg'),
(60, 5, 1, 'Loyang Kue Persegi Anti Lengket', 'Loyang berkualitas food-grade untuk memanggang kue, roti, atau lasagna dengan hasil matang merata.', '45000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-02 06:30:27', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58765400', '98.67987600', '/uploads/items/item-1748869381190-702673080.jpg', '/uploads/items/item-1748869381190-702673080.jpg'),
(61, 5, 1, 'Panci Listrik Serbaguna 1.5L', 'Panci listrik multifungsi dengan kapasitas 1.5 liter, cocok untuk memasak mie, merebus telur, hingga menghangatkan sup. Dilengkapi dengan pengatur suhu dan permukaan anti lengket.', NULL, '50000.00', 0, 1, '0.00', 'rented', '2025-06-02 06:30:27', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59432100', '98.67098700', '/uploads/items/item-1748869399657-999033074.png', '/uploads/items/item-1748869399657-999033074.png'),
(62, 5, 1, 'Teko Elektrik Stainless Steel 1.8L', 'Teko pemanas air otomatis dengan daya 1500W dan kapasitas besar, terbuat dari bahan stainless steel anti karat. Fitur mati otomatis saat air mendidih dan sistem perlindungan dari kekeringan.', '120000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-02 06:30:27', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58321000', '98.66654300', '/uploads/items/item-1748869418405-166842747.jpg', '/uploads/items/item-1748869418405-166842747.jpg'),
(63, 5, 1, 'Toples Kaca Kedap Udara 1000ml', 'Toples penyimpanan makanan berbahan kaca tebal dengan tutup kedap udara berbahan bambu. Ideal untuk menyimpan kopi, biskuit, atau bahan dapur kering agar tetap segar lebih lama.', '30000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-02 06:30:27', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59789000', '98.67543200', '/uploads/items/item-1748869437527-679926691.jpg', '/uploads/items/item-1748869437527-679926691.jpg'),
(64, 5, 2, 'Kamera Mirrorless Canon EOS M50 Mark II', 'Kamera mirrorless ringan dengan kemampuan video 4K dan layar sentuh putar, ideal untuk vlogging dan fotografi sehari-hari.', NULL, '90000.00', 0, 1, '0.00', 'rented', '2025-06-02 06:30:27', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58654300', '98.67187600', '/uploads/items/item-1748869455156-796176828.jpg', '/uploads/items/item-1748869455156-796176828.jpg'),
(65, 5, 2, 'Lensa Fix Sony FE 50mm f/1.8', 'Lensa prime dengan bukaan besar untuk efek bokeh yang memukau, cocok untuk potret dan kondisi cahaya rendah.', '1350000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-02 06:30:27', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59210900', '98.66321000', '/uploads/items/item-1748869469760-673797463.jpg', '/uploads/items/item-1748869469760-673797463.jpg'),
(66, 5, 2, 'Tripod Aluminium Manfrotto Compact', 'Tripod ringan dan kokoh dengan kepala ball head, mendukung kamera DSLR dan mirrorless untuk pengambilan gambar stabil.', '280000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-02 06:30:27', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58543200', '98.67876500', '/uploads/items/item-1748869492029-73193247.jpg', '/uploads/items/item-1748869492029-73193247.jpg'),
(67, 5, 2, 'Lighting Kit LED Neewer 660', 'Paket lampu LED serbaguna dengan intensitas dan suhu warna yang dapat diatur, sempurna untuk studio kecil.', NULL, '60000.00', 0, 1, '0.00', 'available', '2025-06-02 06:30:27', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59543200', '98.66987600', '/uploads/items/item-1748869133361-845257597.png', '/uploads/items/item-1748869133361-845257597.png'),
(68, 5, 2, 'Tas Kamera Lowepro ProTactic BP 450 AW II', 'Tas kamera tahan air dengan kompartemen fleksibel untuk kamera, lensa, drone, dan aksesori lainnya.', '800000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-02 06:30:27', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58432100', '98.66210900', '/uploads/items/item-1748869849700-538534614.jpg', '/uploads/items/item-1748869849700-538534614.jpg'),
(69, 5, 3, '“Atomic Habits” - James Clear', 'Panduan praktis membangun kebiasaan kecil yang membawa perubahan besar dalam hidup.', '95000.00', NULL, 1, 0, '0.00', 'available', '2025-06-02 06:30:27', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59876500', '98.67654300', '/uploads/items/item-1748869725230-190331346.jpg', '/uploads/items/item-1748869725230-190331346.jpg'),
(70, 5, 3, '“Laut Bercerita” - Leila S. Chudori', 'Novel fiksi sejarah yang menyentuh, menceritakan kisah aktivis era Orde Baru yang hilang secara misterius.', '87000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-02 06:30:27', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58210900', '98.67098700', '/uploads/items/item-1748869746996-230879086.jpg', '/uploads/items/item-1748869746996-230879086.jpg'),
(71, 5, 3, '“Sapiens: A Brief History of Humankind” - Yuval Noah Harari', 'Buku non-fiksi populer yang membahas evolusi manusia dari masa purba hingga era modern.', '120000.00', NULL, 1, 0, '0.00', 'available', '2025-06-02 06:30:27', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59198700', '98.66543200', '/uploads/items/item-1748869773467-866999607.jpg', '/uploads/items/item-1748869773467-866999607.jpg'),
(72, 5, 3, '“Filosofi Teras” - Henry Manampiring', 'Pengantar pemikiran stoikisme yang relevan untuk mengelola emosi dan kebahagiaan dalam hidup sehari-hari.', '88000.00', NULL, 1, 0, '0.00', 'available', '2025-06-02 06:30:27', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58789000', '98.67876500', '/uploads/items/item-1748869799063-810559292.jpg', '/uploads/items/item-1748869799063-810559292.jpg'),
(73, 5, 3, '“Rich Dad Poor Dad” - Robert T. Kiyosaki', 'Buku edukatif tentang literasi finansial dan perbedaan mindset antara orang kaya dan miskin.', '99000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-02 06:30:27', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59678900', '98.67234500', '/uploads/items/item-1748869819530-508384295.jpg', '/uploads/items/item-1748869819530-508384295.jpg'),
(74, 6, 1, 'Talenan Kayu Pinus', 'Talenan kayu ini terbuat dari kayu pinus pilihan, proses pengeringannya menggunakan panas alami dari sinar Matahari, sehingga kayu lebih kering dan tidak gampang patah maupun melengkung. penggunaan kaki membuat lebih kokoh dan tidak mudah bergeser saat digunakan mengiris.', '45000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-02 06:34:57', '51', 'BALI', '5101', 'KABUPATEN JEMBRANA', '-8.35926500', '114.62880000', '/uploads/items/item-1748928298698-657155808.jpg', '/uploads/items/item-1748928298698-657155808.jpg'),
(75, 6, 1, 'Mixer Kecepatan Tinggi', 'Mixer tangan dengan pegangan yang terbuat dari plastik kuat guna memudahkan dalam memegang mixer. Mixer ini menawarkan fleksibilitas dengan 7 tingkat kecepatan yang dapat disesuaikan dengan kebutuhan sehingga dapat menghasilkan adonan kue yang mengembang dan merata dengan lebih cepat.', NULL, '50000.00', 0, 1, '0.00', 'rented', '2025-06-02 06:34:57', '51', 'BALI', '5101', 'KABUPATEN JEMBRANA', '-8.35851200', '114.62734500', '/uploads/items/item-1748928313406-714829221.jpg', '/uploads/items/item-1748928313406-714829221.jpg'),
(76, 6, 1, 'Pisau Daging Tajam Carbon', 'Dibuat dari baja karbon yang ditempa sehingga lebih tajam, kokoh, dan tahan lama. Handlenya dibuat ergonomis sehingga memotong daging lebih nyaman dan presisi. Pisau yang satu ini bisa Anda andalkan untuk memotong daging dan tulang.', '80000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-02 06:34:57', '51', 'BALI', '5101', 'KABUPATEN JEMBRANA', '-8.36011100', '114.62945600', '/uploads/items/item-1748928327351-595601621.jpg', '/uploads/items/item-1748928327351-595601621.jpg'),
(77, 6, 1, 'Wajan Mini Anti Lengket', 'Hadir dengan material aluminium berlapis non stick sehingga masakan tak mudah lengket. Wajan ini memudahkan Anda menggoreng bahan makanan kecil seperti telur omelet ataupun sekedar menggoreng patty burger.', '45000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-02 06:34:57', '51', 'BALI', '5101', 'KABUPATEN JEMBRANA', '-8.35798700', '114.62654300', '/uploads/items/item-1748928340860-773949612.jpg', '/uploads/items/item-1748928340860-773949612.jpg'),
(78, 6, 1, 'Spatula Anti Lengket', 'Bilahnya yang tipis memudahkan saat menyelipkan spatula di bawah makanan, sedangkan ukurannya yang besar memungkinkan Anda membalikkan makanan dengan mudah.', NULL, '25000.00', 0, 1, '0.00', 'rented', '2025-06-02 06:34:57', '51', 'BALI', '5101', 'KABUPATEN JEMBRANA', '-8.36123400', '114.63012300', '/uploads/items/item-1748928360375-573238807.png', '/uploads/items/item-1748928360375-573238807.png'),
(79, 6, 2, 'Lensa Sony FE 50mm f/1.2 GM', 'Merupakan Lensa prime classic normal focal length dengan desain yang diperbarui dan ramping, lensa dicirikan oleh kecepatan dan form factor yang relatif ringkas. Selain itu, sebagai lensa G Master, lensa ini memiliki desain optik canggih untuk citra yang terkoreksi dengan baik dengan tingkat ketajaman dan kejernihan yang tinggi.', '2250000.00', NULL, 1, 0, '0.00', 'available', '2025-06-02 06:34:57', '51', 'BALI', '5101', 'KABUPATEN JEMBRANA', '-8.35712300', '114.62543200', '/uploads/items/item-1748928374577-687421656.jpg', '/uploads/items/item-1748928374577-687421656.jpg'),
(80, 6, 2, 'Lensa Sony FE 70-200mm f/2.8 GM OSS', 'Sony FE 70-200mm f/2.8 GM OSS merupakan lensa telefoto zoom untuk profesional, sebagai anggota dari lensa seri G Master, lensa ini dapat memberikan ketajaman tinggi bersama bokeh yang halus dan bersih dan dengan penyimpangan minimum absolut.', '2500000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-02 06:34:57', '51', 'BALI', '5101', 'KABUPATEN JEMBRANA', '-8.36234500', '114.63123400', '/uploads/items/item-1748928389001-618754463.jpg', '/uploads/items/item-1748928389001-618754463.jpg'),
(81, 6, 2, 'Lensa Sony FE 24-70mm f/2.8 GM II', 'Sony FE 24-70mm f/2.8 GM II tidak hanya lebih kecil dan lebih ringan dari generasi sebelumnya, tetapi juga dilengkapi berbagai peningkatan optik, pemfokusan, dan penanganan, yang melayani foto dan aplikasi video.', NULL, '120000.00', 0, 1, '0.00', 'rented', '2025-06-02 06:34:57', '51', 'BALI', '5101', 'KABUPATEN JEMBRANA', '-8.35654300', '114.62432100', '/uploads/items/item-1748928403329-402118843.jpg', '/uploads/items/item-1748928403329-402118843.jpg'),
(82, 6, 2, 'Lensa Sony FE 16-35mm f/2.8 GM', 'Sony FE 16-35mm f/2.8 GM merupakan lensa wide-angle zoom yang cepat dan fleksibel. Lensa ini memiliki aperture f / 2.8 konstan dan juga menawarkan kinerja yang konsisten sepanjang rentang zoom dan manfaat lainnya ketika bekerja dalam kondisi low-light.', '1950000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-02 06:34:57', '51', 'BALI', '5101', 'KABUPATEN JEMBRANA', '-8.36345600', '114.63234500', '/uploads/items/item-1748928415895-565582920.jpg', '/uploads/items/item-1748928415895-565582920.jpg'),
(83, 6, 2, 'Lensa Sony FE 200-600mm f/5.6 – 6.3 G OSS', 'Sony FE 200-600mm F5.6-6.3 G OSS mencakup rentang telefoto serbaguna, lensa zoom fleksibel yang sangat cocok untuk aplikasi alam, margasatwa, dan olahraga.', NULL, '150000.00', 0, 1, '0.00', 'rented', '2025-06-02 06:34:57', '51', 'BALI', '5101', 'KABUPATEN JEMBRANA', '-8.35543200', '114.62321000', '/uploads/items/item-1748928428064-976181991.jpg', '/uploads/items/item-1748928428064-976181991.jpg'),
(84, 6, 3, '“Kambing Jantan” – Raditya Dika', 'Novel komedi ini bercerita tentang keseharian Raditya Dika semasa berkuliah di Australia.', NULL, '20000.00', 0, 1, '0.00', 'rented', '2025-06-02 06:34:57', '51', 'BALI', '5101', 'KABUPATEN JEMBRANA', '-8.36456700', '114.63345600', '/uploads/items/item-1748928443095-748061399.jpg', '/uploads/items/item-1748928443095-748061399.jpg'),
(85, 6, 3, '“Seporsi Mie Ayam Sebelum Mati” – Brian Khrisna', 'Novel ini mengangkat isu kesehatan mental, khususnya depresi, dengan sudut pandang yang unik.', NULL, '25000.00', 0, 1, '0.00', 'available', '2025-06-02 06:34:57', '51', 'BALI', '5101', 'KABUPATEN JEMBRANA', '-8.35432100', '114.62210900', '/uploads/items/item-1748928464781-745411631.png', '/uploads/items/item-1748928464781-745411631.png'),
(86, 6, 3, '“The Psychology of Money” – Morgan Housel', 'Merupakan buku yang mengeksplorasi hubungan antara psikologi dan keuangan. Buku ini tidak hanya membahas teori keuangan, tetapi juga bagaimana emosi, perilaku, dan pengalaman pribadi kita memengaruhi cara kita berinteraksi dengan uang.', NULL, '27000.00', 0, 1, '0.00', 'available', '2025-06-02 06:34:57', '51', 'BALI', '5101', 'KABUPATEN JEMBRANA', '-8.36567800', '114.63456700', '/uploads/items/item-1748928478452-823062042.jpg', '/uploads/items/item-1748928478452-823062042.jpg'),
(87, 6, 3, '“Madilog: Materialisme, Dialektika, dan Logika” – Tan Malaka', 'Karya yang memberikan dasar pemahaman tentang materialisme, dialektika, dan logika bagi para kader dan pemimpin pergerakan revolusioner di Indonesia.', NULL, '30000.00', 0, 1, '0.00', 'available', '2025-06-02 06:34:57', '51', 'BALI', '5101', 'KABUPATEN JEMBRANA', '-8.35321000', '114.62109800', '/uploads/items/item-1748928491598-478132020.jpg', '/uploads/items/item-1748928491598-478132020.jpg'),
(88, 6, 3, '“Namaku Alam” – Leila S. Chudori', 'Buku ini mengisahkan perjalanan hidup Segara Alam, seorang remaja yang mengalami kesulitan mencari identitas diri akibat stigma \"keluarga tapol\" pasca peristiwa 1965.', NULL, '23000.00', 0, 1, '0.00', 'available', '2025-06-02 06:34:57', '51', 'BALI', '5101', 'KABUPATEN JEMBRANA', '-8.36678900', '114.63567800', '/uploads/items/item-1748928505113-582592278.png', '/uploads/items/item-1748928505113-582592278.png'),
(89, 4, 3, 'Buku Gambar', 'Buku gambar murah', '2000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-04 03:42:29', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58876500', '98.67432100', '/uploads/items/item-1749008547782-99655164.jpg', '/uploads/items/item-1749008547782-99655164.jpg'),
(90, 8, 3, 'Buku Bacaan', 'Buku bacaan novel', NULL, '5000.00', 0, 1, '0.00', 'available', '2025-06-04 06:23:08', '12', 'SUMATERA UTARA', '1277', 'KOTA PADANGSIDIMPUAN', '3.57520100', '98.68388300', '/uploads/items/item-1749018186822-718926014.jfif', '/uploads/items/item-1749018186822-718926014.jfif'),
(91, 5, 2, ' Kamera Canon EOS 4000D DSLR Camera EF-S 18-55 mm f/3.5-5.6 III', 'Kamera Canon EOS 4000D DSLR Camera EF-S 18-55 mm f/3.5-5.6 III', NULL, '500000.00', 0, 1, '0.00', 'available', '2025-06-04 11:37:00', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59321000', '98.66789000', '/uploads/items/item-1749037019511-559613524.jfif', '/uploads/items/item-1749037019511-559613524.jfif'),
(92, 9, 1, 'Panci Stainless Steel', 'Panci stainless steel, cocok untuk ibu rumah tangga, new produk', '45000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-04 17:30:40', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58654300', '98.67345600', '/uploads/items/item-1749058237075-188343427.jfif', '/uploads/items/item-1749058237075-188343427.jfif'),
(93, 9, 3, 'Senja di Balik Awan', 'Kisah cinta dua insan yang terpisah waktu dan ruang. Disajikan dengan bahasa puitis dan emosional. Cocok bagi pencinta kisah cinta yang menghangatkan hati.', '55000.00', NULL, 1, 0, '0.00', 'available', '2025-06-05 03:54:40', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59765400', '98.66654300', '/uploads/items/item-1749095679953-375647894.png', '/uploads/items/item-1749095679953-375647894.png'),
(94, 9, 2, 'Hujan', 'Kisah cinta yang terjalin di tengah bencana alam, mengajarkan tentang kehilangan dan harapan baru', '40000.00', NULL, 1, 0, '0.00', 'available', '2025-06-05 03:55:23', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58543200', '98.67543200', '/uploads/items/item-1749095721957-518473425.jpg', '/uploads/items/item-1749095721957-518473425.jpg,/uploads/items/item-1749095721957-251614528.jpg'),
(95, 9, 3, 'Daun yang Jatuh Tak Pernah Membenci Angin ', 'Cerita tentang cinta yang tulus dan pengorbanan tanpa pamrih, mengajarkan arti ketulusan.', '35000.00', NULL, 1, 0, '0.00', 'available', '2025-06-05 03:55:55', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59123400', '98.66987600', '/uploads/items/item-1749095754950-730998933.jpg', '/uploads/items/item-1749095754950-730998933.jpg,/uploads/items/item-1749095754950-219357462.jpg'),
(96, 9, 3, 'Novel Rindu', 'Kisah perjalanan spiritual dan cinta yang mendalam, mengajarkan tentang memaafkan dan merelakan', '44500.00', NULL, 1, 0, '0.00', 'available', '2025-06-05 03:56:46', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58876500', '98.67210900', '/uploads/items/item-1749095804666-873314424.jpg', '/uploads/items/item-1749095804666-873314424.jpg,/uploads/items/item-1749095804666-624970134.jpg'),
(97, 9, 3, 'Novel Kau, Aku dan Sepucuk Angpau Merah', 'Cerita cinta yang bersemi di tengah tradisi dan budaya, penuh warna dan emosi', NULL, '10000.00', 0, 1, '0.00', 'available', '2025-06-05 03:57:27', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.60593934', '98.68874359', '/uploads/items/item-1749095847086-776724997.jpg', '/uploads/items/item-1749095847086-776724997.jpg,/uploads/items/item-1749095847086-382454064.jpg'),
(98, 9, 3, 'Sunset Bersama Rosie', 'Kisah cinta yang diuji oleh waktu dan jarak, mengajarkan tentang kesetiaan dan harapan', NULL, '10000.00', 0, 1, '0.00', 'available', '2025-06-05 03:58:01', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59532100', '98.67012300', '/uploads/items/item-1749095880829-657906182.jpg', '/uploads/items/item-1749095880829-657906182.jpg'),
(99, 9, 3, 'Novel Moga Bunda Disayang Allah', 'Cerita tentang kasih sayang dan pengorbanan seorang ibu, penuh haru dan inspirasi', '55000.00', NULL, 1, 0, '0.00', 'available', '2025-06-05 03:58:51', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58503787', '98.71547503', '/uploads/items/item-1749095929029-174692380.jpg', '/uploads/items/item-1749095929029-174692380.jpg'),
(100, 9, 1, 'Blender Multifungsi 2L', 'Blender dengan kapasitas 2 liter, dilengkapi dengan berbagai kecepatan untuk menghaluskan buah, sayur, dan membuat smoothie', '350000.00', NULL, 1, 0, '0.00', 'available', '2025-06-05 03:59:32', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.56721985', '98.66883644', '/uploads/items/item-1749095971111-55930441.jpg', '/uploads/items/item-1749095971111-55930441.jpg,/uploads/items/item-1749095971111-319848233.jpg'),
(101, 9, 1, 'Rice Cooker Digital 1.8L', 'Rice cooker dengan teknologi digital, memiliki berbagai mode memasak seperti nasi putih, nasi merah, dan bubur. Kapasitas 1.8 liter', '550000.00', NULL, 1, 0, '0.00', 'available', '2025-06-05 04:00:10', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58123400', '98.66432100', '/uploads/items/item-1749096009438-476112264.jpg', '/uploads/items/item-1749096009438-476112264.jpg,/uploads/items/item-1749096009438-682296339.jpg'),
(102, 9, 1, 'Mixer Tangan 5 Kecepatan', 'Mixer tangan dengan 5 pilihan kecepatan, ideal untuk mengocok telur, adonan kue, dan krim. Ringan dan mudah digunakan', '450000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-05 04:00:37', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59586558', '98.66883087', '/uploads/items/item-1749096036598-468712.jpg', '/uploads/items/item-1749096036598-468712.jpg'),
(103, 9, 1, 'Pengupas Sayur Multifungsi', 'Alat pengupas sayur dengan desain ergonomis, dilengkapi dengan pisau stainless steel tajam. Memudahkan pengupasan berbagai jenis sayuran dan buah. ', '45000.00', NULL, 1, 0, '0.00', 'sold', '2025-06-05 04:01:17', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59987600', '98.67876500', '/uploads/items/item-1749096076444-478190164.jpg', '/uploads/items/item-1749096076444-478190164.jpg'),
(104, 9, 2, 'Kamera Sony Alpha A7 III Body Only', 'Kamera mirrorless full-frame terbaik untuk fotografer profesional. Kinerja ISO tinggi dan autofokus cepat. ', NULL, '300000.00', 0, 1, '0.00', 'available', '2025-06-05 04:02:01', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.58771055', '98.67638397', '/uploads/items/item-1749096120862-727429718.jpg', '/uploads/items/item-1749096120862-727429718.jpg');
INSERT INTO `items` (`id`, `user_id`, `category_id`, `name`, `description`, `price_sell`, `price_rent`, `is_available_for_sell`, `is_available_for_rent`, `deposit_amount`, `status`, `created_at`, `province_id`, `province_name`, `city_id`, `city_name`, `latitude`, `longitude`, `thumbnail`, `photos`) VALUES
(105, 9, 2, 'Kamera Panasonic Lumix G100 Kit 12-32mm', 'Kamera vlog dengan audio berkualitas tinggi dan fitur penstabil gambar. Ringan dan mudah dibawa kemana saja', NULL, '350000.00', 0, 1, '0.00', 'available', '2025-06-05 04:02:33', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.59875779', '98.76623027', '/uploads/items/item-1749096152972-133205996.jpg', '/uploads/items/item-1749096152972-133205996.jpg,/uploads/items/item-1749096152972-42531797.jpg'),
(106, 9, 2, 'Jasa Sewa Kamera Sony A7 III', 'Jasa Sewa Kamera Sony A7 III', NULL, '250000.00', 0, 1, '0.00', 'available', '2025-06-06 03:08:00', '12', 'SUMATERA UTARA', '1275', 'KOTA MEDAN', '3.63437826', '98.75124526', '/uploads/items/item-1749179278992-334774127.jfif', '/uploads/items/item-1749179278992-334774127.jfif'),
(107, 11, 3, 'Novel Laut Bercerita', 'Saya mau menjual novel laut bercerita milik sayaaa.', '35000.00', NULL, 1, 0, '0.00', 'available', '2025-06-07 07:46:29', '31', 'DKI JAKARTA', '3171', 'KOTA JAKARTA SELATAN', '-6.19441754', '106.84403229', '/uploads/items/item-1749282387937-208988623.jpg', '/uploads/items/item-1749282387937-208988623.jpg'),
(108, 11, 3, 'Novel Dilan 1990', 'saya ingin menjual novel dilan 1990 ini, novel lama tapi masi bagus', '35000.00', NULL, 1, 0, '0.00', 'available', '2025-06-07 07:56:22', '31', 'DKI JAKARTA', '3171', 'KOTA JAKARTA SELATAN', '-6.19148219', '106.79734039', '/uploads/items/item-1749282982052-198263797.jfif', '/uploads/items/item-1749282982052-198263797.jfif'),
(109, 11, 3, 'Novel Dilan 1991', 'Saya menjual novel dilan 1991, walau sudah lama tapi masi bagus, saya jamin tidak rugi yaaa', '35000.00', NULL, 1, 0, '0.00', 'available', '2025-06-07 08:12:40', '31', 'DKI JAKARTA', '3171', 'KOTA JAKARTA SELATAN', '-6.19318879', '106.83510590', '/uploads/items/item-1749283959635-32530434.jpg', '/uploads/items/item-1749283959635-32530434.jpg,/uploads/items/item-1749283959636-468012131.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int NOT NULL,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `item_id` int DEFAULT NULL,
  `transaction_id` int DEFAULT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `item_id`, `transaction_id`, `content`, `created_at`) VALUES
(32, 8, 5, NULL, 38, 'halo bang', '2025-06-04 11:13:47'),
(33, 8, 5, NULL, 39, 'bang, tolong segera di proses', '2025-06-04 11:38:06'),
(34, 5, 8, NULL, 40, 'abangda', '2025-06-04 12:11:58'),
(35, 9, 5, NULL, 56, 'halo bang', '2025-06-04 16:32:50'),
(36, 5, 9, NULL, 56, 'haloow', '2025-06-04 16:33:21'),
(37, 5, 9, NULL, 62, 'bntr ya bang', '2025-06-05 04:25:39'),
(38, 9, 5, NULL, 62, 'aman aja bang', '2025-06-05 04:25:49'),
(39, 9, 5, NULL, 62, 'bang', '2025-06-05 04:54:59'),
(40, 9, 5, NULL, 62, 'bang', '2025-06-05 05:04:25'),
(41, 5, 9, NULL, 62, 'kenapa dekku', '2025-06-05 05:04:44'),
(42, 9, 5, NULL, 62, 'bang', '2025-06-05 05:05:42'),
(43, 9, 5, NULL, 63, 'bang', '2025-06-05 05:06:54'),
(44, 9, 5, NULL, 63, 'abangda', '2025-06-05 05:17:04'),
(45, 9, 5, NULL, 63, 'bang oik', '2025-06-05 05:28:11'),
(46, 5, 9, NULL, 77, 'bang', '2025-06-05 15:24:38'),
(47, 9, 12, NULL, 82, 'yow', '2025-06-07 13:04:43');

-- --------------------------------------------------------

--
-- Table structure for table `messages_community`
--

CREATE TABLE `messages_community` (
  `id` int NOT NULL,
  `sender_id` int NOT NULL,
  `province_id` int NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `messages_community`
--

INSERT INTO `messages_community` (`id`, `sender_id`, `province_id`, `content`, `created_at`) VALUES
(1, 5, 12, 'halo', '2025-05-30 10:27:27'),
(2, 5, 12, 'abangku', '2025-05-30 10:41:34'),
(3, 4, 12, 'yah fiq', '2025-05-30 10:42:32'),
(4, 5, 12, 'apa cs', '2025-05-30 10:42:43'),
(5, 6, 51, 'horas', '2025-05-30 11:32:06'),
(6, 4, 12, 'halo ges', '2025-05-31 04:49:26'),
(7, 4, 12, 'yud', '2025-05-31 05:03:55'),
(8, 4, 12, 'oi', '2025-05-31 08:45:02'),
(9, 4, 12, 'jajan', '2025-05-31 08:45:52'),
(10, 4, 12, 'halo', '2025-05-31 08:48:48'),
(11, 4, 12, 'halo', '2025-05-31 08:49:30'),
(12, 4, 12, 'halo ges', '2025-05-31 08:54:58'),
(13, 4, 12, 'ges', '2025-05-31 08:58:07'),
(14, 4, 12, 'pada ngapain', '2025-05-31 08:59:29'),
(15, 4, 12, 'ajsfdsfsfdfdf', '2025-05-31 09:00:03'),
(16, 4, 12, 'abangku', '2025-05-31 09:02:31'),
(17, 4, 12, 'lagi ngapain', '2025-05-31 09:02:34'),
(18, 4, 12, 'keren keren', '2025-05-31 09:02:37'),
(19, 4, 12, 'ih lagi ngapain kelen abangda', '2025-05-31 09:02:59'),
(20, 4, 12, 'gaada men maen aja, orang abang?', '2025-05-31 09:03:16'),
(21, 4, 12, 'gabut nich', '2025-05-31 09:03:25'),
(22, 4, 12, 'ges', '2025-05-31 09:03:44'),
(23, 4, 12, 'bug kah?', '2025-05-31 09:03:52'),
(24, 4, 12, 'ada bug kah?', '2025-05-31 09:03:59'),
(25, 4, 12, 'haloo', '2025-05-31 09:04:06'),
(26, 4, 12, 'hajan', '2025-05-31 09:04:14'),
(27, 4, 12, 'halo kak', '2025-05-31 09:12:21'),
(28, 4, 12, 'halo om', '2025-05-31 09:15:50'),
(29, 5, 12, 'sore all', '2025-05-31 09:19:23'),
(30, 4, 12, 'p', '2025-05-31 12:10:13'),
(31, 4, 12, 'malam all', '2025-05-31 12:10:16'),
(32, 5, 12, 'malam', '2025-05-31 12:10:23'),
(33, 4, 12, 'halo ges', '2025-05-31 16:20:29'),
(34, 4, 12, 'lagi pada ngapain?', '2025-05-31 16:20:37'),
(35, 4, 12, 'pagi all', '2025-05-31 17:15:00'),
(36, 5, 12, 'pagii', '2025-05-31 17:15:06'),
(37, 5, 12, 'lagi ngoding kah?', '2025-05-31 17:16:43'),
(38, 4, 12, 'iya bang lagi ngoding hehehe', '2025-05-31 17:16:57'),
(39, 4, 12, 'abang lagi ngoding juga kah?', '2025-05-31 17:17:04'),
(40, 5, 12, 'iya bang, lagi ngoding juga', '2025-05-31 17:17:12'),
(41, 5, 12, 'banyak bet kerjaan ini wkwkw', '2025-05-31 17:17:46'),
(42, 7, 12, 'abangda', '2025-06-01 07:39:07'),
(43, 8, 12, 'halow', '2025-06-01 08:36:53'),
(44, 7, 12, 'eyo', '2025-06-01 08:37:02'),
(45, 8, 12, 'abangda pagi smeunaya', '2025-06-01 22:18:44'),
(46, 6, 51, 'hai', '2025-06-03 05:29:01'),
(47, 8, 12, 'siang all', '2025-06-04 06:24:58'),
(48, 8, 12, 'gaada yang join nih?', '2025-06-04 06:25:11'),
(49, 5, 12, 'gweh bang, join nih', '2025-06-04 06:25:40'),
(50, 9, 12, 'gais', '2025-06-05 03:06:56'),
(51, 9, 12, 'gesss', '2025-06-06 11:55:31');

-- --------------------------------------------------------

--
-- Table structure for table `messages_hobby`
--

CREATE TABLE `messages_hobby` (
  `id` int NOT NULL,
  `sender_id` int NOT NULL,
  `hobby` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `messages_hobby`
--

INSERT INTO `messages_hobby` (`id`, `sender_id`, `hobby`, `content`, `created_at`, `updated_at`) VALUES
(1, 12, 'masak', 'gais', '2025-06-07 01:41:59', '2025-06-07 01:41:59'),
(2, 12, 'masak', 'lagi pada ngapain nih', '2025-06-07 01:42:16', '2025-06-07 01:42:16'),
(3, 9, 'MEMBACA', 'abangdaaa', '2025-06-07 01:53:47', '2025-06-07 01:53:47'),
(4, 9, 'MEMBACA', 'apa kabar semuanyaaaa', '2025-06-07 01:53:51', '2025-06-07 01:53:51'),
(5, 9, 'MEMBACA', 'apa kabar kalian baikk', '2025-06-07 01:53:54', '2025-06-07 01:53:54'),
(6, 9, 'MEMBACA', 'aku baik nihhh', '2025-06-07 01:53:58', '2025-06-07 01:53:58'),
(7, 9, 'MEMBACA', 'ges', '2025-06-07 03:35:02', '2025-06-07 03:35:02');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `type` enum('transaction','message','rent_reminder') NOT NULL DEFAULT 'transaction',
  `transaction_id` int DEFAULT NULL,
  `related_user_id` int DEFAULT NULL,
  `scheduled_date` date DEFAULT NULL,
  `reminder_day` tinyint DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `message`, `is_read`, `created_at`, `type`, `transaction_id`, `related_user_id`, `scheduled_date`, `reminder_day`) VALUES
(47, 6, 'yudii melakukan pembelian untuk item \"Talenan Kayu Pinus\" dengan total Rp 45.000,00', 0, '2025-06-04 02:27:19', 'transaction', 23, 7, NULL, 0),
(48, 7, 'Transaksi pembelian untuk item \"Talenan Kayu Pinus\" berhasil dibuat dengan total Rp 45.000,00', 0, '2025-06-04 02:27:19', 'transaction', 23, 6, NULL, 0),
(49, 6, 'Yudi melakukan penyewaan untuk item \"Mixer Kecepatan Tinggi\" dengan total Rp 200.000,00', 0, '2025-06-04 02:28:56', 'transaction', 24, 4, NULL, 0),
(50, 4, 'Transaksi penyewaan untuk item \"Mixer Kecepatan Tinggi\" berhasil dibuat dengan total Rp 200.000,00', 0, '2025-06-04 02:28:56', 'transaction', 24, 6, NULL, 0),
(51, 4, 'Pengingat: Masa sewa untuk \"Mixer Kecepatan Tinggi\" akan berakhir 3 hari lagi. Harap segera kembalikan item atau perpanjang masa sewa.', 0, '2025-06-04 02:28:56', 'rent_reminder', 24, NULL, '2025-06-14', 1),
(52, 4, 'Pengingat: Masa sewa untuk \"Mixer Kecepatan Tinggi\" akan berakhir 2 hari lagi. Harap segera kembalikan item atau perpanjang masa sewa.', 0, '2025-06-04 02:28:56', 'rent_reminder', 24, NULL, '2025-06-15', 2),
(53, 4, 'Pengingat: Masa sewa untuk \"Mixer Kecepatan Tinggi\" akan berakhir besok. Harap segera kembalikan item atau perpanjang masa sewa.', 0, '2025-06-04 02:28:56', 'rent_reminder', 24, NULL, '2025-06-16', 3),
(54, 6, 'Yudi melakukan pembelian untuk item \"Lensa Sony FE 70-200mm f/2.8 GM OSS\" dengan total Rp 2.500.000,00', 0, '2025-06-04 02:30:22', 'transaction', 25, 4, NULL, 0),
(55, 4, 'Transaksi pembelian untuk item \"Lensa Sony FE 70-200mm f/2.8 GM OSS\" berhasil dibuat dengan total Rp 2.500.000,00', 0, '2025-06-04 02:30:22', 'transaction', 25, 6, NULL, 0),
(56, 6, 'Yudi melakukan penyewaan untuk item \"“Kambing Jantan” – Raditya Dika\" dengan total Rp 240.000,00', 0, '2025-06-04 02:35:05', 'transaction', 26, 4, NULL, 0),
(57, 4, 'Transaksi penyewaan untuk item \"“Kambing Jantan” – Raditya Dika\" berhasil dibuat dengan total Rp 240.000,00', 0, '2025-06-04 02:35:05', 'transaction', 26, 6, NULL, 0),
(58, 4, 'Pengingat: Masa sewa untuk \"“Kambing Jantan” – Raditya Dika\" akan berakhir 3 hari lagi. Harap segera kembalikan item atau perpanjang masa sewa.', 1, '2025-06-04 02:35:05', 'rent_reminder', 26, NULL, '2025-06-12', 1),
(59, 4, 'Pengingat: Masa sewa untuk \"“Kambing Jantan” – Raditya Dika\" akan berakhir 2 hari lagi. Harap segera kembalikan item atau perpanjang masa sewa.', 0, '2025-06-04 02:35:05', 'rent_reminder', 26, NULL, '2025-06-13', 2),
(60, 4, 'Pengingat: Masa sewa untuk \"“Kambing Jantan” – Raditya Dika\" akan berakhir besok. Harap segera kembalikan item atau perpanjang masa sewa.', 0, '2025-06-04 02:35:05', 'rent_reminder', 26, NULL, '2025-06-14', 3),
(61, 4, 'yudii melakukan pembelian untuk item \"Cuisinart Petit Gourment Tabletop Portable Gas Grill\" dengan total Rp 500.000,00', 0, '2025-06-04 02:49:41', 'transaction', 27, 7, NULL, 0),
(62, 7, 'Transaksi pembelian untuk item \"Cuisinart Petit Gourment Tabletop Portable Gas Grill\" berhasil dibuat dengan total Rp 500.000,00', 0, '2025-06-04 02:49:41', 'transaction', 27, 4, NULL, 0),
(63, 4, 'yudii melakukan pembelian untuk item \"Ultra Grill Pan Alat Panggangan Barbeque Bulat 32cm Anti Lengket\" dengan total Rp 150.000,00', 0, '2025-06-04 02:51:31', 'transaction', 28, 7, NULL, 0),
(64, 7, 'Transaksi pembelian untuk item \"Ultra Grill Pan Alat Panggangan Barbeque Bulat 32cm Anti Lengket\" berhasil dibuat dengan total Rp 150.000,00', 0, '2025-06-04 02:51:31', 'transaction', 28, 4, NULL, 0),
(65, 6, 'Yudi melakukan pembelian untuk item \"Pisau Daging Tajam Carbon\" dengan total Rp 80.000,00', 1, '2025-06-04 02:53:45', 'transaction', 29, 4, NULL, 0),
(66, 4, 'Transaksi pembelian untuk item \"Pisau Daging Tajam Carbon\" berhasil dibuat dengan total Rp 80.000,00', 0, '2025-06-04 02:53:45', 'transaction', 29, 6, NULL, 0),
(67, 6, 'Yudi melakukan penyewaan untuk item \"Spatula Anti Lengket\" dengan total Rp 25.000,00', 1, '2025-06-04 02:54:56', 'transaction', 30, 4, NULL, 0),
(68, 4, 'Transaksi penyewaan untuk item \"Spatula Anti Lengket\" berhasil dibuat dengan total Rp 25.000,00', 0, '2025-06-04 02:54:56', 'transaction', 30, 6, NULL, 0),
(69, 4, 'Pengingat: Masa sewa untuk \"Spatula Anti Lengket\" akan berakhir 3 hari lagi. Harap segera kembalikan item atau perpanjang masa sewa.', 0, '2025-06-04 02:54:56', 'rent_reminder', 30, NULL, '2025-06-01', 1),
(70, 4, 'Pengingat: Masa sewa untuk \"Spatula Anti Lengket\" akan berakhir 2 hari lagi. Harap segera kembalikan item atau perpanjang masa sewa.', 0, '2025-06-04 02:54:56', 'rent_reminder', 30, NULL, '2025-06-02', 2),
(71, 4, 'Pengingat: Masa sewa untuk \"Spatula Anti Lengket\" akan berakhir besok. Harap segera kembalikan item atau perpanjang masa sewa.', 0, '2025-06-04 02:54:56', 'rent_reminder', 30, NULL, '2025-06-03', 3),
(72, 4, 'yoga melakukan pembelian untuk item \"Dash Mini Toaster Oven\" dengan total Rp 300.000,00', 0, '2025-06-04 02:56:56', 'transaction', 31, 6, NULL, 0),
(73, 6, 'Transaksi pembelian untuk item \"Dash Mini Toaster Oven\" berhasil dibuat dengan total Rp 300.000,00', 0, '2025-06-04 02:56:56', 'transaction', 31, 4, NULL, 0),
(74, 4, 'yoga melakukan pembelian untuk item \"Lodge Cast Iron Baking Pan\" dengan total Rp 400.000,00', 0, '2025-06-04 02:57:30', 'transaction', 32, 6, NULL, 0),
(75, 6, 'Transaksi pembelian untuk item \"Lodge Cast Iron Baking Pan\" berhasil dibuat dengan total Rp 400.000,00', 0, '2025-06-04 02:57:30', 'transaction', 32, 4, NULL, 0),
(76, 6, 'yogi melakukan penyewaan untuk item \"Lensa Sony FE 200-600mm f/5.6 – 6.3 G OSS\" dengan total Rp 1.050.000,00', 0, '2025-06-04 05:20:32', 'transaction', 33, 8, NULL, 0),
(77, 8, 'Transaksi penyewaan untuk item \"Lensa Sony FE 200-600mm f/5.6 – 6.3 G OSS\" berhasil dibuat dengan total Rp 1.050.000,00', 1, '2025-06-04 05:20:32', 'transaction', 33, 6, NULL, 0),
(78, 8, 'Pengingat: Masa sewa untuk \"Lensa Sony FE 200-600mm f/5.6 – 6.3 G OSS\" akan berakhir 3 hari lagi. Harap segera kembalikan item atau perpanjang masa sewa.', 1, '2025-06-04 05:20:32', 'rent_reminder', 33, NULL, '2025-06-07', 1),
(79, 8, 'Pengingat: Masa sewa untuk \"Lensa Sony FE 200-600mm f/5.6 – 6.3 G OSS\" akan berakhir 2 hari lagi. Harap segera kembalikan item atau perpanjang masa sewa.', 1, '2025-06-04 05:20:32', 'rent_reminder', 33, NULL, '2025-06-08', 2),
(80, 8, 'Pengingat: Masa sewa untuk \"Lensa Sony FE 200-600mm f/5.6 – 6.3 G OSS\" akan berakhir besok. Harap segera kembalikan item atau perpanjang masa sewa.', 1, '2025-06-04 05:20:32', 'rent_reminder', 33, NULL, '2025-06-09', 3),
(81, 5, 'yogi melakukan pembelian untuk item \"Kompor Induksi Portabel 1200W\" dengan total Rp 250.000,00', 1, '2025-06-04 10:55:29', 'transaction', 34, 8, NULL, 0),
(82, 8, 'Transaksi pembelian untuk item \"Kompor Induksi Portabel 1200W\" berhasil dibuat dengan total Rp 250.000,00', 1, '2025-06-04 10:55:29', 'transaction', 34, 5, NULL, 0),
(83, 5, 'yogi melakukan pembelian untuk item \"Set Pisau Dapur Stainless Steel 5-in-1\" dengan total Rp 85.000,00', 1, '2025-06-04 11:01:18', 'transaction', 35, 8, NULL, 0),
(84, 8, 'Transaksi pembelian untuk item \"Set Pisau Dapur Stainless Steel 5-in-1\" berhasil dibuat dengan total Rp 85.000,00', 1, '2025-06-04 11:01:18', 'transaction', 35, 5, NULL, 0),
(85, 5, 'yogi melakukan pembelian untuk item \"Blender Serbaguna Philips 600W\" dengan total Rp 210.000,00', 1, '2025-06-04 11:01:58', 'transaction', 36, 8, NULL, 0),
(86, 8, 'Transaksi pembelian untuk item \"Blender Serbaguna Philips 600W\" berhasil dibuat dengan total Rp 210.000,00', 1, '2025-06-04 11:01:58', 'transaction', 36, 5, NULL, 0),
(87, 5, 'yogi melakukan penyewaan untuk item \"Spatula Silikon Tahan Panas (Set 3 Buah)\" dengan total Rp 120.000,00', 1, '2025-06-04 11:05:18', 'transaction', 37, 8, NULL, 0),
(88, 8, 'Transaksi penyewaan untuk item \"Spatula Silikon Tahan Panas (Set 3 Buah)\" berhasil dibuat dengan total Rp 120.000,00', 1, '2025-06-04 11:05:18', 'transaction', 37, 5, NULL, 0),
(89, 8, 'Pengingat: Masa sewa untuk \"Spatula Silikon Tahan Panas (Set 3 Buah)\" akan berakhir 3 hari lagi. Harap segera kembalikan item atau perpanjang masa sewa.', 1, '2025-06-04 11:05:18', 'rent_reminder', 37, NULL, '2025-06-04', 1),
(90, 8, 'Pengingat: Masa sewa untuk \"Spatula Silikon Tahan Panas (Set 3 Buah)\" akan berakhir 2 hari lagi. Harap segera kembalikan item atau perpanjang masa sewa.', 1, '2025-06-04 11:05:18', 'rent_reminder', 37, NULL, '2025-06-05', 2),
(91, 8, 'Pengingat: Masa sewa untuk \"Spatula Silikon Tahan Panas (Set 3 Buah)\" akan berakhir besok. Harap segera kembalikan item atau perpanjang masa sewa.', 1, '2025-06-04 11:05:18', 'rent_reminder', 37, NULL, '2025-06-06', 3),
(92, 5, 'yogi melakukan penyewaan untuk item \"Panci Listrik Serbaguna 1.5L\" dengan total Rp 50.000,00', 1, '2025-06-04 11:07:40', 'transaction', 38, 8, NULL, 0),
(93, 8, 'Transaksi penyewaan untuk item \"Panci Listrik Serbaguna 1.5L\" berhasil dibuat dengan total Rp 50.000,00', 1, '2025-06-04 11:07:40', 'transaction', 38, 5, NULL, 0),
(94, 8, 'Pengingat: Masa sewa untuk \"Panci Listrik Serbaguna 1.5L\" akan berakhir 3 hari lagi. Harap segera kembalikan item atau perpanjang masa sewa.', 1, '2025-06-04 11:07:40', 'rent_reminder', 38, NULL, '2025-06-01', 1),
(95, 8, 'Pengingat: Masa sewa untuk \"Panci Listrik Serbaguna 1.5L\" akan berakhir 2 hari lagi. Harap segera kembalikan item atau perpanjang masa sewa.', 1, '2025-06-04 11:07:40', 'rent_reminder', 38, NULL, '2025-06-02', 2),
(96, 8, 'Pengingat: Masa sewa untuk \"Panci Listrik Serbaguna 1.5L\" akan berakhir besok. Harap segera kembalikan item atau perpanjang masa sewa.', 1, '2025-06-04 11:07:40', 'rent_reminder', 38, NULL, '2025-06-03', 3),
(97, 5, 'yogi melakukan penyewaan untuk item \"Kamera Mirrorless Canon EOS M50 Mark II\" dengan total Rp 180.000,00', 1, '2025-06-04 11:37:25', 'transaction', 39, 8, NULL, 0),
(98, 8, 'Transaksi penyewaan untuk item \"Kamera Mirrorless Canon EOS M50 Mark II\" berhasil dibuat dengan total Rp 180.000,00', 1, '2025-06-04 11:37:25', 'transaction', 39, 5, NULL, 0),
(99, 8, 'Pengingat: Masa sewa untuk \"Kamera Mirrorless Canon EOS M50 Mark II\" akan berakhir 2 hari lagi. Harap segera kembalikan item atau perpanjang masa sewa.', 1, '2025-06-04 11:37:25', 'rent_reminder', 39, NULL, '2025-06-03', 2),
(100, 8, 'Pengingat: Masa sewa untuk \"Kamera Mirrorless Canon EOS M50 Mark II\" akan berakhir besok. Harap segera kembalikan item atau perpanjang masa sewa.', 1, '2025-06-04 11:37:25', 'rent_reminder', 39, NULL, '2025-06-04', 3),
(101, 5, 'yogi melakukan penyewaan untuk item \"Kompor Induksi Digital 2000W\" dengan total Rp 140.000,00', 1, '2025-06-04 11:48:55', 'transaction', 40, 8, NULL, 0),
(102, 8, 'Transaksi penyewaan untuk item \"Kompor Induksi Digital 2000W\" berhasil dibuat dengan total Rp 140.000,00', 1, '2025-06-04 11:48:55', 'transaction', 40, 5, NULL, 0),
(103, 8, 'Pengingat: Masa sewa untuk \"Kompor Induksi Digital 2000W\" akan berakhir 2 hari lagi. Harap segera kembalikan item atau perpanjang masa sewa.', 1, '2025-06-04 11:48:55', 'rent_reminder', 40, NULL, '2025-06-03', 2),
(104, 8, 'Pengingat: Masa sewa untuk \"Kompor Induksi Digital 2000W\" akan berakhir besok. Harap segera kembalikan item atau perpanjang masa sewa.', 1, '2025-06-04 11:48:55', 'rent_reminder', 40, NULL, '2025-06-04', 3),
(105, 6, 'yogi melakukan penyewaan untuk item \"Lensa Sony FE 24-70mm f/2.8 GM II\" dengan total Rp 840.000,00', 0, '2025-06-04 11:51:42', 'transaction', 41, 8, NULL, 0),
(106, 8, 'Transaksi penyewaan untuk item \"Lensa Sony FE 24-70mm f/2.8 GM II\" berhasil dibuat dengan total Rp 840.000,00', 1, '2025-06-04 11:51:42', 'transaction', 41, 6, NULL, 0),
(107, 8, 'Pengingat: Masa sewa untuk \"Lensa Sony FE 24-70mm f/2.8 GM II\" akan berakhir 3 hari lagi. Harap segera kembalikan item atau perpanjang masa sewa.', 1, '2025-06-04 11:51:42', 'rent_reminder', 41, NULL, '2025-06-07', 1),
(108, 8, 'Pengingat: Masa sewa untuk \"Lensa Sony FE 24-70mm f/2.8 GM II\" akan berakhir 2 hari lagi. Harap segera kembalikan item atau perpanjang masa sewa.', 1, '2025-06-04 11:51:42', 'rent_reminder', 41, NULL, '2025-06-08', 2),
(109, 8, 'Pengingat: Masa sewa untuk \"Lensa Sony FE 24-70mm f/2.8 GM II\" akan berakhir besok. Harap segera kembalikan item atau perpanjang masa sewa.', 1, '2025-06-04 11:51:42', 'rent_reminder', 41, NULL, '2025-06-09', 3),
(110, 5, 'yogi melakukan pembelian untuk item \"Toples Kaca Kedap Udara 1000ml\" dengan total Rp 30.000,00', 0, '2025-06-04 14:29:03', 'transaction', 42, 8, NULL, 0),
(111, 8, 'Transaksi pembelian untuk item \"Toples Kaca Kedap Udara 1000ml\" berhasil dibuat dengan total Rp 30.000,00', 1, '2025-06-04 14:29:03', 'transaction', 42, 5, NULL, 0),
(112, 6, 'yogi melakukan penyewaan untuk item \"Lensa Sony FE 200-600mm f/5.6 – 6.3 G OSS\" dengan total Rp 450.000,00', 0, '2025-06-04 14:29:56', 'transaction', 43, 8, NULL, 0),
(113, 8, 'Transaksi penyewaan untuk item \"Lensa Sony FE 200-600mm f/5.6 – 6.3 G OSS\" berhasil dibuat dengan total Rp 450.000,00', 0, '2025-06-04 14:29:56', 'transaction', 43, 6, NULL, 0),
(114, 8, 'Pengingat: Masa sewa untuk \"Lensa Sony FE 200-600mm f/5.6 – 6.3 G OSS\" akan berakhir 3 hari lagi. Harap segera kembalikan item atau perpanjang masa sewa.', 0, '2025-06-04 14:29:56', 'rent_reminder', 43, NULL, '2025-06-03', 1),
(115, 8, 'Pengingat: Masa sewa untuk \"Lensa Sony FE 200-600mm f/5.6 – 6.3 G OSS\" akan berakhir 2 hari lagi. Harap segera kembalikan item atau perpanjang masa sewa.', 0, '2025-06-04 14:29:56', 'rent_reminder', 43, NULL, '2025-06-04', 2),
(116, 8, 'Pengingat: Masa sewa untuk \"Lensa Sony FE 200-600mm f/5.6 – 6.3 G OSS\" akan berakhir besok. Harap segera kembalikan item atau perpanjang masa sewa.', 1, '2025-06-04 14:29:56', 'rent_reminder', 43, NULL, '2025-06-05', 3),
(117, 5, 'yogi melakukan pembelian untuk item \"Buku Fiksi Best-seller: \"Atomic Habits\"\" dengan total Rp 95.000,00', 0, '2025-06-04 14:48:22', 'transaction', 44, 8, NULL, 0),
(118, 8, 'Transaksi pembelian untuk item \"Buku Fiksi Best-seller: \"Atomic Habits\"\" berhasil dibuat dengan total Rp 95.000,00', 0, '2025-06-04 14:48:22', 'transaction', 44, 5, NULL, 0),
(119, 5, 'yogi melakukan pembelian untuk item \"“Laut Bercerita” - Leila S. Chudori\" dengan total Rp 87.000,00', 0, '2025-06-04 14:49:04', 'transaction', 45, 8, NULL, 0),
(120, 8, 'Transaksi pembelian untuk item \"“Laut Bercerita” - Leila S. Chudori\" berhasil dibuat dengan total Rp 87.000,00', 0, '2025-06-04 14:49:04', 'transaction', 45, 5, NULL, 0),
(121, 5, 'yogi melakukan pembelian untuk item \"Reflektor Cahaya Lipat 5 in 1 (Diameter 60cm)\" dengan total Rp 50.000,00', 0, '2025-06-04 14:59:43', 'transaction', 46, 8, NULL, 0),
(122, 8, 'Transaksi pembelian untuk item \"Reflektor Cahaya Lipat 5 in 1 (Diameter 60cm)\" berhasil dibuat dengan total Rp 50.000,00', 0, '2025-06-04 14:59:43', 'transaction', 46, 5, NULL, 0),
(123, 4, 'fiqri melakukan pembelian untuk item \"Buku Gambar\" dengan total Rp 2.000,00', 0, '2025-06-04 15:04:20', 'transaction', 47, 5, NULL, 0),
(124, 5, 'Transaksi pembelian untuk item \"Buku Gambar\" berhasil dibuat dengan total Rp 2.000,00', 0, '2025-06-04 15:04:20', 'transaction', 47, 4, NULL, 0),
(125, 5, 'yogi melakukan pembelian untuk item \"Sarung Pelindung E-reader Universal 6 Inci\" dengan total Rp 45.000,00', 0, '2025-06-04 15:08:05', 'transaction', 48, 8, NULL, 0),
(126, 8, 'Transaksi pembelian untuk item \"Sarung Pelindung E-reader Universal 6 Inci\" berhasil dibuat dengan total Rp 45.000,00', 0, '2025-06-04 15:08:05', 'transaction', 48, 5, NULL, 0),
(127, 6, 'yogi melakukan pembelian untuk item \"Wajan Mini Anti Lengket\" dengan total Rp 45.000,00', 0, '2025-06-04 15:11:54', 'transaction', 49, 8, NULL, 0),
(128, 8, 'Transaksi pembelian untuk item \"Wajan Mini Anti Lengket\" berhasil dibuat dengan total Rp 45.000,00', 0, '2025-06-04 15:11:54', 'transaction', 49, 6, NULL, 0),
(129, 5, 'yogi melakukan pembelian untuk item \"Panci Anti Lengket Teflon 24cm\" dengan total Rp 90.000,00', 0, '2025-06-04 15:12:29', 'transaction', 50, 8, NULL, 0),
(130, 8, 'Transaksi pembelian untuk item \"Panci Anti Lengket Teflon 24cm\" berhasil dibuat dengan total Rp 90.000,00', 0, '2025-06-04 15:12:29', 'transaction', 50, 5, NULL, 0),
(131, 6, 'yogi melakukan pembelian untuk item \"Lensa Sony FE 16-35mm f/2.8 GM\" dengan total Rp 1.950.000,00', 0, '2025-06-04 15:21:55', 'transaction', 51, 8, NULL, 0),
(132, 8, 'Transaksi pembelian untuk item \"Lensa Sony FE 16-35mm f/2.8 GM\" berhasil dibuat dengan total Rp 1.950.000,00', 0, '2025-06-04 15:21:55', 'transaction', 51, 6, NULL, 0),
(133, 5, 'yoga melakukan pembelian untuk item \"Lensa Fix Portrait Nifty Fifty 50mm f/1.8\" dengan total Rp 650.000,00', 0, '2025-06-04 16:25:21', 'transaction', 52, 6, NULL, 0),
(134, 6, 'Transaksi pembelian untuk item \"Lensa Fix Portrait Nifty Fifty 50mm f/1.8\" berhasil dibuat dengan total Rp 650.000,00', 0, '2025-06-04 16:25:21', 'transaction', 52, 5, NULL, 0),
(135, 4, 'yoga melakukan pembelian untuk item \"Lords of Easy Money: How the Federal Reserve Broke the American Economy\" dengan total Rp 135.000,00', 0, '2025-06-04 16:26:37', 'transaction', 53, 6, NULL, 0),
(136, 6, 'Transaksi pembelian untuk item \"Lords of Easy Money: How the Federal Reserve Broke the American Economy\" berhasil dibuat dengan total Rp 135.000,00', 0, '2025-06-04 16:26:37', 'transaction', 53, 4, NULL, 0),
(137, 5, 'yoga melakukan pembelian untuk item \"“Rich Dad Poor Dad” - Robert T. Kiyosaki\" dengan total Rp 99.000,00', 0, '2025-06-04 16:27:01', 'transaction', 54, 6, NULL, 0),
(138, 6, 'Transaksi pembelian untuk item \"“Rich Dad Poor Dad” - Robert T. Kiyosaki\" berhasil dibuat dengan total Rp 99.000,00', 0, '2025-06-04 16:27:01', 'transaction', 54, 5, NULL, 0),
(139, 4, 'fiqri melakukan pembelian untuk item \"Grill Pan BBQ Yakiniku 37x26cm Panggangan Anti-Lengket untuk Rumah dan Outdoor\" dengan total Rp 175.000,00', 0, '2025-06-04 16:27:43', 'transaction', 55, 5, NULL, 0),
(140, 5, 'Transaksi pembelian untuk item \"Grill Pan BBQ Yakiniku 37x26cm Panggangan Anti-Lengket untuk Rumah dan Outdoor\" berhasil dibuat dengan total Rp 175.000,00', 0, '2025-06-04 16:27:43', 'transaction', 55, 4, NULL, 0),
(141, 5, 'Bintang melakukan pembelian untuk item \"Termometer Makanan Digital Probe\" dengan total Rp 55.000,00', 0, '2025-06-04 16:30:32', 'transaction', 56, 9, NULL, 0),
(142, 9, 'Transaksi pembelian untuk item \"Termometer Makanan Digital Probe\" berhasil dibuat dengan total Rp 55.000,00', 0, '2025-06-04 16:30:32', 'transaction', 56, 5, NULL, 0),
(143, 5, 'Bintang melakukan pembelian untuk item \"Pembatas Buku Metal Motif Etnik\" dengan total Rp 15.000,00', 0, '2025-06-05 03:07:15', 'transaction', 57, 9, NULL, 0),
(144, 9, 'Transaksi pembelian untuk item \"Pembatas Buku Metal Motif Etnik\" berhasil dibuat dengan total Rp 15.000,00', 0, '2025-06-05 03:07:15', 'transaction', 57, 5, NULL, 0),
(145, 5, 'Bintang melakukan pembelian untuk item \"Mixer Tangan Elektrik 5 Kecepatan\" dengan total Rp 180.000,00', 0, '2025-06-05 03:07:43', 'transaction', 58, 9, NULL, 0),
(146, 9, 'Transaksi pembelian untuk item \"Mixer Tangan Elektrik 5 Kecepatan\" berhasil dibuat dengan total Rp 180.000,00', 0, '2025-06-05 03:07:43', 'transaction', 58, 5, NULL, 0),
(147, 5, 'Bintang melakukan pembelian untuk item \"Buku Resep Masakan Nusantara Klasik\" dengan total Rp 70.000,00', 0, '2025-06-05 03:08:02', 'transaction', 59, 9, NULL, 0),
(148, 9, 'Transaksi pembelian untuk item \"Buku Resep Masakan Nusantara Klasik\" berhasil dibuat dengan total Rp 70.000,00', 0, '2025-06-05 03:08:02', 'transaction', 59, 5, NULL, 0),
(149, 9, 'fiqri melakukan pembelian untuk item \"Panci Stainless Steel\" dengan total Rp 45.000,00', 0, '2025-06-05 03:51:36', 'transaction', 60, 5, NULL, 0),
(150, 5, 'Transaksi pembelian untuk item \"Panci Stainless Steel\" berhasil dibuat dengan total Rp 45.000,00', 0, '2025-06-05 03:51:36', 'transaction', 60, 9, NULL, 0),
(151, 5, 'Bintang melakukan penyewaan untuk item \"Tripod Kamera Aluminium Ringan\" dengan total Rp 360.000,00', 0, '2025-06-05 04:04:15', 'transaction', 61, 9, NULL, 0),
(152, 9, 'Transaksi penyewaan untuk item \"Tripod Kamera Aluminium Ringan\" berhasil dibuat dengan total Rp 360.000,00', 0, '2025-06-05 04:04:15', 'transaction', 61, 5, NULL, 0),
(153, 9, 'Pengingat: Masa sewa untuk \"Tripod Kamera Aluminium Ringan\" akan berakhir 3 hari lagi. Harap segera kembalikan item atau perpanjang masa sewa.', 0, '2025-06-05 04:04:15', 'rent_reminder', 61, NULL, '2025-06-13', 1),
(154, 9, 'Pengingat: Masa sewa untuk \"Tripod Kamera Aluminium Ringan\" akan berakhir 2 hari lagi. Harap segera kembalikan item atau perpanjang masa sewa.', 0, '2025-06-05 04:04:15', 'rent_reminder', 61, NULL, '2025-06-14', 2),
(155, 9, 'Pengingat: Masa sewa untuk \"Tripod Kamera Aluminium Ringan\" akan berakhir besok. Harap segera kembalikan item atau perpanjang masa sewa.', 0, '2025-06-05 04:04:15', 'rent_reminder', 61, NULL, '2025-06-15', 3),
(156, 5, 'Bintang melakukan pembelian untuk item \"Tas Kamera Lowepro ProTactic BP 450 AW II\" dengan total Rp 800.000,00', 0, '2025-06-05 04:18:07', 'transaction', 62, 9, NULL, 0),
(157, 9, 'Transaksi pembelian untuk item \"Tas Kamera Lowepro ProTactic BP 450 AW II\" berhasil dibuat dengan total Rp 800.000,00', 0, '2025-06-05 04:18:07', 'transaction', 62, 5, NULL, 0),
(158, 5, 'Bintang melakukan pembelian untuk item \"Lensa Fix Sony FE 50mm f/1.8\" dengan total Rp 1.350.000,00', 0, '2025-06-05 05:06:40', 'transaction', 63, 9, NULL, 0),
(159, 9, 'Transaksi pembelian untuk item \"Lensa Fix Sony FE 50mm f/1.8\" berhasil dibuat dengan total Rp 1.350.000,00', 0, '2025-06-05 05:06:40', 'transaction', 63, 5, NULL, 0),
(160, 5, 'Bintang melakukan pembelian untuk item \"Teko Elektrik Stainless Steel 1.8L\" dengan total Rp 120.000,00', 0, '2025-06-05 05:28:27', 'transaction', 64, 9, NULL, 0),
(161, 9, 'Transaksi pembelian untuk item \"Teko Elektrik Stainless Steel 1.8L\" berhasil dibuat dengan total Rp 120.000,00', 0, '2025-06-05 05:28:27', 'transaction', 64, 5, NULL, 0),
(162, 9, 'fiqri melakukan pembelian untuk item \"Pengupas Sayur Multifungsi\" dengan total Rp 45.000,00', 0, '2025-06-05 13:25:51', 'transaction', 65, 5, NULL, 0),
(163, 5, 'Transaksi pembelian untuk item \"Pengupas Sayur Multifungsi\" berhasil dibuat dengan total Rp 45.000,00', 0, '2025-06-05 13:25:51', 'transaction', 65, 9, NULL, 0),
(164, 5, 'Bintang melakukan pembelian untuk item \"E-reader Kindle Paperwhite 2024\" dengan total Rp 1.700.000,00', 0, '2025-06-05 13:38:23', 'transaction', 66, 9, NULL, 0),
(165, 9, 'Transaksi pembelian untuk item \"E-reader Kindle Paperwhite 2024\" berhasil dibuat dengan total Rp 1.700.000,00', 0, '2025-06-05 13:38:23', 'transaction', 66, 5, NULL, 0),
(166, 5, 'Bintang melakukan pembelian untuk item \"Tripod Aluminium Manfrotto Compact\" dengan total Rp 280.000,00', 0, '2025-06-05 13:41:15', 'transaction', 67, 9, NULL, 0),
(167, 9, 'Transaksi pembelian untuk item \"Tripod Aluminium Manfrotto Compact\" berhasil dibuat dengan total Rp 280.000,00', 0, '2025-06-05 13:41:15', 'transaction', 67, 5, NULL, 0),
(168, 5, 'Bintang melakukan penyewaan untuk item \"Blender Serbaguna Dengan Gelas Kaca\" dengan total Rp 100.000,00', 0, '2025-06-05 13:42:27', 'transaction', 68, 9, NULL, 0),
(169, 9, 'Transaksi penyewaan untuk item \"Blender Serbaguna Dengan Gelas Kaca\" berhasil dibuat dengan total Rp 100.000,00', 0, '2025-06-05 13:42:27', 'transaction', 68, 5, NULL, 0),
(170, 9, 'Pengingat: Masa sewa untuk \"Blender Serbaguna Dengan Gelas Kaca\" akan berakhir 2 hari lagi. Harap segera kembalikan item atau perpanjang masa sewa.', 0, '2025-06-05 13:42:27', 'rent_reminder', 68, NULL, '2025-06-04', 2),
(171, 9, 'Pengingat: Masa sewa untuk \"Blender Serbaguna Dengan Gelas Kaca\" akan berakhir besok. Harap segera kembalikan item atau perpanjang masa sewa.', 0, '2025-06-05 13:42:27', 'rent_reminder', 68, NULL, '2025-06-05', 3),
(172, 5, 'Bintang melakukan pembelian untuk item \"Loyang Kue Persegi Anti Lengket\" dengan total Rp 45.000,00', 0, '2025-06-05 13:55:39', 'transaction', 69, 9, NULL, 0),
(173, 9, 'Transaksi pembelian untuk item \"Loyang Kue Persegi Anti Lengket\" berhasil dibuat dengan total Rp 45.000,00', 0, '2025-06-05 13:55:39', 'transaction', 69, 5, NULL, 0),
(174, 5, 'Bintang melakukan pembelian untuk item \"Timbangan Dapur Digital Akurat 5kg\" dengan total Rp 60.000,00', 0, '2025-06-05 14:10:47', 'transaction', 70, 9, NULL, 0),
(175, 9, 'Transaksi pembelian untuk item \"Timbangan Dapur Digital Akurat 5kg\" berhasil dibuat dengan total Rp 60.000,00', 0, '2025-06-05 14:10:47', 'transaction', 70, 5, NULL, 0),
(176, 5, 'Bintang melakukan pembelian untuk item \"Timbangan Dapur Digital Akurat 5kg\" dengan total Rp 60.000,00', 0, '2025-06-05 14:11:10', 'transaction', 71, 9, NULL, 0),
(177, 9, 'Transaksi pembelian untuk item \"Timbangan Dapur Digital Akurat 5kg\" berhasil dibuat dengan total Rp 60.000,00', 0, '2025-06-05 14:11:10', 'transaction', 71, 5, NULL, 0),
(178, 9, 'fiqri melakukan pembelian untuk item \"Mixer Tangan 5 Kecepatan\" dengan total Rp 450.000,00', 0, '2025-06-05 15:08:26', 'transaction', 72, 5, NULL, 0),
(179, 5, 'Transaksi pembelian untuk item \"Mixer Tangan 5 Kecepatan\" berhasil dibuat dengan total Rp 450.000,00', 0, '2025-06-05 15:08:26', 'transaction', 72, 9, NULL, 0),
(180, 9, 'fiqri melakukan pembelian untuk item \"Mixer Tangan 5 Kecepatan\" dengan total Rp 450.000,00', 0, '2025-06-05 15:18:23', 'transaction', 73, 5, NULL, 0),
(181, 5, 'Transaksi pembelian untuk item \"Mixer Tangan 5 Kecepatan\" berhasil dibuat dengan total Rp 450.000,00', 0, '2025-06-05 15:18:23', 'transaction', 73, 9, NULL, 0),
(182, 9, 'fiqri melakukan pembelian untuk item \"Mixer Tangan 5 Kecepatan\" dengan total Rp 450.000,00', 0, '2025-06-05 15:19:15', 'transaction', 74, 5, NULL, 0),
(183, 5, 'Transaksi pembelian untuk item \"Mixer Tangan 5 Kecepatan\" berhasil dibuat dengan total Rp 450.000,00', 0, '2025-06-05 15:19:15', 'transaction', 74, 9, NULL, 0),
(184, 9, 'fiqri melakukan pembelian untuk item \"Mixer Tangan 5 Kecepatan\" dengan total Rp 450.000,00', 0, '2025-06-05 15:20:42', 'transaction', 75, 5, NULL, 0),
(185, 5, 'Transaksi pembelian untuk item \"Mixer Tangan 5 Kecepatan\" berhasil dibuat dengan total Rp 450.000,00', 0, '2025-06-05 15:20:42', 'transaction', 75, 9, NULL, 0),
(186, 9, 'fiqri melakukan pembelian untuk item \"Mixer Tangan 5 Kecepatan\" dengan total Rp 450.000,00', 0, '2025-06-05 15:21:09', 'transaction', 76, 5, NULL, 0),
(187, 5, 'Transaksi pembelian untuk item \"Mixer Tangan 5 Kecepatan\" berhasil dibuat dengan total Rp 450.000,00', 0, '2025-06-05 15:21:09', 'transaction', 76, 9, NULL, 0),
(188, 9, 'fiqri melakukan pembelian untuk item \"Mixer Tangan 5 Kecepatan\" dengan total Rp 450.000,00', 0, '2025-06-05 15:24:09', 'transaction', 77, 5, NULL, 0),
(189, 5, 'Transaksi pembelian untuk item \"Mixer Tangan 5 Kecepatan\" berhasil dibuat dengan total Rp 450.000,00', 0, '2025-06-05 15:24:09', 'transaction', 77, 9, NULL, 0),
(190, 9, 'fiqri melakukan pembelian untuk item \"Mixer Tangan 5 Kecepatan\" dengan total Rp 450.000,00', 0, '2025-06-05 15:51:06', 'transaction', 78, 5, NULL, 0),
(191, 5, 'Transaksi pembelian untuk item \"Mixer Tangan 5 Kecepatan\" berhasil dibuat dengan total Rp 450.000,00', 0, '2025-06-05 15:51:06', 'transaction', 78, 9, NULL, 0),
(192, 5, 'Bintang melakukan pembelian untuk item \"Kamera DSLR Canon EOS 2000D Kit 18-55mm\" dengan total Rp 3.500.000,00', 0, '2025-06-06 03:21:04', 'transaction', 79, 9, NULL, 0),
(193, 9, 'Transaksi pembelian untuk item \"Kamera DSLR Canon EOS 2000D Kit 18-55mm\" berhasil dibuat dengan total Rp 3.500.000,00', 0, '2025-06-06 03:21:04', 'transaction', 79, 5, NULL, 0),
(194, 4, 'Bintang melakukan pembelian untuk item \"Lensa Original Camera Digital Profesional Fotografer Hasil HD\" dengan total Rp 150.000,00', 0, '2025-06-06 03:21:33', 'transaction', 80, 9, NULL, 0),
(195, 9, 'Transaksi pembelian untuk item \"Lensa Original Camera Digital Profesional Fotografer Hasil HD\" berhasil dibuat dengan total Rp 150.000,00', 0, '2025-06-06 03:21:33', 'transaction', 80, 4, NULL, 0),
(196, 4, 'Bintang melakukan pembelian untuk item \"Fujifilm Instax Mini 12 Kamera Instan\" dengan total Rp 700.000,00', 0, '2025-06-06 03:22:08', 'transaction', 81, 9, NULL, 0),
(197, 9, 'Transaksi pembelian untuk item \"Fujifilm Instax Mini 12 Kamera Instan\" berhasil dibuat dengan total Rp 700.000,00', 0, '2025-06-06 03:22:08', 'transaction', 81, 4, NULL, 0),
(198, 9, 'yasmin melakukan pembelian untuk item \"Mixer Tangan 5 Kecepatan\" dengan total Rp 450.000,00', 0, '2025-06-07 12:36:10', 'transaction', 82, 12, NULL, 0),
(199, 12, 'Transaksi pembelian untuk item \"Mixer Tangan 5 Kecepatan\" berhasil dibuat dengan total Rp 450.000,00', 0, '2025-06-07 12:36:10', 'transaction', 82, 9, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `item_id` int NOT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `user_id`, `item_id`, `comment`, `created_at`) VALUES
(7, 8, 83, 'bagus', '2025-06-04 06:14:57');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `buyer_id` int NOT NULL,
  `item_id` int NOT NULL,
  `type` enum('rent','buy') NOT NULL,
  `status` enum('pending','ongoing','returned','late','cancelled','completed') NOT NULL DEFAULT 'pending',
  `payment_method` enum('cod') DEFAULT 'cod',
  `total_price` decimal(10,2) DEFAULT NULL,
  `rent_start_date` date DEFAULT NULL,
  `rent_end_date` date DEFAULT NULL,
  `deposit_paid` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `buyer_id`, `item_id`, `type`, `status`, `payment_method`, `total_price`, `rent_start_date`, `rent_end_date`, `deposit_paid`, `created_at`) VALUES
(23, 7, 74, 'buy', 'pending', 'cod', '45000.00', NULL, NULL, '0.00', '2025-06-04 02:27:19'),
(24, 4, 75, 'rent', 'pending', 'cod', '200000.00', '2025-06-14', '2025-06-18', '0.00', '2025-06-04 02:28:56'),
(25, 4, 80, 'buy', 'pending', 'cod', '2500000.00', NULL, NULL, '0.00', '2025-06-04 02:30:22'),
(26, 4, 84, 'rent', 'pending', 'cod', '240000.00', '2025-06-04', '2025-06-16', '0.00', '2025-06-04 02:35:04'),
(27, 7, 1, 'buy', 'pending', 'cod', '500000.00', NULL, NULL, '0.00', '2025-06-04 02:49:41'),
(28, 7, 2, 'buy', 'pending', 'cod', '150000.00', NULL, NULL, '0.00', '2025-06-04 02:51:31'),
(29, 4, 76, 'buy', 'pending', 'cod', '80000.00', NULL, NULL, '0.00', '2025-06-04 02:53:45'),
(30, 4, 78, 'rent', 'pending', 'cod', '25000.00', '2025-06-04', '2025-06-05', '0.00', '2025-06-04 02:54:56'),
(31, 6, 4, 'buy', 'pending', 'cod', '300000.00', NULL, NULL, '0.00', '2025-06-04 02:56:56'),
(32, 6, 5, 'buy', 'pending', 'cod', '400000.00', NULL, NULL, '0.00', '2025-06-04 02:57:30'),
(33, 8, 83, 'rent', 'completed', 'cod', '1050000.00', '2025-06-04', '2025-06-11', '0.00', '2025-06-04 05:20:32'),
(34, 8, 31, 'buy', 'pending', 'cod', '250000.00', NULL, NULL, '0.00', '2025-06-04 10:55:28'),
(35, 8, 56, 'buy', 'pending', 'cod', '85000.00', NULL, NULL, '0.00', '2025-06-04 11:01:18'),
(36, 8, 59, 'buy', 'pending', 'cod', '210000.00', NULL, NULL, '0.00', '2025-06-04 11:01:58'),
(37, 8, 30, 'rent', 'pending', 'cod', '120000.00', '2025-06-04', '2025-06-08', '0.00', '2025-06-04 11:05:18'),
(38, 8, 61, 'rent', 'pending', 'cod', '50000.00', '2025-06-04', '2025-06-05', '0.00', '2025-06-04 11:07:40'),
(39, 8, 64, 'rent', 'pending', 'cod', '180000.00', '2025-06-04', '2025-06-06', '0.00', '2025-06-04 11:37:25'),
(40, 8, 58, 'rent', 'ongoing', 'cod', '140000.00', '2025-06-04', '2025-06-06', '0.00', '2025-06-04 11:48:55'),
(41, 8, 81, 'rent', 'pending', 'cod', '840000.00', '2025-06-04', '2025-06-11', '0.00', '2025-06-04 11:51:42'),
(42, 8, 63, 'buy', 'pending', 'cod', '30000.00', NULL, NULL, '0.00', '2025-06-04 14:29:02'),
(43, 8, 83, 'rent', 'pending', 'cod', '450000.00', '2025-06-04', '2025-06-07', '0.00', '2025-06-04 14:29:56'),
(44, 8, 50, 'buy', 'pending', 'cod', '95000.00', NULL, NULL, '0.00', '2025-06-04 14:48:22'),
(45, 8, 70, 'buy', 'pending', 'cod', '87000.00', NULL, NULL, '0.00', '2025-06-04 14:49:04'),
(46, 8, 43, 'buy', 'pending', 'cod', '50000.00', NULL, NULL, '0.00', '2025-06-04 14:59:43'),
(47, 5, 89, 'buy', 'pending', 'cod', '2000.00', NULL, NULL, '0.00', '2025-06-04 15:04:20'),
(48, 8, 52, 'buy', 'pending', 'cod', '45000.00', NULL, NULL, '0.00', '2025-06-04 15:08:05'),
(49, 8, 77, 'buy', 'pending', 'cod', '45000.00', NULL, NULL, '0.00', '2025-06-04 15:11:54'),
(50, 8, 57, 'buy', 'pending', 'cod', '90000.00', NULL, NULL, '0.00', '2025-06-04 15:12:29'),
(51, 8, 82, 'buy', 'pending', 'cod', '1950000.00', NULL, NULL, '0.00', '2025-06-04 15:21:55'),
(52, 6, 45, 'buy', 'pending', 'cod', '650000.00', NULL, NULL, '0.00', '2025-06-04 16:25:21'),
(53, 6, 12, 'buy', 'pending', 'cod', '135000.00', NULL, NULL, '0.00', '2025-06-04 16:26:37'),
(54, 6, 73, 'buy', 'pending', 'cod', '99000.00', NULL, NULL, '0.00', '2025-06-04 16:27:01'),
(55, 5, 3, 'buy', 'pending', 'cod', '175000.00', NULL, NULL, '0.00', '2025-06-04 16:27:43'),
(56, 9, 36, 'buy', 'pending', 'cod', '55000.00', NULL, NULL, '0.00', '2025-06-04 16:30:32'),
(57, 9, 48, 'buy', 'pending', 'cod', '15000.00', NULL, NULL, '0.00', '2025-06-05 03:07:15'),
(58, 9, 29, 'buy', 'pending', 'cod', '180000.00', NULL, NULL, '0.00', '2025-06-05 03:07:43'),
(59, 9, 37, 'buy', 'pending', 'cod', '70000.00', NULL, NULL, '0.00', '2025-06-05 03:08:02'),
(60, 5, 92, 'buy', 'completed', 'cod', '45000.00', NULL, NULL, '0.00', '2025-06-05 03:51:36'),
(61, 9, 39, 'rent', 'pending', 'cod', '360000.00', '2025-06-05', '2025-06-17', '0.00', '2025-06-05 04:04:15'),
(62, 9, 68, 'buy', 'pending', 'cod', '800000.00', NULL, NULL, '0.00', '2025-06-05 04:18:07'),
(63, 9, 65, 'buy', 'pending', 'cod', '1350000.00', NULL, NULL, '0.00', '2025-06-05 05:06:40'),
(64, 9, 62, 'buy', 'pending', 'cod', '120000.00', NULL, NULL, '0.00', '2025-06-05 05:28:27'),
(65, 5, 103, 'buy', 'pending', 'cod', '45000.00', NULL, NULL, '0.00', '2025-06-05 13:25:51'),
(66, 9, 46, 'buy', 'pending', 'cod', '1700000.00', NULL, NULL, '0.00', '2025-06-05 13:38:23'),
(67, 9, 66, 'buy', 'pending', 'cod', '280000.00', NULL, NULL, '0.00', '2025-06-05 13:41:15'),
(68, 9, 35, 'rent', 'pending', 'cod', '100000.00', '2025-06-05', '2025-06-07', '0.00', '2025-06-05 13:42:27'),
(69, 9, 60, 'buy', 'pending', 'cod', '45000.00', NULL, NULL, '0.00', '2025-06-05 13:55:39'),
(70, 9, 33, 'buy', 'cancelled', 'cod', '60000.00', NULL, NULL, '0.00', '2025-06-05 14:10:47'),
(71, 9, 33, 'buy', 'pending', 'cod', '60000.00', NULL, NULL, '0.00', '2025-06-05 14:11:10'),
(72, 5, 102, 'buy', 'cancelled', 'cod', '450000.00', NULL, NULL, '0.00', '2025-06-05 15:08:26'),
(73, 5, 102, 'buy', 'cancelled', 'cod', '450000.00', NULL, NULL, '0.00', '2025-06-05 15:18:23'),
(74, 5, 102, 'buy', 'cancelled', 'cod', '450000.00', NULL, NULL, '0.00', '2025-06-05 15:19:15'),
(75, 5, 102, 'buy', 'cancelled', 'cod', '450000.00', NULL, NULL, '0.00', '2025-06-05 15:20:42'),
(76, 5, 102, 'buy', 'cancelled', 'cod', '450000.00', NULL, NULL, '0.00', '2025-06-05 15:21:09'),
(77, 5, 102, 'buy', 'cancelled', 'cod', '450000.00', NULL, NULL, '0.00', '2025-06-05 15:24:09'),
(78, 5, 102, 'buy', 'cancelled', 'cod', '450000.00', NULL, NULL, '0.00', '2025-06-05 15:51:06'),
(79, 9, 38, 'buy', 'pending', 'cod', '3500000.00', NULL, NULL, '0.00', '2025-06-06 03:21:04'),
(80, 9, 9, 'buy', 'cancelled', 'cod', '150000.00', NULL, NULL, '0.00', '2025-06-06 03:21:33'),
(81, 9, 10, 'buy', 'pending', 'cod', '700000.00', NULL, NULL, '0.00', '2025-06-06 03:22:07'),
(82, 12, 102, 'buy', 'ongoing', 'cod', '450000.00', NULL, NULL, '0.00', '2025-06-07 12:36:10');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `province_id` int DEFAULT NULL,
  `province_name` varchar(100) DEFAULT NULL,
  `city_id` int DEFAULT NULL,
  `city_name` varchar(100) DEFAULT NULL,
  `hobby` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `push_subscription` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `photo`, `created_at`, `province_id`, `province_name`, `city_id`, `city_name`, `hobby`, `push_subscription`) VALUES
(4, 'Yudi', 'yudi@gmail.com', '$2b$12$mbJ60aAs.XW/Q0QkkzCgmuG3jXOWrXGagJSYB.4ueaaK0DrgfDRVG', NULL, '2025-05-29 01:42:55', 12, 'SUMATERA UTARA', 1275, 'KOTA MEDAN', 'FOTOGRAFI', NULL),
(5, 'fiqri', 'fiqri@gmail.com', '$2b$12$RdQParH6ftkId3aQUbFPIeyGcwUzp26uYfdNHStoTaqEmNxRQMRd6', NULL, '2025-05-29 01:46:49', 12, 'SUMATERA UTARA', 1275, 'KOTA MEDAN', 'FOTOGRAFI', '{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/d_kbB04T0tc:APA91bFSwIKAHAWTWeOpFTRkDHC6wuw1PJLfZZtIlqk9ED69z6QeRqHKLvZQJuqqK1nB02DuNpD5re60WBPq-RUD-Zus7f40LMRy4dyiYmdDY9EDReNCObdU6FdjvVM-L9_YxIjpF9bG\",\"keys\":{\"p256dh\":\"BEvS8RP6gjqEWj+BicVk+vctfEQVFRsKWggj9ClanlSDAVKFRZVKu5Y/+zL5WJt/a1NcGU/tXWGCsTZd3trN6RY=\",\"auth\":\"YMh+kevl5l3AaYXMtV5GdA==\"}}'),
(6, 'yoga', 'yoga@gmail.com', '$2b$12$I9dZSiqriq5/MlbhabkiZeB5ha1gZlAE2/79NwaMxbjCsUyZryC8u', NULL, '2025-05-30 10:46:10', 51, 'BALI', 5101, 'KABUPATEN JEMBRANA', 'FOTOGRAFI', '{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/caVMXK9NQ_Q:APA91bEdEESA5TB-2iNUy09FOvyP6f8PmmX_AzHVprUd1Q9vfWRKbu2FdopLW6PDWgOuWdubUu4ATK4mgvMc3FtU_K2G_kEpdtqUgIdm7H1n1UlfsnWBxSqCdgtwylBJIAd6Q5PzMGcz\",\"keys\":{\"p256dh\":\"BEwz6DulHDqPgrgQS7Lo01dddpk86QCtF3T7QM/ziVhhfAFK0GO3zWW575ML3wEZpQ8NrS+2i8WA9sCzr1SDvjs=\",\"auth\":\"WM53PqfdWZmBi8TnPYPrpg==\"}}'),
(7, 'yudii', 'yudii@gmail.com', '$2b$12$EIA4/lZw7cxjBIjoLQJlgOSXQbX89MI2d6fAWN.l2B50zefS.Zgum', NULL, '2025-06-01 06:10:35', 12, 'SUMATERA UTARA', 1276, 'KOTA BINJAI', 'MEMBACA', NULL),
(8, 'yogi', 'yogi@gmail.com', '$2b$12$4NrS9mUmYQAsQgk/VxvPFumwNVAszmMbEWcmpsQt2N8yMY9Omc79O', NULL, '2025-06-01 08:35:48', 12, 'SUMATERA UTARA', 1277, 'KOTA PADANGSIDIMPUAN', 'MEMBACA', NULL),
(9, 'Bintang', 'bintang@gmail.com', '$2b$12$vjXGyuMLbq2kSOgBe2SrWOCjMwApHqBeFaSWFG3i8mQkb69lLHLn.', NULL, '2025-06-04 16:30:22', 12, 'SUMATERA UTARA', 1275, 'KOTA MEDAN', 'MEMBACA', '{\"endpoint\":\"https://wns2-pn1p.notify.windows.com/w/?token=BQYAAAAbEctbbRj8ey4T9vk7pmxqEyuHerpQ0iT6tnu5vOvZjl%2bc7UU2SU2LBeO%2b5Nl1i13qu1LDECFOS3hgBQx43nFPxOOYek%2fLlJEm3L9yoyJWoK7GLpZ99EurpTuMJFEUidXXwnD3th%2bZjhEUd%2bHuzb2pz%2bUBcHAmy3YUmBUVCUR%2fUs44IDwQUMfYdOigBifwmNkgFJ9EFy2caNl%2bVBCfIltVjC6vpk5GAcxtrR9xbCM%2bGBPUGXz6nM30py4Nt2zaY8jgc5AEL0T1eeBdPncrl9358u4w0YK%2fB95PtUgTgN2um9w%2fILX%2fB8KI7e%2fhq32U%2fVYNmA1tkzAMujwDQqz%2bZnjE\",\"keys\":{\"p256dh\":\"BJj1rs1uFOOlxwBlmdlp/GS1EV012Jw2x44DCJGWjYN1TmJdz+tykrBkh232ce0hLbOysKlpYyopj2MVIGc9gvA=\",\"auth\":\"jAZNKUwke6H2MEXWWNE7LA==\"}}'),
(11, 'budi', 'budi@gmail.com', '$2b$12$V.TSC04DkF971yuoggWTMuUbB6WRZz8Jjb44E3iAdU4u./NAwqQ3i', NULL, '2025-06-05 18:39:38', 31, 'DKI JAKARTA', 3171, 'KOTA JAKARTA SELATAN', 'MASAK', '{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/dLWQAw51JLA:APA91bFyJ8bTIF-Zop6ACLeVwvvMqOU7-hIiNiWaRglxzXhd2bvP6dzFtTACyVsM3SYrKKuueEhDwAQQJYD7KRuvVuPf8ITMdYwP_1Mna0UhcBTIKbib9j0BDbdfL-5TmfJhpyJZUuT-\",\"keys\":{\"p256dh\":\"BLqbusbdIdS9tUJ1/GNW//a7b/bCy/kjz27IGrzSqKjux1hWRYJvyDPMcaDdZ/2QolIFdCVmY053yJkAIbfXROk=\",\"auth\":\"MKCS/EpVQQvO2S7pWpYgBQ==\"}}'),
(12, 'yasmin', 'yasmin@gmail.com', '$2b$12$8nLswZuKOujxPizYR2.NN.nRbsV3eSvCyqtdIhxZ7dgkjIMt3Z/yi', NULL, '2025-06-06 15:25:58', 12, 'SUMATERA UTARA', 1275, 'KOTA MEDAN', 'MASAK', '{\"endpoint\":\"https://fcm.googleapis.com/fcm/send/dy4CzQiefag:APA91bFBRdnnQX63RIUB4RZSayv65Axu1DbkWJDJuvEhNxOuuO_bhoRcoX0NCz7VgxDxsLAo8jBNff5A2CyQseC8uMVZRg5hcXVnZvgnpaY38ErS-wy9YqDI-kRjmdQSZ2jeYQEEuHbk\",\"keys\":{\"p256dh\":\"BLUpV2JaYuSYFU8iRqkFq/jqKk0tyvMoqNKsJtUQqjVScIi5ARyApBm6UThcTsKco8ZsFXxF+JkzjgeqgwtNk9Q=\",\"auth\":\"SJzLEtRD7NrivONN2Z8ttQ==\"}}');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `idx_items_coordinates` (`latitude`,`longitude`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`),
  ADD KEY `item_id` (`item_id`),
  ADD KEY `transaction_id` (`transaction_id`);

--
-- Indexes for table `messages_community`
--
ALTER TABLE `messages_community`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Indexes for table `messages_hobby`
--
ALTER TABLE `messages_hobby`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_hobby` (`hobby`),
  ADD KEY `idx_sender_id` (`sender_id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_type` (`user_id`,`type`),
  ADD KEY `idx_scheduled_date` (`scheduled_date`),
  ADD KEY `idx_transaction` (`transaction_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `buyer_id` (`buyer_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `messages_community`
--
ALTER TABLE `messages_community`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `messages_hobby`
--
ALTER TABLE `messages_hobby`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=200;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `items_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`),
  ADD CONSTRAINT `messages_ibfk_4` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`);

--
-- Constraints for table `messages_community`
--
ALTER TABLE `messages_community`
  ADD CONSTRAINT `messages_community_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `messages_hobby`
--
ALTER TABLE `messages_hobby`
  ADD CONSTRAINT `messages_hobby_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`);

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
