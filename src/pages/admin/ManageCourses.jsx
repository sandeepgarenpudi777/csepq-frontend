import React, { useEffect, useState } from 'react';
import CourseService from '../../services/CourseService';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';
import { getUser, getRole } from '../../utils/auth';

const EMPTY = { title: '', description: '', credits: '', capacity: '', fee: '', status: 'ACTIVE', instructorId: '' };

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const role = getRole();
  const user = getUser();

  const load = () => {
    setLoading(true);
    CourseService.getAll()
      .then(setCourses)
      .catch(() => toast.error('Failed to load courses'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    // ── ISSUE 3 FIX: if instructor, pre-fill instructorId from profile
    //    (backend will auto-resolve anyway, but this gives the form a value) ──
    setForm({ ...EMPTY });
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = c => {
    setForm({
      title: c.title,
      description: c.description || '',
      credits: c.credits,
      capacity: c.capacity,
      fee: c.fee,
      status: c.status,
      instructorId: c.instructorId || '',
    });
    setEditId(c.id);
    setShowModal(true);
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        credits: Number(form.credits),
        capacity: Number(form.capacity),
        fee: Number(form.fee),
        // ── ISSUE 3 FIX: only send instructorId if it has a value ──
        instructorId: form.instructorId ? Number(form.instructorId) : null,
      };
      if (editId) await CourseService.update(editId, payload);
      else await CourseService.create(payload);
      toast.success(editId ? 'Course updated!' : 'Course created!');
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await CourseService.delete(id);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main-content">
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1>Manage Courses</h1>
            <p>Create, edit, and delete courses</p>
          </div>
          <button className="btn btn-amber" onClick={openCreate}>+ Add Course</button>
        </div>

        <div className="filter-bar">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search courses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span className="text-sm text-slate" style={{ marginLeft: 'auto' }}>{filtered.length} courses</span>
        </div>

        {loading ? <Loader /> : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Title</th><th>Instructor</th><th>Credits</th><th>Capacity</th><th>Fee</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.title}</strong></td>
                    <td className="text-sm text-slate">{c.instructorName || '—'}</td>
                    <td>{c.credits}</td>
                    <td>{c.capacity}</td>
                    <td>₹{Number(c.fee).toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`badge ${c.status === 'ACTIVE' ? 'badge-teal' : c.status === 'COMPLETED' ? 'badge-ink' : 'badge-slate'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(c)}>Edit</button>
                        {role === 'ADMIN' && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Delete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editId ? 'Edit Course' : 'New Course'}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  className="form-input"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Credits</label>
                  <input type="number" className="form-input" value={form.credits}
                    onChange={e => setForm(f => ({ ...f, credits: e.target.value }))} required min={1} max={10} />
                </div>
                <div className="form-group">
                  <label className="form-label">Capacity</label>
                  <input type="number" className="form-input" value={form.capacity}
                    onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} required min={1} />
                </div>
                <div className="form-group">
                  <label className="form-label">Fee (₹)</label>
                  <input type="number" className="form-input" value={form.fee}
                    onChange={e => setForm(f => ({ ...f, fee: e.target.value }))} required min={0} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                {/* ── ISSUE 3 FIX: instructorId optional for instructors
                    (backend auto-resolves from logged-in user) ── */}
                <div className="form-group">
                  <label className="form-label">
                    Instructor ID
                    {role === 'INSTRUCTOR' && (
                      <span style={{ color: 'var(--slate)', fontWeight: 400, marginLeft: 4 }}>(auto)</span>
                    )}
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder={role === 'INSTRUCTOR' ? 'Leave blank — auto-assigned' : 'Required for admin'}
                    value={form.instructorId}
                    onChange={e => setForm(f => ({ ...f, instructorId: e.target.value }))}
                    required={role === 'ADMIN'}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 2 }}>
                  {saving ? 'Saving...' : editId ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
