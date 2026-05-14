import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <Sidebar />
      <main className="main-content" style={{ flex: 1, minHeight: '100vh', width: '100%' }}>
        {children}
      </main>
    </div>
  );
}
