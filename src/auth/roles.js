export const ROLES = Object.freeze({
  ADMIN: "admin",
  TEACHER: "teacher",
  ADMINISTRATIVE_EMPLOYEE: "administrative_employee",
  FINANCIAL_EMPLOYEE: "financial_employee",
  ADMINISTRATIVE_AFFAIRS_EMPLOYEE: "administrative_affairs_employee",
});

export const ROLE_OPTIONS = [
  { value: ROLES.ADMIN, label: "المدير" },
  { value: ROLES.TEACHER, label: "المعلم" },
  { value: ROLES.ADMINISTRATIVE_EMPLOYEE, label: "الموظف الإداري" },
  { value: ROLES.FINANCIAL_EMPLOYEE, label: "الموظف المالي" },
  { value: ROLES.ADMINISTRATIVE_AFFAIRS_EMPLOYEE, label: "موظف الشؤون الإدارية" },
];

export function getRoleLabel(role) {
  return ROLE_OPTIONS.find((option) => option.value === role)?.label || "المدير";
}

export function isValidRole(role) {
  return ROLE_OPTIONS.some((option) => option.value === role);
}
