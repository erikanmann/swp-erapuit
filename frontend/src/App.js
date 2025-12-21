import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterDeliveryPage from './pages/RegisterDeliveryPage';
import LoginPage from './pages/LoginPage';
import UserManagementPage from './pages/UserManagementPage';
import UserProfilePage from './pages/UserProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import WarehouseDashboard from './pages/WarehouseDashboard';
import ProductionUsagePage from './pages/ProductionUsagePage';
import OutboundShippingPage from "./pages/OutboundShippingPage";
import DeliveryDetailPage from "./pages/DeliveryDetailPage";
// eslint-disable-next-line no-unused-vars
import { tokenStorage } from './api/authApi';
import { UserProvider } from './context/UserContext';

function AppContent() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Protected Routes */}
            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/register-delivery"
                element={
                    <ProtectedRoute>
                        <RegisterDeliveryPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/deliveries/:id"
                element={
                    <ProtectedRoute>
                        <DeliveryDetailPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/warehouse-dashboard"
                element={
                    <ProtectedRoute>
                        <WarehouseDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/production-usage"
                element={
                    <ProtectedRoute>
                        <ProductionUsagePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/outbound-shipping"
                element={
                    <ProtectedRoute>
                        <OutboundShippingPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/user-management"
                element={
                    <ProtectedRoute>
                        <UserManagementPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <UserProfilePage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <UserProvider>
                <div className="App">
                    <AppContent />
                </div>
            </UserProvider>
        </Router>
    );
}

export default App;
