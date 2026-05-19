import axios, { AxiosInstance, AxiosResponse } from 'axios'

const BASE_URL = 'http://10.252.56.105:8080'

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      const bearer = token.startsWith('Bearer ') ? token : `Bearer ${token}`
      config.headers.Authorization = bearer
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle 401
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── Auth ─────────────────────────────────────────────────
export const authApi = {
  login: (data: { username: string; password: string }) =>
    api.post('/auth/login', data),
  register: (data: unknown) => api.post('/auth/register', data),
  getMe: () => api.get('/user'),
}

// ─── Dashboard ────────────────────────────────────────────
export const dashboardApi = {
  getLandSummary: () => api.get('/api/v1/dashboard/land-summary'),
}

// ─── Farmers ──────────────────────────────────────────────
export const farmersApi = {
  getAll: (params?: Record<string, unknown>) => api.get('/api/v1/farmers', { params }),
  getAnalytics: (id: number) => api.get(`/api/v1/farmers/${id}/analytics`),
  upload: (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post('/api/v1/farmers/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  getHududSection: (params?: Record<string, unknown>) =>
    api.get('/api/v1/farmers/hudud-section', { params }),
}

// ─── Specializations ──────────────────────────────────────
export const specializationsApi = {
  getLookups: () => api.get('/api/v1/lookups/specializations'),
  getSummary: () => api.get('/api/v1/specializations/summary'),
}

// ─── Agro Technics ────────────────────────────────────────
export const agroTechnicsApi = {
  getAll: (params?: Record<string, unknown>) => api.get('/api/agro-technics', { params }),
  create: (data: unknown) => api.post('/api/agro-technics', data),
  update: (id: number, data: unknown) => api.put(`/api/agro-technics/${id}`, data),
  delete: (id: number) => api.delete(`/api/agro-technics/${id}`),
  importExcel: (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post('/api/agro-technics/excel/import', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

// ─── Cadastre Land Records ────────────────────────────────
export const cadastreApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get('/api/cadastre-land-records', { params }),
  create: (data: unknown) => api.post('/api/cadastre-land-records', data),
  update: (id: number, data: unknown) => api.put(`/api/cadastre-land-records/${id}`, data),
  delete: (id: number) => api.delete(`/api/cadastre-land-records/${id}`),
}

// ─── Greenhouse Records ───────────────────────────────────
export const greenhouseApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get('/api/greenhouse-records', { params }),
  create: (data: unknown) => api.post('/api/greenhouse-records', data),
  update: (id: number, data: unknown) => api.put(`/api/greenhouse-records/${id}`, data),
  delete: (id: number) => api.delete(`/api/greenhouse-records/${id}`),
}

// ─── Farm Representatives ─────────────────────────────────
export const representativesApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get('/api/farm-representatives', { params }),
}

// ─── Land Contours ────────────────────────────────────────
export const landContoursApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get('/api/land-contours', { params }),
}

// ─── Pump ──────────────────────────────────────────────────
export const pumpApi = {
  getStations: (params?: Record<string, unknown>) =>
    api.get('/api/pump/stations', { params }),
  getTechnicals: (params?: Record<string, unknown>) =>
    api.get('/api/pump/technicals', { params }),
  getFarmerAggregates: (params?: Record<string, unknown>) =>
    api.get('/api/pump/farmer-pump-aggregates', { params }),
  importExcel: (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post('/api/pump/excel/import', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

// ─── Users ────────────────────────────────────────────────
export const usersApi = {
  getAdminUsers: (params?: Record<string, unknown>) =>
    api.get('/user/all', { params }),
  getSuperAdminUsers: (params?: Record<string, unknown>) =>
    api.get('/super-admin/users', { params }),
}

export default api