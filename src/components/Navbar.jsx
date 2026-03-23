import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated, getUser, getRole, clearAuth } from '../utils/auth';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const authed = isAuthenticated();
  const user = getUser();
  const role = getRole();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  // ── ISSUE 3 FIX: instructor dashboard = course management ──
  const dashboardPath =
    role === 'ADMIN'       ? '/admin/dashboard' :
    role === 'INSTRUCTOR'  ? '/admin/courses'   :
    '/student/dashboard';

  const dashboardLabel =
    role === 'ADMIN'       ? 'Dashboard' :
    role === 'INSTRUCTOR'  ? 'My Courses' :
    'Dashboard';

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 72,
      background: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: scrolled ? '1px solid var(--surface-3)' : '1px solid transparent',
      transition: 'all 0.3s var(--ease-out)',
      boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
    }}>
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'var(--ink)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="var(--amber)" />
              <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
              <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--ink)' }}>
            Edu<span style={{ color: 'var(--amber)' }}>Verse</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <NavLink to="/courses">Courses</NavLink>
          {authed && <NavLink to={dashboardPath}>{dashboardLabel}</NavLink>}
          {/* ── ISSUE 3 FIX: instructor sees enrollments link ── */}
          {authed && role === 'INSTRUCTOR' && (
            <NavLink to="/admin/enrollments">Enrollments</NavLink>
          )}
          {!authed ? (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-amber btn-sm">Get Started</Link>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 12px',
                background: 'var(--surface-2)',
                borderRadius: 'var(--r-full)',
              }}>
                <div style={{
                  width: 26, height: 26,
                  background: 'var(--ink)', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.7rem',
                }}>
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <span style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '0.82rem' }}>{user?.username}</span>
                <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>{role}</span>
              </div>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="hide-desktop"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ padding: 8, borderRadius: 8, background: 'var(--surface-2)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'white', borderBottom: '1px solid var(--surface-3)',
          padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 8,
          boxShadow: 'var(--shadow-md)',
        }}>
          <Link to="/courses" className="btn btn-ghost">Courses</Link>
          {authed && <Link to={dashboardPath} className="btn btn-ghost">{dashboardLabel}</Link>}
          {authed && role === 'INSTRUCTOR' && (
            <Link to="/admin/enrollments" className="btn btn-ghost">Enrollments</Link>
          )}
          {!authed ? (
            <>
              <Link to="/login" className="btn btn-outline">Sign In</Link>
              <Link to="/register" className="btn btn-amber">Get Started</Link>
            </>
          ) : (
            <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
          )}
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, children }) {
  const { pathname } = useLocation();
  const active = pathname.startsWith(to);
  return (
    <Link to={to} style={{
      padding: '6px 12px', borderRadius: 8,
      fontFamily: 'var(--font-display)', fontSize: '0.875rem', fontWeight: 600,
      color: active ? 'var(--amber)' : 'var(--slate)',
      background: active ? 'var(--amber-pale)' : 'transparent',
      transition: 'all 0.15s',
    }}>
      {children}
    </Link>
  );
}
