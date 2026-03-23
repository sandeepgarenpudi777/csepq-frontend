import axiosInstance from '../utils/axiosInstance';

const PaymentService = {
  getAll: ()              => axiosInstance.get('/payments').then(r => r.data),
  getById: (id)           => axiosInstance.get(`/payments/${id}`).then(r => r.data),
  create: (data)          => axiosInstance.post('/payments', data).then(r => r.data),
  update: (id, data)      => axiosInstance.put(`/payments/${id}`, data).then(r => r.data),
  getByEnrollment: (eid)  => axiosInstance.get(`/payments/enrollment/${eid}`).then(r => r.data),
};

export default PaymentService;
