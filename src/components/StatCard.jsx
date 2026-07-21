import React, { useEffect, useId, useRef, useState } from "react";
import CircularProgress from "./CircularProgress";
import Sparkline from "./Sparkline";

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame;
    const started = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

export default function StatCard({ stat, hideNumbers = false }) {
  const uid = useId().replace(/:/g, "");
  const cardRef = useRef(null);
  const value = useCountUp(stat.value);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const handleMove = (event) => {
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * 10;
      const rotateY = (x - 0.5) * 12;
      el.style.setProperty("--rx", `${rotateX}deg`);
      el.style.setProperty("--ry", `${rotateY}deg`);
    };

    const reset = () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", reset);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", reset);
    };
  }, []);

  const accentMap = {
    cyan: "#22d3ee",
    violet: "#8b5cf6",
    gold: "#f5c451",
    green: "#33d69f",
    rose: "#fb7185",
  };
  const lateGradientId = `late-${uid}`;
  const absGradientId = `abs-${uid}`;

  const icon = stat.illustration ? (
    stat.illustration === "late" ? (
      <svg viewBox="0 0 64 64" width="46" height="46" fill="none">
        <path d="M16 44c7-12 25-12 32 0" stroke={`url(#${lateGradientId})`} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M24 24a8 8 0 1 1 16 0" stroke={`url(#${lateGradientId})`} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="32" cy="32" r="24" stroke={`url(#${lateGradientId})`} strokeWidth="2" opacity="0.45" />
        <defs>
          <linearGradient id={lateGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#f5c451" />
          </linearGradient>
        </defs>
      </svg>
    ) : (
      <svg viewBox="0 0 64 64" width="46" height="46" fill="none">
        <circle cx="32" cy="32" r="22" stroke={`url(#${absGradientId})`} strokeWidth="3" />
        <path d="M23 33l7 7 11-13" stroke={`url(#${absGradientId})`} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id={absGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
    )
  ) : null;

  return (
    <article
      ref={cardRef}
      className="stat-card"
      style={{
        "--card-accent": accentMap[stat.accent] || "#3b82f6",
        transform: "perspective(1200px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
      }}
    >
      <p className="label">{stat.label}</p>
      <div className="meta">
        <div>
          <h3 className={`value ${hideNumbers ? "masked-value" : ""}`} style={{ color: accentMap[stat.accent] || "#fff" }}>
            {hideNumbers ? "•••" : value.toLocaleString("ar-EG")}
          </h3>
          <div className="suffix">{hideNumbers ? "مخفي" : stat.suffix}</div>
        </div>
        <div className="stat-icon">{icon || <CircularProgress value={stat.progress} color={accentMap[stat.accent]} />}</div>
      </div>
      <div className="suffix">{stat.hint}</div>
      {stat.sparkline ? <Sparkline data={stat.sparkline} color={accentMap[stat.accent]} /> : null}
      {!stat.sparkline ? (
        <div style={{ marginTop: 16 }}>
          <CircularProgress value={stat.progress} color={accentMap[stat.accent]} />
        </div>
      ) : null}
    </article>
  );
}
