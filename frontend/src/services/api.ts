import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const employeeService = {
  getAll: () => api.get('/employees/'),
  getById: (id: number) => api.get(`/employees/${id}`),
  create: (data: any) => api.get('/employees/').then(() => {}), 
  add: (data: any) => api.post('/employees/', data),
  delete: (id: number) => api.delete(`/employees/${id}`),
  getStats: () => api.get('/employees/dashboard/stats'),
};

export const attendanceService = {
  mark: (data: { employee_id: number; date: string; status: string; remarks?: string | null, check_in_time?: string | null }) => api.post('/attendance/', data),
  getForEmployee: (id: number) => api.get(`/attendance/employee/${id}`),
  getSummary: () => api.get('/attendance/summary'),
  getTodayStats: (date: string) => api.get(`/attendance/today-stats?date=${date}`),
};

export default api;
