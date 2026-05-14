'use client';
import { useEffect, useState } from 'react';

interface Teacher {
  id: string; teacherId: string; name: string; email: string; phone: string;
  gender: string; subjects: string[]; classes: string[]; qualification: string;
  experience: string; salary: number; joinDate: string; bloodGroup: string;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<any>({ subjects: '', classes: '' });
  const [saving, setSaving] = useState(false);

  const fetchTeachers = async () => {
    const res = await fetch('/api/teachers');
    const data = await res.json();
    setTeachers(data.teachers);
    setLoading(false);
  };

  useEffect(() => { fetchTeachers(); }, []);

  async function handleSave() {
    setSaving(true);
    const payload = { ...form, subjects: form.subjects.split(',').map((s: string) => s.trim()), classes: form.classes.split(',').map((s: string) => s.trim()), salary: Number(form.salary) };
    await fetch('/api/teachers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setShowModal(false); setForm({ subjects: '', classes: '' });
    fetchTeachers(); setSaving(false);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Teachers</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{teachers.length} teaching staff</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add Teacher</button>
      </div>

      <div className="page-body">
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 180 }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {teachers.map(t => (
              <div key={t.id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: `hsl(${t.name.charCodeAt(0)*7}deg, 55%, 88%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', color: `hsl(${t.name.charCodeAt(0)*7}deg, 55%, 35%)`, flexShrink: 0 }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'DM Sans, sans-serif' }}>{t.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.qualification}</p>
                    <code style={{ fontSize: '0.72rem', background: '#f1f5f9', padding: '2px 7px', borderRadius: 6, color: '#64748b' }}>{t.teacherId}</code>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                  {t.subjects.map(s => <span key={s} className="badge badge-info">{s}</span>)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.82rem' }}>
                  <div style={{ background: '#f8fafc', borderRadius: 8, padding: '0.5rem' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Experience</p>
                    <p style={{ fontWeight: 600 }}>{t.experience}</p>
                  </div>
                  <div style={{ background: '#f8fafc', borderRadius: 8, padding: '0.5rem' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Salary</p>
                    <p style={{ fontWeight: 600 }}>₹{t.salary?.toLocaleString()}/mo</p>
                  </div>
                  <div style={{ background: '#f8fafc', borderRadius: 8, padding: '0.5rem', gridColumn: 'span 2' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Contact</p>
                    <p style={{ fontWeight: 500 }}>{t.phone} · {t.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Add New Teacher</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#94a3b8' }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Teacher name', full: true },
                { key: 'email', label: 'Email', type: 'email', placeholder: 'teacher@school.edu' },
                { key: 'phone', label: 'Phone', type: 'text', placeholder: '9876500001' },
                { key: 'qualification', label: 'Qualification', type: 'text', placeholder: 'M.Sc Physics' },
                { key: 'experience', label: 'Experience', type: 'text', placeholder: '5 years' },
                { key: 'salary', label: 'Monthly Salary (₹)', type: 'number', placeholder: '40000' },
                { key: 'subjects', label: 'Subjects (comma separated)', type: 'text', placeholder: 'Physics, Chemistry', full: true },
                { key: 'classes', label: 'Classes (comma separated)', type: 'text', placeholder: '10A, 9B', full: true },
              ].map(f => (
                <div key={f.key} style={{ gridColumn: (f as any).full ? 'span 2' : 'span 1' }}>
                  <label>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key] || ''} onChange={e => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Add Teacher'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
