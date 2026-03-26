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

  // Show a blank dark screen while checking auth to prevent flashing
  if (!currentUser) return <div style={{ height: '100vh', backgroundColor: '#05150b' }}></div>;

  return (
    <div style={{ backgroundColor: '#05150b', minHeight: '100vh', color: '#fff' }}>
      
      
      {/* Padding top accounts for the fixed header */}
      <main style={{ padding: '100px 1.5rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Account</h1>
        
        {/* Profile Card */}
        <div style={{ 
          backgroundColor: '#0d2a17', 
          borderRadius: '16px', 
          padding: '1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          marginBottom: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          {/* Avatar Placeholder */}
          <div style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            backgroundColor: '#00ff88', 
            color: '#05150b',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            {currentUser.email.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#b3d4c0' }}>Signed in as</p>
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {currentUser.email}
            </p>
          </div>
        </div>

        {/* Mock Settings List (Gives it a real app feel) */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', color: '#b3d4c0', marginBottom: '1rem', paddingLeft: '0.5rem' }}>App Settings</h2>
          <div style={{ backgroundColor: '#0d2a17', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Theme</span>
              <span style={{ color: '#00ff88' }}>Dark</span>
            </div>
            <div style={{ padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Version</span>
              <span style={{ color: '#b3d4c0' }}>1.0.0</span>
            </div>
          </div>
        </div>

        {/* Destructive Logout Button */}
        <button 
          onClick={handleLogout} 
          style={{ 
            width: '100%', 
            padding: '1.2rem', 
            borderRadius: '16px', 
            border: 'none', 
            backgroundColor: 'rgba(255, 76, 76, 0.1)', 
            color: '#ff4c4c', 
            fontSize: '1.1rem', 
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Sign Out
        </button>
      </main>
    </div>
  );
}