import React, { useEffect, useState } from 'react';
import StudentService from '../../services/StudentService';
import Loader from '../../components/Loader';
import { getUser } from '../../utils/auth';
import toast from 'react-hot-toast';

export default function Profile() {
  const [student, setStudent] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const user = getUser();

  useEffect(() => {
    StudentService.getAll()
      .then(students => {
        const me = students.find(s => s.email === user?.email);
        setStudent(me);
        if (me) setForm({ firstName: me.firstName, lastName: me.lastName, phone: me.phone || '', email: me.email });
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!student) return;
    setSaving(true);
    try {
      const updated = await StudentService.update(student.id, { ...student, ...form });
      setStudent(updated);
      setEditing(false);
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="main-content">
      <div className="container" style={{ maxWidth: 680, paddingBottom: '4rem' }}>
        <div className="page-header">
          <h1>My Profile</h1>
          <p>Manage your personal information</p>
        </div>

        {!student ? (
          <div className="card">
            <p className="text-slate">No student profile linked to your account.</p>
          </div>
        ) : (
          <>
            {/* Avatar row */}
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24, padding: '2rem' }}>
              <div style={{ width: 72, height: 72, background: 'var(--ink)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', flexShrink: 0 }}>
                {student.firstName?.[0]?.toUpperCase()}
              </div>
              <div>
                <h3 style={{ marginBottom: 2 }}>{student.firstName} {student.lastName}</h3>
                <p className="text-sm text-slate">{student.email}</p>
                <span className="badge badge-amber" style={{ marginTop: 6 }}>ID: {student.studentId}</span>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setEditing(!editing)} style={{ marginLeft: 'auto' }}>
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {editing ? (
              <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input className="form-input" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input className="form-input" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={form.phone} placeholder="+91 98765 43210" onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
              </div>
            ) : (
              <div className="card" style={{ padding: '2rem' }}>
                <h4 style={{ marginBottom: 20 }}>Personal Information</h4>
                {[['First Name', student.firstName], ['Last Name', student.lastName], ['Email', student.email], ['Phone', student.phone || '—'], ['Student ID', student.studentId]].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--surface-3)' }}>
                    <span className="text-sm text-slate" style={{ fontWeight: 600 }}>{label}</span>
                    <span className="text-sm" style={{ fontWeight: 500 }}>{val}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
