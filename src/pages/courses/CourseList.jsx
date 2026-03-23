import React, { useEffect, useState } from 'react';
import CourseService from '../../services/CourseService';
import CourseCard from '../../components/CourseCard';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';
import toast from 'react-hot-toast';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const authed = isAuthenticated();

  useEffect(() => {
    CourseService.getAll()
      .then(data => { setCourses(data); setFiltered(data); })
      .catch(() => toast.error('Failed to load courses'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = courses;
    if (search.trim()) result = result.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase()));
    if (status !== 'ALL') result = result.filter(c => c.status === status);
    setFiltered(result);
  }, [search, status, courses]);

  const handleEnroll = course => {
    if (!authed) { navigate('/login'); return; }
    navigate(`/courses/${course.id}/enroll`);
  };

  return (
    <div className="main-content">
      <div className="container">
        <div className="page-header">
          <h1>All Courses</h1>
          <p>Discover and enroll in courses tailored to your goals</p>
        </div>

        {/* Filters */}
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
          <select
            className="form-select"
            value={status}
            onChange={e => setStatus(e.target.value)}
            style={{ width: 'auto', minWidth: 140 }}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <span className="text-sm text-slate" style={{ marginLeft: 'auto' }}>{filtered.length} courses</span>
        </div>

        {loading ? <Loader /> : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h3>No courses found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid-3" style={{ paddingBottom: '4rem' }}>
            {filtered.map(c => (
              <CourseCard key={c.id} course={c} onEnroll={handleEnroll} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
