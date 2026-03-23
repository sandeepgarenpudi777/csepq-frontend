import axiosInstance from '../utils/axiosInstance';

const CourseService = {
  getAll:          ()         => axiosInstance.get('/courses').then(r => r.data),
  getById:         (id)       => axiosInstance.get(`/courses/${id}`).then(r => r.data),
  // ── ISSUE 3 FIX: always send auth header (axiosInstance interceptor handles it) ──
  create:          (data)     => axiosInstance.post('/courses', data).then(r => r.data),
  update:          (id, data) => axiosInstance.put(`/courses/${id}`, data).then(r => r.data),
  delete:          (id)       => axiosInstance.delete(`/courses/${id}`).then(r => r.data),
  getByInstructor: (id)       => axiosInstance.get(`/courses/instructor/${id}`).then(r => r.data),
};

export default CourseService;
