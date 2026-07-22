import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';

export default function SignupPage() {
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
        <p>أنشئ حساباً جديداً واختر الدور المناسب.</p>
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
