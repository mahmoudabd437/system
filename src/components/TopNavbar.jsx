import React, { useEffect, useRef, useState } from "react";
import SettingsMenu from "./SettingsMenu";
import { getRoleLabel } from "../auth/roles";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function TopNavbar({ user, pageTitle = "الصفحة الرئيسية" }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-copy">
        <span className="topbar-kicker">نظام إدارة تعليمي</span>
        <h2>{pageTitle}</h2>
      </div>

      <div className="topbar-actions" ref={menuRef}>
        <div className="user-summary">
          <div className="user-avatar">{getInitials(user?.name || "مستخدم")}</div>
          <div className="user-meta">
            <strong>{user?.name || "المستخدم الحالي"}</strong>
            <span>{user?.role_label || getRoleLabel(user?.role)}</span>
          </div>
        </div>

        <button
          type="button"
          className="icon-button topbar-settings"
          onClick={() => setOpen((current) => !current)}
          aria-label="فتح الإعدادات"
          aria-expanded={open}
        >
          ⚙
        </button>

        {open ? <SettingsMenu onClose={() => setOpen(false)} /> : null}
      </div>
    </header>
  );
}
