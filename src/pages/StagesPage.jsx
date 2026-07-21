import React, { useEffect, useMemo, useState } from "react";
import GlassButton from "../components/GlassButton";
import { createStage, deleteStage, getStages, updateStage } from "../services/api";

const emptyForm = {
  name: "",
  students: 0,
  groups: 0,
  color: "cyan",
  description: "",
};

function StageModal({ mode, form, setForm, onClose, onSubmit, saving }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="modal-kicker">{mode === "edit" ? "تعديل مرحلة" : "إضافة مرحلة جديدة"}</span>
            <h3>{mode === "edit" ? "تعديل المرحلة الدراسية" : "إضافة مرحلة دراسية"}</h3>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="إغلاق">
            ×
          </button>
        </div>

        <form
          className="modal-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <label>
            اسم المرحلة
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="المرحلة الابتدائية"
            />
          </label>
          <label>
            عدد الطلاب
            <input
              type="number"
              min="0"
              value={form.students}
              onChange={(event) => setForm((current) => ({ ...current, students: Number(event.target.value) }))}
            />
          </label>
          <label>
            عدد المجموعات
            <input
              type="number"
              min="0"
              value={form.groups}
              onChange={(event) => setForm((current) => ({ ...current, groups: Number(event.target.value) }))}
            />
          </label>
          <label>
            اللون
            <select
              value={form.color}
              onChange={(event) => setForm((current) => ({ ...current, color: event.target.value }))}
            >
              <option value="cyan">أزرق سماوي</option>
              <option value="violet">بنفسجي</option>
              <option value="gold">ذهبي</option>
              <option value="green">أخضر</option>
              <option value="rose">وردي</option>
            </select>
          </label>
          <label className="full-span">
            وصف المرحلة
            <textarea
              rows="4"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="وصف مختصر للمرحلة..."
            />
          </label>
          <div className="modal-actions full-span">
            <GlassButton variant="ghost" type="button" onClick={onClose}>
              إلغاء
            </GlassButton>
            <GlassButton variant="primary" type="submit" disabled={saving}>
              {saving ? "جارٍ الحفظ..." : mode === "edit" ? "حفظ التعديل" : "إضافة المرحلة"}
            </GlassButton>
          </div>
        </form>
      </div>
    </div>
  );
}

function ContextMenu({ onEdit, onDelete, onClose }) {
  return (
    <div className="context-menu" onMouseLeave={onClose}>
      <button type="button" onClick={onEdit}>
        تعديل المرحلة
      </button>
      <button type="button" onClick={onDelete}>
        حذف المرحلة
      </button>
    </div>
  );
}

export default function StagesPage() {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [editor, setEditor] = useState(null);
  const [saving, setSaving] = useState(false);

  const refreshStages = async () => {
    const result = await getStages();
    setStages(result);
  };

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const result = await getStages();
        if (active) setStages(result);
      } catch (requestError) {
        if (active) setError(requestError.message || "تعذر تحميل المراحل الدراسية");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const totalStudents = useMemo(
    () => stages.reduce((sum, stage) => sum + Number(stage.students || 0), 0),
    [stages]
  );

  const accentMap = {
    cyan: "#25b7d3",
    violet: "#7c5cfa",
    gold: "#d8a323",
    green: "#1fa35b",
    rose: "#f05a6e",
  };

  const openCreateModal = () => {
    setEditor({ mode: "create", id: null, form: emptyForm });
  };

  const openEditModal = (stage) => {
    setEditor({
      mode: "edit",
      id: stage.id,
      form: {
        name: stage.name,
        students: stage.students,
        groups: stage.groups,
        color: stage.color,
        description: stage.description,
      },
    });
  };

  const submitStage = async () => {
    if (!editor) return;
    setSaving(true);
    try {
      const payload = {
        ...editor.form,
        students: Number(editor.form.students),
        groups: Number(editor.form.groups),
      };

      if (editor.mode === "edit") {
        await updateStage(editor.id, payload);
      } else {
        await createStage(payload);
      }
      await refreshStages();
      setEditor(null);
      setError("");
    } catch (requestError) {
      setError(requestError.message || "تعذر حفظ المرحلة");
    } finally {
      setSaving(false);
    }
  };

  const removeStage = async (stage) => {
    const confirmed = window.confirm(`هل تريد حذف ${stage.name}؟`);
    if (!confirmed) return;
    setSaving(true);
    try {
      await deleteStage(stage.id);
      await refreshStages();
    } catch (requestError) {
      setError(requestError.message || "تعذر حذف المرحلة");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="page-shell">
        <div className="page-content">
          <div className="empty-state">جارٍ تحميل المراحل الدراسية...</div>
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

  return (
    <section className="page-shell">
      <header className="page-header">
        <div className="page-title-wrap">
          <h2>إدارة المراحل الدراسية</h2>
          <p>إضافة وتعديل وحذف المراحل مباشرة من نافذة منبثقة أنيقة وسريعة.</p>
        </div>
        <div className="page-header-actions">
          <div className="floating-brand">
            <strong>{totalStudents.toLocaleString("ar-EG")} طالب</strong>
            <span>إجمالي تسجيلات المراحل</span>
          </div>
          <GlassButton variant="primary" className="header-action-btn" onClick={openCreateModal}>
            + إضافة مرحلة دراسية
          </GlassButton>
        </div>
      </header>

      <div className="page-content">
        <div className="stages-topbar">
          <span className="badge">عرض بطاقات</span>
          <span className="badge">نافذة منبثقة للتعديل والإضافة</span>
        </div>

        <div className="stage-grid">
          {stages.map((stage) => (
            <article key={stage.id} className="stage-card" style={{ "--stage-accent": accentMap[stage.color] }}>
              <div className="stage-card-header">
                <div>
                  <h4>{stage.name}</h4>
                  <p>{stage.description}</p>
                </div>
                <div style={{ position: "relative" }}>
                  <button
                    className="context-trigger"
                    type="button"
                    onClick={() => setOpenMenu(openMenu === stage.id ? null : stage.id)}
                    aria-label="إدارة المرحلة"
                  >
                    ⋯
                  </button>
                  {openMenu === stage.id ? (
                    <ContextMenu
                      onEdit={() => {
                        openEditModal(stage);
                        setOpenMenu(null);
                      }}
                      onDelete={() => {
                        removeStage(stage);
                        setOpenMenu(null);
                      }}
                      onClose={() => setOpenMenu(null)}
                    />
                  ) : null}
                </div>
              </div>
              <div className="metric-row">
                <div className="metric-pill">
                  <strong>{Number(stage.students || 0).toLocaleString("ar-EG")}</strong>
                  <span>عدد الطلاب</span>
                </div>
                <div className="metric-pill">
                  <strong>{Number(stage.groups || 0).toLocaleString("ar-EG")}</strong>
                  <span>المجموعات</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      {editor ? (
        <StageModal
          mode={editor.mode}
          form={editor.form}
          setForm={(updater) =>
            setEditor((current) =>
              current
                ? { ...current, form: typeof updater === "function" ? updater(current.form) : updater }
                : current
            )
          }
          onClose={() => setEditor(null)}
          onSubmit={submitStage}
          saving={saving}
        />
      ) : null}
    </section>
  );
}
