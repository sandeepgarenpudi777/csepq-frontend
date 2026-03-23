import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EnrollmentService from '../../services/EnrollmentService';
import StudentService from '../../services/StudentService';
import Loader from '../../components/Loader';
import { getUser } from '../../utils/auth';
import toast from 'react-hot-toast';

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    StudentService.getAll()
      .then(students => {
        const me = students.find(s => s.email === user?.email);
        setStudent(me);
        if (me) return EnrollmentService.getByStudent(me.id);
        return [];
      })
      .then(setEnrollments)
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  // ── ISSUE 2 FIX: count ENROLLED as active too ──
  const active    = enrollments.filter(e => e.status === 'ENROLLED' || e.status === 'CONFIRMED').length;
  const pending   = enrollments.filter(e => e.status === 'PENDING').length;
  const completed = enrollments.filter(e => e.status === 'COMPLETED').length;

  if (loading) return <Loader fullPage />;

  return (
    <div className="main-content">
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div style={{
          paddingTop: 40, paddingBottom: 32,
          borderBottom: '1px solid var(--surface-3)',
          marginBottom: 32,
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-end', flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <p className="text-sm text-slate" style={{ marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Student Portal</p>
            <h1 style={{ marginBottom: 4 }}>Hello, {student?.firstName || user?.username} 👋</h1>
            <p className="text-slate">Track your learning progress and enrollments</p>
          </div>
          <Link to="/courses" className="btn btn-amber">Explore Courses →</Link>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: 40 }}>
          <div className="stat-card amber">
            <div className="stat-number">{enrollments.length}</div>
            <div className="stat-label">Total Enrollments</div>
          </div>
          <div className="stat-card teal">
            <div className="stat-number">{active}</div>
            <div className="stat-label">Active Courses</div>
          </div>
          <div className="stat-card ink">
            <div className="stat-number">{completed}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card rose">
            <div className="stat-number">{pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>

        {/* Recent enrollments */}
        <h2 style={{ marginBottom: 20 }}>Recent Enrollments</h2>
        {enrollments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h3>No enrollments yet</h3>
            <p>Browse our courses and enroll today</p>
            <Link to="/courses" className="btn btn-amber" style={{ marginTop: 20 }}>Browse Courses</Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Course</th><th>Enrolled On</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {enrollments.slice(0, 5).map(e => (
                  <tr key={e.id}>
                    <td><strong>{e.courseName}</strong></td>
                    <td className="text-sm text-slate">
                      {e.enrollmentDate ? new Date(e.enrollmentDate).toLocaleDateString() : '—'}
                    </td>
                    <td><StatusBadge status={e.status} /></td>
                    <td>
                      <Link to={`/courses/${e.courseId}`} className="btn btn-ghost btn-sm">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

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
