/**
 * GOOGLE APPS SCRIPT UNTUK PENDAFTARAN LOMBA 17-AN RT 04
 * 
 * LEGKAP DENGAN HANDLING CORS & AUTOCREATE HEADER SPREADSHEET
 * 
 * CARA PAKAI:
 * 1. Buka Google Sheets Anda (misal: "Data Pendaftaran Lomba 17-an RT 04")
 * 2. Klik menu "Ekstensi" -> "Apps Script"
 * 3. Hapus semua kode default, lalu COPAS seluruh isi file ini
 * 4. Klik tombol "Simpan" (ikon disket)
 * 5. Klik tombol "Terapkan" / "Deploy" (Warna Biru di kanan atas) -> "Terapkan Baru" / "New deployment"
 * 6. Pilih Jenis: "Aplikasi Web" / "Web App"
 * 7. Deskripsi: "API Pendaftaran 17-an"
 * 8. Jalankan sebagai / Execute as: "Saya" / "Me"
 * 9. Yang memiliki akses / Who has access: "Siapa saja" / "Anyone"  <-- PENTING!
 * 10. Klik "Terapkan" / "Deploy", izinkan akses akun Google Anda.
 * 11. Salin "URL Aplikasi Web" (URL berakhiran /exec) dan tempel di website React Anda!
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Jika sheet masih kosong, buat Header Kolom otomatis
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Waktu Pendaftaran", 
        "Nama Anak", 
        "Usia / Kelas", 
        "Kategori Lomba", 
        "Lomba Yang Diikuti", 
        "Nama Orang Tua / Wali", 
        "No. WhatsApp Ortu", 
        "Alamat / Blok RT 04", 
        "Catatan Tambahan"
      ]);
      sheet.getRange(1, 1, 1, 9).setFontWeight("bold").setBackground("#c8102e").setFontColor("#ffffff");
    }

    var data = JSON.parse(e.postData.contents);
    
    var timestamp = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
    var namaAnak = data.namaAnak || "";
    var usiaKelas = data.usiaKelas || "";
    var kategori = data.kategoriName || "";
    var daftarLomba = Array.isArray(data.lombaTerpilih) ? data.lombaTerpilih.join(", ") : (data.lombaTerpilih || "");
    var namaOrtu = data.namaOrtu || "";
    var noWa = data.noWa || "";
    var alamat = data.alamat || "";
    var catatan = data.catatan || "";

    sheet.appendRow([
      timestamp, 
      namaAnak, 
      usiaKelas, 
      kategori, 
      daftarLomba, 
      namaOrtu, 
      noWa, 
      alamat, 
      catatan
    ]);

    return ContentService.createTextOutput(JSON.stringify({ 
      result: "success", 
      message: "Data pendaftaran berhasil disimpan ke Google Sheets!",
      timestamp: timestamp
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      result: "error", 
      message: error.toString() 
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
  } finally {
    lock.releaseLock();
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
