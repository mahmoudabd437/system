import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { roleLabels, sidebarItems } from '../data/navigation';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import IconGlyph from './IconGlyph';
import PageTransition from './PageTransition';

function getDisplayName(user) {
  if (!user) return 'أحمد إسماعيل';
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
  return user.name || fullName || user.username || 'أحمد إسماعيل';
}

export default function AppShell({ children }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { fontSize, setFontSize } = useSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    setSettingsOpen(false);
  }, [location.pathname]);

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
          {sidebarItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                className={`side-link ${isActive ? 'active' : ''} ${item.isSpecial ? 'special-link' : ''}`}
                to={item.path}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="side-link-icon">
                  <IconGlyph name={item.icon} />
                </span>
                <span className="side-link-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="logout-section">
          <button type="button" className="logout-btn" onClick={logout}>
            <IconGlyph name="logout" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <div className="page-title">{activeLabel}</div>
            <div className="page-subtitle">مرحباً بك في لوحة التحكم الرئيسية</div>
          </div>
          <div className="topbar-actions">
            <div className="meta-pill">
              <span className="pill-icon">
                <IconGlyph name="clock" />
              </span>
              <span>{timeText}</span>
            </div>
            <div className="meta-pill">
              <span className="pill-icon">
                <IconGlyph name="calendar" />
              </span>
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

        <section className="page-body">
          <PageTransition>{children}</PageTransition>
        </section>
      </main>
    </div>
  );
}
