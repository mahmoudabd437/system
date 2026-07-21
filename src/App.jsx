// ===============================
// Demo API (No Backend Required)
// ===============================

const TOKEN_KEY = "dar_bidaya_token";
const STAGES_KEY = "dar_bidaya_stages";

// ----------------------
// Auth
// ----------------------

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(payload) {
  return {
    token: "demo-token",
    user: {
      id: 1,
      name: "محمد إسماعيل الجندي",
      email: payload?.email || "admin@demo.com",
      role: "admin",
      role_label: "المدير",
    },
  };
}

export async function signup(payload) {
  return {
    token: "demo-token",
    user: {
      id: Date.now(),
      name: payload.name,
      email: payload.email,
      role: payload.role,
      role_label: "مستخدم",
    },
  };
}

export async function getMe() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    user || {
      id: 1,
      name: "محمد إسماعيل الجندي",
      email: "admin@demo.com",
      role: "admin",
      role_label: "المدير",
    }
  );
}

// ===============================
// Dashboard
// ===============================

export async function getDashboardSummary() {
  return {
    stats: [
      {
        key: "students",
        title: "الطلاب",
        value: 152,
        icon: "👨‍🎓",
        color: "cyan",
      },
      {
        key: "attendance",
        title: "الحضور",
        value: 132,
        icon: "✅",
        color: "green",
      },
      {
        key: "paid",
        title: "المدفوع",
        value: "15,250 ج.م",
        icon: "💰",
        color: "violet",
      },
      {
        key: "remaining",
        title: "المتبقي",
        value: "5,500 ج.م",
        icon: "🪙",
        color: "gold",
      },
      {
        key: "expenses",
        title: "المصروفات",
        value: "2,300 ج.م",
        icon: "💸",
        color: "rose",
      },
      {
        key: "late",
        title: "المتأخرون",
        value: 3,
        icon: "⚠️",
        color: "red",
      },
    ],

    late_payments: [
      {
        id: 1,
        name: "أحمد محمد",
        stage: "المرحلة الثانوية",
        payment_amount: 350,
        last_due_date: "2025/07/01",
        late_days: 10,
        details: "",
      },
      {
        id: 2,
        name: "محمد علي",
        stage: "المرحلة الإعدادية",
        payment_amount: 200,
        last_due_date: "2025/07/03",
        late_days: 8,
        details: "",
      },
      {
        id: 3,
        name: "سارة أحمد",
        stage: "المرحلة الابتدائية",
        payment_amount: 150,
        last_due_date: "2025/07/05",
        late_days: 5,
        details: "",
      },
    ],

    schedule: [
      {
        id: 1,
        time: "04:00 م",
        teacher: "أ/ محمد",
        group_name: "المجموعة الأولى",
        subject: "رياضيات",
        count: 28,
        progress: 70,
        remaining: "ساعة و30 دقيقة",
        color: "cyan",
      },

      {
        id: 2,
        time: "05:30 م",
        teacher: "أ/ أحمد",
        group_name: "المجموعة الثانية",
        subject: "علوم",
        count: 25,
        progress: 45,
        remaining: "ساعتان",
        color: "green",
      },

      {
        id: 3,
        time: "07:00 م",
        teacher: "أ/ علي",
        group_name: "المجموعة الثالثة",
        subject: "فيزياء",
        count: 30,
        progress: 90,
        remaining: "30 دقيقة",
        color: "violet",
      },
    ],
  };
}


// ===============================
// Stages (LocalStorage)
// ===============================

const DEFAULT_STAGES = [
  {
    id: 1,
    name: "المرحلة الابتدائية",
    students: 180,
    groups: 8,
    color: "cyan",
    description: "من الصف الأول حتى السادس الابتدائي",
  },
  {
    id: 2,
    name: "المرحلة الإعدادية",
    students: 120,
    groups: 6,
    color: "green",
    description: "من الصف الأول حتى الثالث الإعدادي",
  },
  {
    id: 3,
    name: "المرحلة الثانوية",
    students: 95,
    groups: 5,
    color: "violet",
    description: "الصف الأول والثاني والثالث الثانوي",
  },
];

function loadStages() {
  const saved = localStorage.getItem(STAGES_KEY);

  if (saved) {
    return JSON.parse(saved);
  }

  localStorage.setItem(STAGES_KEY, JSON.stringify(DEFAULT_STAGES));

  return DEFAULT_STAGES;
}

function saveStages(stages) {
  localStorage.setItem(STAGES_KEY, JSON.stringify(stages));
}

export async function getStages() {
  return loadStages();
}

export async function createStage(payload) {
  const stages = loadStages();

  const newStage = {
    id: Date.now(),
    name: payload.name,
    students: Number(payload.students || 0),
    groups: Number(payload.groups || 0),
    color: payload.color || "cyan",
    description: payload.description || "",
  };

  stages.push(newStage);

  saveStages(stages);

  return newStage;
}

export async function updateStage(id, payload) {
  const stages = loadStages();

  const index = stages.findIndex((s) => s.id === id);

  if (index === -1) {
    throw new Error("المرحلة غير موجودة");
  }

  stages[index] = {
    ...stages[index],
    ...payload,
  };

  saveStages(stages);

  return stages[index];
}

export async function deleteStage(id) {
  const stages = loadStages();

  const filtered = stages.filter((stage) => stage.id !== id);

  saveStages(filtered);

  return { success: true };
}

// ===============================
// Students
// ===============================

export async function getStudents() {
  return [
    {
      id: 1,
      name: "أحمد محمد",
      stage: "المرحلة الثانوية",
    },
    {
      id: 2,
      name: "محمد علي",
      stage: "المرحلة الإعدادية",
    },
    {
      id: 3,
      name: "سارة أحمد",
      stage: "المرحلة الابتدائية",
    },
  ];
}

export async function getLatePayments() {
  return [
    {
      id: 1,
      name: "أحمد محمد",
      amount: 350,
    },
    {
      id: 2,
      name: "محمد علي",
      amount: 200,
    },
  ];
}
