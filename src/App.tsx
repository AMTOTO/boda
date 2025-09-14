import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { VoiceCommandProvider } from './contexts/VoiceCommandContext';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { RegistrationPage } from './components/RegistrationPage';

import { CommunityDashboard } from './components/dashboards/CommunityDashboard';
import { RiderDashboard } from './components/dashboards/RiderDashboard';
import { CHVDashboard } from './components/dashboards/CHVDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { HealthWorkerDashboard } from './components/dashboards/HealthWorkerDashboard';
import { MSUPUDashboard } from './components/msupu/MSUPUDashboard';

import { ProtectedRoute } from './components/ProtectedRoute';
import { Chatbot } from './components/common/Chatbot';
import { ToastContainer } from './components/common/Toast';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <AuthProvider>
            <DataProvider>
              <NotificationProvider>
                <VoiceCommandProvider>
                  <Router>
                    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-purple-900 transition-colors duration-500">
                      <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/register" element={<RegistrationPage />} />
                        
                        {/* Dashboard routes - No authentication required for demo */}
                        <Route path="/admin/*" element={<AdminDashboard />} />
                        <Route path="/msupu/*" element={<MSUPUDashboard />} />
                        
                        {/* Protected routes for other dashboards */}
                        <Route 
                          path="/community/*" 
                          element={
                            <ProtectedRoute role="community">
                              <CommunityDashboard />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/rider/*" 
                          element={
                            <ProtectedRoute role="rider">
                              <RiderDashboard />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/chv/*" 
                          element={
                            <ProtectedRoute role="chv">
                              <CHVDashboard />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/health-worker/*" 
                          element={
                            <ProtectedRoute role="health_worker">
                              <HealthWorkerDashboard />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* Catch all route - redirect to landing page */}
                        <Route path="*" element={<LandingPage />} />
                      </Routes>
                      
                      {/* Global Chatbot */}
                      <Chatbot />
                      
                      {/* Global Toast Container */}
                      <ToastContainer />
                    </div>
                  </Router>
                </VoiceCommandProvider>
              </NotificationProvider>
            </DataProvider>
          </AuthProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;