import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import { useAuthStore } from './store/authStore';
import Properties from './pages/Properties';
import Demographics from './pages/Demographics';
import Users from './pages/Users';
import Revenue from './pages/Revenue';
import RegionalData from './pages/RegionalData';
import OperationalEfficiency from './pages/Operations';
import DemandNotice from "./pages/DemandNotice";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  // Check if Gemini API key is set
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
      console.warn('Warning: Gemini API key is not set. Please set VITE_GEMINI_API_KEY in .env file.');
    }
  }, []);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="properties" element={<Properties />} />
          <Route path="demographics" element={<Demographics />} />
          <Route path="users" element={<Users />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="regional-data" element={<RegionalData />} />
          <Route path="demand-notice" element={<DemandNotice />} />
          <Route path="operational-efficiency" element={<OperationalEfficiency />} />
        </Route>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;