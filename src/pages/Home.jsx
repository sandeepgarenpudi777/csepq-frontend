import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CourseService from '../services/CourseService';
import CourseCard from '../components/CourseCard';
import Loader from '../components/Loader';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CourseService.getAll()
      .then(data => setCourses(data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'var(--ink)',
        padding: '7rem 0 5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,160,32,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,140,122,0.08) 0%, transparent 70%)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(232,160,32,0.15)', border: '1px solid rgba(232,160,32,0.3)', borderRadius: 'var(--r-full)', padding: '6px 16px', marginBottom: 24 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--amber)', display: 'block' }} />
            <span style={{ color: 'var(--amber)', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Now enrolling — Spring 2026
            </span>
          </div>

          <h1 style={{ color: 'white', maxWidth: 700, margin: '0 auto 20px', fontSize: 'clamp(2.4rem, 6vw, 4rem)' }}>
            Expand your skills with{' '}
            <span style={{
              color: 'transparent',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              backgroundImage: 'linear-gradient(135deg, var(--amber), var(--amber-soft))',
            }}>
              expert instructors
            </span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Join thousands of students learning new skills online. Enroll in courses that fit your schedule and career goals.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/courses" className="btn btn-amber btn-lg">
              Browse Courses →
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
              Create Account
            </Link>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 64, flexWrap: 'wrap' }}>
            {[['500+', 'Courses'], ['12k+', 'Students'], ['80+', 'Instructors'], ['95%', 'Satisfaction']].map(([val, lbl]) => (
              <div key={lbl} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', color: 'var(--amber)' }}>{val}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 style={{ marginBottom: 8 }}>Featured Courses</h2>
              <p style={{ fontSize: '1rem' }}>Handpicked courses to kickstart your journey</p>
            </div>
            <Link to="/courses" className="btn btn-outline">View All Courses →</Link>
          </div>

          {loading ? <Loader /> : (
            <div className="grid-3">
              {courses.length > 0
                ? courses.map(c => <CourseCard key={c.id} course={c} />)
                : <p className="text-slate">No courses available yet.</p>
              }
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--amber-pale)', padding: '5rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: 12 }}>Ready to start learning?</h2>
          <p style={{ marginBottom: 32, fontSize: '1rem', maxWidth: 480, margin: '0 auto 32px' }}>
            Create your free account and get access to hundreds of courses immediately.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">Get Started — It's Free</Link>
        </div>
      </section>
    </div>
  );
}
