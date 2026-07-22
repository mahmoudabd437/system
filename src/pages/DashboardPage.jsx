import React, { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import IconGlyph from '../components/IconGlyph';

function formatValue(value) {
  if (typeof value === 'number') {
    return value.toLocaleString('en-US');
  }

  return value;
}

function Sparkline({ variant }) {
  const paths = [
    'M2 22 C 10 18, 16 20, 26 15 S 44 9, 56 12 S 70 6, 82 8',
    'M2 24 C 12 20, 18 16, 30 18 S 46 10, 58 12 S 70 8, 82 6',
    'M2 20 C 12 18, 20 14, 30 16 S 46 12, 58 9 S 72 11, 82 7',
    'M2 24 C 10 22, 18 14, 28 16 S 44 10, 56 14 S 70 8, 82 12',
  ];

  return (
    <svg className="stat-sparkline" viewBox="0 0 84 28" aria-hidden="true" focusable="false">
      <path d={paths[variant % paths.length]} />
    </svg>
  );
}

function ProgressRing({ progress }) {
  return (
    <div className="progress-ring" style={{ '--progress': `${progress}%` }}>
      <div className="progress-ring__inner">
        <IconGlyph name="check" />
      </div>
    </div>
  );
}

function StatCard({ card, visible }) {
  const valueText = visible ? formatValue(card.value) : '*****';

  return (
    <article className="stat-card" style={{ '--card-accent': card.accent }}>
      <header className="stat-card__header">
        <div className="stat-card__copy">
          <p className="stat-card__label">{card.label}</p>
          <h3 className="stat-card__value">{valueText}</h3>
          <span className="stat-card__unit">{card.unit}</span>
        </div>

        {/* <div className="stat-icon" aria-hidden="true">
          <IconGlyph name={card.icon} />
        </div> */}
      </header>

      <div className="stat-card__meta">
        <div className="stat-card__text">
          <span className="stat-card__suffix">{card.suffix}</span>
        </div>

        <ProgressRing progress={card.progress} />
      </div>

      <Sparkline variant={card.sparkline} />
    </article>
  );
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [visible, setVisible] = useState(false);

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
              ['08:00 ص', 'الصف الأول الابتدائي', 'رياضيات', '28 طالباً'],
              ['09:30 ص', 'الصف الثاني الإعدادي', 'علوم', '25 طالباً'],
              ['11:00 ص', 'الصف الثالث الثانوي', 'فيزياء', '30 طالباً'],
              ['12:30 م', 'الصف الرابع الابتدائي', 'لغة عربية', '22 طالباً'],
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
    {
      label: 'المتأخرون في السداد',
      value: dashboard?.late_payments ?? 3,
      unit: 'طالب',
      icon: 'warning',
      accent: '#ff6b7a',
      suffix: 'تحتاج متابعة فورية',
      note: 'الطلاب المتأخرون في الدفع',
      progress: 34,
      sparkline: 0,
    },
    {
      label: 'غائب اليوم',
      value: dashboard?.today_absence ?? 3,
      unit: 'طالب',
      icon: 'check',
      accent: '#8a62ff',
      suffix: 'داخل الصفوف المتوقعة',
      note: 'عدد الطلاب الغائبين اليوم',
      progress: 46,
      sparkline: 1,
    },
    {
      label: 'المصروفات',
      value: dashboard?.expenses ?? 2300,
      unit: 'ج.م',
      icon: 'expenses',
      accent: '#ff7b8b',
      suffix: 'إجمالي المستحقات',
      note: 'المصروفات المسجلة حاليًا',
      progress: 58,
      sparkline: 2,
    },
    {
      label: 'المتبقي',
      value: dashboard?.remaining ?? 5500,
      unit: 'ج.م',
      icon: 'wallet',
      accent: '#ffb74d',
      suffix: 'إجمالي التحصيل',
      note: 'المتبقي للحصول عليه',
      progress: 62,
      sparkline: 3,
    },
    {
      label: 'المدفوع',
      value: dashboard?.paid ?? 15250,
      unit: 'ج.م',
      icon: 'wallet',
      accent: '#38cfa0',
      suffix: 'ج.م',
      note: 'إجمالي المدفوع حتى الآن',
      progress: 72,
      sparkline: 0,
    },
    {
      label: 'الحضور',
      value: dashboard?.attendance ?? 132,
      unit: 'طالب',
      icon: 'attendance',
      accent: '#2fbe63',
      suffix: 'طالب',
      note: 'الطلاب الحاضرون اليوم',
      progress: 84,
      sparkline: 1,
    },
    {
      label: 'الطلاب',
      value: dashboard?.students ?? 152,
      unit: 'طالب',
      icon: 'students',
      accent: '#3b73f2',
      suffix: 'إجمالي الطلاب المسجلين',
      note: 'الطلاب المقيدون حاليًا',
      progress: 90,
      sparkline: 2,
    },
  ];

  const schedule = (dashboard?.today_schedule || []).map((item) =>
    Array.isArray(item) ? item : [item.time, item.group, item.subject, `${item.students} طالباً`]
  );
  const notifications = dashboard?.notifications || [];

  return (
    <div className="dashboard-grid">
      <div className="dashboard-actions">
        <button type="button" className="toggle-btn" onClick={() => setVisible((value) => !value)}>
          <IconGlyph name={visible ? 'eye-off' : 'eye'} />
          <span>{visible ? 'إخفاء الكل' : 'عرض الكل'}</span>
        </button>
      </div>

      <div className="stats-grid">
        {cards.map((card) => (
          <StatCard key={card.label} card={card} visible={visible} />
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
