import React, { createContext, useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { apiRequest } from './services/api';

const AuthContext = createContext(null);
const SettingsContext = createContext(null);

const roleLabels = {
  admin: 'مدير النظام',
  employee: 'موظف إداري',
  teacher: 'معلم',
  affairs: 'شؤون طلاب',
};

const sidebarItems = [
  { path: '/dashboard', label: 'الرئيسية', icon: '🏠' },
  { path: '/stages', label: 'المراحل الدراسية', icon: '🎓' },
  { path: '/subjects', label: 'المواد الدراسية', icon: '📚' },
  { path: '/groups', label: 'المجموعات', icon: '👥' },
  { path: '/students', label: 'بيانات الطلاب', icon: '🧑‍🎓' },
  { path: '/attendance', label: 'الحضور والغياب', icon: '✅' },
  { path: '/payments', label: 'المدفوعات', icon: '💳' },
  { path: '/reports', label: 'التقارير', icon: '📊' },
  { path: '/settings', label: 'الإعدادات', icon: '⚙️' },
];

function IconGlyph({ name }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  switch (name) {
    case 'clock':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case 'calendar':
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
          <path d="M8 3.5v3" />
          <path d="M16 3.5v3" />
          <path d="M3.5 9h17" />
        </svg>
      );
    case 'gear':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3.1" />
          <path d="M19 12a7 7 0 0 0-.1-1l2.1-1.6-2-3.5-2.5 1a7.2 7.2 0 0 0-1.7-1l-.4-2.7H9.6L9.2 6a7.2 7.2 0 0 0-1.7 1l-2.5-1-2 3.5L5.1 11a7 7 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.2 7.2 0 0 0 1.7 1l.4 2.7h4.8l.4-2.7a7.2 7.2 0 0 0 1.7-1l2.5 1 2-3.5L18.9 13a7 7 0 0 0 .1-1Z" />
        </svg>
      );
    case 'user':
      return (
        <svg {...common}>
          <path d="M20 21a8 8 0 1 0-16 0" />
          <circle cx="12" cy="8" r="4" />
        </svg>
      );
    case 'students':
      return (
        <svg {...common}>
          <path d="M12 13a4 4 0 1 0-4-4" />
          <path d="M4 20a8 8 0 0 1 16 0" />
          <circle cx="18" cy="9" r="2.3" />
        </svg>
      );
    case 'attendance':
      return (
        <svg {...common}>
          <path d="M5 12l4 4 10-10" />
          <path d="M12 22a10 10 0 1 0-10-10" />
        </svg>
      );
    case 'wallet':
      return (
        <svg {...common}>
          <path d="M4.5 7.5h13a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V9.5a2 2 0 0 1 2-2Z" />
          <path d="M16.5 12h3" />
          <path d="M6 7.5V5.8A2.3 2.3 0 0 1 8.3 3.5H19" />
        </svg>
      );
    case 'expenses':
      return (
        <svg {...common}>
          <path d="M12 3v18" />
          <path d="M16.5 7a3.5 3.5 0 0 0-7 0c0 3.5 7 3.5 7 7a3.5 3.5 0 0 1-7 0" />
        </svg>
      );
    case 'warning':
      return (
        <svg {...common}>
          <path d="M12 4 21 19H3Z" />
          <path d="M12 9v5" />
          <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'book':
      return (
        <svg {...common}>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22Z" />
          <path d="M8 3v19" />
        </svg>
      );
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 5 5" />
        </svg>
      );
    case 'filter':
      return (
        <svg {...common}>
          <path d="M4 6h16l-6 7v4l-4 2v-6Z" />
        </svg>
      );
    default:
      return null;
  }
}

function getSavedJSON(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSavedJSON('school_user'));
  const [tokens, setTokens] = useState(() => ({
    access: localStorage.getItem('school_access_token') || '',
    refresh: localStorage.getItem('school_refresh_token') || '',
  }));

  const login = (payload) => {
    setUser(payload.user);
    setTokens({ access: payload.access, refresh: payload.refresh });
    localStorage.setItem('school_user', JSON.stringify(payload.user));
    localStorage.setItem('school_access_token', payload.access);
    localStorage.setItem('school_refresh_token', payload.refresh);
  };

  const logout = () => {
    setUser(null);
    setTokens({ access: '', refresh: '' });
    localStorage.removeItem('school_user');
    localStorage.removeItem('school_access_token');
    localStorage.removeItem('school_refresh_token');
  };

  const value = useMemo(() => ({ user, tokens, login, logout }), [user, tokens]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function SettingsProvider({ children }) {
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('school_font_size') || 'medium');

  useEffect(() => {
    localStorage.setItem('school_font_size', fontSize);
    document.documentElement.dataset.fontSize = fontSize;
  }, [fontSize]);

  const value = useMemo(() => ({ fontSize, setFontSize }), [fontSize]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

function useAuth() {
  return React.useContext(AuthContext);
}

function useSettings() {
  return React.useContext(SettingsContext);
}

function getDisplayName(user) {
  if (!user) return 'أحمد إسماعيل';
  console.log('User object:', user); // Debugging line
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
  return user.name || fullName || user.username || 'أحمد إسماعيل';
}

function AppShell({ children }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { fontSize, setFontSize } = useSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const dateText = new Intl.DateTimeFormat('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const timeText = new Intl.DateTimeFormat('ar-EG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date());

  const activeLabel = sidebarItems.find((item) => location.pathname.startsWith(item.path))?.label || 'الرئيسية';

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">مدرسة</div>
          <div>
            <div className="brand-title">نظام إدارة المدرسة</div>
            <div className="brand-subtitle">{user ? roleLabels[user.role] : 'منصة تعليمية عربية'}</div>
          </div>
        </div>
        <nav className="side-nav">
          {sidebarItems.map((item) => (
            <Link key={item.path} className={`side-link ${location.pathname.startsWith(item.path) ? 'active' : ''}`} to={item.path}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <button className="logout-btn" onClick={logout} type="button">
          تسجيل خروج
        </button>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <div className="page-title">{activeLabel}</div>
            <div className="page-subtitle">مرحبا بك في لوحة التحكم الرئيسية</div>
          </div>
          <div className="topbar-actions">
            <div className="meta-pill">
              <span className="pill-icon"><IconGlyph name="clock" /></span>
              <span>{timeText}</span>
            </div>
            <div className="meta-pill">
              <span className="pill-icon"><IconGlyph name="calendar" /></span>
              <span>{dateText}</span>
            </div>
            <button className="icon-btn" type="button" onClick={() => setSettingsOpen((value) => !value)}>
              <IconGlyph name="gear" />
            </button>
            <div className="profile-chip">
              <div className="avatar">
                <IconGlyph name="user" />
              </div>
              <div className="profile-copy">
                <div className="profile-type">نوع الحساب</div>
                <div className="profile-name">{getDisplayName(user)}</div>
                <div className="profile-role">{user ? roleLabels[user.role] : 'مدير المدرسة'}</div>
              </div>
            </div>
          </div>
        </header>

        {settingsOpen ? (
          <div className="settings-dropdown">
            <div className="settings-title">إعدادات المظهر</div>
            <div className="settings-row">
              <button type="button" className={fontSize === 'small' ? 'active' : ''} onClick={() => setFontSize('small')}>
                صغير
              </button>
              <button type="button" className={fontSize === 'medium' ? 'active' : ''} onClick={() => setFontSize('medium')}>
                متوسط
              </button>
              <button type="button" className={fontSize === 'large' ? 'active' : ''} onClick={() => setFontSize('large')}>
                كبير
              </button>
            </div>
          </div>
        ) : null}

        <section className="page-body">{children}</section>
      </main>
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    // محاكاة تأخير بسيط للشبكة لتبدو العملية واقعية أثناء الفحص والتجريب
    setTimeout(() => {
      try {
        // بيانات مستخدم تجريبي يتم قبولها وتخطي الـ API
        const mockData = {
          access: 'mocked_access_token_for_testing',
          refresh: 'mocked_refresh_token_for_testing',
          user: {
            id: 999,
            username: form.identifier || 'test_user',
            email: form.identifier || 'test@school.com',
            first_name: 'أحمد',
            last_name: 'إسماعيل',
            role: 'admin', // يمكنك تغيير الدور الافتراضي للتجربة (admin, teacher, employee, affairs)
          },
        };

        login(mockData);
        navigate('/dashboard');
      } catch (err) {
        setError('حدث خطأ أثناء تسجيل الدخول التجريبي');
      } finally {
        setLoading(false);
      }
    }, 600); // 600ms تأخير
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">نظام إدارة المدرسة</div>
        <h1>تسجيل الدخول (وضع التجريب)</h1>
        <p>ادخل أي بريد إلكتروني وكلمة مرور لتخطي الدخول والتجربة.</p>
        <form onSubmit={submit} className="auth-form">
          <label>
            البريد الإلكتروني
            <input value={form.identifier} onChange={(e) => setForm({ ...form, identifier: e.target.value })} />
          </label>
          <label>
            كلمة المرور
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>
          {error ? <div className="form-error">{error}</div> : null}
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'جاري الدخول...' : 'دخول مباشر'}
          </button>
        </form>
        <Link to="/signup" className="auth-link">
          ليس لديك حساب؟ إنشاء حساب جديد
        </Link>
      </div>
    </div>
  );
}

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'teacher',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const parts = form.name.trim().split(' ');
    const payload = {
      username: form.email,
      email: form.email,
      first_name: parts[0] || form.name,
      last_name: parts.slice(1).join(' '),
      role: form.role,
      password: form.password,
    };

    try {
      await apiRequest('/auth/register/', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });
      navigate('/login');
    } catch {
      setError('تعذر إنشاء الحساب، تأكد من البيانات المدخلة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">نظام إدارة المدرسة</div>
        <h1>إنشاء حساب</h1>
        <p>أنشئ حسابا جديدا واختر الدور المناسب.</p>
        <form onSubmit={submit} className="auth-form">
          <label>
            الاسم الكامل
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label>
            البريد الإلكتروني
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label>
            الدور
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="admin">مدير النظام</option>
              <option value="employee">موظف إداري</option>
              <option value="teacher">معلم</option>
              <option value="affairs">شؤون طلاب</option>
            </select>
          </label>
          <label>
            كلمة المرور
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>
          {error ? <div className="form-error">{error}</div> : null}
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
          </button>
        </form>
        <Link to="/login" className="auth-link">
          لديك حساب بالفعل؟ تسجيل الدخول
        </Link>
      </div>
    </div>
  );
}

function EyeNumber({ value, label, unit, visible, icon }) {
  return (
    <div className="eye-number">
      <div className="eye-title">{label}</div>
      <div className="eye-icon-wrap">
        <IconGlyph name={icon} />
      </div>
      <div className="eye-value">{visible ? value : '*****'}</div>
      <div className="eye-unit">{unit}</div>
    </div>
  );
}

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let alive = true;
    apiRequest('/dashboard/stats/')
      .then((data) => {
        if (alive) setDashboard(data);
      })
      .catch(() => {
        if (alive) {
          setDashboard({
            students: 152,
            attendance: 132,
            paid: 15250,
            remaining: 5500,
            expenses: 2300,
            late_payments: 3,
            today_absence: 3,
            today_schedule: [
              ['08:00 ص', 'الصف الأول الابتدائي', 'رياضيات', '28 طالبا'],
              ['09:30 ص', 'الصف الثاني الإعدادي', 'علوم', '25 طالبا'],
              ['11:00 ص', 'الصف الثالث الثانوي', 'فيزياء', '30 طالبا'],
              ['12:30 م', 'الصف الرابع الابتدائي', 'لغة عربية', '22 طالبا'],
            ],
            notifications: ['لديك 3 طلاب متأخرين في السداد', 'تم تحديث الحضور اليوم', 'تمت إضافة حصة جديدة إلى الجدول'],
          });
        }
      });

    return () => {
      alive = false;
    };
  }, []);

  const cards = [
    { label: 'الطلاب', value: dashboard?.students ?? 152, unit: 'طالب', color: 'blue', icon: 'students' },
    { label: 'الحضور', value: dashboard?.attendance ?? 132, unit: 'طالب', color: 'green', icon: 'attendance' },
    { label: 'المدفوع', value: dashboard?.paid ?? '15,250', unit: 'ج.م', color: 'teal', icon: 'wallet' },
    { label: 'المتبقي', value: dashboard?.remaining ?? '5,500', unit: 'ج.م', color: 'orange', icon: 'wallet' },
    { label: 'المصروفات', value: dashboard?.expenses ?? '2,300', unit: 'ج.م', color: 'rose', icon: 'expenses' },
    { label: 'المتأخرون في السداد', value: dashboard?.late_payments ?? 3, unit: 'طالب', color: 'red', icon: 'warning' },
    { label: 'الغياب اليوم', value: dashboard?.today_absence ?? 3, unit: 'طالب', color: 'violet', icon: 'warning' },
  ];

  const schedule = (dashboard?.today_schedule || []).map((item) =>
    Array.isArray(item) ? item : [item.time, item.group, item.subject, `${item.students} طالبا`]
  );
  const notifications = dashboard?.notifications || [];

  return (
    <div className="dashboard-grid">
      <div className="dashboard-actions">
        <button type="button" className="toggle-btn" onClick={() => setVisible((value) => !value)}>
          {visible ? '🙈 إخفاء الكل' : '👁️ عرض الكل'}
        </button>
      </div>

      <div className="stat-grid">
        {cards.map((card) => (
          <article key={card.label} className={`stat-card ${card.color}`}>
            <EyeNumber value={card.value} label={card.label} unit={card.unit} visible={visible} icon={card.icon} />
          </article>
        ))}
      </div>

      <div className="dashboard-panels">
        <section className="panel large">
          <div className="panel-header">
            <h2>جدول اليوم</h2>
            <span>الأحد 25 مايو 2024</span>
          </div>
          <div className="schedule-list">
            {schedule.map(([time, group, subject, students]) => (
              <div className="schedule-row" key={`${time}-${group}`}>
                <span>{time}</span>
                <span>{group}</span>
                <span>{subject}</span>
                <span>{students}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>الإشعارات</h2>
          </div>
          <ul className="notification-list">
            {notifications.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function StageModal({ stage, onClose, onSave }) {
  const [form, setForm] = useState(
    stage || {
      name: '',
      grade_range: '',
      is_active: true,
      students_count: 0,
      groups_count: 0,
    }
  );

  useEffect(() => {
    setForm(
      stage || {
        name: '',
        grade_range: '',
        is_active: true,
        students_count: 0,
        groups_count: 0,
      }
    );
  }, [stage]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>{stage ? 'تعديل مرحلة دراسية' : 'إضافة مرحلة دراسية'}</h3>
            <p>أدخل بيانات المرحلة بشكل منظم وواضح</p>
          </div>
          <div className="modal-head-icon">
            <IconGlyph name="book" />
          </div>
        </div>
        <div className="modal-grid">
          <div className="field-card">
            <div className="field-label">اسم المرحلة</div>
            <div className="field-shell">
              <span className="field-icon"><IconGlyph name="book" /></span>
              <input placeholder="مثال: المرحلة الابتدائية" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
          </div>
          <div className="field-card">
            <div className="field-label">الصفوف</div>
            <div className="field-shell">
              <span className="field-icon"><IconGlyph name="calendar" /></span>
              <input placeholder="مثال: الصفوف 1 - 6" value={form.grade_range} onChange={(e) => setForm({ ...form, grade_range: e.target.value })} />
            </div>
          </div>
          <div className="field-card">
            <div className="field-label">عدد الطلاب</div>
            <div className="field-shell">
              <span className="field-icon"><IconGlyph name="students" /></span>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={form.students_count}
                onChange={(e) => setForm({ ...form, students_count: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="field-card">
            <div className="field-label">عدد المجموعات</div>
            <div className="field-shell">
              <span className="field-icon"><IconGlyph name="user" /></span>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={form.groups_count}
                onChange={(e) => setForm({ ...form, groups_count: Number(e.target.value) })}
              />
            </div>
          </div>
          <label className="status-card">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            <span>
              <strong>الحالة النشطة</strong>
              <small>عند تفعيلها ستظهر ضمن النتائج النشطة</small>
            </span>
          </label>
        </div>
        <div className="modal-actions">
          <button type="button" className="secondary-btn" onClick={onClose}>
            إلغاء
          </button>
          <button type="button" className="primary-btn" onClick={() => onSave(form)}>
            حفظ
          </button>
        </div>
      </div>
    </div>
  );
}

function AcademicStagesPage() {
  const [stages, setStages] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: 'all' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingStage, setEditingStage] = useState(null);

  const loadStages = async (nextFilters = filters) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (nextFilters.search.trim()) params.set('search', nextFilters.search.trim());
    if (nextFilters.status !== 'all') params.set('status', nextFilters.status);

    try {
      const data = await apiRequest(`/stages/${params.toString() ? `?${params.toString()}` : ''}`);
      setStages(Array.isArray(data) ? data : []);
    } catch {
      setStages([
        { id: 1, name: 'المرحلة الابتدائية', grade_range: 'الصفوف 1 - 6', students_count: 78, groups_count: 4, status_label: 'نشطة', is_active: true },
        { id: 2, name: 'المرحلة الإعدادية', grade_range: 'الصفوف 7 - 9', students_count: 46, groups_count: 2, status_label: 'نشطة', is_active: true },
        { id: 3, name: 'المرحلة الثانوية', grade_range: 'الصفوف 10 - 12', students_count: 28, groups_count: 2, status_label: 'نشطة', is_active: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStages(filters);
  }, [filters.search, filters.status]);

  const saveStage = async (form) => {
    const payload = {
      name: form.name,
      grade_range: form.grade_range,
      is_active: form.is_active,
      students_count: form.students_count,
      groups_count: form.groups_count,
    };

    try {
      if (editingStage?.id) {
        await apiRequest(`/stages/${editingStage.id}/`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' },
        });
        setMessage('تم تعديل المرحلة بنجاح');
      } else {
        await apiRequest('/stages/', {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' },
        });
        setMessage('تمت إضافة المرحلة بنجاح');
      }
      setEditingStage(null);
      loadStages(filters);
    } catch {
      setMessage('حدث خطأ أثناء الحفظ');
    }
  };

  const removeStage = async (stage) => {
    if (!window.confirm(`هل تريد حذف ${stage.name}؟`)) return;
    try {
      await apiRequest(`/stages/${stage.id}/`, { method: 'DELETE' });
      setMessage('تم حذف المرحلة بنجاح');
      loadStages(filters);
    } catch {
      setMessage('تعذر حذف المرحلة');
    }
  };

  return (
    <div className="stages-page">
      <div className="stages-header">
        <button type="button" className="primary-btn" onClick={() => setEditingStage({})}>
          + إضافة مرحلة دراسية
        </button>
        <div className="stages-filters">
          <div className="filter-shell search-shell" style={{ maxWidth: 'fit-content' }}>
            <span className="filter-icon"><IconGlyph name="search" /></span>
            <input
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="ابحث عن مرحلة دراسية..."
            />
          </div>
          <div className="filter-shell select-shell">
            <span className="filter-icon"><IconGlyph name="filter" /></span>
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="all">جميع الحالات</option>
              <option value="active">نشطة</option>
              <option value="inactive">غير نشطة</option>
            </select>
          </div>
        </div>
      </div>

      {message ? <div className="message-box">{message}</div> : null}

      <div className="summary-grid">
        <div className="summary-card">
          <div>إجمالي المراحل</div>
          <strong>{stages.length}</strong>
        </div>
        <div className="summary-card">
          <div>عدد الطلاب</div>
          <strong>{stages.reduce((sum, stage) => sum + Number(stage.students_count || 0), 0)}</strong>
        </div>
        <div className="summary-card">
          <div>عدد المجموعات</div>
          <strong>{stages.reduce((sum, stage) => sum + Number(stage.groups_count || 0), 0)}</strong>
        </div>
      </div>

      <section className="panel">
        <div className="panel-header">
          <h2>قائمة المراحل الدراسية</h2>
          {loading ? <span>جاري التحميل...</span> : null}
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>اسم المرحلة</th>
                <th>الصف</th>
                <th>عدد الطلاب</th>
                <th>عدد المجموعات</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {stages.map((stage) => (
                <tr key={stage.id}>
                  <td>{stage.name}</td>
                  <td>{stage.grade_range}</td>
                  <td>{stage.students_count}</td>
                  <td>{stage.groups_count}</td>
                  <td>{stage.status_label || (stage.is_active ? 'نشطة' : 'غير نشطة')}</td>
                  <td className="action-cell">
                    <button type="button" className="text-btn" onClick={() => setEditingStage(stage)}>
                      تعديل
                    </button>
                    <button type="button" className="text-btn danger" onClick={() => removeStage(stage)}>
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
              {stages.length === 0 ? (
                <tr>
                  <td colSpan="6">لا توجد نتائج</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {editingStage ? <StageModal stage={editingStage.id ? editingStage : null} onClose={() => setEditingStage(null)} onSave={saveStage} /> : null}
    </div>
  );
}

function ComingSoonPage({ title }) {
  return (
    <div className="coming-soon">
      <h1>{title}</h1>
      <p>هذه الصفحة ستكتمل لاحقا ضمن نفس النظام.</p>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppShell>
              <DashboardPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/stages"
        element={
          <ProtectedRoute>
            <AppShell>
              <AcademicStagesPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/subjects"
        element={
          <ProtectedRoute>
            <AppShell>
              <ComingSoonPage title="المواد الدراسية" />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/groups"
        element={
          <ProtectedRoute>
            <AppShell>
              <ComingSoonPage title="المجموعات" />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <AppShell>
              <ComingSoonPage title="بيانات الطلاب" />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <ProtectedRoute>
            <AppShell>
              <ComingSoonPage title="الحضور والغياب" />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <AppShell>
              <ComingSoonPage title="المدفوعات" />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <AppShell>
              <ComingSoonPage title="التقارير" />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppShell>
              <ComingSoonPage title="الإعدادات" />
            </AppShell>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <AppRoutes />
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
