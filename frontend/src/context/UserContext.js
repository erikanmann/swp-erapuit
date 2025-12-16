// frontend/src/context/UserContext.js

import React, { createContext, useState, useCallback, useEffect } from 'react';
import { userApi } from '../api/userApi';
import { tokenStorage } from '../api/authApi';

export const UserContext = createContext();

const USER_STORAGE_KEY = 'userData';
const ROLES_STORAGE_KEY = 'userRoles';
const PAGES_STORAGE_KEY = 'allowedPages';

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [allowedPages, setAllowedPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserData = useCallback(async () => {
    try {
      const [userData, rolesData] = await Promise.all([
        userApi.getCurrentUser(),
        userApi.getCurrentUserRoles()
      ]);
      
      setUser(userData);
      setUserRoles(rolesData || []);
      // Parse allowed pages from userData
      const pages = userData?.allowedPages ? userData.allowedPages.split(',').map(p => p.trim()).filter(p => p) : [];
      setAllowedPages(pages);
      
      // Store in localStorage for persistence
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(rolesData || []));
      localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(pages));
    } catch (err) {
      const errorMsg = err.message || '';
      console.error('Error loading user data:', err);
      
      // Only log out on 401 Unauthorized errors
      if (errorMsg.includes('401')) {
        setUser(null);
        setUserRoles([]);
        setAllowedPages([]);
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(ROLES_STORAGE_KEY);
        localStorage.removeItem(PAGES_STORAGE_KEY);
      }
      // On other errors, silently keep existing session
    }
  }, []);

  // Load user and roles when component mounts
  useEffect(() => {
    // First, try to restore from localStorage (instant)
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    const storedRoles = localStorage.getItem(ROLES_STORAGE_KEY);
    const storedPages = localStorage.getItem(PAGES_STORAGE_KEY);
    
    if (storedUser && storedRoles) {
      try {
        setUser(JSON.parse(storedUser));
        setUserRoles(JSON.parse(storedRoles));
        setAllowedPages(JSON.parse(storedPages || '[]'));
        setIsLoading(false);
      } catch (e) {
        console.error('Error restoring user data from storage:', e);
      }
    }

    // Then, if token exists, fetch fresh data from server
    const token = tokenStorage.getToken();
    if (token) {
      loadUserData().finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [loadUserData]);

  const logout = useCallback(() => {
    setUser(null);
    setUserRoles([]);
    setAllowedPages([]);
    tokenStorage.clearToken();
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(ROLES_STORAGE_KEY);
    localStorage.removeItem(PAGES_STORAGE_KEY);
  }, []);

  const value = {
    user,
    userRoles,
    allowedPages,
    isLoading,
    loadUserData,
    logout,
    hasRole: (roleName) => userRoles.some(role => role.name === roleName)
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
