import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Users
export const getUsers = (search?: string) => apiClient.get('/users', { params: { search } }).then(r => r.data);
export const createUser = (data: any) => apiClient.post('/users', data).then(r => r.data);
export const updateUser = (id: string, data: any) => apiClient.put(`/users/${id}`, data).then(r => r.data);
export const deleteUser = (id: string) => apiClient.delete(`/users/${id}`).then(r => r.data);

// Hospitals
export const getHospitals = (search?: string) => apiClient.get('/hospitals', { params: { search } }).then(r => r.data);
export const createHospital = (data: any) => apiClient.post('/hospitals', data).then(r => r.data);
export const updateHospital = (id: string, data: any) => apiClient.put(`/hospitals/${id}`, data).then(r => r.data);
export const deleteHospital = (id: string) => apiClient.delete(`/hospitals/${id}`).then(r => r.data);

// Ambulances
export const getAmbulances = (search?: string) => apiClient.get('/ambulances', { params: { search } }).then(r => r.data);
export const createAmbulance = (data: any) => apiClient.post('/ambulances', data).then(r => r.data);
export const updateAmbulance = (id: string, data: any) => apiClient.put(`/ambulances/${id}`, data).then(r => r.data);
export const deleteAmbulance = (id: string) => apiClient.delete(`/ambulances/${id}`).then(r => r.data);

// Activity Logs
export const getActivityLogs = (search?: string, module?: string) =>
  apiClient.get('/activity', { params: { search, module } }).then(r => r.data);

// Auth
export const login = (data: any) => apiClient.post('/auth/login', data).then(r => r.data);

// Profile
export const updateProfile = (data: any) => apiClient.put('/profile', data).then(r => r.data);
export const updatePassword = (data: any) => apiClient.put('/profile/password', data).then(r => r.data);
