'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function RootPage() {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for the auth state to initialize
    if (currentUser === undefined) return; 

    // Redirect based on auth status
    if (currentUser) {
      router.push('/dashboard'); // Go to identify screen
    } else {
      router.push('/login'); // Force login
    }
  }, [currentUser, router]);

  // A simple loading screen while the app checks Firebase Auth
  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#051a10', color: '#00ff88' }}>
      <h2>Loading EcoDex...</h2>
    </div>
  );
}