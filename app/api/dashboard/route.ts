import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';

export async function GET() {
  const students = readDB<any>('students');
  const teachers = readDB<any>('teachers');
  const fees = readDB<any>('fees');
  const notices = readDB<any>('notices');
  const admissions = readDB<any>('admissions');
  const attendance = readDB<any>('attendance');

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter((a: any) => a.date === today);
  const presentToday = todayAttendance.filter((a: any) => a.status === 'present').length;

  const totalRevenue = fees.filter((f: any) => f.paymentStatus === 'paid').reduce((sum: number, f: any) => sum + f.amount, 0);
  const pendingFees = fees.filter((f: any) => f.paymentStatus === 'pending').reduce((sum: number, f: any) => sum + f.amount, 0);

  // Fee collection by month (mock)
  const monthlyFees = [
    { month: 'Aug', amount: 85000 },
    { month: 'Sep', amount: 92000 },
    { month: 'Oct', amount: 78000 },
    { month: 'Nov', amount: 95000 },
    { month: 'Dec', amount: totalRevenue },
  ];

  // Class-wise student count
  const classStats = students.reduce((acc: any, s: any) => {
    const key = `Class ${s.class}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    stats: {
      totalStudents: students.length,
      totalTeachers: teachers.length,
      totalRevenue,
      pendingFees,
      presentToday,
      pendingAdmissions: admissions.filter((a: any) => a.status === 'pending').length,
      recentNotices: notices.slice(0, 4),
    },
    charts: {
      monthlyFees,
      classStats: Object.entries(classStats).map(([cls, count]) => ({ cls, count })),
      attendanceRate: todayAttendance.length > 0 ? Math.round((presentToday / todayAttendance.length) * 100) : 0,
    },
  });
}
