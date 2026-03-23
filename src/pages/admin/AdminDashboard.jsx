import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CourseService from '../../services/CourseService';
import StudentService from '../../services/StudentService';
import EnrollmentService from '../../services/EnrollmentService';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ courses: 0, students: 0, enrollments: 0, revenue: 0 });
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([CourseService.getAll(), StudentService.getAll(), EnrollmentService.getAll()])
      .then(([courses, students, enrollments]) => {
        setStats({
          courses: courses.length,
          students: students.length,
          enrollments: enrollments.length,
          revenue: 0,
        });
        setRecentEnrollments(enrollments.slice(0, 8));
      })
      .catch(() => toast.error('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullPage />;

  return (
    <div className="main-content">
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div style={{ paddingTop: 40, paddingBottom: 32, borderBottom: '1px solid var(--surface-3)', marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="text-sm text-slate" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 4 }}>Admin Portal</p>
            <h1>Dashboard</h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/admin/courses" className="btn btn-outline btn-sm">Manage Courses</Link>
            <Link to="/admin/students" className="btn btn-amber btn-sm">Manage Students</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: 40 }}>
          <div className="stat-card amber">
            <div className="stat-number">{stats.courses}</div>
            <div className="stat-label">Total Courses</div>
          </div>
          <div className="stat-card teal">
            <div className="stat-number">{stats.students}</div>
            <div className="stat-label">Students</div>
          </div>
          <div className="stat-card ink">
            <div className="stat-number">{stats.enrollments}</div>
            <div className="stat-label">Enrollments</div>
          </div>
          <div className="stat-card rose">
            <div className="stat-number">—</div>
            <div className="stat-label">Revenue</div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid-4" style={{ marginBottom: 40 }}>
          {[
            { label: 'Manage Courses', path: '/admin/courses', icon: '📚', color: 'var(--amber-pale)', border: 'var(--amber)' },
            { label: 'Manage Students', path: '/admin/students', icon: '🎓', color: 'var(--teal-light)', border: 'var(--teal)' },
            { label: 'Instructors', path: '/admin/instructors', icon: '👨‍🏫', color: 'var(--surface-2)', border: 'var(--slate)' },
            { label: 'Enrollments', path: '/admin/enrollments', icon: '📋', color: 'var(--rose-light)', border: 'var(--rose)' },
          ].map(({ label, path, icon, color, border }) => (
            <Link key={path} to={path} className="card" style={{ textDecoration: 'none', background: color, borderColor: border, textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>{icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)' }}>{label}</div>
            </Link>
          ))}
        </div>

        {/* Recent Enrollments */}
        <h2 style={{ marginBottom: 20 }}>Recent Enrollments</h2>
        {recentEnrollments.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">📋</div><h3>No enrollments yet</h3></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead><tr>
                <th>#</th><th>Student</th><th>Course</th><th>Date</th><th>Status</th>
              </tr></thead>
              <tbody>
                {recentEnrollments.map(e => (
                  <tr key={e.id}>
                    <td className="text-sm text-slate">#{e.id}</td>
                    <td><strong>{e.studentName}</strong></td>
                    <td>{e.courseName}</td>
                    <td className="text-sm text-slate">{e.enrollmentDate ? new Date(e.enrollmentDate).toLocaleDateString() : '—'}</td>
                    <td><StatusBadge status={e.status} /></td>
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
  const map = { CONFIRMED: 'badge-teal', PENDING: 'badge-amber', CANCELLED: 'badge-rose', COMPLETED: 'badge-ink' };
  return <span className={`badge ${map[status] || 'badge-slate'}`}>{status}</span>;
}
