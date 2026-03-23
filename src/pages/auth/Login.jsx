import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthService from '../../services/AuthService';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await AuthService.login(form.username, form.password);
      toast.success(`Welcome back, ${data.username}!`);
      const role = data.role;
      if (role === 'ADMIN') navigate('/admin/dashboard', { replace: true });
      else if (role === 'INSTRUCTOR') navigate('/instructor/dashboard', { replace: true });
      else navigate('/student/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: 'var(--surface)',
    }}>
      {/* Left panel */}
      <div style={{
        background: 'var(--ink)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '4rem',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circle */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(232,160,32,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(232,160,32,0.05)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
            <div style={{ width: 40, height: 40, background: 'var(--amber)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="var(--ink)" />
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', color: 'white' }}>
              Edu<span style={{ color: 'var(--amber)' }}>Verse</span>
            </span>
          </div>

          <h1 style={{ color: 'white', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: 16 }}>
            Learn without<br /><span style={{ color: 'var(--amber)' }}>limits.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 340, fontSize: '0.95rem' }}>
            Access hundreds of courses taught by expert instructors. Start your learning journey today.
          </p>

          <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: '🎓', text: 'Expert-led courses across all disciplines' },
              { icon: '📱', text: 'Learn at your own pace, anytime' },
              { icon: '🏆', text: 'Earn recognized certifications' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem' }}>
        <div style={{ width: '100%', maxWidth: 420 }} className="slide-up">
          <h2 style={{ marginBottom: 8 }}>Sign in</h2>
          <p className="text-slate" style={{ marginBottom: 32, fontSize: '0.95rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--amber)', fontWeight: 600 }}>Create one →</Link>
          </p>

          {error && (
            <div style={{
              background: 'var(--rose-light)', border: '1px solid var(--rose)',
              borderRadius: 'var(--r-md)', padding: '12px 16px',
              marginBottom: 20, fontSize: '0.875rem', color: 'var(--rose)',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                className="form-input"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ marginTop: 8, padding: '0.85rem' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>

      <style>{`@media(max-width:768px){.login-grid{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}
