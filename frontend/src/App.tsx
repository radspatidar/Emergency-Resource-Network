import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
import AuthGuard from './components/AuthGuard';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import SettingsSecurity from './pages/SettingsSecurity';
import SettingsNotifications from './pages/SettingsNotifications';
import SettingsSystem from './pages/SettingsSystem';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import UsersPage from './pages/UsersPage';
import HospitalsPage from './pages/HospitalsPage';
import AmbulancesPage from './pages/AmbulancesPage';
import ActivityPage from './pages/ActivityPage';
import Resources from './pages/Resources';
import EmergencyStatus from './pages/EmergencyStatus';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import EmergencyRequestsPage from './pages/EmergencyRequestsPage';
import CreateEmergency from './pages/CreateEmergency';
import ResourceMatching from './pages/ResourceMatching';
import Assignments from './pages/Assignments';
import Monitoring from './pages/Monitoring';
import OperatorDashboard from './pages/OperatorDashboard';
import AssignedEmergency from './pages/AssignedEmergency';
import ActiveTrip from './pages/ActiveTrip';
import Location from './pages/Location';
import TripHistory from './pages/TripHistory';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Login is the landing page */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route path="/" element={<AuthGuard><Layout /></AuthGuard>}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="hospitals" element={<HospitalsPage />} />
              <Route path="ambulances" element={<AmbulancesPage />} />
              <Route path="resources" element={<Resources />} />
              <Route path="emergency-status" element={<EmergencyStatus />} />
              <Route path="emergency-requests" element={<EmergencyRequestsPage />} />
              <Route path="emergency-requests/new" element={<CreateEmergency />} />
              <Route path="resource-matching" element={<ResourceMatching />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="monitoring" element={<Monitoring />} />
              <Route path="activity" element={<ActivityPage />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="operator-dashboard" element={<OperatorDashboard />} />
              <Route path="assigned-emergency" element={<AssignedEmergency />} />
              <Route path="active-trip" element={<ActiveTrip />} />
              <Route path="location" element={<Location />} />
              <Route path="trip-history" element={<TripHistory />} />
              <Route path="settings">
                <Route index element={<Settings />} />
                <Route path="security" element={<SettingsSecurity />} />
                <Route path="notifications" element={<SettingsNotifications />} />
                <Route path="system" element={<SettingsSystem />} />
              </Route>
            </Route>

            {/* Catch-all → redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

