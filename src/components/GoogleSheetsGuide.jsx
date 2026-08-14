import React, { useState } from 'react';
import { FileSpreadsheet, Copy, Check, ExternalLink, Link2, AlertCircle } from 'lucide-react';

const SCRIPT_CODE = `/**
 * GOOGLE APPS SCRIPT UNTUK PENDAFTARAN LOMBA 17-AN RT 04
 * COPAS KODE INI KE: Google Sheets -> Ekstensi -> Apps Script
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create Header jika sheet masih kosong
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

    sheet.appendRow([
      timestamp, 
      data.namaAnak || "", 
      data.usiaKelas || "", 
      data.kategoriName || "", 
      Array.isArray(data.lombaTerpilih) ? data.lombaTerpilih.join(", ") : (data.lombaTerpilih || ""), 
      data.namaOrtu || "", 
      data.noWa || "", 
      data.alamat || "", 
      data.catatan || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({ 
      result: "success", 
      message: "Data pendaftaran berhasil disimpan!",
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
}`;

export default function GoogleSheetsGuide({ scriptUrl, setScriptUrl }) {
  const [copied, setCopied] = useState(false);
  const [inputUrl, setInputUrl] = useState(scriptUrl || '');
  const [saveStatus, setSaveStatus] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveUrl = (e) => {
    e.preventDefault();
    const cleanUrl = inputUrl.trim();
    if (!cleanUrl) {
      localStorage.removeItem('lomba_sheets_url');
      setScriptUrl('');
      setSaveStatus('URL dikosongkan. Formulir akan berjalan dalam mode Simulasi/Demo.');
      return;
    }

    if (!cleanUrl.includes('script.google.com')) {
      alert('Mohon masukkan URL Google Apps Script yang valid (berakhiran /exec)');
      return;
    }

    localStorage.setItem('lomba_sheets_url', cleanUrl);
    setScriptUrl(cleanUrl);
    setSaveStatus('✅ URL Web App Google Sheets berhasil disimpan!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div style={{ maxWidth: '850px', margin: '30px auto', padding: '0 20px' }}>
      <div style={{ background: '#ffffff', borderRadius: '20px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
        
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileSpreadsheet color="#0284c7" size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              Panduan Menghubungkan Google Sheets
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Ikuti 4 langkah mudah berikut agar data pendaftaran langsung masuk ke Excel Google Sheets Anda.
            </p>
          </div>
        </div>

        {/* Input URL Section */}
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1.5px solid #cbd5e1', marginBottom: '28px' }}>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', marginBottom: '6px' }}>
            🔗 URL Aplikasi Web Google Apps Script Anda:
          </label>
          <form onSubmit={handleSaveUrl} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              style={{
                flex: 1,
                minWidth: '280px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                fontFamily: 'monospace'
              }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '12px 20px', fontSize: '0.9rem' }}>
              Simpan URL
            </button>
          </form>
          {saveStatus && (
            <p style={{ marginTop: '10px', fontSize: '0.85rem', fontWeight: 600, color: '#0284c7' }}>
              {saveStatus}
            </p>
          )}
          {!scriptUrl && (
            <p style={{ marginTop: '8px', fontSize: '0.8rem', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertCircle size={14} /> Belum ada URL tersimpan. Saat ini pendaftaran menggunakan <strong>Mode Simulasi/Demo</strong>.
            </p>
          )}
        </div>

        {/* Steps List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Step 1 */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#d90429', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0 }}>
              1
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontWeight: 700, color: '#0f172a' }}>Buat Google Sheets Baru</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
                Buka <a href="https://sheets.new" target="_blank" rel="noopener noreferrer" style={{ color: '#0284c7', fontWeight: 600, textDecoration: 'none' }}>sheets.new <ExternalLink size={12} /></a> dan beri nama spreadsheet Anda (contoh: <strong>Data Pendaftaran 17an RT 04</strong>).
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#d90429', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0 }}>
              2
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontWeight: 700, color: '#0f172a' }}>Buka Script Editor & Paste Kode Berikut:</h4>
                <button
                  onClick={handleCopy}
                  className="btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem', gap: '6px' }}
                >
                  {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                  {copied ? 'Tersalin!' : 'Salin Kode Script'}
                </button>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>
                Klik menu <strong>Ekstensi</strong> di Google Sheets -&gt; <strong>Apps Script</strong>. Hapus semua kode bawaan, lalu tempel kode berikut:
              </p>

              <pre style={{
                background: '#1e293b',
                color: '#e2e8f0',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                maxHeight: '220px',
                overflowY: 'auto',
                fontFamily: 'Consolas, Monaco, monospace'
              }}>
                {SCRIPT_CODE}
              </pre>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#d90429', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0 }}>
              3
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontWeight: 700, color: '#0f172a' }}>Deploy Sebagai Aplikasi Web</h4>
              <ul style={{ fontSize: '0.85rem', color: '#475569', marginTop: '6px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Klik tombol <strong>Deploy / Terapkan</strong> (Warna biru kanan atas) -&gt; Pilih <strong>New deployment / Terapkan Baru</strong>.</li>
                <li>Pilih jenis <strong>Aplikasi Web / Web App</strong>.</li>
                <li>Ubah <i>Who has access / Yang memiliki akses</i> menjadi: <strong style={{ color: '#d90429' }}>"Siapa saja" / "Anyone"</strong>. (Sangat Penting!).</li>
                <li>Klik <strong>Deploy</strong> dan berikan izin (*Authorize access*).</li>
              </ul>
            </div>
          </div>

          {/* Step 4 */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#d90429', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0 }}>
              4
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontWeight: 700, color: '#0f172a' }}>Salin & Tempel URL Web App ke Form Di Atas</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
                Salin URL Web App (berakhiran <code>/exec</code>) lalu tempelkan pada kolom input di bagian atas halaman ini, kemudian tekan <strong>Simpan URL</strong>. Selesai!
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
