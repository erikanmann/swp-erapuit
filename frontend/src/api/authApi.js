// frontend/src/api/authApi.js

const API_BASE_URL = 'http://localhost:8080/api/auth';

export const authApi = {
  login: async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Login failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  createUser: async (userRequest, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userRequest),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Create user failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  },

  getUsers: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Fetch users failed (${response.status})`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  },

  deleteUser: async (userId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Delete user failed');
      }

      return await response.text();
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  },

  updateUser: async (userId, userRequest, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userRequest),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        const error = await response.text();
        throw new Error(error || 'Update user failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },
};

export const tokenStorage = {
  setToken: (token) => {
    localStorage.setItem('authToken', token);
  },

  getToken: () => {
    return localStorage.getItem('authToken');
  },

  clearToken: () => {
    localStorage.removeItem('authToken');
  },

  hasToken: () => {
    return !!localStorage.getItem('authToken');
  },
};
