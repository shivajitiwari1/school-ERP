'use client';
import { useEffect, useState } from 'react';

export default function ResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [classFilter, setClassFilter] = useState('');

  useEffect(() => {
    const params = classFilter ? `?class=${classFilter}` : '';
    fetch(`/api/results${params}`).then(r => r.json()).then(d => { setResults(d.results); setLoading(false); });
  }, [classFilter]);

  const gradeColor: Record<string, string> = { 'A+': '#10b981', 'A': '#2563eb', 'B+': '#8b5cf6', 'B': '#f59e0b', 'C': '#ef4444' };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Results & Marksheet</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>View and manage examination results</p>
        </div>
      </div>

      <div className="page-body">
        <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1.25rem' }}>
          <select value={classFilter} onChange={e => setClassFilter(e.target.value)} style={{ maxWidth: 200 }}>
            <option value="">All Classes</option>
            {['6','7','8','9','10','11','12'].map(c => <option key={c} value={c}>Class {c}</option>)}
          </select>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[1,2].map(i => <div key={i} className="skeleton" style={{ height: 80 }} />)}
          </div>
        ) : results.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: 48, marginBottom: '1rem' }}>📊</div>
            <p>No results found</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {results.map(r => (
              <div key={r.id} className="card" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => setSelected(r)}>
                <div className="result-card-body">
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', minWidth: 0 }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', color: '#2563eb', flexShrink: 0 }}>
                      {r.studentName.charAt(0)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', fontWeight: 600 }}>{r.studentName}</h3>
                      <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Class {r.class} · {r.examType} · {r.academicYear}</p>
                    </div>
                  </div>
                  <div className="result-card-stats">
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total</p>
                      <p style={{ fontWeight: 700, fontSize: '1rem' }}>{r.obtainedTotal}/{r.totalMarks}</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Percentage</p>
                      <p style={{ fontWeight: 700, fontSize: '1rem', color: '#2563eb' }}>{r.percentage}%</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Grade</p>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${gradeColor[r.grade]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: gradeColor[r.grade] || '#64748b', margin: 'auto' }}>
                        {r.grade}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Rank</p>
                      <p style={{ fontWeight: 700, fontSize: '1rem', color: r.rank === 1 ? '#f59e0b' : '#1e293b' }}>#{r.rank}</p>
                    </div>
                    <span className={`badge ${r.result === 'Pass' ? 'badge-success' : 'badge-danger'}`} style={{ alignSelf: 'center' }}>{r.result}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Report Card</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#94a3b8' }}>×</button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '1rem', background: 'linear-gradient(135deg, #0f2348, #2563eb)', borderRadius: 16 }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>EduManage School</p>
              <h2 style={{ color: 'white', fontSize: '1.4rem', margin: '0.25rem 0', fontFamily: 'Playfair Display, serif' }}>{selected.studentName}</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>Class {selected.class} | {selected.examType} | {selected.academicYear}</p>
            </div>

            <table style={{ marginBottom: '1.5rem' }}>
              <thead>
                <tr><th>Subject</th><th style={{ textAlign: 'right' }}>Max</th><th style={{ textAlign: 'right' }}>Obtained</th><th style={{ textAlign: 'right' }}>Grade</th></tr>
              </thead>
              <tbody>
                {selected.subjects.map((s: any) => (
                  <tr key={s.name}>
                    <td style={{ fontWeight: 500 }}>{s.name}</td>
                    <td style={{ textAlign: 'right' }}>{s.maxMarks}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        {s.obtainedMarks}
                        <div style={{ width: 60, height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${(s.obtainedMarks/s.maxMarks)*100}%`, height: '100%', background: '#2563eb', borderRadius: 3 }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 700, color: gradeColor[s.grade] || '#64748b' }}>{s.grade}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="result-summary-grid">
              {[
                ['Total Marks', `${selected.obtainedTotal}/${selected.totalMarks}`],
                ['Percentage', `${selected.percentage}%`],
                ['Grade', selected.grade],
                ['Rank', `#${selected.rank}`],
              ].map(([k, v]) => (
                <div key={k} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{k}</p>
                  <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
