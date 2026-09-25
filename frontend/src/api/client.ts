import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Auth ───────────────────────────────────────────────────────────────────
export const login = (data: any) => apiClient.post('/auth/login', data).then(r => r.data);

// ── Profile ────────────────────────────────────────────────────────────────
export const updateProfile = (data: any) => apiClient.put('/profile', data).then(r => r.data);
export const updatePassword = (data: any) => apiClient.put('/profile/password', data).then(r => r.data);

// ── Users ──────────────────────────────────────────────────────────────────
export const getUsers = (search?: string) => apiClient.get('/users', { params: { search } }).then(r => r.data);
export const createUser = (data: any) => apiClient.post('/users', data).then(r => r.data);
export const updateUser = (id: string, data: any) => apiClient.put(`/users/${id}`, data).then(r => r.data);
export const deleteUser = (id: string) => apiClient.delete(`/users/${id}`).then(r => r.data);

// ── Hospitals ──────────────────────────────────────────────────────────────
export const getHospitals = (search?: string) => apiClient.get('/hospitals', { params: { search } }).then(r => r.data);
export const getHospital = (id: string) => apiClient.get(`/hospitals/${id}`).then(r => r.data);
export const createHospital = (data: any) => apiClient.post('/hospitals', data).then(r => r.data);
export const updateHospital = (id: string, data: any) => apiClient.put(`/hospitals/${id}`, data).then(r => r.data);
export const updateHospitalResources = (id: string, data: any) => apiClient.patch(`/hospitals/${id}/resources`, data).then(r => r.data);
export const deleteHospital = (id: string) => apiClient.delete(`/hospitals/${id}`).then(r => r.data);

// ── Ambulances ─────────────────────────────────────────────────────────────
export const getAmbulances = (search?: string, status?: string) => apiClient.get('/ambulances', { params: { search, status } }).then(r => r.data);
export const createAmbulance = (data: any) => apiClient.post('/ambulances', data).then(r => r.data);
export const updateAmbulance = (id: string, data: any) => apiClient.put(`/ambulances/${id}`, data).then(r => r.data);
export const updateAmbulanceLocation = (id: string, data: any) => apiClient.patch(`/ambulances/${id}/location`, data).then(r => r.data);
export const deleteAmbulance = (id: string) => apiClient.delete(`/ambulances/${id}`).then(r => r.data);

// ── Emergency Requests ─────────────────────────────────────────────────────
export const getEmergencies = (params?: { status?: string; priority?: string; search?: string }) =>
  apiClient.get('/emergencies', { params }).then(r => r.data);
export const getEmergency = (id: string) => apiClient.get(`/emergencies/${id}`).then(r => r.data);
export const createEmergency = (data: any) => apiClient.post('/emergencies', data).then(r => r.data);
export const acknowledgeEmergency = (id: string, coordinatorName?: string) =>
  apiClient.patch(`/emergencies/${id}/acknowledge`, { coordinatorName }).then(r => r.data);
export const assignEmergency = (id: string, data: { hospitalId: string; ambulanceId: string; coordinatorName?: string }) =>
  apiClient.post(`/emergencies/${id}/assign`, data).then(r => r.data);
export const getResourceMatch = (emergencyId: string) =>
  apiClient.get(`/emergencies/${emergencyId}/match`).then(r => r.data);

// ── Trips (Operator) ───────────────────────────────────────────────────────
export const getTripForAmbulance = (ambulanceId: string) =>
  apiClient.get(`/trips/ambulance/${ambulanceId}`).then(r => r.data);
export const getTripsForHospital = (hospitalId: string) =>
  apiClient.get(`/trips/hospital/${hospitalId}`).then(r => r.data);
export const getTripHistory = (ambulanceId: string) =>
  apiClient.get(`/trips/history/${ambulanceId}`).then(r => r.data);
export const acceptTrip = (tripId: string, data?: any) =>
  apiClient.patch(`/trips/${tripId}/accept`, data || {}).then(r => r.data);
export const startTrip = (tripId: string, data?: any) =>
  apiClient.patch(`/trips/${tripId}/start`, data || {}).then(r => r.data);
export const updateTripLocation = (tripId: string, data: { lat: number; lng: number; waypointIndex: number }) =>
  apiClient.patch(`/trips/${tripId}/location`, data).then(r => r.data);
export const completeTrip = (tripId: string, data?: any) =>
  apiClient.patch(`/trips/${tripId}/complete`, data || {}).then(r => r.data);

// ── Dashboard Stats ────────────────────────────────────────────────────────
export const getDashboardStats = () => apiClient.get('/stats').then(r => r.data);

// ── Activity Logs ──────────────────────────────────────────────────────────
export const getActivityLogs = (search?: string, module?: string) =>
  apiClient.get('/activity', { params: { search, module } }).then(r => r.data);
