import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import CourseService from '../../services/CourseService';
import EnrollmentService from '../../services/EnrollmentService';
import StudentService from '../../services/StudentService';
import Loader from '../../components/Loader';
import { getUser } from '../../utils/auth';

export default function EnrollCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);
  const user = getUser();

  useEffect(() => {
    Promise.all([
      CourseService.getById(id),
      StudentService.getAll(),
    ])
      .then(([c, students]) => {
        setCourse(c);
        // ── ISSUE 2 FIX: find student profile by email match ──
        const me = students.find(s => s.email === user?.email);
        setStudent(me || null);

        // Check if already enrolled
        if (me) {
          EnrollmentService.getByStudent(me.id)
            .then(enrollments => {
              const exists = enrollments.some(e => String(e.courseId) === String(id));
              setAlreadyEnrolled(exists);
            })
            .catch(() => {});
        }
      })
      .catch(() => toast.error('Failed to load course info'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    if (!student) {
      toast.error('No student profile found. Please contact admin.');
      return;
    }
    if (alreadyEnrolled) {
      toast.error('You are already enrolled in this course.');
      return;
    }

    setSubmitting(true);
    try {
      // ── ISSUE 2 FIX: send only studentId + courseId — no payment step here ──
      await EnrollmentService.create({
        studentId: student.id,
        courseId: parseInt(id),
      });
      toast.success('Enrolled successfully!');
      navigate('/student/courses');
    } catch (err) {
      const msg = err.response?.data?.message || 'Enrollment failed. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader fullPage />;
  if (!course) return (
    <div className="main-content">
      <div className="container">
        <p className="text-slate">Course not found.</p>
        <Link to="/courses" className="btn btn-outline" style={{ marginTop: 16 }}>Back to Courses</Link>
      </div>
    </div>
  );

  return (
    <div className="main-content">
      <div className="container" style={{ maxWidth: 680, paddingBottom: '4rem' }}>
        <div className="breadcrumb" style={{ marginTop: 32 }}>
          <Link to="/courses">Courses</Link>
          <span className="breadcrumb-sep">/</span>
          <Link to={`/courses/${id}`}>{course.title}</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">Enroll</span>
        </div>

        <h1 style={{ margin: '24px 0 8px' }}>Complete Enrollment</h1>
        <p className="text-slate">Review the details below before confirming your enrollment.</p>

        <div className="divider" />

        {/* Student profile check warning */}
        {!student && (
          <div style={{ background: 'var(--rose-light)', border: '1px solid var(--rose)', borderRadius: 'var(--r-md)', padding: '12px 16px', marginBottom: 20, fontSize: '0.875rem', color: 'var(--rose)' }}>
            No student profile found for your account. Please contact admin to create one.
          </div>
        )}

        {alreadyEnrolled && (
          <div style={{ background: 'var(--amber-pale)', border: '1px solid var(--amber)', borderRadius: 'var(--r-md)', padding: '12px 16px', marginBottom: 20, fontSize: '0.875rem', color: '#9a6800' }}>
            You are already enrolled in this course.
          </div>
        )}

        {/* Course summary */}
        <div className="card card-flat" style={{ marginBottom: 24, padding: '1.5rem', border: '2px solid var(--amber-pale)' }}>
          <h3 style={{ marginBottom: 8 }}>{course.title}</h3>
          <p className="text-sm text-slate" style={{ marginBottom: 16 }}>
            by {course.instructorName || 'Unknown Instructor'}
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span className="text-sm text-slate">📚 {course.credits} credits</span>
            <span className="text-sm text-slate">👥 {course.capacity} seats</span>
            <span className="text-sm" style={{ color: 'var(--amber)', fontWeight: 600 }}>
              ₹{Number(course.fee).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Student info */}
        {student && (
          <div className="card card-flat" style={{ padding: '1.5rem', background: 'var(--surface-2)', marginBottom: 32 }}>
            <h4 style={{ marginBottom: 12, fontFamily: 'var(--font-display)' }}>Enrolling as</h4>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, background: 'var(--ink)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
                {student.firstName?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{student.firstName} {student.lastName}</div>
                <div className="text-sm text-slate">{student.email} · ID: {student.studentId}</div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <Link to={`/courses/${id}`} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
            Cancel
          </Link>
          <button
            className="btn btn-amber"
            onClick={handleEnroll}
            disabled={submitting || !student || alreadyEnrolled}
            style={{ flex: 2, justifyContent: 'center', padding: '0.85rem' }}
          >
            {submitting ? 'Processing...' : alreadyEnrolled ? 'Already Enrolled' : 'Confirm Enrollment'}
          </button>
        </div>
      </div>
    </div>
  );
}
