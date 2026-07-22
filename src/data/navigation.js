export const roleLabels = {
  admin: 'مدير النظام',
  employee: 'موظف إداري',
  teacher: 'معلم',
  affairs: 'شؤون طلاب',
};

export const sidebarItems = [
  { path: '/dashboard', label: 'الرئيسية', icon: 'home' },
  { path: '/stages', label: 'المراحل الدراسية', icon: 'school' },
  { path: '/subjects', label: 'المواد الدراسية', icon: 'book' },
  { path: '/groups', label: 'المجموعات', icon: 'users' },
  { path: '/students', label: 'بيانات الطلاب', icon: 'student' },
  { path: '/bookings', label: 'الحجوزات', icon: 'calendar' },
  { path: '/attendance', label: 'الحضور والغياب', icon: 'check' },
  { path: '/payments', label: 'مدفوعات الطلاب', icon: 'wallet' },
  { path: '/salaries', label: 'الرواتب', icon: 'salary' },
  { path: '/exams', label: 'الامتحانات', icon: 'exam' },
  { path: '/expenses', label: 'المصروفات', icon: 'expenses' },
  { path: '/inventory', label: 'المخازن والجرد', icon: 'inventory' },
  { path: '/reports', label: 'التقارير التحليلية', icon: 'reports' },
  { path: '/users', label: 'المستخدمين', icon: 'users' },
  { path: '/backup', label: 'النسخ الاحتياطي', icon: 'backup', isSpecial: true },
];
