import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageSquare, PlusCircle, Calendar, Home } from 'lucide-react';

const PANITIA_WA_NUMBER = '62895705290500';

export default function SuccessModal({ data, onClose, onRegisterNew }) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.55 }
      });
    } catch (e) {
      console.log('Confetti failed to run', e);
    }
  }, []);

  if (!data) return null;

  const children = data.children || (data.namaAnak ? [data] : []);
  const parent = data.parentData || {
    namaOrtu: data.namaOrtu,
    noWa: data.noWa,
    alamat: data.alamat
  };

  // Format WhatsApp message for committee (directed to 0895705290500)
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
    <div className="modal-overlay animate-fade-in">
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        maxWidth: '540px',
        width: '100%',
        maxHeight: '85vh',
        overflowY: 'auto',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
        border: '1px solid #f1f5f9',
        padding: 'clamp(16px, 4vw, 28px)'
      }}>
        
        {/* Success Header */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#dcfce7',
            color: '#16a34a',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px'
          }}>
            <CheckCircle2 size={32} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Pendaftaran Berhasil! 🎉
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
            Sebanyak <strong>{children.length} Peserta</strong> telah terdaftar di Google Sheets Panitia:
          </p>
        </div>

        {/* Digital Receipt Card */}
        <div style={{
          background: 'linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)',
          borderRadius: '16px',
          border: '1.5px solid #ffe4e6',
          padding: '16px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #fecdd3', paddingBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#be123c', letterSpacing: '0.5px' }}>
              🇮🇩 STRUK PENDAFTARAN DIGITAL
            </span>
            <span style={{ fontSize: '0.72rem', color: '#881337', fontWeight: 600 }}>
              RT 04 / RW 12
            </span>
          </div>

          {/* Children / Participant List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {children.map((c, idx) => (
              <div key={idx} style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '12px', border: '1px solid #fecdd3' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
                  <span style={{ background: '#d90429', color: '#fff', fontSize: '0.7rem', width: '18px', height: '18px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    {idx + 1}
                  </span>
                  {c.namaAnak}
                </div>
                
                <div style={{ marginTop: '4px', fontSize: '0.78rem', color: '#475569' }}>
                  <strong>Kategori:</strong> <span style={{ color: '#be123c', fontWeight: 700 }}>{c.kategoriName}</span> ({c.usiaKelas})
                </div>
                
                <div style={{ marginTop: '2px', fontSize: '0.75rem', color: '#64748b' }}>
                  <strong>Lomba:</strong> {Array.isArray(c.lombaTerpilih) ? c.lombaTerpilih.join(', ') : c.lombaTerpilih}
                </div>

                <div style={{ marginTop: '4px', fontSize: '0.72rem', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} /> {c.schedule}
                </div>
              </div>
            ))}
          </div>

          {/* Parent & Address Summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderTop: '1px dashed #fecdd3', paddingTop: '10px' }}>
            <Home size={16} color="#d90429" style={{ shrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Penanggung Jawab / Alamat</div>
              <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#334155' }}>
                {parent.namaOrtu} ({parent.noWa}) - Blok {parent.alamat}
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a
            href={generateWAUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
            style={{ width: '100%' }}
          >
            <MessageSquare size={18} />
            Kirim Konfirmasi Ke WA Panitia (0895705290500)
          </a>

          <button
            onClick={onRegisterNew}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <PlusCircle size={16} />
            Daftarkan Keluarga / Peserta Lain
          </button>
        </div>

      </div>
    </div>
  );
}
