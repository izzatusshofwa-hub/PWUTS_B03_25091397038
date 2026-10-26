# Website SD Islam Al-Hikmah

Website SD Islam Al-Hikmah merupakan website informasi sekolah yang digunakan untuk menampilkan dan mengelola data prestasi siswa. Website ini dibuat menggunakan HTML, CSS, dan JavaScript dengan penyimpanan data menggunakan `localStorage` pada browser.

## Fitur Website

1. **Beranda**  
   Menampilkan informasi sekolah, statistik prestasi, dan daftar prestasi terbaru.

2. **Daftar Prestasi**  
   Menampilkan data prestasi siswa serta menyediakan fitur filter berdasarkan tingkat dan tahun.

3. **Tambah Prestasi**  
   Memungkinkan pengguna menambahkan data prestasi berupa nama prestasi, tingkat, tahun, deskripsi, dan gambar opsional.

4. **Edit Prestasi**  
   Memungkinkan pengguna memperbarui informasi prestasi yang telah tersimpan, termasuk mengganti gambar jika diperlukan.

5. **Hapus Prestasi**  
   Memungkinkan pengguna menghapus data prestasi yang tidak diperlukan.

6. **Validasi Formulir**  
   Memeriksa kelengkapan data dan validitas tahun sebelum data diproses.

7. **Penyimpanan Data**  
   Data prestasi disimpan menggunakan `localStorage` pada browser sehingga tidak memerlukan database MySQL.

## Teknologi yang Digunakan

- HTML5 untuk struktur halaman website.
- CSS3 untuk desain dan tata letak.
- JavaScript untuk interaksi, validasi, dan pengelolaan data.
- `localStorage` untuk menyimpan data prestasi pada browser.
- Visual Studio Code sebagai editor kode.
- XAMPP sebagai lingkungan lokal untuk menjalankan website melalui localhost.

## Struktur Folder

```text
PWUTS_B03_25091397038/
│
├── css/
│   └── style.css
│
├── images/
│   ├── logo_sekolah.png
│   ├── gambar 1.png
│   ├── gambar 2.png
│   ├── gambar 3.png
│   ├── gambar 4.png
│   ├── gambar 5.png
│   └── gambar 6.png
│
├── js/
│   └── app.js
│
├── index.html
├── prestasi.html
├── tambah-prestasi.html
├── edit-prestasi.html
└── README.md
```

## Cara Menjalankan Website

1. Pastikan XAMPP sudah terpasang pada komputer.
2. Letakkan folder proyek `PWUTS_B03_25091397038` di dalam folder `htdocs`.
3. Buka XAMPP Control Panel dan jalankan Apache.
4. Buka browser, kemudian akses alamat berikut:

   `http://localhost/PWUTS_B03_25091397038/`

5. Website akan menampilkan halaman beranda SD Islam Al-Hikmah.
6. Gunakan menu navigasi untuk membuka halaman daftar prestasi, tambah prestasi, dan edit prestasi.

## Cara Mengelola Data Prestasi

1. Buka menu **Tambah Prestasi**.
2. Isi nama prestasi, tingkat prestasi, tahun, dan deskripsi.
3. Tambahkan gambar jika diperlukan.
4. Klik tombol **Simpan Prestasi**.
5. Buka menu **Prestasi** untuk melihat data yang telah ditambahkan.
6. Gunakan tombol **Edit** untuk memperbarui data atau tombol **Hapus** untuk menghapus data.

## Penyimpanan Data

Website menggunakan `localStorage` untuk menyimpan data prestasi pada browser yang digunakan. Data tidak disimpan ke database MySQL atau server penyimpanan data.

Karena penyimpanan dilakukan secara lokal, data dapat berbeda antara browser atau perangkat. Menghapus data situs pada browser juga dapat menghilangkan data prestasi yang tersimpan.

## Tujuan Website

Website ini dikembangkan untuk mempermudah penyajian informasi prestasi siswa SD Islam Al-Hikmah serta menyediakan antarmuka sederhana untuk menambah, melihat, memperbarui, dan menghapus data prestasi.

---

**Nama Proyek:** Website Informasi Prestasi SD Islam Al-Hikmah  
**Teknologi:** HTML, CSS, JavaScript  
**Penyimpanan:** `localStorage`  
**Lingkungan Pengembangan:** Visual Studio Code dan XAMPP
