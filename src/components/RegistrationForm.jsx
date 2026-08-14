import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../data/categories';
import { Home, Calendar, Loader2, Send, CheckCircle2, Plus, Trash2, Users, RefreshCw, BookmarkCheck } from 'lucide-react';

const DRAFT_KEY = 'lomba_17an_form_draft';

export default function RegistrationForm({ scriptUrl, onSuccess }) {
  // Initialize state from localStorage draft if available
  const [childrenList, setChildrenList] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.childrenList && Array.isArray(parsed.childrenList) && parsed.childrenList.length > 0) {
          return parsed.childrenList;
        }
      }
    } catch (e) {
      console.error('Failed to load draft', e);
    }
    return [
      {
        id: Date.now(),
        namaAnak: '',
        categoryId: 'sd_1_3'
      }
    ];
  });

  const [parentData, setParentData] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.parentData) {
          return parsed.parentData;
        }
      }
    } catch (e) {
      console.error('Failed to load draft', e);
    }
    return {
      namaOrtu: '',
      noWa: '',
      alamat: '',
      catatan: ''
    };
  });

  const [hasDraftRestored, setHasDraftRestored] = useState(() => {
    return Boolean(localStorage.getItem(DRAFT_KEY));
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-save form draft on every change
  useEffect(() => {
    try {
      const isNotEmpty = childrenList.some(c => c.namaAnak.trim()) || parentData.namaOrtu.trim() || parentData.noWa.trim();
      if (isNotEmpty) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ childrenList, parentData }));
      }
    } catch (e) {
      console.error('Failed to save draft', e);
    }
  }, [childrenList, parentData]);

  // Prompt user before closing tab if form has unsaved content
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const isNotEmpty = childrenList.some(c => c.namaAnak.trim()) || parentData.namaOrtu.trim();
      if (isNotEmpty && !loading) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [childrenList, parentData, loading]);

  // Clear Draft Function
  const handleClearDraft = () => {
    if (window.confirm('Apakah Anda yakin ingin mengosongkan formulir dan menghapus draf?')) {
      localStorage.removeItem(DRAFT_KEY);
      setChildrenList([
        {
          id: Date.now(),
          namaAnak: '',
          categoryId: 'sd_1_3'
        }
      ]);
      setParentData({
        namaOrtu: '',
        noWa: '',
        alamat: '',
        catatan: ''
      });
      setHasDraftRestored(false);
    }
  };

  // Add participant
  const handleAddChild = () => {
    setChildrenList(prev => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        namaAnak: '',
        categoryId: 'bapak_ibu'
      }
    ]);
  };

  // Remove participant
  const handleRemoveChild = (id) => {
    if (childrenList.length === 1) {
      alert('Minimal mendaftarkan 1 orang peserta.');
      return;
    }
    setChildrenList(prev => prev.filter(c => c.id !== id));
  };

  // Update specific participant data
  const handleChildChange = (id, field, value) => {
    setChildrenList(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, [field]: value };
      }
      return c;
    }));
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    for (let i = 0; i < childrenList.length; i++) {
      const child = childrenList[i];
      if (!child.namaAnak.trim()) {
        setErrorMsg(`Mohon isi Nama Lengkap untuk Peserta Ke-${i + 1}.`);
        return;
      }
    }

    if (!parentData.namaOrtu.trim()) {
      setErrorMsg('Mohon isi nama penanggung jawab / orang tua.');
      return;
    }
    if (!parentData.noWa.trim()) {
      setErrorMsg('Mohon isi nomor WhatsApp yang aktif.');
      return;
    }
    if (!parentData.alamat.trim()) {
      setErrorMsg('Mohon isi alamat / nomor rumah RT 04.');
      return;
    }

    setLoading(true);

    // Prepare processed payload per participant
    const processedChildren = childrenList.map(child => {
      const cat = CATEGORIES.find(c => c.id === child.categoryId) || CATEGORIES[0];
      return {
        namaAnak: child.namaAnak,
        usiaKelas: cat.ageRange,
        categoryId: child.categoryId,
        kategoriName: cat.name,
        lombaTerpilih: cat.competitions.map(c => c.name),
        schedule: cat.schedule,
        location: cat.location,
        namaOrtu: parentData.namaOrtu,
        noWa: parentData.noWa,
        alamat: parentData.alamat,
        catatan: parentData.catatan
      };
    });

    try {
      if (scriptUrl) {
        for (const childPayload of processedChildren) {
          await fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(childPayload)
          });
        }
      } else {
        await new Promise(res => setTimeout(res, 800));
      }

      // Wipe draft upon successful submission
      localStorage.removeItem(DRAFT_KEY);
      setHasDraftRestored(false);
      
      onSuccess({ children: processedChildren, parentData, savedToSheets: Boolean(scriptUrl) });
    } catch (err) {
      console.error('Error submitting form', err);
      onSuccess({ children: processedChildren, parentData, savedToSheets: Boolean(scriptUrl) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '20px auto', padding: '0 12px' }}>
      <form onSubmit={handleSubmit} style={{ 
        background: '#ffffff', 
        borderRadius: '24px', 
        padding: 'clamp(18px, 4vw, 32px)', 
        border: '1px solid #e2e8f0', 
        boxShadow: '0 8px 30px rgba(0,0,0,0.05)' 
      }}>
        
        {/* DRAFT RESTORED ALERT BANNER */}
        {hasDraftRestored && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            padding: '10px 14px',
            borderRadius: '14px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#15803d' }}>
              <BookmarkCheck size={18} color="#16a34a" style={{ shrink: 0 }} />
              <span><strong>Draf Dipulihkan:</strong> Isian formulir Anda sebelumnya otomatis disimpan dan dipulihkan.</span>
            </div>

            <button
              type="button"
              onClick={handleClearDraft}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RefreshCw size={12} /> Kosongkan Draf
            </button>
          </div>
        )}

        {/* SECTION 1: DATA PESERTA LOMBA */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ffe4e6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Users size={18} color="#d90429" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>1. Data Peserta Lomba</h2>
                <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Bisa mendaftarkan Anak, Bapak, maupun Ibu sekaligus!</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddChild}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#fff0f3',
                color: '#d90429',
                border: '1.5px dashed #fecdd3',
                padding: '8px 14px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Plus size={16} /> Tambah Peserta
            </button>
          </div>

          {/* Render Each Participant Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {childrenList.map((child, index) => {
              const selectedCat = CATEGORIES.find(c => c.id === child.categoryId) || CATEGORIES[0];

              return (
                <div
                  key={child.id}
                  style={{
                    background: '#f8fafc',
                    borderRadius: '18px',
                    padding: 'clamp(14px, 3vw, 20px)',
                    border: '1.5px solid #e2e8f0',
                    position: 'relative'
                  }}
                >
                  {/* Participant Header & Delete Button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#d90429', color: '#fff', fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {index + 1}
                      </span>
                      Peserta Ke-{index + 1} {child.namaAnak ? `: ${child.namaAnak}` : ''}
                    </span>

                    {childrenList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveChild(child.id)}
                        style={{
                          background: '#fef2f2',
                          color: '#dc2626',
                          border: '1px solid #fecdd3',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Trash2 size={13} /> Hapus
                      </button>
                    )}
                  </div>

                  {/* Participant Name Input */}
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', color: '#334155', marginBottom: '6px' }}>
                      Nama Lengkap Peserta <span style={{ color: '#d90429' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Muhammad Bintang / Ibu Siti"
                      value={child.namaAnak}
                      onChange={(e) => handleChildChange(child.id, 'namaAnak', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.9rem',
                        outline: 'none',
                        background: '#ffffff'
                      }}
                    />
                  </div>

                  {/* Category Selection for THIS Participant */}
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', color: '#334155', marginBottom: '8px' }}>
                      Pilih Kategori Tingkatan Peserta Ke-{index + 1}:
                    </label>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
                      {CATEGORIES.map(cat => {
                        const isSelected = child.categoryId === cat.id;
                        return (
                          <div
                            key={cat.id}
                            onClick={() => handleChildChange(child.id, 'categoryId', cat.id)}
                            style={{
                              padding: '10px 6px',
                              borderRadius: '12px',
                              border: isSelected ? '2px solid #d90429' : '1px solid #cbd5e1',
                              background: isSelected ? '#fff0f3' : '#ffffff',
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ fontSize: '1.1rem' }}>{cat.badge.split(' ')[0]}</div>
                            <div style={{ fontWeight: 800, fontSize: '0.78rem', color: isSelected ? '#a0001e' : '#334155' }}>
                              {cat.name}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                              {cat.ageRange}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Included Competitions Preview for THIS Participant */}
                  <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <CheckCircle2 size={14} /> Otomatis Mengikuti ({selectedCat.competitions.length} Lomba):
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#334155', fontWeight: 600, lineHeight: 1.4 }}>
                      {selectedCat.competitions.map(c => c.name).join(' • ')}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                      📅 Jadwal: {selectedCat.schedule}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Add Another Participant Button */}
          <button
            type="button"
            onClick={handleAddChild}
            style={{
              width: '100%',
              marginTop: '14px',
              padding: '12px',
              borderRadius: '14px',
              border: '2px dashed #d90429',
              background: '#fff5f5',
              color: '#d90429',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Plus size={16} /> + Tambah Peserta Lain (Anak / Bapak / Ibu)
          </button>

        </div>

        {/* SECTION 2: DATA PENANGGUNG JAWAB / ORANG TUA / ALAMAT */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ffe4e6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Home size={18} color="#d90429" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>2. Data Penanggung Jawab & Alamat RT 04</h2>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Cukup diisi 1 kali untuk seluruh peserta pendaftar</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', color: '#334155', marginBottom: '6px' }}>
                Nama Penanggung Jawab / Ortu <span style={{ color: '#d90429' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Bapak/Ibu Hendra"
                value={parentData.namaOrtu}
                onChange={(e) => setParentData({ ...parentData, namaOrtu: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', color: '#334155', marginBottom: '6px' }}>
                No. WhatsApp Aktif <span style={{ color: '#d90429' }}>*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="Contoh: 08123456789"
                value={parentData.noWa}
                onChange={(e) => setParentData({ ...parentData, noWa: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', color: '#334155', marginBottom: '6px' }}>
                Blok & Nomor Rumah RT 04 <span style={{ color: '#d90429' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Blok B2 No. 15"
                value={parentData.alamat}
                onChange={(e) => setParentData({ ...parentData, alamat: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', color: '#334155', marginBottom: '6px' }}>
                Catatan Tambahan (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Membawa sarung/alat sendiri"
                value={parentData.catatan}
                onChange={(e) => setParentData({ ...parentData, catatan: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* ERROR MSG IF ANY */}
        {errorMsg && (
          <div style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecdd3', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{ width: '100%', fontSize: '1rem', padding: '14px' }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Sedang Mengirim Data ({childrenList.length} Peserta)...
            </>
          ) : (
            <>
              <Send size={18} /> Kirim Pendaftaran ({childrenList.length} Peserta)
            </>
          )}
        </button>

      </form>
    </div>
  );
}
