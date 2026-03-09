'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
// Re-using your standard page styles
import styles from '../page.module.css'; 
// import Header from '../components/Header';

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

  if (!currentUser) return <p>Loading...</p>;

  return (
    <>
      
      <div className={styles.page}>
        <main className={styles.main} style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h1 className={styles.title}>Account Settings</h1>
          
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '12px', marginTop: '2rem' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#fff' }}>
              Logged in as:
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00ff88', marginBottom: '3rem' }}>
              {currentUser.email}
            </p>

            <button 
              onClick={handleLogout} 
              className={styles.button} 
              style={{ background: '#ff4c4c', color: '#fff', border: 'none' }}
            >
              Sign Out
            </button>
          </div>
        </main>
      </div>
    </>
  );
}