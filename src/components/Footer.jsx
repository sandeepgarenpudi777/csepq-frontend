import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--ink)',
      color: 'rgba(255,255,255,0.5)',
      padding: '3rem 0 2rem',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, background: 'var(--amber)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" fill="var(--ink)" />
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>
                Edu<span style={{ color: 'var(--amber)' }}>Verse</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.4)' }}>
              Empowering learners with world-class online education.
            </p>
          </div>

          {/* Links */}
          <div>
            <h5 style={{ fontFamily: 'var(--font-display)', color: 'white', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Platform</h5>
            {[['Courses', '/courses'], ['Register', '/register'], ['Login', '/login']].map(([label, path]) => (
              <div key={path} style={{ marginBottom: 6 }}>
                <Link to={path} style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--amber)'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
                >{label}</Link>
              </div>
            ))}
          </div>

          <div>
            <h5 style={{ fontFamily: 'var(--font-display)', color: 'white', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Support</h5>
            {['Help Center', 'Contact Us', 'Privacy Policy'].map(label => (
              <div key={label} style={{ marginBottom: 6 }}>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: '0.8rem' }}>© {new Date().getFullYear()} EduVerse. All rights reserved.</span>
          <span style={{ fontSize: '0.8rem' }}>Built with Spring Boot + React</span>
        </div>
      </div>
    </footer>
  );
}
