import React from "react";

export default function GlassButton({ children, className = "", variant = "default", ...props }) {
  return (
    <button
      className={`glass-button glass-button-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
