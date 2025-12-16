// frontend/src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { tokenStorage } from '../api/authApi';

export default function ProtectedRoute({ children }) {
  const { userRoles, allowedPages, isLoading } = useUser();
  const location = useLocation();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  // Check if user is logged in (has a token)
  if (!tokenStorage.hasToken()) {
    return <Navigate to="/login" replace />;
  }

  // Map page paths to database page names
  const pageNameMap = {
    '/home': 'home',
    '/register-delivery': 'register-delivery',
    '/warehouse-dashboard': 'warehouse',
    '/production-usage': 'production-usage',
    '/user-management': 'users',
    '/outbound-shipping': 'outbound-shipping',
    '/profile': 'profile',
    '/deliveries/:id': 'deliveries',
  };

  const pageName = pageNameMap[location.pathname];

  // If allowedPages is set from database, check against it
  if (allowedPages && allowedPages.length > 0) {
    // For dynamic routes like /deliveries/:id, check both exact and pattern match
    const isAllowed = allowedPages.includes(pageName) || 
                      (location.pathname.startsWith('/deliveries/') && allowedPages.includes('deliveries'));
    if (!isAllowed) {
      return <Navigate to="/login" replace />;
    }
  } else if (userRoles.length > 0) {
    // Fallback: if no allowedPages set, deny access (shouldn't happen with new system)
    return <Navigate to="/login" replace />;
  }

  return children;
}
