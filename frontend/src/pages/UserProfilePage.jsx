// frontend/src/pages/UserProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, tokenStorage } from '../api/authApi';
import Navbar from '../components/Navbar';
import '../styles/userprofile.css';

export default function UserProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const token = tokenStorage.getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch current user details from backend
      const response = await fetch('http://localhost:8080/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load user profile: ${response.status}`);
      }

      const userData = await response.json();
      setUser(userData);
      setError('');
    } catch (err) {
      console.error('Error in loadUserProfile:', err);
      setError('Failed to load profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const token = tokenStorage.getToken();
      const response = await fetch('http://localhost:8080/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to change password');
      }

      setSuccess('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <>
        <Navbar />
        <div className="profile-container">
          <p>Laen profiili...</p>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="profile-container">
          <p>Kasutaja andmed pole saadaval</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          <h1>Minu profiil</h1>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="profile-section">
            <h2>Konto info</h2>
            <div className="profile-info">
              <div className="info-row">
                <label>Kasutajanimi:</label>
                <span>{user.username}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Roll</h2>
            <div className="roles-container">
              {user.roles && user.roles.length > 0 ? (
                user.roles.map((role) => (
                  <span key={role} className={`role-badge role-${role.toLowerCase()}`}>
                    {role.replace('ROLE_', '')}
                  </span>
                ))
              ) : (
                <span>Rollid puuduvad</span>
              )}
            </div>
          </div>

          {user.allowedPages && user.allowedPages.length > 0 && (
            <div className="profile-section">
              <h2>Ligipääs lehekülgedele</h2>
              <div className="pages-container">
                {user.allowedPages.split(',').map((page) => (
                  <span key={page} className="page-badge">
                    {page.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="profile-section">
            <h2>Parool</h2>
            {!showPasswordForm ? (
              <button
                className="btn btn-primary"
                onClick={() => setShowPasswordForm(true)}
              >
                Vaheta parooli
              </button>
            ) : (
              <form onSubmit={handleChangePassword} className="password-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Praegune parool *</label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">Uus parool *</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    required
                    disabled={loading}
                    minLength="6"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Kinnita uus parool *</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    disabled={loading}
                    minLength="6"
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? 'Uuendan...' : 'Uuenda parool'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
