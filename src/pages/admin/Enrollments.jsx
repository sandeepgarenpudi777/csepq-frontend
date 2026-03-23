import React, { useEffect, useState } from 'react';
import EnrollmentService from '../../services/EnrollmentService';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const load = () => {
    setLoading(true);
    EnrollmentService.getAll().then(setEnrollments).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleStatusChange = async (id, status) => {
    try {
      await EnrollmentService.update(id, { status });
      toast.success('Status updated');
      load();
    } catch { toast.error('Update failed'); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Remove this enrollment?')) return;
    try { await EnrollmentService.delete(id); toast.success('Removed'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const filtered = enrollments.filter(e => {
    const matchSearch = `${e.studentName} ${e.courseName}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="main-content">
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div className="page-header">
          <h1>Enrollments</h1>
          <p>Manage all student course enrollments</p>
        </div>

        <div className="filter-bar">
          <div className="search-wrapper"><span className="search-icon">🔍</span>
            <input type="text" className="search-input" placeholder="Search by student or course..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 'auto', minWidth: 140 }}>
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <span className="text-sm text-slate" style={{ marginLeft: 'auto' }}>{filtered.length} records</span>
        </div>

        {loading ? <Loader /> : filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">📋</div><h3>No enrollments found</h3></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>#</th><th>Student</th><th>Course</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id}>
                    <td className="text-sm text-slate">#{e.id}</td>
                    <td><strong>{e.studentName}</strong></td>
                    <td>{e.courseName}</td>
                    <td className="text-sm text-slate">{e.enrollmentDate ? new Date(e.enrollmentDate).toLocaleDateString() : '—'}</td>
                    <td>
                      <select
                        value={e.status}
                        onChange={ev => handleStatusChange(e.id, ev.target.value)}
                        style={{ background: 'transparent', border: 'none', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', color: e.status === 'CONFIRMED' ? 'var(--teal)' : e.status === 'CANCELLED' ? 'var(--rose)' : e.status === 'COMPLETED' ? 'var(--ink)' : 'var(--amber)' }}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(e.id)}>Remove</button>
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
