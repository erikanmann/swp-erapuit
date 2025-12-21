// frontend/src/pages/UserManagementPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, tokenStorage } from '../api/authApi';
import { useUser } from '../context/UserContext';
import Navbar from '../components/Navbar';
import '../styles/usermanagement.css';

export default function UserManagementPage() {
  const navigate = useNavigate();
  const { userRoles } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const AVAILABLE_PAGES = [
    { id: 'home', name: 'Avaleht' },
    { id: 'register-delivery', name: 'Tarne registreerimine' },
    { id: 'warehouse', name: 'Lao ülevaade ja jälgimine' },
    { id: 'production-usage', name: 'Tootmise materjalikasutus' },
    { id: 'users', name: 'Kasutajate haldus' },
    { id: 'profile', name: 'Profiil' },
  ];

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    roles: ['ROLE_USER'],
    allowedPages: [],
  });
  const [editingUserRoles, setEditingUserRoles] = useState([]);


  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = tokenStorage.getToken();
      const userData = await authApi.getUsers(token);
      setUsers(userData);
      setError('');
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('unauthorized')) {
        setError('Session expired. Please log in again.');
        navigate('/login');
      } else {
        setError(`Failed to load users: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);


  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      roles: ['ROLE_USER'],
      allowedPages: [],
    });
    setEditingUserId(null);
  };

  const startCreateUser = () => {
    setFormData({
      username: '',
      password: '',
      roles: ['ROLE_USER'],
      allowedPages: ['home', 'profile'], // Always include home and profile pages
    });
    setEditingUserId(null);
    setShowCreateForm(true);
  };

  const startEditUser = (user) => {
    const allowedPages = user.allowedPages ? user.allowedPages.split(',').filter(p => p) : [];
    // Ensure home and profile pages are always included
    if (!allowedPages.includes('home')) {
      allowedPages.unshift('home');
    }
    if (!allowedPages.includes('profile')) {
      allowedPages.push('profile');
    }
    setFormData({
      username: user.username,
      password: '', // Don't pre-fill password
      roles: user.roles || ['ROLE_USER'],
      allowedPages: allowedPages,
    });
    setEditingUserRoles(user.roles || []);
    setEditingUserId(user.id);
    setShowCreateForm(false);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Validation: ROLE_USER cannot have "users" page access
      if (formData.roles.includes('ROLE_USER') && formData.allowedPages.includes('users')) {
        setError('Users with role "User" cannot have access to "Kasutajahaldus" page');
        setLoading(false);
        return;
      }

      const token = tokenStorage.getToken();
      const userData = { ...formData };
      userData.allowedPages = formData.allowedPages.join(',');
      if (!userData.password && editingUserId) {
        delete userData.password;
      }
      if (editingUserId) {
        await authApi.updateUser(editingUserId, userData, token);
        setSuccess('User updated successfully');
      } else {
        await authApi.createUser(userData, token);
        setSuccess('User created successfully');
      }
      resetForm();
      setShowCreateForm(false);
      await loadUsers();
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('unauthorized')) {
        setError('Session expired. Please log in again.');
        navigate('/login');
      } else {
        setError(`Failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageAccessChange = (pageId) => {
    // Prevent unchecking the home page and profile page
    if (pageId === 'home' || pageId === 'profile') {
      return;
    }
    
    setFormData((prev) => {
      const pages = prev.allowedPages.includes(pageId)
        ? prev.allowedPages.filter((p) => p !== pageId)
        : [...prev.allowedPages, pageId];
      return { ...prev, allowedPages: pages };
    });
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      roles: [role],
    }));
  };

  const handleDeleteUser = async (userId) => {
    setLoading(true);
    try {
      const token = tokenStorage.getToken();
      await authApi.deleteUser(userId, token);
      setSuccess('User deleted successfully');
      await loadUsers();
    } catch (err) {
      setError(`Failed to delete user: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="user-management-container">
      <div className="user-management-header">
        <h1>Kasutajahaldus</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="action-buttons">
        <button
          className="btn btn-primary"
          onClick={startCreateUser}
          disabled={editingUserId !== null}
        >
          Loo uus kasutaja
        </button>
        {editingUserId !== null && (
          <button
            className="btn btn-secondary"
            onClick={() => {
              resetForm();
              setShowCreateForm(false);
            }}
          >
            Cancel Edit
          </button>
        )}
      </div>

      {(showCreateForm || editingUserId !== null) && (
        <div className="create-user-form">
          <h2>{editingUserId ? 'Kasutaja muutmine' : 'Uue kasutaja loomine'}</h2>
          <form onSubmit={handleSubmitForm}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">Kasutajanimi *</label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  disabled={loading || (editingUserId !== null && userRoles.some(r => r.name === 'ROLE_ADMIN') && editingUserRoles.includes('ROLE_ADMIN'))}
                  title={editingUserId && userRoles.some(r => r.name === 'ROLE_ADMIN') && editingUserRoles.includes('ROLE_ADMIN') ? 'Admin users cannot change username of other admin users' : ''}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">
                  Parool {editingUserId ? '(leave blank to keep current)' : '*'}
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required={!editingUserId}
                  disabled={loading || (editingUserId && userRoles.some(r => r.name === 'ROLE_ADMIN') && editingUserRoles.includes('ROLE_ADMIN'))}
                  placeholder={editingUserId ? 'Leave blank to keep current password' : ''}
                  title={editingUserId && userRoles.some(r => r.name === 'ROLE_ADMIN') && editingUserRoles.includes('ROLE_ADMIN') ? 'Admin users cannot change password of other admin users' : ''}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Lehekülje ligipääs</label>
              <div className="checkbox-group">
                {AVAILABLE_PAGES.map((page) => (
                  <label key={page.id}>
                    <input
                      type="checkbox"
                      checked={formData.allowedPages.includes(page.id)}
                      onChange={() => handlePageAccessChange(page.id)}
                      disabled={loading || page.id === 'home' || page.id === 'profile'}
                    />
                    {page.id === 'home' ? 'Avaleht - sellele pääsevad ligi kõik kasutajad' : page.id === 'profile' ? 'Profiil - sellele pääsevad ligi kõik kasutajad' : page.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Roll</label>
              <div className="checkbox-group">
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="ROLE_ADMIN"
                    checked={formData.roles.includes('ROLE_ADMIN')}
                    onChange={() => handleRoleChange('ROLE_ADMIN')}
                    disabled={loading}
                  />
                  Admin (Täielik süsteemi ligipääs)
                </label>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="ROLE_USER"
                    checked={formData.roles.includes('ROLE_USER')}
                    onChange={() => handleRoleChange('ROLE_USER')}
                    disabled={loading}
                  />
                  User (tavakasutaja õigused)
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? 'Salvestan...' : editingUserId ? 'Uuenda kasutajat' : 'Loo kasutaja'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  resetForm();
                  setShowCreateForm(false);
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="users-table-container">
        <h2>Kasutajate nimekiri({users.length})</h2>
        {loading && !showCreateForm && editingUserId === null ? (
          <p>Laen kasutajaid...</p>
        ) : users.length === 0 ? (
          <p>Ei leidnud ühtegi kasutajat.</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Kasutajanimi</th>
                <th>Roll</th>
                <th>Lubatud lehed</th>
                <th>Tegevused</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.roles ? user.roles.join(', ') : 'No roles'}</td>
                  <td>{user.allowedPages || 'All'}</td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => startEditUser(user)}
                      disabled={user.roles && user.roles.includes('ROLE_DEVELOPER')}
                    >
                      Muuda
                    </button>
                    {!user.roles || !user.roles.includes('ROLE_DEVELOPER') ? (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          if (window.confirm(`Delete user ${user.username}?`)) {
                            handleDeleteUser(user.id);
                          }
                        }}
                      >
                        Kustuta
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* CLOSE user-management-container */}
      </div>
    </>
  );
}
