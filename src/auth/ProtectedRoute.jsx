import React from "react";

export default function ProtectedRoute({ user, children, fallback = null }) {
  if (!user) {
    return fallback;
  }

  return children;
}
