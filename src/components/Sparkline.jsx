import React, { useId } from "react";

export default function Sparkline({ data = [], color = "#22d3ee" }) {
  const uid = useId().replace(/:/g, "");
  if (!data.length) return null;

  const width = 120;
  const height = 34;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((n, index) => {
      const x = (index / Math.max(1, data.length - 1)) * width;
      const y = height - ((n - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
  const gradientId = `spark-${uid}`;

  return (
    <svg className="sparkline" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="50%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <polyline points={points} stroke={`url(#${gradientId})`} />
    </svg>
  );
}
