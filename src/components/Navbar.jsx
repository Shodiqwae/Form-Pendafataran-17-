import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <header style={{ background: '#ffffff', borderBottom: '1px solid #e9ecef', position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Top Red & White Bar */}
      <div style={{ height: '6px', background: 'linear-gradient(90deg, #d90429 50%, #ffffff 50%)', borderBottom: '1px solid #e2e8f0' }}></div>

      <div style={{ maxWidth: '850px', margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        
        {/* Main Header Content */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="/hut81-logo.png"
            alt="Logo HUT RI 81"
            style={{
              height: '46px',
              width: 'auto',
              objectFit: 'contain',
              borderRadius: '8px'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span className="badge-red" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>HUT RI Ke-81</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Tahun 2026</span>
            </div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, marginTop: '2px' }}>
              Pendaftaran Lomba 17-an RT 04
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Perum. Sukamaju Permai RT 04 / RW 12, Depok
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge-gold">
            <ShieldCheck size={14} /> Karang Taruna
          </span>
        </div>

      </div>
    </header>
  );
}
