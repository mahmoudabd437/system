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
        key: "late",
        label: "المتأخرون في السداد",
        value: 3,
        suffix: "طالب",
        accent: "rose",
        trend: -12,
        max: 10,
        progress: 30,
        hint: "تحتاج متابعة فورية",
        illustration: "late",
      },
      {
        key: "today",
        label: "غائب اليوم",
        value: 3,
        suffix: "طالب",
        accent: "violet",
        trend: 4,
        max: 10,
        progress: 25,
        hint: "داخل الصفوف المتوقعة",
        illustration: "absence",
      },
      {
        key: "payments",
        label: "المصروفات",
        value: 2300,
        suffix: "ج.م",
        accent: "rose",
        trend: 18,
        max: 3000,
        progress: 77,
        sparkline: [8, 11, 13, 12, 16, 15, 19, 21, 23, 26],
      },
      {
        key: "remaining",
        label: "المتبقي",
        value: 5500,
        suffix: "ج.م",
        accent: "gold",
        trend: 7,
        max: 10000,
        progress: 55,
        sparkline: [22, 24, 26, 25, 28, 30, 29, 33, 36, 38],
      },
      {
        key: "collected",
        label: "المدفوع",
        value: 15250,
        suffix: "ج.م",
        accent: "green",
        trend: 23,
        max: 20000,
        progress: 86,
        sparkline: [12, 17, 15, 21, 24, 22, 28, 30, 34, 38],
      },
      {
        key: "students",
        label: "الطلاب",
        value: 132,
        suffix: "طالب",
        accent: "cyan",
        trend: 9,
        max: 200,
        progress: 66,
        sparkline: [10, 12, 14, 13, 15, 18, 20, 21, 23, 26],
      },
    ],

    late_payments: [
      {
        id: 1,
        name: "محمود علي",
        stage: "المرحلة الابتدائية",
        payment_amount: 200,
        last_due_date: "2024 / 06 / 01",
        late_days: 3,
        details: "قسط الشهر الحالي لم يتم تحصيله بعد. يوجد اتصال سابق دون رد.",
      },
      {
        id: 2,
        name: "كريم محمود",
        stage: "المرحلة الإعدادية",
        payment_amount: 100,
        last_due_date: "2024 / 06 / 01",
        late_days: 6,
        details: "المبلغ مستحق منذ الأسبوع الماضي مع تذكيرين سابقين.",
      },
      {
        id: 3,
        name: "يوسف أحمد",
        stage: "المرحلة الثانوية",
        payment_amount: 300,
        last_due_date: "2024 / 06 / 02",
        late_days: 2,
        details: "الحالة في انتظار متابعة جديدة من شؤون الطلاب.",
      },
      {
        id: 4,
        name: "أحمد سمير",
        stage: "المرحلة الابتدائية",
        payment_amount: 250,
        last_due_date: "2024 / 06 / 02",
        late_days: 1,
        details: "تم إرسال إشعار صباح اليوم ولم يتم التأكيد بعد.",
      },
    ],

    schedule: [
      {
        id: 1,
        time: "04:00 م",
        group_name: "المجموعة الأولى (ثانوي)",
        subject: "رياضيات",
        teacher: "الأستاذة مها",
        count: 28,
        remaining: "ساعة و30 دقيقة",
        color: "cyan",
        progress: 52,
      },
      {
        id: 2,
        time: "05:30 م",
        group_name: "المجموعة الثانية (إعدادي)",
        subject: "علوم",
        teacher: "الأستاذ أحمد",
        count: 25,
        remaining: "ساعتان",
        color: "green",
        progress: 68,
      },
      {
        id: 3,
        time: "07:00 م",
        group_name: "المجموعة الثالثة (ثانوي)",
        subject: "فيزياء",
        teacher: "الأستاذة سارة",
        count: 30,
        remaining: "ساعة و30 دقيقة",
        color: "violet",
        progress: 80,
      },
      {
        id: 4,
        time: "08:30 م",
        group_name: "المجموعة الرابعة (إعدادي)",
        subject: "لغة إنجليزية",
        teacher: "الأستاذ عمرو",
        count: 22,
        remaining: "ساعتان",
        color: "gold",
        progress: 34,
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
