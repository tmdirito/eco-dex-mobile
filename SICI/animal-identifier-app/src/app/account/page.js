'use client';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext'; // <-- Import Theme Context
import { useRouter } from 'next/navigation';


export default function AccountPage() {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme(); // <-- Get theme state and toggle function
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  if (!currentUser) return <div style={{ height: '100vh', backgroundColor: 'var(--bg-color)' }}></div>;

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', color: 'var(--text-primary)', transition: 'all 0.3s ease' }}>
      
      
      <main style={{ padding: '100px 1.5rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: 'var(--text-primary)' }}>Account</h1>
        
        {/* Profile Card */}
        <div style={{ 
          background: 'var(--card-bg)', 
          backdropFilter: 'blur(10px)',
          borderRadius: '16px', 
          padding: '1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          boxShadow: 'var(--shadow-color)',
          marginBottom: '2rem',
          border: `1px solid var(--card-border)`
        }}>
          <div style={{ 
            width: '60px', height: '60px', borderRadius: '50%', 
            backgroundColor: 'var(--accent-color)', color: 'var(--accent-text)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: 'bold'
          }}>
            {currentUser.email.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Signed in as</p>
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {currentUser.email}
            </p>
          </div>
        </div>

        {/* Settings List */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '0.5rem' }}>App Settings</h2>
          <div style={{ 
            background: 'var(--card-bg)', backdropFilter: 'blur(10px)',
            borderRadius: '16px', overflow: 'hidden', 
            border: `1px solid var(--card-border)`, boxShadow: 'var(--shadow-color)' 
          }}>
            
            {/* THEME TOGGLE BUTTON */}
            <div 
              onClick={toggleTheme}
              style={{ padding: '1.2rem 1.5rem', borderBottom: `1px solid var(--card-border)`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            >
              <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Dark Mode</span>
              
              {/* Custom Toggle Switch UI */}
              <div style={{
                width: '50px', height: '26px', borderRadius: '26px',
                backgroundColor: theme === 'dark' ? 'var(--accent-color)' : '#ccc',
                position: 'relative', transition: 'background-color 0.3s'
              }}>
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'white',
                  position: 'absolute', top: '2px', left: theme === 'dark' ? '26px' : '2px',
                  transition: 'left 0.3s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}></div>
              </div>
            </div>

            <div style={{ padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Version</span>
              <span style={{ color: 'var(--text-secondary)' }}>1.0.0</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          style={{ 
            width: '100%', padding: '1.2rem', borderRadius: '50px', 
            border: `1px solid var(--danger-border)`, background: 'var(--danger-bg)', 
            color: 'var(--danger-text)', fontSize: '1.1rem', fontWeight: 'bold',
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
          }}
        >
          Sign Out
        </button>
      </main>
    </div>
  );
}