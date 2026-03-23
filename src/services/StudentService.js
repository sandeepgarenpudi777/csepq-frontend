import axiosInstance from '../utils/axiosInstance';

const StudentService = {
  getAll: ()         => axiosInstance.get('/students').then(r => r.data),
  getById: (id)      => axiosInstance.get(`/students/${id}`).then(r => r.data),
  create: (data)     => axiosInstance.post('/students', data).then(r => r.data),
  update: (id, data) => axiosInstance.put(`/students/${id}`, data).then(r => r.data),
  delete: (id)       => axiosInstance.delete(`/students/${id}`).then(r => r.data),
};

export default StudentService;
