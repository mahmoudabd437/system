import React, { useState } from "react";
import GlassButton from "./GlassButton";
import { login, signup } from "../services/api";
import { ROLE_OPTIONS } from "../auth/roles";

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "admin@darbidaya.test",
    password: "Password123",
    confirmPassword: "Password123",
    role: "admin",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "signup" && form.password !== form.confirmPassword) {
        throw new Error("كلمتا المرور غير متطابقتين");
      }

      const payload = {
        email: form.email.trim(),
        password: form.password,
      };

      const result =
        mode === "login"
          ? await login(payload)
          : await signup({ ...payload, name: form.name.trim(), role: form.role });

      onAuthSuccess(result.token, result.user);
    } catch (requestError) {
      setError(requestError.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-card">
        <div className="auth-panel">
          <div className="auth-tabs">
            <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
              تسجيل الدخول
            </button>
            <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>
              إنشاء حساب
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === "signup" ? (
              <label>
                الاسم الكامل
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="مثال: أحمد محمد"
                  autoComplete="name"
                />
              </label>
            ) : null}

            {mode === "signup" ? (
              <label>
                الدور
                <select name="role" value={form.role} onChange={handleChange}>
                  {ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <label>
              البريد الإلكتروني
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@darbidaya.test"
                autoComplete="email"
              />
            </label>

            <label>
              كلمة المرور
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </label>

            {mode === "signup" ? (
              <label>
                تأكيد كلمة المرور
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </label>
            ) : null}

            {error ? <div className="auth-error">{error}</div> : null}

            <GlassButton variant="primary" type="submit" disabled={loading}>
              {loading ? "جارٍ التنفيذ..." : mode === "login" ? "دخول" : "إنشاء الحساب"}
            </GlassButton>

            <p className="auth-hint">
              الحساب التجريبي: <strong>admin@darbidaya.test</strong> / <strong>Password123</strong>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
