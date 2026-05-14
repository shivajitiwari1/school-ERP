import Link from 'next/link';

export default function HomePage() {
  const topServices = [
    { title: 'Admissions', desc: 'Simplified student enrollment and application tracking.' },
    { title: 'Fee Management', desc: 'Instant billing, payment records, and fee reminders.' },
    { title: 'Attendance', desc: 'Daily attendance capture for students and teachers.' },
    { title: 'Results', desc: 'Grade books, report cards, and academic insights.' },
  ];

  const benefits = [
    { title: 'Parent Communication', desc: 'Publish notices, events, and announcements instantly.' },
    { title: 'Staff Productivity', desc: 'Give teachers one place to manage classes and students.' },
    { title: 'Secure Records', desc: 'Keep student, fee and academic information safe.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fbff', color: '#1e293b' }}>
      <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '1rem 2rem', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #2563eb, #1a3a6e)', display: 'grid', placeItems: 'center', color: 'white', fontSize: 22 }}>
              🎓
            </div>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontWeight: 700 }}>EduManage</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>School Management System</div>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link href="#home" style={{ color: '#334155', textDecoration: 'none', fontWeight: 500 }}>Home</Link>
            <Link href="#services" style={{ color: '#334155', textDecoration: 'none', fontWeight: 500 }}>Services</Link>
            <Link href="#why" style={{ color: '#334155', textDecoration: 'none', fontWeight: 500 }}>Why Us</Link>
            <Link href="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Login</Link>
          </nav>

          <Link href="/login" style={{ background: 'linear-gradient(135deg, #2563eb, #1a3a6e)', color: 'white', textDecoration: 'none', padding: '0.75rem 1.25rem', borderRadius: 12, fontWeight: 700 }}>Get Started</Link>
        </div>
      </header>

      <section id="home" style={{ padding: '5rem 2rem', background: 'linear-gradient(135deg, #0f2348 0%, #184b9d 45%, #2563eb 100%)', color: 'white' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.14)', padding: '0.7rem 1rem', borderRadius: 9999, marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.22)' }}>
              <span style={{ fontSize: '0.95rem' }}>🎓</span>
              <span style={{ fontSize: '0.85rem', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.9 }}>School ERP & Website</span>
            </div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2.75rem, 5vw, 4.5rem)', lineHeight: 1.02, marginBottom: '1.5rem' }}>
              Modern school management built for parents, teachers, and administrators.
            </h1>
            <p style={{ maxWidth: 580, fontSize: '1.05rem', lineHeight: 1.8, opacity: 0.9, marginBottom: '2rem' }}>
              Manage admissions, fees, attendance, results, notices and dashboards from one clean and responsive platform.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/login" style={{ background: 'white', color: '#1a3a6e', padding: '0.95rem 2rem', borderRadius: 14, fontWeight: 700, textDecoration: 'none', minWidth: 170, textAlign: 'center' }}>
                Admin Login
              </Link>
              <Link href="/login" style={{ background: 'rgba(255,255,255,0.16)', color: 'white', padding: '0.95rem 2rem', borderRadius: 14, fontWeight: 600, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.35)', minWidth: 170, textAlign: 'center' }}>
                Student / Parent Login
              </Link>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)', borderRadius: 28, padding: '2rem' }}>
              <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '1.25rem' }}>Transform your school with features that drive attendance, fees, admissions and results.</p>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {['Live attendance', 'Fee collection', 'Noticeboard', 'Admissions portal'].map(item => (
                  <div key={item} style={{ display: 'flex', gap: '0.9rem', alignItems: 'center' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 12, background: 'white', display: 'grid', placeItems: 'center', color: '#2563eb', fontSize: 18 }}>✓</div>
                    <p style={{ margin: 0, fontSize: '0.98rem', color: 'white', opacity: 0.94 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ background: 'white', borderRadius: 24, padding: '1.75rem', color: '#1e293b', boxShadow: '0 24px 60px rgba(15,36,72,0.12)' }}>
                <p style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 700, marginBottom: '0.75rem' }}>VISITOR STATISTICS</p>
                <div style={{ display: 'grid', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}><span>Schools onboarded</span><strong>120+</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}><span>Daily attendance</span><strong>95%+</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}><span>Fee collection rate</span><strong>98%</strong></div>
                </div>
              </div>
              <div style={{ background: '#1a3a6e', borderRadius: 24, padding: '1.75rem', color: 'white' }}>
                <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '0.75rem' }}>SCHOOL WEBSITE</p>
                <h3 style={{ margin: 0, fontSize: '1.35rem', lineHeight: 1.3 }}>A beautiful landing page and student portal, ready to use.</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" style={{ padding: '4rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ textTransform: 'uppercase', letterSpacing: '0.18em', color: '#2563eb', fontSize: '0.8rem', marginBottom: '0.75rem' }}>Core Services</p>
          <h2 style={{ fontSize: '2.25rem', fontFamily: 'Playfair Display, serif', color: '#1a3a6e' }}>Everything your school needs in a single package</h2>
          <p style={{ maxWidth: 720, margin: '0.75rem auto 0', color: '#64748b', lineHeight: 1.8 }}>From admissions to reports, the platform supports every essential school workflow with clean interfaces and real-time insights.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
          {topServices.map(service => (
            <div key={service.title} style={{ background: 'white', borderRadius: 24, padding: '1.75rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.85rem', color: '#1a3a6e' }}>{service.title}</h3>
              <p style={{ color: '#64748b', lineHeight: 1.7 }}>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="why" style={{ padding: '4rem 2rem', background: '#eef5ff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
          <div>
            <p style={{ textTransform: 'uppercase', letterSpacing: '0.18em', color: '#2563eb', fontSize: '0.8rem', marginBottom: '0.75rem' }}>Why EduManage?</p>
            <h2 style={{ fontSize: '2.25rem', fontFamily: 'Playfair Display, serif', color: '#1a3a6e', marginBottom: '1rem' }}>Designed to simplify school life for everyone</h2>
            <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: '2rem' }}>Deliver modern digital experiences for parents, teachers, and administrators with one easy-to-use platform.</p>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {benefits.map(benefit => (
                <div key={benefit.title} style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start', background: 'white', borderRadius: 18, padding: '1.25rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: '#eff6ff', display: 'grid', placeItems: 'center', color: '#2563eb', fontSize: 18 }}>✓</div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: '#1f2937' }}>{benefit.title}</h3>
                    <p style={{ margin: '0.5rem 0 0', color: '#64748b', lineHeight: 1.7 }}>{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: '2rem', borderRadius: 28, background: 'linear-gradient(135deg, white 0%, #eaf2ff 100%)', border: '1px solid #dbeafe', boxShadow: '0 30px 70px rgba(37, 99, 235, 0.08)' }}>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ background: 'white', borderRadius: 20, padding: '1.5rem', boxShadow: '0 10px 30px rgba(15,36,72,0.06)' }}>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', color: '#1a3a6e' }}>Fast onboarding</h3>
                <p style={{ color: '#64748b', lineHeight: 1.75 }}>Start with demo accounts and a ready-made dashboard for your school.</p>
              </div>
              <div style={{ background: 'white', borderRadius: 20, padding: '1.5rem', boxShadow: '0 10px 30px rgba(15,36,72,0.06)' }}>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', color: '#1a3a6e' }}>Responsive experience</h3>
                <p style={{ color: '#64748b', lineHeight: 1.75 }}>Accessible on phones, tablets, and desktops for students and parents.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ background: '#0f2348', color: 'rgba(255,255,255,0.82)', padding: '2.5rem 2rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', marginBottom: '0.5rem' }}>EduManage</p>
        <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>A complete school management system for modern institutions. Login to access the dashboard and manage your school online.</p>
      </footer>
    </div>
  );
}