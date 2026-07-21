import React, { useState } from "react";
import GlassButton from "./GlassButton";
import { ROLE_OPTIONS } from "../auth/roles";

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      // محاكاة انتظار بسيط
      await new Promise((resolve) => setTimeout(resolve, 700));

      const fakeUser = {
        id: 1,
        name:
          form.name.trim() ||
          (mode === "signup" ? "مستخدم جديد" : "محمد إسماعيل الجندي"),
        email: form.email.trim() || "admin@darbidaya.test",
        role: form.role || "admin",
      };

      const fakeToken = "fake-demo-token";

      localStorage.setItem("token", fakeToken);
      localStorage.setItem("user", JSON.stringify(fakeUser));

      onAuthSuccess(fakeToken, fakeUser);
    } catch (err) {
      setError("حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-card">
        <div className="auth-panel">
          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              تسجيل الدخول
            </button>

            <button
              type="button"
              className={mode === "signup" ? "active" : ""}
              onClick={() => setMode("signup")}
            >
              إنشاء حساب
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <>
                <label>
                  الاسم الكامل
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="مثال: أحمد محمد"
                  />
                </label>

                <label>
                  الدور
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                  >
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}

            <label>
              البريد الإلكتروني
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="أي قيمة أو اتركه فارغًا"
              />
            </label>

            <label>
              كلمة المرور
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="أي قيمة أو اتركها فارغة"
              />
            </label>

            {mode === "signup" && (
              <label>
                تأكيد كلمة المرور
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </label>
            )}

            {error && <div className="auth-error">{error}</div>}

            <GlassButton
              variant="primary"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "جارٍ الدخول..."
                : mode === "login"
                ? "تسجيل الدخول"
                : "إنشاء الحساب"}
            </GlassButton>

            <p className="auth-hint">
              🚀 هذه نسخة Demo، اضغط على زر تسجيل الدخول وسيتم الدخول مباشرة
              بدون Backend.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
