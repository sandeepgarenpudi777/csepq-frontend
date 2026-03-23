import React from 'react';
import { Link } from 'react-router-dom';

const STATUS_COLORS = {
  ACTIVE:    { bg: 'var(--teal-light)',  color: 'var(--teal)',  label: 'Active'    },
  INACTIVE:  { bg: 'var(--surface-2)',   color: 'var(--slate)', label: 'Inactive'  },
  COMPLETED: { bg: 'var(--amber-pale)',  color: '#9a6800',      label: 'Completed' },
};

export default function CourseCard({ course, onEnroll, showActions = false, onEdit, onDelete }) {
  const status = STATUS_COLORS[course.status] || STATUS_COLORS.ACTIVE;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0, overflow: 'hidden' }}>
      {/* Header strip */}
      <div style={{
        height: 6,
        background: `linear-gradient(90deg, var(--amber), var(--amber-soft))`,
      }} />

      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '3px 10px',
            background: status.bg, color: status.color,
            borderRadius: 'var(--r-full)',
            fontSize: '0.7rem', fontWeight: 700,
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            {status.label}
          </span>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.15rem',
            color: 'var(--amber)',
          }}>
            ₹{Number(course.fee).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.05rem', marginBottom: 8, color: 'var(--ink)', lineHeight: 1.3 }}>
          {course.title}
        </h3>

        {/* Description */}
        <p style={{ fontSize: '0.85rem', color: 'var(--slate)', marginBottom: 16, flex: 1,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {course.description || 'No description available.'}
        </p>

        {/* Meta */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <Meta icon="📚" label={`${course.credits} Credits`} />
          <Meta icon="👥" label={`${course.capacity} Seats`} />
          {course.instructorName && <Meta icon="🎓" label={course.instructorName} />}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link to={`/courses/${course.id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
            View Details
          </Link>
          {onEnroll && course.status === 'ACTIVE' && (
            <button className="btn btn-amber btn-sm" onClick={() => onEnroll(course)} style={{ flex: 1 }}>
              Enroll
            </button>
          )}
          {showActions && (
            <>
              {onEdit && (
                <button className="btn btn-outline btn-sm" onClick={() => onEdit(course)}>Edit</button>
              )}
              {onDelete && (
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(course.id)}>Delete</button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Meta({ icon, label }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--slate)' }}>
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  );
}
