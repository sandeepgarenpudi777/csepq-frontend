import axiosInstance from '../utils/axiosInstance';

const EnrollmentService = {
  getAll: ()              => axiosInstance.get('/enrollments').then(r => r.data),
  getById: (id)           => axiosInstance.get(`/enrollments/${id}`).then(r => r.data),
  create: (data)          => axiosInstance.post('/enrollments', data).then(r => r.data),
  update: (id, data)      => axiosInstance.put(`/enrollments/${id}`, data).then(r => r.data),
  delete: (id)            => axiosInstance.delete(`/enrollments/${id}`).then(r => r.data),
  getByStudent: (sid)     => axiosInstance.get(`/enrollments/student/${sid}`).then(r => r.data),
  getByCourse: (cid)      => axiosInstance.get(`/enrollments/course/${cid}`).then(r => r.data),
};

export default EnrollmentService;
