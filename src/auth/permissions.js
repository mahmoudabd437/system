import { ROLES } from "./roles";

export const PERMISSIONS = Object.freeze({
  STUDENTS: "students",
  ATTENDANCE: "attendance",
  EXAMS: "exams",
  PAYMENTS: "payments",
  EXPENSES: "expenses",
  SCHEDULES: "schedules",
  SETTINGS: "settings",
});

export const ROLE_PERMISSIONS = Object.freeze({
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.TEACHER]: [PERMISSIONS.STUDENTS, PERMISSIONS.ATTENDANCE, PERMISSIONS.EXAMS],
  [ROLES.ADMINISTRATIVE_EMPLOYEE]: [PERMISSIONS.STUDENTS, PERMISSIONS.SCHEDULES],
  [ROLES.FINANCIAL_EMPLOYEE]: [PERMISSIONS.PAYMENTS, PERMISSIONS.EXPENSES],
  [ROLES.ADMINISTRATIVE_AFFAIRS_EMPLOYEE]: [PERMISSIONS.STUDENTS, PERMISSIONS.SCHEDULES, PERMISSIONS.SETTINGS],
});

export function hasPermission(role, permission) {
  return Boolean(role && ROLE_PERMISSIONS[role]?.includes(permission));
}

export function getPermissionsForRole(role) {
  return ROLE_PERMISSIONS[role] || [];
}
