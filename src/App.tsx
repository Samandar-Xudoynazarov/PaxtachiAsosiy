import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './utils/AuthContext'
import DashboardLayout from './layouts/DashboardLayout'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import FarmersPage from './pages/farmers/FarmersPage'
import LandBalancePage from './pages/land/LandBalancePage'
import CadastrePage from './pages/cadastre/CadastrePage'
import AgroTechnicsPage from './pages/agro/AgroTechnicsPage'
import PumpStationsPage from './pages/pump/PumpStationsPage'
import GreenhousePage from './pages/greenhouse/GreenhousePage'
import RepresentativesPage from './pages/representatives/RepresentativesPage'
import LandContoursPage from './pages/contours/LandContoursPage'
import SpecializationsPage from './pages/specializations/SpecializationsPage'
import UsersPage from './pages/users/UsersPage'
import ExcelImportPage from './pages/excel/ExcelImportPage'
import SettingsPage from './pages/settings/SettingsPage'
import ReportsPage from './pages/reports/ReportsPage'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth()
  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="farmers" element={<FarmersPage />} />
        <Route path="land-balance" element={<LandBalancePage />} />
        <Route path="cadastre" element={<CadastrePage />} />
        <Route path="agro-technics" element={<AgroTechnicsPage />} />
        <Route path="pump-stations" element={<PumpStationsPage />} />
        <Route path="greenhouse" element={<GreenhousePage />} />
        <Route path="representatives" element={<RepresentativesPage />} />
        <Route path="land-contours" element={<LandContoursPage />} />
        <Route path="specializations" element={<SpecializationsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="excel-import" element={<ExcelImportPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

const App: React.FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
)

export default App
