import React from "react";
import { ROLES } from "./roles";

function normalizeRoles(allowedRoles) {
  if (!allowedRoles || allowedRoles === "any") {
    return [];
  }

  return Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
}

export default function RoleGuard({ user, allowedRoles, fallback = null, children }) {
  if (!user) {
    return fallback;
  }

  const normalizedRoles = normalizeRoles(allowedRoles);
  if (!normalizedRoles.length || normalizedRoles.includes(ROLES.ADMIN) || normalizedRoles.includes(user.role)) {
    return children;
  }

  return fallback;
}

export function createRoleMiddleware(allowedRoles) {
  const normalizedRoles = normalizeRoles(allowedRoles);

  return (user) => {
    if (!user) return false;
    if (!normalizedRoles.length) return true;
    return normalizedRoles.includes(ROLES.ADMIN) || normalizedRoles.includes(user.role);
  };
}
