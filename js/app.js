
// =====================================
// APLIKASI PRESTASI SEKOLAH
// HTML, CSS, JAVASCRIPT (TANPA PHP)
// =====================================

const STORAGE_KEY = "alhikmah_prestasi_v1";
const BATAS_GAMBAR = 2 * 1024 * 1024;

// Mengambil data dari localStorage
function ambilData() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
        return [];
    }
}

 // Menyimpan data ke localStorage
function simpanData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error("Gagal menyimpan data:", error);

        if (
            error.name === "QuotaExceededError" ||
            error.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
            error.code === 22 ||
            error.code === 1014
        ) {
            alert(
                "Penyimpanan browser penuh. " +
                "Kurangi ukuran gambar atau gunakan gambar yang lebih kecil."
            );
        } else {
            alert(
                "Data gagal disimpan. Silakan periksa Console browser " +
                "untuk melihat penyebabnya."
            );
        }

        return false;
    }
}


// Membuat ID unik
function buatID() {
    return Date.now().toString() + Math.random().toString(16).slice(2);
}

// Mencegah teks pengguna dibaca sebagai HTML
function aman(teks) {
    return String(teks ?? "").replace(/[&<>"']/g, karakter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[karakter]);
}

// Membaca gambar yang dipilih

function bacaGambar(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve("");
            return;
        }

        if (!file.type.startsWith("image/")) {
            reject(new Error("File harus berupa gambar."));
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {
            const gambar = new Image();

            gambar.onload = function () {
                const canvas = document.createElement("canvas");

                // Batasi dimensi gambar agar lebih hemat penyimpanan
                const batas = 800;
                const skala = Math.min(
                    1,
                    batas / Math.max(gambar.width, gambar.height)
                );

                canvas.width = Math.round(gambar.width * skala);
                canvas.height = Math.round(gambar.height * skala);

                const ctx = canvas.getContext("2d");

                // Latar putih agar gambar JPEG tidak menjadi hitam
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.drawImage(
                    gambar,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                // Kompres gambar menjadi JPEG
                resolve(canvas.toDataURL("image/jpeg", 0.6));
            };

            gambar.onerror = function () {
                reject(new Error("Gambar tidak dapat dibaca."));
            };

            gambar.src = event.target.result;
        };

        reader.onerror = function () {
            reject(new Error("Gagal membaca file gambar."));
        };

        reader.readAsDataURL(file);
    });
}


// Membuat tampilan kartu prestasi
function kartuPrestasi(item, tampilkanTombol = false) {
    const gambar = item.gambar
        ? `<img class="card-image" src="${item.gambar}" alt="Gambar prestasi">`
        : `<div class="image-placeholder">🏆</div>`;

    return `
        <article class="prestasi-card">
            ${gambar}

            <div class="card-body">
                <div class="card-badges">
                    <span class="pill">${aman(item.tingkat)}</span>
                    <span class="pill year">${aman(item.tahun)}</span>
                </div>

                <h3>${aman(item.nama)}</h3>
                <p>${aman(item.deskripsi)}</p>

                ${tampilkanTombol ? `
                    <div class="card-actions">
                        <a class="button button-small"
                           href="edit-prestasi.html?id=${encodeURIComponent(item.id)}">
                           Edit
                        </a>

                        <button class="button button-small button-danger"
                                type="button"
                                data-hapus="${aman(item.id)}">
                            Hapus
                        </button>
                    </div>
                ` : ""}
            </div>
        </article>
    `;
}

// =====================================
// BERANDA
// =====================================

function tampilkanBeranda() {
    const wadah = document.getElementById("recentPrestasi");

    if (!wadah) return;

    const data = ambilData().sort(
        (a, b) => Number(b.tahun) - Number(a.tahun)
    );

    document.getElementById("totalPrestasi").textContent = data.length;

    document.getElementById("totalTingkat").textContent =
        new Set(data.map(item => item.tingkat)).size;

    document.getElementById("tahunTerbaru").textContent =
        data.length
            ? Math.max(...data.map(item => Number(item.tahun)))
            : "—";

    wadah.innerHTML = data.length
        ? data.slice(0, 3).map(item => kartuPrestasi(item)).join("")
        : `<p class="empty-state">
             Belum ada prestasi. Silakan tambahkan data terlebih dahulu.
           </p>`;
}

// =====================================
// DAFTAR, FILTER, DAN HAPUS PRESTASI
// =====================================

function tampilkanDaftar() {
    const wadah = document.getElementById("daftarPrestasi");

    if (!wadah) return;

    const data = ambilData();

    const filterTingkat = document.getElementById("filterTingkat");
    const filterTahun = document.getElementById("filterTahun");

    const tingkatDipilih = filterTingkat.value;
    const tahunDipilih = filterTahun.value;

    const tingkat = [...new Set(data.map(item => item.tingkat))];
    const tahun = [...new Set(data.map(item => String(item.tahun)))]
        .sort((a, b) => Number(b) - Number(a));

    filterTingkat.innerHTML =
        `<option value="">Semua Tingkat</option>` +
        tingkat.map(item =>
            `<option value="${aman(item)}">${aman(item)}</option>`
        ).join("");

    filterTahun.innerHTML =
        `<option value="">Semua Tahun</option>` +
        tahun.map(item =>
            `<option value="${aman(item)}">${aman(item)}</option>`
        ).join("");

    filterTingkat.value = tingkat.includes(tingkatDipilih)
        ? tingkatDipilih : "";

    filterTahun.value = tahun.includes(tahunDipilih)
        ? tahunDipilih : "";

    const hasil = data
        .filter(item =>
            (!filterTingkat.value ||
                item.tingkat === filterTingkat.value) &&
            (!filterTahun.value ||
                String(item.tahun) === filterTahun.value)
        )
        .sort((a, b) => Number(b.tahun) - Number(a.tahun));

    wadah.innerHTML = hasil
        .map(item => kartuPrestasi(item, true))
        .join("");

    document.getElementById("jumlahHasil").textContent =
        hasil.length + " prestasi";

    document.getElementById("pesanKosong").hidden =
        hasil.length > 0;
}

function siapkanDaftar() {
    const wadah = document.getElementById("daftarPrestasi");

    if (!wadah) return;

    document.getElementById("filterTingkat")
        .addEventListener("change", tampilkanDaftar);

    document.getElementById("filterTahun")
        .addEventListener("change", tampilkanDaftar);

    document.getElementById("resetFilter")
        .addEventListener("click", () => {
            document.getElementById("filterTingkat").value = "";
            document.getElementById("filterTahun").value = "";
            tampilkanDaftar();
        });

    wadah.addEventListener("click", event => {
        const tombol = event.target.closest("[data-hapus]");

        if (!tombol) return;

        const id = tombol.dataset.hapus;
        const data = ambilData();
        const item = data.find(prestasi => prestasi.id === id);

        if (!item) return;

        if (confirm(`Yakin ingin menghapus "${item.nama}"?`)) {
            const dataBaru = data.filter(
                prestasi => prestasi.id !== id
            );

            if (simpanData(dataBaru)) {
                tampilkanDaftar();
            }
        }
    });

    tampilkanDaftar();
}

// =====================================
// PREVIEW GAMBAR
// =====================================

function siapkanPreview() {
    const input = document.getElementById("gambar");
    const wadah = document.getElementById("previewWrap");
    const gambar = document.getElementById("previewGambar");

    if (!input || !wadah || !gambar) return;

    input.addEventListener("change", async () => {
        const file = input.files[0];

        if (!file) {
            wadah.hidden = true;
            return;
        }

        try {
            gambar.src = await bacaGambar(file);
            wadah.hidden = false;
        } catch (error) {
            alert(error.message);
            input.value = "";
            wadah.hidden = true;
        }
    });
}

// =====================================
// TAMBAH PRESTASI
// =====================================

function siapkanFormTambah() {
    const form = document.getElementById("formPrestasi");

    if (!form) return;

    document.getElementById("tahun").value =
        new Date().getFullYear();

    form.addEventListener("submit", async event => {
        event.preventDefault();

        const pesan = document.getElementById("formMessage");
        pesan.textContent = "";
        pesan.classList.remove("error");

        const nama = document.getElementById("namaPrestasi")
            .value.trim();

        const tingkat = document.getElementById("tingkat").value;
        const tahun = Number(document.getElementById("tahun").value);

        const deskripsi = document.getElementById("deskripsi")
            .value.trim();

        const file = document.getElementById("gambar").files[0];

        if (!nama || !tingkat || !tahun || !deskripsi) {
            pesan.textContent = "Lengkapi semua kolom wajib.";
            pesan.classList.add("error");
            return;
        }

        if (tahun < 2000 || tahun > 2100) {
            pesan.textContent = "Tahun harus antara 2000 dan 2100.";
            pesan.classList.add("error");
            return;
        }

        try {
            const gambar = await bacaGambar(file);

            const data = ambilData();

            data.push({
                id: buatID(),
                nama,
                tingkat,
                tahun,
                deskripsi,
                gambar,
                dibuat: new Date().toISOString()
            });

            if (simpanData(data)) {
                window.location.href = "prestasi.html";
            }
        } catch (error) {
            pesan.textContent = error.message;
            pesan.classList.add("error");
        }
    });
}

// =====================================
// EDIT PRESTASI
// =====================================

function siapkanFormEdit() {
    const form = document.getElementById("formEditPrestasi");

    if (!form) return;

    const id = new URLSearchParams(window.location.search).get("id");
    const data = ambilData();
    const item = data.find(prestasi => prestasi.id === id);

    const pesan = document.getElementById("formMessage");

    if (!item) {
        form.hidden = true;
        pesan.textContent =
            "Data tidak ditemukan. Kembali ke daftar dan pilih Edit.";
        pesan.classList.add("error");
        return;
    }

    document.getElementById("idPrestasi").value = item.id;
    document.getElementById("namaPrestasi").value = item.nama;
    document.getElementById("tingkat").value = item.tingkat;
    document.getElementById("tahun").value = item.tahun;
    document.getElementById("deskripsi").value = item.deskripsi;

    if (item.gambar) {
        document.getElementById("gambarSaatIni").src = item.gambar;
        document.getElementById("gambarSaatIniWrap").hidden = false;
    }

    form.addEventListener("submit", async event => {
        event.preventDefault();

        pesan.textContent = "";
        pesan.classList.remove("error");

        const nama = document.getElementById("namaPrestasi")
            .value.trim();

        const tingkat = document.getElementById("tingkat").value;
        const tahun = Number(document.getElementById("tahun").value);

        const deskripsi = document.getElementById("deskripsi")
            .value.trim();

        const file = document.getElementById("gambar").files[0];

        if (!nama || !tingkat || !tahun || !deskripsi) {
            pesan.textContent = "Lengkapi semua kolom wajib.";
            pesan.classList.add("error");
            return;
        }

        if (tahun < 2000 || tahun > 2100) {
            pesan.textContent = "Tahun harus antara 2000 dan 2100.";
            pesan.classList.add("error");
            return;
        }

        try {
            const gambarBaru = file
                ? await bacaGambar(file)
                : item.gambar;

            const dataTerbaru = ambilData();
            const index = dataTerbaru.findIndex(
                prestasi => prestasi.id === id
            );

            if (index === -1) {
                throw new Error("Data prestasi tidak ditemukan.");
            }

            dataTerbaru[index] = {
                ...dataTerbaru[index],
                nama,
                tingkat,
                tahun,
                deskripsi,
                gambar: gambarBaru,
                diperbarui: new Date().toISOString()
            };

            if (simpanData(dataTerbaru)) {
                window.location.href = "prestasi.html";
            }
        } catch (error) {
            pesan.textContent = error.message;
            pesan.classList.add("error");
        }
    });
}

// =====================================
// JALANKAN APLIKASI
// =====================================

document.addEventListener("DOMContentLoaded", () => {
    tampilkanBeranda();
    siapkanDaftar();
    siapkanPreview();
    siapkanFormTambah();
    siapkanFormEdit();
});
