'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../layout';

export default function NoticesPage() {
  const { user } = useAuth();
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<any>({ category: 'Event', targetAudience: 'all', isUrgent: false, content: '' });
  const [saving, setSaving] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState<any>(null);
  const [classList, setClassList] = useState<string[]>([]);
  const [filterAudience, setFilterAudience] = useState('all');
  const [filterClass, setFilterClass] = useState('');

  const fetchTeacher = async () => {
    if (!user?.email || user.role !== 'teacher') return;
    const res = await fetch(`/api/teachers?email=${encodeURIComponent(user.email)}`);
    const data = await res.json();
    setTeacherInfo(data.teacher);
    setClassList(data.teacher?.classes || []);
  };

  const fetchNotices = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (user?.role === 'teacher') {
      params.set('audience', 'teachers');
      if (classList.length) params.set('classes', classList.join(','));
    }
    if (filterAudience !== 'all') params.set('audience', filterAudience);
    if (filterClass) params.set('classes', filterClass);
    const res = await fetch(`/api/notices?${params.toString()}`);
    const data = await res.json();
    setNotices(data.notices);
    setLoading(false);
  };

  useEffect(() => { fetchTeacher(); }, [user]);
  useEffect(() => { if (user) fetchNotices(); }, [user, classList, filterAudience, filterClass]);

  async function handleSave() {
    setSaving(true);
    await fetch('/api/notices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, publishedBy: user?.name }) });
    setShowModal(false);
    setForm({ category: 'Event', targetAudience: 'all', isUrgent: false, content: '' });
    fetchNotices();
    setSaving(false);
  }

  const catColors: Record<string, string> = { Event: '#2563eb', Holiday: '#10b981', Fee: '#ef4444', Academic: '#8b5cf6', General: '#f59e0b' };
  const catIcons: Record<string, string> = { Event: '🎉', Holiday: '🏖️', Fee: '💰', Academic: '📚', General: '📢' };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Notice Board</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{notices.length} notices</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'teacher') && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ Post Notice</button>
        )}
      </div>

      <div className="page-body">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 100 }} />)}
          </div>
        ) : notices.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No notices found</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notices.map(n => (
              <div key={n.id} className="card" style={{ padding: '1.5rem', borderLeft: `4px solid ${n.isUrgent ? '#ef4444' : (catColors[n.category] || '#94a3b8')}` }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: n.isUrgent ? '#fee2e2' : `${catColors[n.category]}15` || '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                    {n.isUrgent ? '🚨' : (catIcons[n.category] || '📢')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', fontWeight: 600 }}>{n.title}</h3>
                      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                        {n.isUrgent && <span className="badge badge-danger">URGENT</span>}
                        <span className="badge badge-info">{n.category}</span>
                        <span className="badge" style={{ background: '#f1f5f9', color: '#64748b' }}>{n.targetAudience}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6 }}>{n.content}</p>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.75rem' }}>
                      Posted by {n.publishedBy} · {n.publishedDate}
                    </p>
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
              <h3 style={{ fontSize: '1.2rem' }}>Post New Notice</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#94a3b8' }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label>Title</label>
                <input type="text" placeholder="Notice title..." value={form.title || ''} onChange={e => setForm((p: any) => ({ ...p, title: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label>Category</label>
                  <select value={form.category} onChange={e => setForm((p: any) => ({ ...p, category: e.target.value }))}>
                    {['Event','Holiday','Fee','Academic','General'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label>Target Audience</label>
                  <select value={form.targetAudience} onChange={e => setForm((p: any) => ({ ...p, targetAudience: e.target.value }))}>
                    {['all','students','teachers','parents'].map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label>Content</label>
                <textarea rows={4} placeholder="Notice content..." value={form.content || ''} onChange={e => setForm((p: any) => ({ ...p, content: e.target.value }))} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.isUrgent} onChange={e => setForm((p: any) => ({ ...p, isUrgent: e.target.checked }))} style={{ width: 'auto' }} />
                Mark as Urgent
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Posting...' : 'Post Notice'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
