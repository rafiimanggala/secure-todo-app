import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const canAccessUsers = user?.role === 'admin';

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">🏥 Patient Data System</div>
        <div className="navbar-menu">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/patients" className="nav-link">Patients</Link>
          {canAccessUsers && <Link to="/users" className="nav-link">Users</Link>}
        </div>
        <div className="navbar-user">
          <span className="user-info">{user?.username} ({user?.role})</span>
          <button onClick={handleLogout} className="btn btn-primary">Logout</button>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

