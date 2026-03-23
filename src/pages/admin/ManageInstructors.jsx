import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const EMPTY = { firstName: '', lastName: '', email: '', department: '', qualification: '' };

export default function ManageInstructors() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    axiosInstance.get('/instructors').then(r => setInstructors(r.data)).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setShowModal(true); };
  const openEdit = i => { setForm({ firstName: i.firstName, lastName: i.lastName, email: i.email, department: i.department || '', qualification: i.qualification || '' }); setEditId(i.id); setShowModal(true); };

  const handleSave = async e => {
    e.preventDefault(); setSaving(true);
    try {
      if (editId) await axiosInstance.put(`/instructors/${editId}`, form);
      else await axiosInstance.post('/instructors', form);
      toast.success(editId ? 'Updated!' : 'Created!');
      setShowModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this instructor?')) return;
    try { await axiosInstance.delete(`/instructors/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const filtered = instructors.filter(i =>
    `${i.firstName} ${i.lastName} ${i.email} ${i.department}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main-content">
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div><h1>Manage Instructors</h1><p>View and manage instructor profiles</p></div>
          <button className="btn btn-amber" onClick={openCreate}>+ Add Instructor</button>
        </div>

        <div className="filter-bar">
          <div className="search-wrapper"><span className="search-icon">🔍</span>
            <input type="text" className="search-input" placeholder="Search instructors..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? <Loader /> : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Qualification</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(i => (
                  <tr key={i.id}>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, background: 'var(--teal)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>{i.firstName?.[0]}</div>
                      <strong>{i.firstName} {i.lastName}</strong></div></td>
                    <td className="text-sm">{i.email}</td>
                    <td>{i.department || '—'}</td>
                    <td className="text-sm text-slate">{i.qualification || '—'}</td>
                    <td><div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(i)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(i.id)}>Delete</button>
                    </div></td>
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
              <span className="modal-title">{editId ? 'Edit Instructor' : 'New Instructor'}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group"><label className="form-label">First Name</label><input className="form-input" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} required /></div>
                <div className="form-group"><label className="form-label">Last Name</label><input className="form-input" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} required /></div>
              </div>
              <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group"><label className="form-label">Department</label><input className="form-input" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} /></div>
                <div className="form-group"><label className="form-label">Qualification</label><input className="form-input" value={form.qualification} onChange={e => setForm(f => ({ ...f, qualification: e.target.value }))} /></div>
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
