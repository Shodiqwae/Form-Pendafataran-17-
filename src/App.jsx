import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import RegistrationForm from './components/RegistrationForm';
import SuccessModal from './components/SuccessModal';

const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbweFdTp9_vaTtL7KcXxXLAM7CjHc3XbfN5izAcmgWgjNl8XsePQWH017Mzw5ms683CC/exec';

export default function App() {
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    // Save new Apps Script URL to localStorage
    localStorage.setItem('lomba_sheets_url', DEFAULT_SCRIPT_URL);
  }, []);

  const handleFormSuccess = (data) => {
    setSubmittedData(data);
  };

  const handleRegisterNew = () => {
    setSubmittedData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <Navbar />

      <main style={{ minHeight: 'calc(100vh - 180px)' }}>
        <RegistrationForm
          scriptUrl={DEFAULT_SCRIPT_URL}
          onSuccess={handleFormSuccess}
        />
      </main>

      {/* SUCCESS MODAL */}
      {submittedData && (
        <SuccessModal
          data={submittedData}
          onClose={() => setSubmittedData(null)}
          onRegisterNew={handleRegisterNew}
        />
      )}

      {/* FOOTER */}
      <footer style={{
        marginTop: '40px',
        padding: '20px 16px',
        textAlign: 'center',
        borderTop: '1px solid #e2e8f0',
        background: '#ffffff',
        fontSize: '0.8rem',
        color: '#64748b'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <p style={{ fontWeight: 700, color: '#0f172a' }}>
            🇮🇩 Panitia HUT RI Ke-81 Sukamaju Permai RT 04 / RW 12
          </p>
          <p>
            Kecamatan Cilodong, Kota Depok • Karang Taruna Sukamaju Permai
          </p>
        </div>
      </footer>
    </div>
  );
}
