import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import RegistrationForm from './components/RegistrationForm';
import SuccessModal from './components/SuccessModal';
import AlreadySubmittedView from './components/AlreadySubmittedView';

const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbweFdTp9_vaTtL7KcXxXLAM7CjHc3XbfN5izAcmgWgjNl8XsePQWH017Mzw5ms683CC/exec';
const SUBMISSION_KEY = 'lomba_17an_submitted_data';

export default function App() {
  const [submittedData, setSubmittedData] = useState(null);
  const [alreadySubmittedData, setAlreadySubmittedData] = useState(null);

  useEffect(() => {
    // Check if user has already submitted previously
    try {
      const savedSubmission = localStorage.getItem(SUBMISSION_KEY);
      if (savedSubmission) {
        setAlreadySubmittedData(JSON.parse(savedSubmission));
      }
    } catch (e) {
      console.error('Failed to load submission history', e);
    }
  }, []);

  const handleFormSuccess = (data) => {
    // Save submission to localStorage to prevent duplicate submissions
    try {
      localStorage.setItem(SUBMISSION_KEY, JSON.stringify(data));
      setAlreadySubmittedData(data);
    } catch (e) {
      console.error('Failed to save submission flag', e);
    }
    setSubmittedData(data);
  };

  const handleRegisterNew = () => {
    // Allow registering new family member by clearing submission lock upon confirmation
    if (window.confirm('Apakah Anda ingin menambah pendaftaran peserta baru?')) {
      localStorage.removeItem(SUBMISSION_KEY);
      setAlreadySubmittedData(null);
      setSubmittedData(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <main style={{ minHeight: 'calc(100vh - 180px)' }}>
        {alreadySubmittedData && !submittedData ? (
          <AlreadySubmittedView
            data={alreadySubmittedData}
            onRegisterNew={handleRegisterNew}
          />
        ) : (
          <RegistrationForm
            scriptUrl={DEFAULT_SCRIPT_URL}
            onSuccess={handleFormSuccess}
          />
        )}
      </main>

      {/* SUCCESS MODAL ON SUBMIT */}
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
