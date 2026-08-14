import React from 'react';
import { ShieldCheck, CheckCircle2, MessageSquare, PlusCircle, Calendar, Home, AlertCircle } from 'lucide-react';

const PANITIA_WA_NUMBER = '62895705290500';

export default function AlreadySubmittedView({ data, onRegisterNew }) {
  if (!data) return null;

  const children = data.children || (data.namaAnak ? [data] : []);
  const parent = data.parentData || {
    namaOrtu: data.namaOrtu,
    noWa: data.noWa,
    alamat: data.alamat
  };

  // Format WhatsApp message for committee
  const generateWAUrl = () => {
    let childrenText = '';
    children.forEach((c, idx) => {
      const lombaStr = Array.isArray(c.lombaTerpilih) ? c.lombaTerpilih.join(', ') : c.lombaTerpilih;
      childrenText += `
*Anak/Peserta Ke-${idx + 1}:* ${c.namaAnak}
• *Kategori:* ${c.kategoriName} (${c.usiaKelas})
• *Lomba:* ${lombaStr}
• *Jadwal:* ${c.schedule}
`;
    });

    const text = `Halo Panitia 17-an RT 04, saya pendaftar via Web Pendaftaran:

📌 *DATA PENDAFTARAN LOMBA 17-AN (${children.length} PESERTA)*
${childrenText}
👤 *Nama Ortu/Penanggung Jawab:* ${parent.namaOrtu}
📱 *No. WA:* ${parent.noWa}
🏠 *Alamat:* ${parent.alamat}

Mohon konfirmasinya kak. Terima kasih! 🇮🇩`;

    return `https://api.whatsapp.com/send?phone=${PANITIA_WA_NUMBER}&text=${encodeURIComponent(text)}`;
  };

  return (
    <div style={{ maxWidth: '650px', margin: '30px auto', padding: '0 16px' }} className="animate-fade-in">
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        padding: 'clamp(20px, 4vw, 32px)',
        border: '1px solid #e2e8f0',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)'
      }}>

        {/* Protected Banner */}
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#dcfce7',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <ShieldCheck size={26} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#14532d', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Anda Sudah Mendaftar! <CheckCircle2 size={18} color="#16a34a" />
            </div>
            <p style={{ fontSize: '0.8rem', color: '#15803d', marginTop: '2px' }}>
              Sistem telah mengunci pendaftaran Anda untuk mencegah pengisian ganda. Data telah tersimpan aman di Google Sheets.
            </p>
          </div>
        </div>

        {/* Digital Receipt Summary */}
        <div style={{
          background: 'linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)',
          borderRadius: '18px',
          border: '1.5px solid #ffe4e6',
          padding: '20px',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #fecdd3', paddingBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#be123c', letterSpacing: '0.5px' }}>
              🇮🇩 BUKTI PENDAFTARAN TERDAFTAR
            </span>
            <span style={{ fontSize: '0.75rem', color: '#881337', fontWeight: 600 }}>
              RT 04 / RW 12
            </span>
          </div>

          {/* Children List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {children.map((c, idx) => (
              <div key={idx} style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '12px', border: '1px solid #fecdd3' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                  <span style={{ background: '#d90429', color: '#fff', fontSize: '0.75rem', width: '20px', height: '20px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    {idx + 1}
                  </span>
                  {c.namaAnak}
                </div>
                
                <div style={{ marginTop: '6px', fontSize: '0.82rem', color: '#475569' }}>
                  <strong>Kategori:</strong> <span style={{ color: '#be123c', fontWeight: 700 }}>{c.kategoriName}</span> ({c.usiaKelas})
                </div>
                
                <div style={{ marginTop: '2px', fontSize: '0.8rem', color: '#64748b' }}>
                  <strong>Lomba:</strong> {Array.isArray(c.lombaTerpilih) ? c.lombaTerpilih.join(', ') : c.lombaTerpilih}
                </div>

                <div style={{ marginTop: '4px', fontSize: '0.75rem', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} /> {c.schedule}
                </div>
              </div>
            ))}
          </div>

          {/* Parent & Address Summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderTop: '1px dashed #fecdd3', paddingTop: '12px' }}>
            <Home size={18} color="#d90429" style={{ shrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Penanggung Jawab / Alamat</div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                {parent.namaOrtu} ({parent.noWa}) - Blok {parent.alamat}
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <a
            href={generateWAUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
            style={{ width: '100%' }}
          >
            <MessageSquare size={20} />
            Kirim Konfirmasi Ulang Ke WA Panitia
          </a>

          <button
            onClick={onRegisterNew}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <PlusCircle size={18} />
            Tambah Pendaftaran Peserta Baru
          </button>
        </div>

      </div>
    </div>
  );
}
