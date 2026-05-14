'use client';
import { useEffect, useState } from 'react';

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [remarks, setRemarks] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchAdmissions = async () => {
    const params = statusFilter ? `?status=${statusFilter}` : '';
    const res = await fetch(`/api/admissions${params}`);
    const data = await res.json();
    setAdmissions(data.admissions);
    setLoading(false);
  };

  useEffect(() => { fetchAdmissions(); }, [statusFilter]);

  async function updateStatus(id: string, status: string) {
    setUpdating(true);
    await fetch('/api/admissions', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status, remarks, reviewedBy: 'Admin' }) });
    setSelected(null); setRemarks('');
    fetchAdmissions(); setUpdating(false);
  }

  const statusBadge = (s: string) => {
    if (s === 'approved') return <span className="badge badge-success">✓ Approved</span>;
    if (s === 'rejected') return <span className="badge badge-danger">✗ Rejected</span>;
    return <span className="badge badge-warning">⏳ Pending</span>;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Admissions</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{admissions.length} applications</p>
        </div>
      </div>

      <div className="page-body">
        <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['', 'pending', 'approved', 'rejected'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={statusFilter === s ? 'btn-primary' : 'btn-secondary'} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="table-container">
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Loading...</div>
            ) : (
              <table>
                <thead>
                  <tr><th>Application No.</th><th>Student Name</th><th>Class Applied</th><th>Parent</th><th>Date Applied</th><th>Previous %</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {admissions.map(a => (
                    <tr key={a.id}>
                      <td><code style={{ fontSize: '0.8rem', background: '#f1f5f9', padding: '2px 8px', borderRadius: 6 }}>{a.applicationNo}</code></td>
                      <td>
                        <p style={{ fontWeight: 600 }}>{a.studentName}</p>
                        <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{a.gender} · DOB: {a.dob}</p>
                      </td>
                      <td>Class {a.applyingForClass}</td>
                      <td>
                        <p style={{ fontSize: '0.85rem' }}>{a.parentName}</p>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{a.parentPhone}</p>
                      </td>
                      <td>{a.appliedDate}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: a.previousPercentage >= 80 ? '#10b981' : a.previousPercentage >= 60 ? '#f59e0b' : '#ef4444' }}>
                          {a.previousPercentage}%
                        </span>
                      </td>
                      <td>{statusBadge(a.status)}</td>
                      <td>
                        <button onClick={() => { setSelected(a); setRemarks(a.remarks || ''); }}
                          style={{ background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontSize: '0.8rem' }}>
                          {a.status === 'pending' ? 'Review' : 'View'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Application Review</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#94a3b8' }}>×</button>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: 12, padding: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h4 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>{selected.studentName}</h4>
                {statusBadge(selected.status)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
                {[
                  ['Application No.', selected.applicationNo], ['Applying for Class', `Class ${selected.applyingForClass}`],
                  ['Gender', selected.gender], ['Date of Birth', selected.dob],
                  ['Previous School', selected.previousSchool], ['Previous Class', `Class ${selected.previousClass}`],
                  ['Previous %', `${selected.previousPercentage}%`], ['Applied Date', selected.appliedDate],
                  ['Parent', selected.parentName], ['Parent Phone', selected.parentPhone],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{k}</p>
                    <p style={{ fontWeight: 500 }}>{v}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Address</p>
                <p style={{ fontSize: '0.85rem', fontWeight: 500 }}>{selected.address}</p>
              </div>
            </div>

            {selected.status === 'pending' && (
              <>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label>Remarks</label>
                  <textarea rows={3} value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Add remarks..." />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => updateStatus(selected.id, 'approved')} disabled={updating}
                    style={{ flex: 1, background: '#d1fae5', color: '#065f46', border: '1.5px solid #6ee7b7', borderRadius: 10, padding: '0.7rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                    ✓ Approve
                  </button>
                  <button onClick={() => updateStatus(selected.id, 'rejected')} disabled={updating}
                    style={{ flex: 1, background: '#fee2e2', color: '#991b1b', border: '1.5px solid #fca5a5', borderRadius: 10, padding: '0.7rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                    ✗ Reject
                  </button>
                </div>
              </>
            )}

            {selected.status !== 'pending' && selected.remarks && (
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: '0.75rem' }}>
                <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Remarks</p>
                <p style={{ fontSize: '0.875rem' }}>{selected.remarks}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
