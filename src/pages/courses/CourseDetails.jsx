import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import CourseService from '../../services/CourseService';
import Loader from '../../components/Loader';
import { isAuthenticated } from '../../utils/auth';
import toast from 'react-hot-toast';

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    CourseService.getById(id)
      .then(setCourse)
      .catch(() => toast.error('Course not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader fullPage />;
  if (!course) return (
    <div className="main-content"><div className="container"><div className="empty-state"><h3>Course not found</h3><Link to="/courses" className="btn btn-primary" style={{ marginTop: 16 }}>Back to Courses</Link></div></div></div>
  );

  return (
    <div className="main-content">
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div className="breadcrumb" style={{ marginTop: 32 }}>
          <Link to="/">Home</Link>
          <span className="breadcrumb-sep">/</span>
          <Link to="/courses">Courses</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{course.title}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40, marginTop: 32, alignItems: 'start' }}>
          {/* Main */}
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <span className={`badge ${course.status === 'ACTIVE' ? 'badge-teal' : 'badge-slate'}`}>{course.status}</span>
              <span className="badge badge-slate">{course.credits} Credits</span>
            </div>
            <h1 style={{ marginBottom: 16, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>{course.title}</h1>
            {course.instructorName && (
              <p style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                <span style={{ width: 32, height: 32, background: 'var(--ink)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>
                  {course.instructorName[0]}
                </span>
                <span>Taught by <strong style={{ color: 'var(--ink)' }}>{course.instructorName}</strong></span>
              </p>
            )}
            <div className="divider" />
            <h3 style={{ marginBottom: 12 }}>About this course</h3>
            <p style={{ lineHeight: 1.8 }}>{course.description || 'No description available for this course.'}</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 32 }}>
              {[['📚', 'Credits', course.credits], ['👥', 'Capacity', `${course.capacity} seats`], ['💰', 'Fee', `₹${Number(course.fee).toLocaleString('en-IN')}`]].map(([icon, label, val]) => (
                <div key={label} className="card card-flat" style={{ textAlign: 'center', padding: '1.2rem' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{icon}</div>
                  <div className="stat-label">{label}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginTop: 4 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ position: 'sticky', top: 100 }}>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: 'var(--amber)', marginBottom: 4 }}>
                ₹{Number(course.fee).toLocaleString('en-IN')}
              </div>
              <p className="text-sm text-slate" style={{ marginBottom: 24 }}>One-time enrollment fee</p>

              {course.status === 'ACTIVE' ? (
                isAuthenticated() ? (
                  <Link to={`/courses/${course.id}/enroll`} className="btn btn-amber" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', marginBottom: 12 }}>
                    Enroll Now
                  </Link>
                ) : (
                  <Link to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', marginBottom: 12 }}>
                    Sign In to Enroll
                  </Link>
                )
              ) : (
                <button className="btn" disabled style={{ width: '100%', background: 'var(--surface-2)', color: 'var(--slate)', padding: '0.9rem', marginBottom: 12 }}>
                  Enrollment Closed
                </button>
              )}

              <Link to="/courses" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>← Back to Courses</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
