'use client';
import { useEffect, useState } from 'react';

export default function AttendancePage() {
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [records, setRecords] = useState<any[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [cls, setCls] = useState('10');
  const [section, setSection] = useState('A');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<'mark' | 'report'>('mark');

  useEffect(() => {
    fetch(`/api/students?class=${cls}&section=${section}`).then(r => r.json()).then(d => {
      setStudents(d.students);
      // Initialize all as present
      const init: Record<string,string> = {};
      d.students.forEach((s: any) => init[s.id] = 'present');
      setAttendance(init);
    });
  }, [cls, section]);

  useEffect(() => {
    if (tab === 'report') {
      fetch(`/api/attendance?class=${cls}`).then(r => r.json()).then(d => setRecords(d.records));
    }
  }, [tab, cls]);

  async function handleSave() {
    setSaving(true);
    const entries = students.map(s => ({ studentId: s.id, status: attendance[s.id] || 'absent', class: cls, section }));
    await fetch('/api/attendance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date, entries }) });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const presentCount = Object.values(attendance).filter(v => v === 'present').length;
  const absentCount = students.length - presentCount;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Attendance</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Mark and view daily attendance</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={tab === 'mark' ? 'btn-primary' : 'btn-secondary'} onClick={() => setTab('mark')}>Mark Attendance</button>
          <button className={tab === 'report' ? 'btn-primary' : 'btn-secondary'} onClick={() => setTab('report')}>View Report</button>
        </div>
      </div>

      <div className="page-body">
        {/* Filters */}
        <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: 180 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label>Class</label>
              <select value={cls} onChange={e => setCls(e.target.value)} style={{ width: 140 }}>
                {['6','7','8','9','10','11','12'].map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label>Section</label>
              <select value={section} onChange={e => setSection(e.target.value)} style={{ width: 120 }}>
                {['A','B','C'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {tab === 'mark' && (
          <>
            {/* Summary */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
              {[
                { label: 'Total', value: students.length, color: '#2563eb', bg: '#dbeafe' },
                { label: 'Present', value: presentCount, color: '#10b981', bg: '#d1fae5' },
                { label: 'Absent', value: absentCount, color: '#ef4444', bg: '#fee2e2' },
                { label: 'Rate', value: students.length ? `${Math.round(presentCount/students.length*100)}%` : '—', color: '#f59e0b', bg: '#fef3c7' },
              ].map(s => (
                <div key={s.label} className="card" style={{ padding: '1rem 1.5rem', flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontWeight: 700, color: s.color, fontSize: '1rem' }}>{s.value}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Mark attendance */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Class {cls}-{section} · {date}</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-secondary" style={{ fontSize: '0.82rem', padding: '0.4rem 1rem' }} onClick={() => { const a: Record<string,string> = {}; students.forEach(s => a[s.id] = 'present'); setAttendance(a); }}>All Present</button>
                  <button className="btn-secondary" style={{ fontSize: '0.82rem', padding: '0.4rem 1rem' }} onClick={() => { const a: Record<string,string> = {}; students.forEach(s => a[s.id] = 'absent'); setAttendance(a); }}>All Absent</button>
                </div>
              </div>

              {students.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No students in this class/section</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  {students.map(s => {
                    const status = attendance[s.id] || 'present';
                    return (
                      <div key={s.id} style={{ border: `2px solid ${status === 'present' ? '#10b981' : '#ef4444'}`, borderRadius: 12, padding: '0.75rem 1rem', background: status === 'present' ? '#f0fdf4' : '#fff5f5', cursor: 'pointer', transition: 'all 0.15s' }}
                        onClick={() => setAttendance(p => ({ ...p, [s.id]: p[s.id] === 'present' ? 'absent' : 'present' }))}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: status === 'present' ? '#bbf7d0' : '#fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: status === 'present' ? '#065f46' : '#991b1b', flexShrink: 0 }}>
                            {s.name.charAt(0)}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</p>
                            <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Roll #{s.rollNo}</p>
                          </div>
                          <span style={{ fontSize: 18 }}>{status === 'present' ? '✅' : '❌'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {students.length > 0 && (
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center' }}>
                  {saved && <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>✓ Attendance saved!</span>}
                  <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Attendance'}</button>
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'report' && (
          <div className="card">
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Date</th><th>Student ID</th><th>Status</th><th>Class</th></tr>
                </thead>
                <tbody>
                  {records.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No records found</td></tr>
                  ) : records.map(r => (
                    <tr key={r.id}>
                      <td>{r.date}</td>
                      <td><code style={{ fontSize: '0.8rem', background: '#f1f5f9', padding: '2px 8px', borderRadius: 6 }}>{r.studentId}</code></td>
                      <td><span className={`badge ${r.status === 'present' ? 'badge-success' : 'badge-danger'}`}>{r.status}</span></td>
                      <td>Class {r.class}-{r.section}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
