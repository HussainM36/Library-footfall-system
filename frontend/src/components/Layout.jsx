// frontend/src/components/Layout.jsx
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Scan, Users, BarChart3 } from 'lucide-react';

export const Layout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Live Scanning Desk', path: '/scan', icon: <Scan size={20} /> },
    { name: 'User Registry', path: '/users', icon: <Users size={20} /> },
    { name: 'Analytics Panels', path: '/analytics', icon: <BarChart3 size={20} /> },
  ];

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={layoutStyles.container}>
      {/* Persistent Left Navigation Sidebar */}
      <aside style={layoutStyles.sidebar}>
        <div>
          <div style={layoutStyles.brandArea}>
            <h2 style={layoutStyles.brandText}>LMS Admin</h2>
          </div>
          <nav>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <div 
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  style={{...layoutStyles.navLink, ...(isActive ? layoutStyles.navLinkActive : {})}}
                >
                  <span style={layoutStyles.navIcon}>{item.icon}</span>
                  {item.name}
                </div>
              );
            })}
          </nav>
        </div>
        
        {/* Sidebar Footer Logout Handler */}
        <div style={layoutStyles.logoutArea} onClick={handleLogoutClick}>
          <LogOut size={20} style={layoutStyles.navIcon} />
          <span>Exit Session</span>
        </div>
      </aside>

      {/* Main Structural Layout Panel Framework */}
      <div style={layoutStyles.mainContent}>
        {/* Top Floating Application Header Bar */}
        <header style={layoutStyles.header}>
          <div style={layoutStyles.headerTitle}>
            System Activity Monitor Ledger
          </div>
          <div style={layoutStyles.adminProfile}>
            <div style={layoutStyles.avatar}>
              {admin?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <span style={layoutStyles.profileName}>
              Active Admin: <strong>{admin?.username || 'Administrator'}</strong>
            </span>
          </div>
        </header>

        {/* Dynamic Nested View Port Window Injection Block */}
        <main style={layoutStyles.viewPort}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const layoutStyles = {
  container: { display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#f4f6f9' },
  sidebar: { width: '260px', backgroundColor: '#1e293b', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 10px', color: '#cbd5e1' },
  brandArea: { padding: '10px 15px', marginBottom: '30px', borderBottom: '1px solid #334155' },
  brandText: { color: '#ffffff', fontSize: '20px', fontWeight: '700' },
  navLink: { display: 'flex', alignItems: 'center', padding: '12px 15px', borderRadius: '6px', marginBottom: '6px', cursor: 'pointer', fontSize: '15px', fontWeight: '500', transition: 'all 0.2s', color: '#94a3b8' },
  navLinkActive: { backgroundColor: '#334155', color: '#ffffff', fontWeight: '600' },
  navIcon: { marginRight: '12px', display: 'flex', alignItems: 'center' },
  logoutArea: { display: 'flex', alignItems: 'center', padding: '12px 15px', borderRadius: '6px', cursor: 'pointer', color: '#f1f5f9', backgroundColor: '#rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', transition: 'background 0.2s' },
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header: { height: '70px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', minHeight: '70px' },
  headerTitle: { fontSize: '18px', fontWeight: '600', color: '#334155' },
  adminProfile: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#0052cc', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '15px' },
  profileName: { fontSize: '14px', color: '#64748b' },
  viewPort: { flex: 1, padding: '30px', overflowY: 'auto' }
};