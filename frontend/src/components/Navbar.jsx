// frontend/src/components/Navbar.jsx

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { authApi, tokenStorage } from '../api/authApi';
import { useUser } from '../context/UserContext';
import '../styles/navbar.css';

const pageLinks = [
  { path: '/home', label: 'Avaleht' },
  { path: '/register-delivery', label: 'Tarne registreerimine' },
  { path: '/warehouse-dashboard', label: 'Lao ülevaade' },
  { path: '/production-usage', label: 'Tootmine' },
  { path: '/outbound-shipping', label: 'Väljaminev kaup' },
  { path: '/user-management', label: 'Kasutajahaldus' }
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRoles, allowedPages, logout } = useUser();
  const [username, setUsername] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // Get username from token if available
    const token = tokenStorage.getToken();
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUsername(decoded.sub);
      } catch (e) {
        setUsername('User');
      }
    }
  }, []);

  const handleLogout = () => {
    logout();
    // Use replace to clear navigation history
    navigate('/login', { replace: true });
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setShowMenu(false);
  };

  // Filter pages based on user access
  // If allowedPages from database is set, use it; otherwise fall back to role-based permissions
  const availablePages = pageLinks.filter(page => {
    // ROLE_USER cannot access user-management tab
    const hasRoleUser = userRoles.some(role => role.name === 'ROLE_USER');
    if (hasRoleUser && page.path === '/user-management') {
      return false;
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
    };
    
    const pageName = pageNameMap[page.path];
    
    // If allowedPages is set from database, check against it
    if (allowedPages && allowedPages.length > 0) {
      return allowedPages.includes(pageName);
    }
    
    // Otherwise allow access (database will override at route level)
    return true;
  });

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="navbar-home-btn" style={{cursor: 'default'}}>
            Erapuit
          </span>
        </div>

        <div className="navbar-links">
          {availablePages.map(page => (
            <button
              key={page.path}
              onClick={() => navigate(page.path)}
              className={`navbar-link${location.pathname === page.path ? ' active-tab' : ''}`}
            >
              {page.label}
            </button>
          ))}
        </div>

        <div className="navbar-menu">
          <div className="navbar-user">
            <span className="navbar-username">{username}</span>
            <div className="navbar-dropdown">
              <button
                className="navbar-toggle"
                onClick={() => setShowMenu(!showMenu)}
              >
                ▼
              </button>
              {showMenu && (
                <div className="dropdown-content">
                  <button onClick={handleProfileClick} className="dropdown-item">
                    Minu profiil
                  </button>
                  <hr />
                  <button onClick={handleLogout} className="dropdown-item logout">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
