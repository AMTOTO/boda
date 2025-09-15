import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { RegistrationPage } from './components/RegistrationPage';

import { CommunityDashboard } from './components/dashboards/CommunityDashboard';
import { RiderDashboard } from './components/dashboards/RiderDashboard';
import { CHVDashboard } from './components/dashboards/CHVDashboard';
import { HealthWorkerDashboard } from './components/dashboards/HealthWorkerDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';

import { ProtectedRoute } from './components/ProtectedRoute';
import { VoiceCommandProvider } from './contexts/VoiceCommandContext';
import { Chatbot } from './components/common/Chatbot';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { SHALoanRequestPage } from './pages/SHALoanRequestPage';
import { AdminIcon } from './components/common/AdminIcon';

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <CurrencyProvider>
          <AuthProvider>
            <DataProvider>
              <VoiceCommandProvider>
                <Router>
                  <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors duration-200">
                    <OfflineIndicator />
                    <AdminIcon />
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/register" element={<RegistrationPage />} />
                      <Route path="/sha-loan-request" element={<ProtectedRoute><SHALoanRequestPage /></ProtectedRoute>} />

                      {/* Admin Dashboard - No authentication required for demo */}
                      <Route
                        path="/admin/*"
                        element={
                          <ProtectedRoute role="admin">
                            <div className="admin-mode">
                              <AdminDashboard />
                            </div>
                          </ProtectedRoute>
                        }
                      />

                      {/* Protected routes for other dashboards */}
                      <Route
                        path="/community/*"
                        element={
                          <ProtectedRoute role="community">
                            <div className="community-mode">
                              <CommunityDashboard />
                            </div>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/rider/*"
                        element={
                          <ProtectedRoute role="rider">
                            <div className="youth-mode">
                              <RiderDashboard />
                            </div>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/chv/*"
                        element={
                          <ProtectedRoute role="chv">
                            <div className="chv-mode">
                              <CHVDashboard />
                            </div>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/health-worker/*"
                        element={
                          <ProtectedRoute role="health_worker">
                            <div className="admin-mode">
                              <HealthWorkerDashboard />
                            </div>
                          </ProtectedRoute>
                        }
                      />

                      {/* Catch all route - redirect to landing page */}
                      <Route path="*" element={<LandingPage />} />
                    </Routes>

                    {/* Global Chatbot */}
                    <Chatbot />
                  </div>
                </Router>
              </VoiceCommandProvider>
            </DataProvider>
          </AuthProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;