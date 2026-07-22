import React from "react";
import GlassButton from "./GlassButton";
import { getRoleLabel } from "../auth/roles";

const navItems = [
  { id: "dashboard", label: "الرئيسية", icon: "⌂" },
  { id: "stages", label: "المراحل الدراسية", icon: "▣" },
];

export default function Sidebar({ activePage, onNavigate, collapsed, onToggleCollapsed, onLogout, user }) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top">
        <div className="brand-pill">
          <div className="brand-mark">DB</div>
          {!collapsed ? (
            <div className="brand-copy">
              <h1>دار بداية</h1>
              <p>{user?.name || "إدارة تعليمية احترافية"}</p>
              <span className="sidebar-role">{user?.role_label || getRoleLabel(user?.role)}</span>
            </div>
          ) : null}
        </div>
      </div>

      <nav className="nav-list">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${activePage === item.id ? "active" : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed ? <span>{item.label}</span> : null}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <GlassButton variant="ghost" className="logout-btn compact-button" onClick={onLogout}>
          تسجيل الخروج
        </GlassButton>
      </div>
    </aside>
  );
}
