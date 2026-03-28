'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';


export default function AccountPage() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  if (!currentUser) return <div style={{ height: '100vh', backgroundColor: '#f0ead2' }}></div>;

  return (
    <div style={{ backgroundColor: '#f0ead2', minHeight: '100vh', color: '#333' }}>
      
      
      <main style={{ padding: '100px 1.5rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#36452a' }}>Account</h1>
        
        {/* Profile Card - Now clean white with soft shadow */}
        <div style={{ 
          background: 'rgba(253, 253, 253, 0.95)', /* MATCHES WEB APP */
          backdropFilter: 'blur(10px)',
          borderRadius: '16px', 
          padding: '1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          boxShadow: '0 6px 18px rgba(0,0,0,0.04)',
          marginBottom: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.6)' /* Soft highlight border */
        }}>
          {/* ... Avatar code stays exactly the same ... */}
        </div>

        {/* Settings List - Layered Off-White */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', color: '#555', marginBottom: '1rem', paddingLeft: '0.5rem' }}>App Settings</h2>
          <div style={{ 
            background: 'rgba(253, 253, 253, 0.95)', /* MATCHES WEB APP */
            backdropFilter: 'blur(10px)',
            borderRadius: '16px', 
            overflow: 'hidden', 
            border: '1px solid rgba(255, 255, 255, 0.6)', 
            boxShadow: '0 6px 18px rgba(0,0,0,0.04)' 
          }}>
            {currentUser.email.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Signed in as</p>
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#36452a', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {currentUser.email}
            </p>
          </div>
        </div>

        {/* Settings List */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', color: '#555', marginBottom: '1rem', paddingLeft: '0.5rem' }}>App Settings</h2>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #eaeaea', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#333', fontWeight: '500' }}>Theme</span>
              <span style={{ color: '#6c8954', fontWeight: '600' }}>Light</span>
            </div>
            <div style={{ padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#333', fontWeight: '500' }}>Version</span>
              <span style={{ color: '#888' }}>1.0.0</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          style={{ 
            width: '100%', 
            padding: '1.2rem', 
            borderRadius: '50px', 
            border: '1px solid rgba(239, 68, 68, 0.3)', 
            backgroundColor: 'rgba(239, 68, 68, 0.05)', 
            color: '#ef4444', 
            fontSize: '1.1rem', 
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Sign Out
        </button>
      </main>
    </div>
  );
}