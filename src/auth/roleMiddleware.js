import { createRoleMiddleware } from "./RoleGuard";

export function roleMiddleware(allowedRoles) {
  return createRoleMiddleware(allowedRoles);
}

export function requireAnyRole(user, allowedRoles) {
  return roleMiddleware(allowedRoles)(user);
}
