import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiRequest('/auth/login/', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' },
      });
      login(data);
      navigate('/dashboard');
    } catch {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">نظام إدارة المدرسة</div>
        <h1>تسجيل الدخول</h1>
        <p>ادخل إلى لوحة التحكم باستخدام البريد الإلكتروني وكلمة المرور.</p>
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
            {loading ? 'جاري الدخول...' : 'دخول'}
          </button>
        </form>
        <Link to="/signup" className="auth-link">
          ليس لديك حساب؟ إنشاء حساب جديد
        </Link>
      </div>
    </div>
  );
}
