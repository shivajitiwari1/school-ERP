'use client';
import { useEffect, useState } from 'react';

export default function FeesPage() {
  const [fees, setFees] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<any>({ feeType: 'Tuition Fee', paymentStatus: 'pending' });
  const [saving, setSaving] = useState(false);

  const fetchFees = async () => {
    const params = statusFilter ? `?status=${statusFilter}` : '';
    const res = await fetch(`/api/fees${params}`);
    const data = await res.json();
    setFees(data.fees); setSummary(data.summary);
    setLoading(false);
  };

  useEffect(() => { fetchFees(); }, [statusFilter]);

  async function markPaid(id: string) {
    await fetch('/api/fees', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, paymentStatus: 'paid', paymentMethod: 'Online' }) });
    fetchFees();
  }

  async function handleAdd() {
    setSaving(true);
    const students = await fetch('/api/students').then(r => r.json());
    const student = students.students.find((s: any) => s.studentId === form.studentId);
    await fetch('/api/fees', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, amount: Number(form.amount), studentName: student?.name || '', class: student?.class || '', month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }) }) });
    setShowModal(false); setForm({ feeType: 'Tuition Fee', paymentStatus: 'pending' });
    fetchFees(); setSaving(false);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Fee Management</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Track and manage student fees</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add Fee Entry</button>
      </div>

      <div className="page-body">
        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Billed', value: `₹${(summary.total||0).toLocaleString()}`, icon: '📋', color: '#2563eb', bg: '#dbeafe' },
            { label: 'Collected', value: `₹${(summary.paid||0).toLocaleString()}`, icon: '💰', color: '#10b981', bg: '#d1fae5' },
            { label: 'Pending', value: `₹${(summary.pending||0).toLocaleString()}`, icon: '⏳', color: '#ef4444', bg: '#fee2e2' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>{s.label}</p>
                  <p style={{ fontSize: '1.75rem', fontWeight: 700, color: s.color, lineHeight: 1.2, marginTop: '0.25rem' }}>{s.value}</p>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{s.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ maxWidth: 200 }}>
            <option value="">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Table */}
        <div className="card">
          <div className="table-container">
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Loading fees...</div>
            ) : (
              <table>
                <thead>
                  <tr><th>Student</th><th>Class</th><th>Fee Type</th><th>Amount</th><th>Due Date</th><th>Status</th><th>Transaction</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {fees.map(f => (
                    <tr key={f.id}>
                      <td style={{ fontWeight: 600 }}>{f.studentName}</td>
                      <td>{f.class ? `Class ${f.class}` : '—'}</td>
                      <td>{f.feeType}</td>
                      <td style={{ fontWeight: 600 }}>₹{f.amount?.toLocaleString()}</td>
                      <td>{f.dueDate}</td>
                      <td>
                        <span className={`badge ${f.paymentStatus === 'paid' ? 'badge-success' : 'badge-danger'}`}>
                          {f.paymentStatus === 'paid' ? `✓ Paid ${f.paidDate}` : '⏳ Pending'}
                        </span>
                      </td>
                      <td>
                        {f.transactionId ? (
                          <code style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '2px 7px', borderRadius: 6 }}>{f.transactionId.slice(-8)}</code>
                        ) : <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>—</span>}
                      </td>
                      <td>
                        {f.paymentStatus === 'pending' && (
                          <button onClick={() => markPaid(f.id)} style={{ background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Add Fee Entry</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#94a3b8' }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { key: 'studentId', label: 'Student ID', type: 'text', placeholder: 'SCH2024001' },
                { key: 'feeType', label: 'Fee Type', type: 'select', options: ['Tuition Fee','Exam Fee','Sports Fee','Library Fee','Transport Fee','Hostel Fee'] },
                { key: 'amount', label: 'Amount (₹)', type: 'number', placeholder: '8000' },
                { key: 'dueDate', label: 'Due Date', type: 'date' },
              ].map(f => (
                <div key={f.key}>
                  <label>{f.label}</label>
                  {f.type === 'select' ? (
                    <select value={form[f.key] || ''} onChange={e => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))}>
                      {(f as any).options.map((o: string) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} placeholder={(f as any).placeholder} value={form[f.key] || ''} onChange={e => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAdd} disabled={saving}>{saving ? 'Saving...' : 'Add Entry'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
