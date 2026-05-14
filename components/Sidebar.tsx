'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/layout';

const NAV_ITEMS: Record<string, { icon: string; label: string; href: string; roles: string[] }[]> = {
  main: [
    { icon: '⊞', label: 'Dashboard', href: '/dashboard', roles: ['admin', 'teacher', 'student', 'parent'] },
  ],
  academic: [
    { icon: '👥', label: 'Students', href: '/dashboard/students', roles: ['admin', 'teacher'] },
    { icon: '🧑‍🏫', label: 'Teachers', href: '/dashboard/teachers', roles: ['admin'] },
    { icon: '✅', label: 'Attendance', href: '/dashboard/attendance', roles: ['admin', 'teacher', 'student', 'parent'] },
    { icon: '📊', label: 'Results', href: '/dashboard/results', roles: ['admin', 'teacher', 'student', 'parent'] },
  ],
  admin: [
    { icon: '💰', label: 'Fees', href: '/dashboard/fees', roles: ['admin', 'parent'] },
    { icon: '📝', label: 'Admissions', href: '/dashboard/admissions', roles: ['admin'] },
    { icon: '📢', label: 'Notices', href: '/dashboard/notices', roles: ['admin', 'teacher', 'student', 'parent'] },
    { icon: '📅', label: 'Class Calendar', href: '/dashboard/calendar', roles: ['admin', 'teacher'] },
  ],
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  if (!user) return null;

  const roleColors: Record<string, string> = { admin: '#f59e0b', teacher: '#10b981', student: '#8b5cf6', parent: '#ef4444' };

  return (
    <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🎓</div>
          <div>
            <div style={{ color: 'white', fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.1rem' }}>EduManage</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>School Management</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
        {Object.entries(NAV_ITEMS).map(([section, items]) => {
          const filtered = items.filter(i => i.roles.includes(user.role));
          if (!filtered.length) return null;
          return (
            <div key={section} style={{ marginBottom: '1.25rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.75rem', marginBottom: '0.35rem' }}>
                {section === 'main' ? 'Overview' : section === 'academic' ? 'Academic' : 'Management'}
              </p>
              {filtered.map(item => (
                <Link key={item.href} href={item.href} className={`nav-item ${pathname === item.href ? 'active' : ''}`}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.08)', borderRadius: 12, marginBottom: '0.5rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: roleColors[user.role] || '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', textTransform: 'capitalize' }}>{user.role}</div>
          </div>
        </div>
        <button onClick={logout} className="nav-item" style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', color: 'rgba(255,255,255,0.5)' }}>
          <span>🚪</span><span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
