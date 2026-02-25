import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
  getTeachers: () => api.get('/auth/teachers'),
};

export const projectService = {
  requestProject: (data) => api.post('/projects/request', data),
  getProjectsByStudent: () => api.get('/projects/student'),
  getProjectsByTeacher: () => api.get('/projects/teacher'),
  getProjectDetails: (id) => api.get(`/projects/${id}`),
  approveProject: (id) => api.post(`/projects/${id}/approve`),
  rejectProject: (id) => api.post(`/projects/${id}/reject`),
  updateProjectProgress: (id, progress) => api.patch(`/projects/${id}/progress`, { progress }),
};

export const wprService = {
  submitWPR: (projectId, data) => api.post(`/wpr/${projectId}/submit`, data),
  getWPR: (projectId) => api.get(`/wpr/${projectId}`),
  getWPRDetails: (projectId, id) => api.get(`/wpr/${projectId}/${id}`),
};

export const analyticsService = {
  getTeacherAnalytics: () => api.get('/analytics/teacher'),
  getStudentAnalytics: (studentId) => api.get(`/analytics/student/${studentId}`),
};

export default api;
