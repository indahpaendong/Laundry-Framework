import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import API from './services/api'
import TrackingPage from './pages/TrackingPage'
import HasilTracking from './pages/HasilTracking'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import DataOrder from './pages/DataOrder'
import TambahOrder from './pages/TambahOrder'
import DetailOrder from './pages/DetailOrder'

function AppContent() {
  const navigate = useNavigate()

  useEffect(() => {
    API.setUnauthorizedHandler(() => {
      navigate('/login?expired=1')
    })
  }, [navigate])

  return (
    <Routes>
      <Route path="/" element={<TrackingPage />} />
      <Route path="/hasil-tracking" element={<HasilTracking />} />
      <Route path="/login" element={<Login />} />
      <Route path="/detail-order" element={<DetailOrder />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/data-order" element={<DataOrder />} />
      <Route path="/tambah-order" element={<TambahOrder />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
