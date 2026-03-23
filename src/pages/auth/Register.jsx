import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthService from '../../services/AuthService';

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: '',
    role: 'STUDENT',
    // Student fields
    firstName: '', lastName: '', phone: '', studentId: '',
    // Instructor fields
    department: '', qualification: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const isStudent    = form.role === 'STUDENT';
  const isInstructor = form.role === 'INSTRUCTOR';

  // ── ISSUE 1 FIX: role-based validation ──
  const validate = () => {
    const e = {};
    if (!form.username || form.username.length < 3) e.username = 'Username must be at least 3 characters';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (isStudent && !form.studentId.trim()) e.studentId = 'Student ID is required';
    if (isInstructor && !form.department.trim()) e.department = 'Department is required';
    return e;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      // ── ISSUE 1 FIX: send all role-specific fields in request ──
      const payload = {
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
        firstName: form.firstName,
        lastName: form.lastName,
      };
      if (isStudent) {
        payload.phone = form.phone;
        payload.studentId = form.studentId;
      }
      if (isInstructor) {
        payload.department = form.department;
        payload.qualification = form.qualification;
      }
      await AuthService.register(payload);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-2)', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 540, background: 'white', borderRadius: 'var(--r-xl)', padding: '3rem', boxShadow: 'var(--shadow-lg)' }} className="slide-up">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, background: 'var(--ink)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" fill="var(--amber)" /></svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--ink)' }}>
              Edu<span style={{ color: 'var(--amber)' }}>Verse</span>
            </span>
          </Link>
          <h2 style={{ marginBottom: 8 }}>Create your account</h2>
          <p className="text-slate" style={{ fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--amber)', fontWeight: 600 }}>Sign in →</Link>
          </p>
        </div>

        {errors.general && (
          <div style={{ background: 'var(--rose-light)', border: '1px solid var(--rose)', borderRadius: 'var(--r-md)', padding: '12px 16px', marginBottom: 20, fontSize: '0.875rem', color: 'var(--rose)' }}>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Role selector — shown first so form fields adapt */}
          <div className="form-group">
            <label className="form-label">I am a...</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {['STUDENT', 'INSTRUCTOR'].map(r => (
                <label key={r} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 8, padding: '0.7rem', cursor: 'pointer',
                  border: `2px solid ${form.role === r ? 'var(--amber)' : 'var(--surface-3)'}`,
                  borderRadius: 'var(--r-md)',
                  background: form.role === r ? 'var(--amber-pale)' : 'transparent',
                  transition: 'all 0.15s',
                  fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem',
                  color: form.role === r ? '#9a6800' : 'var(--slate)',
                }}>
                  <input type="radio" name="role" value={r} checked={form.role === r} onChange={handleChange} style={{ display: 'none' }} />
                  {r === 'STUDENT' ? '🎓' : '📚'} {r}
                </label>
              ))}
            </div>
          </div>

          {/* Account fields */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <input type="text" name="username" className="form-input" placeholder="Choose a username" value={form.username} onChange={handleChange} required />
            {errors.username && <span className="form-error">⚠ {errors.username}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            {errors.email && <span className="form-error">⚠ {errors.email}</span>}
          </div>

          {/* ── ISSUE 1 FIX: First + Last name for both roles ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input type="text" name="firstName" className="form-input" placeholder="First name" value={form.firstName} onChange={handleChange} required />
              {errors.firstName && <span className="form-error">⚠ {errors.firstName}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input type="text" name="lastName" className="form-input" placeholder="Last name" value={form.lastName} onChange={handleChange} required />
              {errors.lastName && <span className="form-error">⚠ {errors.lastName}</span>}
            </div>
          </div>

          {/* ── ISSUE 1 FIX: Student-specific fields ── */}
          {isStudent && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Student ID</label>
                <input type="text" name="studentId" className="form-input" placeholder="e.g. STU2024001" value={form.studentId} onChange={handleChange} required />
                {errors.studentId && <span className="form-error">⚠ {errors.studentId}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone <span style={{ color: 'var(--slate)', fontWeight: 400 }}>(optional)</span></label>
                <input type="tel" name="phone" className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
              </div>
            </div>
          )}

          {/* ── ISSUE 1 FIX: Instructor-specific fields ── */}
          {isInstructor && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input type="text" name="department" className="form-input" placeholder="e.g. Computer Science" value={form.department} onChange={handleChange} required />
                {errors.department && <span className="form-error">⚠ {errors.department}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Qualification <span style={{ color: 'var(--slate)', fontWeight: 400 }}>(optional)</span></label>
                <input type="text" name="qualification" className="form-input" placeholder="e.g. M.Tech, PhD" value={form.qualification} onChange={handleChange} />
              </div>
            </div>
          )}

          {/* Password fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-input" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
              {errors.password && <span className="form-error">⚠ {errors.password}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" name="confirmPassword" className="form-input" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} required />
              {errors.confirmPassword && <span className="form-error">⚠ {errors.confirmPassword}</span>}
            </div>
          </div>

          <button type="submit" className="btn btn-amber" disabled={loading} style={{ marginTop: 8, padding: '0.85rem', fontSize: '0.95rem' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
