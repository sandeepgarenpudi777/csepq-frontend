import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EnrollmentService from '../../services/EnrollmentService';
import StudentService from '../../services/StudentService';
import Loader from '../../components/Loader';
import { getUser } from '../../utils/auth';
import toast from 'react-hot-toast';

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const user = getUser();

  useEffect(() => {
    StudentService.getAll()
      .then(students => {
        const me = students.find(s => s.email === user?.email);
        if (me) return EnrollmentService.getByStudent(me.id);
        return [];
      })
      .then(setEnrollments)
      .catch(() => toast.error('Failed to load courses'))
      .finally(() => setLoading(false));
  }, []);

  // ── ISSUE 2 FIX: include ENROLLED in filter tabs ──
  const filtered = filter === 'ALL'
    ? enrollments
    : enrollments.filter(e => e.status === filter);

  if (loading) return <Loader fullPage />;

  return (
    <div className="main-content">
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div className="page-header">
          <h1>My Courses</h1>
          <p>All your enrolled courses in one place</p>
        </div>

        <div className="tabs">
          {['ALL', 'ENROLLED', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'].map(s => (
            <button
              key={s}
              className={`tab ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📂</div>
            <h3>No courses found</h3>
            <p>
              {filter === 'ALL'
                ? "You haven't enrolled in any courses yet"
                : `No ${filter.toLowerCase()} courses`}
            </p>
            {filter === 'ALL' && (
              <Link to="/courses" className="btn btn-amber" style={{ marginTop: 20 }}>
                Browse Courses
              </Link>
            )}
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map(e => (
              <div key={e.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{
                  height: 4,
                  background:
                    e.status === 'ENROLLED'   ? 'var(--amber)' :
                    e.status === 'CONFIRMED'  ? 'var(--teal)'  :
                    e.status === 'COMPLETED'  ? 'var(--ink)'   :
                    e.status === 'CANCELLED'  ? 'var(--rose)'  : 'var(--slate)',
                }} />
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ marginBottom: 10 }}><StatusBadge status={e.status} /></div>
                  <h3 style={{ fontSize: '1rem', marginBottom: 8 }}>{e.courseName}</h3>
                  <p className="text-sm text-slate" style={{ marginBottom: 16 }}>
                    Enrolled:{' '}
                    {e.enrollmentDate
                      ? new Date(e.enrollmentDate).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })
                      : 'N/A'}
                  </p>
                  <Link
                    to={`/courses/${e.courseId}`}
                    className="btn btn-outline btn-sm"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    View Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── ISSUE 2 FIX: ENROLLED added to badge map ──
function StatusBadge({ status }) {
  const map = {
    ENROLLED:  'badge-amber',
    CONFIRMED: 'badge-teal',
    PENDING:   'badge-amber',
    CANCELLED: 'badge-rose',
    COMPLETED: 'badge-ink',
  };
  return <span className={`badge ${map[status] || 'badge-slate'}`}>{status}</span>;
}
