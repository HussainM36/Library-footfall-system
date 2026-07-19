// frontend/src/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { DashboardHome } from '../pages/DashboardHome';
import { UserRegistry } from '../pages/UserRegistry';
import { BackupConsole } from '../pages/BackupConsole';
import { LayoutDashboard, Users, Database, LogOut } from 'lucide-react';

export const AdminLayout = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard'); // Starts at main welcome index

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome setActiveTab={setActiveTab} />;
      case 'users':
        return <UserRegistry />;
      case 'backups':
        return <BackupConsole />;
      default:
        return <DashboardHome setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui' }}>
      {/* Dynamic Left Sidebar matching your template mockup perfectly */}
      <aside style={{ width: '260px', backgroundColor: '#1e293b', color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 0' }}>
        <div>
          <div style={{ padding: '0 24px 24px 24px', borderBottom: '1px solid #334155' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '0.5px' }}>LMS Admin</h2>
          </div>
          
          <nav style={{ padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button 
              onClick={() => setActiveTab('dashboard')} 
              style={{ ...sidebarStyles.navBtn, ...(activeTab === 'dashboard' ? sidebarStyles.active : {}) }}
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>
            
            <button 
              onClick={() => setActiveTab('users')} 
              style={{ ...sidebarStyles.navBtn, ...(activeTab === 'users' ? sidebarStyles.active : {}) }}
            >
              <Users size={18} /> User Registry (CRUD)
            </button>

            <button 
              onClick={() => setActiveTab('backups')} 
              style={{ ...sidebarStyles.navBtn, ...(activeTab === 'backups' ? sidebarStyles.active : {}) }}
            >
              <Database size={18} /> Database Backups
            </button>
          </nav>
        </div>

        <div style={{ padding: '0 12px' }}>
          {/* onClick event added to handle dashboard state exit */}
          <button onClick={onLogout} style={sidebarStyles.exitBtn}>
            <LogOut size={18} /> Exit Session
          </button>
        </div>
      </aside>

      {/* Main Action Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Upper Top Navbar display bar banner line */}
        <header style={{ height: '64px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
          <span style={{ color: '#475569', fontSize: '14px', fontWeight: '500' }}>System Activity Monitor Ledger</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0052cc', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px' }}>L</div>
            <span style={{ fontSize: '14px', color: '#334155' }}>Active Admin: <strong>librarian1</strong></span>
          </div>
        </header>
        
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const sidebarStyles = {
  navBtn: { display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', backgroundColor: 'transparent', border: 'none', color: '#94a3b8', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' },
  active: { backgroundColor: '#334155', color: '#ffffff', fontWeight: '600' },
  exitBtn: { display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#f87171', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }
};