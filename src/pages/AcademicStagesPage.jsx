import React, { useEffect, useState } from 'react';
import IconGlyph from '../components/IconGlyph';
import { apiRequest } from '../services/api';

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
              <span className="field-icon">
                <IconGlyph name="book" />
              </span>
              <input
                placeholder="مثال: المرحلة الابتدائية"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>
          <div className="field-card">
            <div className="field-label">الصفوف</div>
            <div className="field-shell">
              <span className="field-icon">
                <IconGlyph name="calendar" />
              </span>
              <input
                placeholder="مثال: الصفوف 1 - 6"
                value={form.grade_range}
                onChange={(e) => setForm({ ...form, grade_range: e.target.value })}
              />
            </div>
          </div>
          <div className="field-card">
            <div className="field-label">عدد الطلاب</div>
            <div className="field-shell">
              <span className="field-icon">
                <IconGlyph name="students" />
              </span>
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
              <span className="field-icon">
                <IconGlyph name="user" />
              </span>
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

export default function AcademicStagesPage() {
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
            <span className="filter-icon">
              <IconGlyph name="search" />
            </span>
            <input
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="ابحث عن مرحلة دراسية..."
            />
          </div>
          <div className="filter-shell select-shell">
            <span className="filter-icon">
              <IconGlyph name="filter" />
            </span>
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
              {stages.length > 0 ? (
                stages.map((stage) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan="6">لا توجد نتائج</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {editingStage ? <StageModal stage={editingStage.id ? editingStage : null} onClose={() => setEditingStage(null)} onSave={saveStage} /> : null}
    </div>
  );
}
