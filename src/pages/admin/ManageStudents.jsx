import React, { useEffect, useState } from 'react';
import StudentService from '../../services/StudentService';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const EMPTY = { firstName: '', lastName: '', email: '', studentId: '', phone: '' };

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = () => { setLoading(true); StudentService.getAll().then(setStudents).catch(() => toast.error('Failed')).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setShowModal(true); };
  const openEdit = s => { setForm({ firstName: s.firstName, lastName: s.lastName, email: s.email, studentId: s.studentId, phone: s.phone || '' }); setEditId(s.id); setShowModal(true); };

  const handleSave = async e => {
    e.preventDefault(); setSaving(true);
    try {
      if (editId) await StudentService.update(editId, form);
      else await StudentService.create(form);
      toast.success(editId ? 'Updated!' : 'Created!');
      setShowModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this student?')) return;
    try { await StudentService.delete(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const filtered = students.filter(s =>
    `${s.firstName} ${s.lastName} ${s.email} ${s.studentId}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main-content">
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div><h1>Manage Students</h1><p>View and manage student records</p></div>
          <button className="btn btn-amber" onClick={openCreate}>+ Add Student</button>
        </div>

        <div className="filter-bar">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input type="text" className="search-input" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span className="text-sm text-slate" style={{ marginLeft: 'auto' }}>{filtered.length} students</span>
        </div>

        {loading ? <Loader /> : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Name</th><th>Student ID</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, background: 'var(--ink)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                          {s.firstName?.[0]?.toUpperCase()}
                        </div>
                        <strong>{s.firstName} {s.lastName}</strong>
                      </div>
                    </td>
                    <td><span className="badge badge-amber">{s.studentId}</span></td>
                    <td className="text-sm">{s.email}</td>
                    <td className="text-sm text-slate">{s.phone || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Delete</button>
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
              <span className="modal-title">{editId ? 'Edit Student' : 'New Student'}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group"><label className="form-label">First Name</label><input className="form-input" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} required /></div>
                <div className="form-group"><label className="form-label">Last Name</label><input className="form-input" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} required /></div>
              </div>
              <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group"><label className="form-label">Student ID</label><input className="form-input" value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))} required /></div>
                <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 2 }}>{saving ? 'Saving...' : editId ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
