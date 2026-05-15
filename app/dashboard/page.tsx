'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../layout';

interface DashData {
  stats: any;
  charts: any;
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, []);

  if (loading) return (
    <div>
      <div className="page-header"><h2 style={{ fontSize: '1.3rem' }}>Dashboard</h2></div>
      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 110 }} />)}
        </div>
      </div>
    </div>
  );

  if (!data) return null;
  const { stats, charts } = data;

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: '👥', color: '#2563eb', bg: '#dbeafe', change: '+3 this month' },
    { label: 'Total Teachers', value: stats.totalTeachers, icon: '🧑‍🏫', color: '#10b981', bg: '#d1fae5', change: 'Active staff' },
    { label: 'Revenue Collected', value: `₹${(stats.totalRevenue/1000).toFixed(1)}K`, icon: '💰', color: '#f59e0b', bg: '#fef3c7', change: `₹${(stats.pendingFees/1000).toFixed(1)}K pending` },
    { label: 'Pending Admissions', value: stats.pendingAdmissions, icon: '📝', color: '#ef4444', bg: '#fee2e2', change: 'Awaiting review' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Dashboard</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 2 }}>
            Welcome back, <strong>{user?.name}</strong> · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="page-body">
        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {statCards.map(card => (
            <div key={card.label} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500, marginBottom: '0.5rem' }}>{card.label}</p>
                  <p style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>{card.value}</p>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.5rem' }}>{card.change}</p>
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="dashboard-charts-grid">
          {/* Monthly Fee Collection */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: '#1e293b' }}>Monthly Fee Collection</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={charts.monthlyFees}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: any) => [`₹${v.toLocaleString()}`, 'Amount']} />
                <Bar dataKey="amount" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Class Distribution */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: '#1e293b' }}>Students by Class</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={charts.classStats} dataKey="count" nameKey="cls" cx="50%" cy="50%" outerRadius={70} label={(props: any) => `${props.cls}: ${props.count}`} labelLine={false}>
                  {charts.classStats.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="dashboard-bottom-grid">
          {/* Recent Notices */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Recent Notices</h3>
              <a href="/dashboard/notices" style={{ fontSize: '0.8rem', color: '#2563eb', textDecoration: 'none' }}>View all →</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats.recentNotices?.map((n: any) => (
                <div key={n.id} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: n.isUrgent ? '#fee2e2' : '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                    {n.isUrgent ? '🚨' : '📢'}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e293b' }}>{n.title}</p>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>{n.category} · {n.publishedDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Today's Overview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: "Today's Attendance", value: `${stats.presentToday} present`, sub: 'from attendance records', color: '#10b981' },
                { label: 'Pending Fee Dues', value: `₹${stats.pendingFees?.toLocaleString()}`, sub: 'across all students', color: '#ef4444' },
                { label: 'New Applications', value: `${stats.pendingAdmissions} pending`, sub: 'awaiting review', color: '#f59e0b' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: 10 }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.label}</p>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.sub}</p>
                  </div>
                  <span style={{ fontWeight: 700, color: item.color, fontSize: '0.9rem' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
