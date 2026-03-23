import React from 'react';

export default function Loader({ fullPage = false, size = 'md', text = '' }) {
  const sizes = { sm: 18, md: 32, lg: 48 };
  const px = sizes[size] || 32;

  const spinner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <svg
        width={px} height={px}
        viewBox="0 0 38 38"
        style={{ animation: 'spin 0.8s linear infinite' }}
      >
        <defs>
          <linearGradient id="loaderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#e8a020" stopOpacity="0" />
            <stop offset="100%" stopColor="#e8a020" stopOpacity="1" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#loaderGrad)" strokeWidth="3.5">
          <circle cx="19" cy="19" r="16" strokeOpacity="0.15" stroke="#e8a020" />
          <path d="M35 19 A16 16 0 0 1 19 35" stroke="#e8a020" strokeLinecap="round" />
        </g>
      </svg>
      {text && (
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: 'var(--slate)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          {text}
        </span>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
      }}>
        {spinner}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '3rem',
    }}>
      {spinner}
    </div>
  );
}
