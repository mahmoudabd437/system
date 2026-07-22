// services/fakeAuth.js

const USERS_KEY = "demo_users";

const DEFAULT_USERS = [
  {
    id: 1,
    name: "محمد إسماعيل",
    email: "admin@darbidaya.test",
    password: "Password123",
    role: "admin",
  },
  {
    id: 2,
    name: "أحمد علي",
    email: "teacher@darbidaya.test",
    password: "Password123",
    role: "teacher",
  },
  {
    id: 3,
    name: "منى حسن",
    email: "finance@darbidaya.test",
    password: "Password123",
    role: "financial",
  },
];

function getUsers() {
  const users = JSON.parse(localStorage.getItem(USERS_KEY));

  if (users) return users;

  localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));

  return DEFAULT_USERS;
}

export async function fakeLogin({ email, password }) {
  await new Promise((r) => setTimeout(r, 600));

  const users = getUsers();

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
  );

  if (!user) {
    throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
  }

  return {
    token: "fake-jwt-token",
    user,
  };
}

export async function fakeSignup(data) {
  await new Promise((r) => setTimeout(r, 600));

  const users = getUsers();

  if (
    users.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    )
  ) {
    throw new Error("هذا البريد مستخدم بالفعل");
  }

  const user = {
    id: Date.now(),
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
  };

  users.push(user);

  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  return {
    token: "fake-jwt-token",
    user,
  };
}