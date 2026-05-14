'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../layout';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: 'admin@school.edu', password: 'admin123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const demos = [
    { label: 'Admin', email: 'admin@school.edu', password: 'admin123', color: '#1a3a6e' },
    { label: 'Teacher', email: 'priya@school.edu', password: 'teacher123', color: '#059669' },
    { label: 'Student', email: 'rahul@school.edu', password: 'student123', color: '#7c3aed' },
    { label: 'Parent', email: 'sunita@school.edu', password: 'parent123', color: '#dc2626' },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); return; }
      login(data.user, data.token);
      router.push('/dashboard');
    } catch { setError('Connection error'); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #0f2348 0%, #1a3a6e 50%, #2563eb 100%)' }}>
      {/* Left panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: 'white' }}>
        <div style={{ maxWidth: 420 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.2)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🎓</div>
            <div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' }}>EduManage</h1>
              <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Smart School Management System</p>
            </div>
          </div>
          <div style={{ borderLeft: '3px solid rgba(255,255,255,0.3)', paddingLeft: '1.5rem', marginBottom: '2rem' }}>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, opacity: 0.9 }}>A complete digital platform for schools to manage academics, admissions, fees, and communication.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {['Student Management', 'Fee Management', 'Attendance Tracking', 'Result Analytics', 'Online Admissions', 'Notice Board'].map(f => (
              <div key={f} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.6rem 0.9rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>✓</span> {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: 440, background: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem', boxShadow: '-20px 0 60px rgba(0,0,0,0.3)' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1e293b' }}>Welcome Back</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem' }}>Sign in to your school account</p>

        {/* Demo accounts */}
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Demo Login</p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {demos.map(d => (
              <button key={d.label} onClick={() => setForm({ email: d.email, password: d.password })}
                style={{ background: `${d.color}15`, color: d.color, border: `1px solid ${d.color}30`, borderRadius: 8, padding: '0.35rem 0.75rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label>Email Address</label>
            <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="your@school.edu" required />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••" required />
          </div>
          {error && <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 10, padding: '0.75rem', fontSize: '0.875rem' }}>⚠️ {error}</div>}
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '0.8rem', fontSize: '1rem', marginTop: '0.5rem' }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem', color: '#94a3b8' }}>
          © 2024 EduManage. All rights reserved.
        </p>
      </div>
    </div>
  );
}
