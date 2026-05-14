'use client';
import { useEffect, useState } from 'react';

interface Student {
  id: string; studentId: string; name: string; class: string; section: string;
  rollNo: string; gender: string; phone: string; email: string; parentName: string;
  parentPhone: string; feeStatus: string; admissionDate: string; bloodGroup: string; address: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Student>>({ gender: 'Male', feeStatus: 'pending' });
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<Student | null>(null);

  const fetchStudents = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (classFilter) params.set('class', classFilter);
    const res = await fetch(`/api/students?${params}`);
    const data = await res.json();
    setStudents(data.students);
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, [search, classFilter]);

  async function handleSave() {
    setSaving(true);
    await fetch('/api/students', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setShowModal(false); setForm({ gender: 'Male', feeStatus: 'pending' });
    fetchStudents(); setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this student?')) return;
    await fetch(`/api/students/${id}`, { method: 'DELETE' });
    fetchStudents();
  }

  const CLASSES = ['6','7','8','9','10','11','12'];

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Students</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{students.length} students enrolled</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add Student</button>
      </div>

      <div className="page-body">
        {/* Filters */}
        <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input placeholder="🔍  Search name, ID, email..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 300 }} />
          <select value={classFilter} onChange={e => setClassFilter(e.target.value)} style={{ maxWidth: 180 }}>
            <option value="">All Classes</option>
            {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
          </select>
          {(search || classFilter) && <button className="btn-secondary" onClick={() => { setSearch(''); setClassFilter(''); }} style={{ whiteSpace: 'nowrap' }}>Clear Filters</button>}
        </div>

        {/* Table */}
        <div className="card">
          <div className="table-container">
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Loading students...</div>
            ) : students.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                <div style={{ fontSize: 48, marginBottom: '1rem' }}>👥</div>
                <p>No students found</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Student</th><th>ID</th><th>Class</th><th>Parent</th><th>Contact</th><th>Fee Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: `hsl(${s.name.charCodeAt(0)*7}deg, 60%, 85%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: `hsl(${s.name.charCodeAt(0)*7}deg, 60%, 30%)`, flexShrink: 0 }}>
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.name}</p>
                            <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td><code style={{ fontSize: '0.8rem', background: '#f1f5f9', padding: '2px 8px', borderRadius: 6 }}>{s.studentId}</code></td>
                      <td><span className="badge badge-info">Class {s.class}-{s.section}</span></td>
                      <td>
                        <p style={{ fontSize: '0.85rem' }}>{s.parentName}</p>
                        <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{s.parentPhone}</p>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{s.phone}</td>
                      <td>
                        <span className={`badge ${s.feeStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                          {s.feeStatus === 'paid' ? '✓ Paid' : '⏳ Pending'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => setSelected(s)} style={{ background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontSize: '0.8rem' }}>View</button>
                          <button onClick={() => handleDelete(s.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Add New Student</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#94a3b8' }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Student name', full: true },
                { key: 'email', label: 'Email', type: 'email', placeholder: 'student@school.edu' },
                { key: 'phone', label: 'Phone', type: 'text', placeholder: '9876543210' },
                { key: 'dob', label: 'Date of Birth', type: 'date' },
                { key: 'class', label: 'Class', type: 'select', options: CLASSES.map(c => ({ value: c, label: `Class ${c}` })) },
                { key: 'section', label: 'Section', type: 'select', options: ['A','B','C'].map(s => ({ value: s, label: s })) },
                { key: 'gender', label: 'Gender', type: 'select', options: ['Male','Female','Other'].map(g => ({ value: g, label: g })) },
                { key: 'bloodGroup', label: 'Blood Group', type: 'select', options: ['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg => ({ value: bg, label: bg })) },
                { key: 'parentName', label: "Parent's Name", type: 'text', placeholder: 'Parent name' },
                { key: 'parentPhone', label: "Parent's Phone", type: 'text', placeholder: '9876543210' },
                { key: 'parentEmail', label: "Parent's Email", type: 'email', placeholder: 'parent@email.com' },
                { key: 'address', label: 'Address', type: 'text', placeholder: 'Full address', full: true },
              ].map(f => (
                <div key={f.key} style={{ gridColumn: (f as any).full ? 'span 2' : 'span 1' }}>
                  <label>{f.label}</label>
                  {f.type === 'select' ? (
                    <select value={(form as any)[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}>
                      <option value="">Select {f.label}</option>
                      {(f as any).options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} placeholder={(f as any).placeholder} value={(form as any)[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Add Student'}</button>
            </div>
          </div>
        </div>
      )}

      {/* View Student Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Student Profile</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#94a3b8' }}>×</button>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: `hsl(${selected.name.charCodeAt(0)*7}deg, 60%, 85%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.5rem', color: `hsl(${selected.name.charCodeAt(0)*7}deg, 60%, 30%)`, margin: '0 auto 0.5rem' }}>
                {selected.name.charAt(0)}
              </div>
              <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.1rem', fontWeight: 600 }}>{selected.name}</h3>
              <span className="badge badge-info" style={{ margin: '0.25rem auto' }}>Class {selected.class}-{selected.section}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                ['Student ID', selected.studentId], ['Roll No', selected.rollNo],
                ['Gender', selected.gender], ['Blood Group', selected.bloodGroup],
                ['Phone', selected.phone], ['Email', selected.email],
                ['Parent', selected.parentName], ['Parent Phone', selected.parentPhone],
                ['Fee Status', selected.feeStatus], ['Admission Date', selected.admissionDate],
              ].map(([k, v]) => (
                <div key={k} style={{ background: '#f8fafc', borderRadius: 10, padding: '0.6rem 0.75rem' }}>
                  <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, marginTop: 2 }}>{v || '—'}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '0.75rem', background: '#f8fafc', borderRadius: 10, padding: '0.6rem 0.75rem' }}>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Address</p>
              <p style={{ fontSize: '0.875rem', fontWeight: 500, marginTop: 2 }}>{selected.address || '—'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
