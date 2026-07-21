import React, { useMemo, useState } from "react";

function maskDigits(value) {
  return String(value).replace(/\d/g, "•");
}

export default function PowerfulTable({ rows, columns, onAction, hideNumbers = false }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [openRow, setOpenRow] = useState(null);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const text = `${row.name || ""} ${row.stage || ""} ${row.subject || ""} ${row.teacher || ""}`.toLowerCase();
      const queryOk = text.includes(query.toLowerCase());
      const filterValue = row.stage || row.subject || "";
      const filterOk = filter === "all" || filterValue.includes(filter);
      return queryOk && filterOk;
    });
  }, [rows, query, filter]);

  return (
    <div>
      <div className="table-toolbar">
        <div className="search-field" style={{ flex: 1 }}>
          <span>⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث داخل القائمة..." />
        </div>
        <div className="filter-field" style={{ minWidth: 220 }}>
          <span>⎚</span>
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="all">الكل</option>
            <option value="المرحلة الابتدائية">الابتدائية</option>
            <option value="المرحلة الإعدادية">الإعدادية</option>
            <option value="المرحلة الثانوية">الثانوية</option>
            <option value="رياضيات">رياضيات</option>
            <option value="علوم">علوم</option>
          </select>
        </div>
      </div>

      <div className="card-list">
        {filteredRows.map((row) => {
          const open = openRow === row.id;
          return (
            <article
              key={row.id}
              className={`table-row ${open ? "open" : ""}`}
              onClick={() => setOpenRow(open ? null : row.id)}
              role="button"
              tabIndex={0}
            >
              {columns.map((column) => (
                <div key={column.key}>
                  <strong>{hideNumbers ? maskDigits(row[column.key]) : row[column.key]}</strong>
                  {column.subKey ? (
                    <span className="row-subtitle">
                      {hideNumbers ? maskDigits(row[column.subKey]) : row[column.subKey]}
                    </span>
                  ) : null}
                </div>
              ))}

              <div className="row-actions" onClick={(event) => event.stopPropagation()}>
                <button className="action-chip" aria-label="إرسال تذكير" onClick={() => onAction?.("remind", row)}>
                  ⟲
                </button>
                <button className="action-chip" aria-label="حذف" onClick={() => onAction?.("delete", row)}>
                  ⌫
                </button>
                <button className="action-chip" aria-label="المزيد" onClick={() => onAction?.("more", row)}>
                  ⋮
                </button>
              </div>

              {open ? (
                <div className="detail-box">
                  {hideNumbers
                    ? maskDigits(row.details || "لا توجد تفاصيل إضافية حالياً.")
                    : row.details || "لا توجد تفاصيل إضافية حالياً."}
                </div>
              ) : null}
            </article>
          );
        })}
        {!filteredRows.length ? <div className="empty-state">لا توجد نتائج مطابقة حالياً.</div> : null}
      </div>
    </div>
  );
}
