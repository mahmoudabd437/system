import React from 'react';

export default function IconGlyph({ name }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  switch (name) {
    case 'home':
      return (
        <svg {...common}>
          <path d="M4 11.5 12 4l8 7.5" />
          <path d="M6 10.8V20h12v-9.2" />
        </svg>
      );
    case 'school':
      return (
        <svg {...common}>
          <path d="M12 3 3 8l9 5 9-5-9-5Z" />
          <path d="M6 10v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
          <path d="M21 8v7" />
        </svg>
      );
    case 'book':
      return (
        <svg {...common}>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22Z" />
          <path d="M8 3v19" />
        </svg>
      );
    case 'users':
      return (
        <svg {...common}>
          <path d="M8 14a4 4 0 1 1 8 0" />
          <path d="M3 20a6.5 6.5 0 0 1 6-4" />
          <path d="M21 20a6.5 6.5 0 0 0-6-4" />
          <circle cx="12" cy="8" r="3.5" />
        </svg>
      );
    case 'student':
      return (
        <svg {...common}>
          <path d="M20 21a8 8 0 0 0-16 0" />
          <circle cx="12" cy="8" r="4" />
        </svg>
      );
    case 'calendar':
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
          <path d="M8 3.5v3" />
          <path d="M16 3.5v3" />
          <path d="M3.5 9h17" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <path d="M5 12l4 4 10-10" />
          <path d="M12 22a10 10 0 1 0-10-10" />
        </svg>
      );
    case 'wallet':
      return (
        <svg {...common}>
          <path d="M4.5 7.5h13a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V9.5a2 2 0 0 1 2-2Z" />
          <path d="M16.5 12h3" />
          <path d="M6 7.5V5.8A2.3 2.3 0 0 1 8.3 3.5H19" />
        </svg>
      );
    case 'salary':
      return (
        <svg {...common}>
          <path d="M4 7h16v10H4z" />
          <path d="M8 7v10" />
          <path d="M16 7v10" />
          <path d="M12 10.5c1.7 0 3 .9 3 2s-1.3 2-3 2-3 .9-3 2 1.3 2 3 2" />
        </svg>
      );
    case 'exam':
      return (
        <svg {...common}>
          <path d="M7 3h10l3 3v15H7z" />
          <path d="M10 10h4" />
          <path d="M10 14h6" />
          <path d="M10 18h3" />
        </svg>
      );
    case 'expenses':
      return (
        <svg {...common}>
          <path d="M12 3v18" />
          <path d="M16.5 7a3.5 3.5 0 0 0-7 0c0 3.5 7 3.5 7 7a3.5 3.5 0 0 1-7 0" />
        </svg>
      );
    case 'inventory':
      return (
        <svg {...common}>
          <path d="M4 8 12 4l8 4-8 4-8-4Z" />
          <path d="M4 8v8l8 4 8-4V8" />
          <path d="M12 12v8" />
        </svg>
      );
    case 'reports':
      return (
        <svg {...common}>
          <path d="M5 20V10" />
          <path d="M11 20V4" />
          <path d="M17 20v-8" />
          <path d="M3 20h18" />
        </svg>
      );
    case 'backup':
      return (
        <svg {...common}>
          <path d="M12 3a9 9 0 1 0 9 9" />
          <path d="M21 4v8h-8" />
        </svg>
      );
    case 'clock':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case 'gear':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3.1" />
          <path d="M19 12a7 7 0 0 0-.1-1l2.1-1.6-2-3.5-2.5 1a7.2 7.2 0 0 0-1.7-1l-.4-2.7H9.6L9.2 6a7.2 7.2 0 0 0-1.7 1l-2.5-1-2 3.5L5.1 11a7 7 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.2 7.2 0 0 0 1.7 1l.4 2.7h4.8l.4-2.7a7.2 7.2 0 0 0 1.7-1l2.5 1 2-3.5L18.9 13a7 7 0 0 0 .1-1Z" />
        </svg>
      );
    case 'user':
      return (
        <svg {...common}>
          <path d="M20 21a8 8 0 1 0-16 0" />
          <circle cx="12" cy="8" r="4" />
        </svg>
      );
    case 'students':
      return (
        <svg {...common}>
          <path d="M12 13a4 4 0 1 0-4-4" />
          <path d="M4 20a8 8 0 0 1 16 0" />
          <circle cx="18" cy="9" r="2.3" />
        </svg>
      );
    case 'attendance':
      return (
        <svg {...common}>
          <path d="M5 12l4 4 10-10" />
          <path d="M12 22a10 10 0 1 0-10-10" />
        </svg>
      );
    case 'warning':
      return (
        <svg {...common}>
          <path d="M12 4 21 19H3Z" />
          <path d="M12 9v5" />
          <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'eye-off':
      return (
        <svg {...common}>
          <path d="M3 12s3.5-6.5 9-6.5 9 6.5 9 6.5-3.5 6.5-9 6.5S3 12 3 12Z" />
          <circle cx="12" cy="12" r="2.5" />
          <path d="m4 4 16 16" />
        </svg>
      );
    case 'eye':
      return (
        <svg {...common}>
          <path d="M3 12s3.5-6.5 9-6.5 9 6.5 9 6.5-3.5 6.5-9 6.5S3 12 3 12Z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 5 5" />
        </svg>
      );
    case 'filter':
      return (
        <svg {...common}>
          <path d="M4 6h16l-6 7v4l-4 2v-6Z" />
        </svg>
      );
    case 'logout':
      return (
        <svg {...common}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      );
    default:
      return null;
  }
}
