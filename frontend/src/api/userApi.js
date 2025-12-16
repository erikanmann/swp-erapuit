// frontend/src/api/userApi.js

import { tokenStorage } from './authApi';

const API_URL = 'http://localhost:8080/api';

export const userApi = {
  // Get current user's roles
  getCurrentUserRoles: async () => {
    try {
      const token = tokenStorage.getToken();
      const response = await fetch(`${API_URL}/auth/user-roles`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user roles:', error);
      throw error;
    }
  },

  // Get current user info
  getCurrentUser: async () => {
    try {
      const token = tokenStorage.getToken();
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }
};
