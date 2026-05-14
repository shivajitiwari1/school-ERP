'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../layout';

export default function CalendarPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [teacherInfo, setTeacherInfo] = useState<any>(null);
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<any>({ title: '', className: 'all', date: new Date().toISOString().split('T')[0], time: '09:00', description: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.role === 'teacher') {
      fetchTeacher();
    } else {
      fetchEvents();
    }
  }, [user]);

  useEffect(() => {
    if (teacherInfo && selectedClass === 'all' && teacherInfo.classes?.length > 0) {
      setSelectedClass(teacherInfo.classes[0]);
    }
  }, [teacherInfo]);

  useEffect(() => {
    if (user) fetchEvents();
  }, [selectedClass]);

  async function fetchTeacher() {
    const res = await fetch(`/api/teachers?email=${encodeURIComponent(user?.email || '')}`);
    const data = await res.json();
    setTeacherInfo(data.teacher);
    const teacherClasses = data.teacher?.classes || [];
    setClasses(teacherClasses);
    setSelectedClass(teacherClasses[0] || 'all');
    setForm((prev: any) => ({ ...prev, className: teacherClasses[0] || 'all' }));
    fetchEvents(teacherClasses[0] || 'all');
  }

  async function fetchEvents(className = selectedClass) {
    setLoading(true);
    const params = new URLSearchParams();
    if (className && className !== 'all') params.set('className', className);
    const res = await fetch(`/api/class-calendar?${params.toString()}`);
    const data = await res.json();
    setEvents(data.events);
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    await fetch('/api/class-calendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, createdBy: user?.name }),
    });
    setShowModal(false);
    setForm({ title: '', className: selectedClass || 'all', date: new Date().toISOString().split('T')[0], time: '09:00', description: '' });
    fetchEvents();
    setSaving(false);
  }

  const availableClasses = user?.role === 'teacher' ? classes : ['all', '10A', '9B', '8A', '11A'];

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Class Calendar</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Manage class schedules, reminders and events.</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'teacher') && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add Event</button>
        )}
      </div>

      <div className="page-body">
        <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: '1 1 260px' }}>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>View Calendar for</p>
            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
              {availableClasses.map(cls => (
                <option key={cls} value={cls}>{cls === 'all' ? 'All Classes' : `Class ${cls}`}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: '1 1 260px', minWidth: 200 }}>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>Events shown</p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ padding: '0.85rem 1rem', borderRadius: 14, background: '#eff6ff', color: '#1d4ed8', fontWeight: 600 }}>Total events: {events.length}</div>
              <div style={{ padding: '0.85rem 1rem', borderRadius: 14, background: '#ecfccb', color: '#166534', fontWeight: 600 }}>Class: {selectedClass === 'all' ? 'All' : selectedClass}</div>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 120 }} />)}
          </div>
        ) : events.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No events found for this class.</div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {events.map(event => (
              <div key={event.id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>{event.title}</h3>
                    <p style={{ margin: '0.5rem 0 0', color: '#64748b' }}>{event.description}</p>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 160, display: 'grid', gap: '0.35rem' }}>
                    <span style={{ color: '#475569', fontSize: '0.9rem' }}>{event.className === 'all' ? 'All Classes' : `Class ${event.className}`}</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{event.date} · {event.time}</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>By {event.createdBy}</span>
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
              <h3 style={{ fontSize: '1.2rem' }}>Add Class Event</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#94a3b8' }}>×</button>
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label>Title</label>
                <input type="text" placeholder="Event title..." value={form.title} onChange={e => setForm((p: any) => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label>Class</label>
                <select value={form.className} onChange={e => setForm((p: any) => ({ ...p, className: e.target.value }))}>
                  {availableClasses.map(cls => (
                    <option key={cls} value={cls}>{cls === 'all' ? 'All Classes' : `Class ${cls}`}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label>Date</label>
                  <input type="date" value={form.date} onChange={e => setForm((p: any) => ({ ...p, date: e.target.value }))} />
                </div>
                <div>
                  <label>Time</label>
                  <input type="time" value={form.time} onChange={e => setForm((p: any) => ({ ...p, time: e.target.value }))} />
                </div>
              </div>
              <div>
                <label>Description</label>
                <textarea rows={4} placeholder="Event details..." value={form.description} onChange={e => setForm((p: any) => ({ ...p, description: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Create Event'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
