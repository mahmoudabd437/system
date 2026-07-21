import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import PowerfulTable from "../components/PowerfulTable";
import { getDashboardSummary } from "../services/api";
import { getRoleLabel } from "../auth/roles";

const PRIVACY_KEY = "dar_bidaya_hide_numbers";

function maskDigits(value) {
  return String(value).replace(/\d/g, "•");
}

export default function DashboardPage({ user }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hideNumbers, setHideNumbers] = useState(() => localStorage.getItem(PRIVACY_KEY) === "1");

  useEffect(() => {
    localStorage.setItem(PRIVACY_KEY, hideNumbers ? "1" : "0");
  }, [hideNumbers]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const result = await getDashboardSummary();
        if (active) setSummary(result);
      } catch (requestError) {
        if (active) setError(requestError.message || "تعذر تحميل بيانات لوحة التحكم");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="page-shell">
        <div className="page-content">
          <div className="empty-state">جارٍ تحميل بيانات لوحة التحكم...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-shell">
        <div className="page-content">
          <div className="empty-state">{error}</div>
        </div>
      </section>
    );
  }

  const latePayments = (summary?.late_payments || []).map((student) => ({
    id: student.id,
    name: student.name,
    stage: student.stage,
    amount: `${Number(student.payment_amount || 0).toLocaleString("ar-EG")} ج.م`,
    lastDue: student.last_due_date,
    daysLate: student.late_days,
    details: student.details,
  }));

  const schedule = summary?.schedule || [];
  const stats = summary?.stats || [];

  return (
    <section className="page-shell">
      <header className="page-header">
        <div className="page-title-wrap">
          <span className="page-kicker">الرئيسية</span>
          <h2>{user?.name || "لوحة التحكم"}</h2>
          <p>{user?.role_label || getRoleLabel(user?.role)}</p>
        </div>
        <div className="page-header-actions">
          <button
            type="button"
            className="glass-button glass-button-ghost header-action-btn privacy-toggle-btn"
            onClick={() => setHideNumbers((current) => !current)}
            aria-pressed={hideNumbers}
          >
            {hideNumbers ? "إظهار الأرقام" : "إخفاء الأرقام"}
          </button>
        </div>
      </header>

      <div className="page-content">
        <div className="stats-grid">
          {stats.map((stat) => (
            <StatCard key={stat.key} stat={stat} hideNumbers={hideNumbers} />
          ))}
        </div>

        <div className="panel-grid">
          <div className="panel">
            <div className="panel-header">
              <h3>الطلاب المتأخرون في السداد</h3>
              <span className="muted">قائمة مباشرة من الخادم</span>
            </div>
            <div className="panel-body">
              <PowerfulTable
                rows={latePayments}
                columns={[
                  { key: "name", subKey: "stage" },
                  { key: "amount", subKey: "lastDue" },
                  { key: "daysLate", subKey: "daysLate" },
                ]}
                hideNumbers={hideNumbers}
                onAction={(type, row) => {
                  console.log(type, row);
                }}
              />
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>جدول اليوم</h3>
              <span className="muted">بطاقات زمنية متدرجة</span>
            </div>
            <div className="panel-body schedule-list">
              {schedule.map((item) => (
                <article
                  key={item.id}
                  className="schedule-card"
                  style={{
                    "--timeline-color": `var(--${item.color})`,
                    "--timeline-glow": `color-mix(in srgb, var(--${item.color}) 66%, white)`,
                  }}
                >
                  <div className="schedule-head">
                    <strong className="schedule-time">{hideNumbers ? maskDigits(item.time) : item.time}</strong>
                    <span className="tag">{item.teacher}</span>
                  </div>
                  <div className="schedule-main">
                    <div>
                      <strong>{item.group_name}</strong>
                      <div className="row-subtitle">{item.subject}</div>
                    </div>
                    <div className="badge">{hideNumbers ? maskDigits(`${item.count} طالب`) : `${item.count} طالب`}</div>
                  </div>
                  <div className="mini-progress">
                    <span style={{ width: `${item.progress}%` }} />
                  </div>
                  <div className="row-subtitle" style={{ marginTop: 10 }}>
                    {hideNumbers ? maskDigits(item.remaining) : item.remaining}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
