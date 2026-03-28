'use client';

import { useState } from 'react';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect, 
  signInWithCredential
} from 'firebase/auth';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { app } from '../lib/firebase';
import { createFirestoreUser } from '../lib/firestore-service';
import styles from '../page.module.css';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // --- NEW: Terms and Conditions State ---
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  // --- 1. HANDLE EMAIL/PASSWORD LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreedToTerms) {
      setError("You must agree to the Terms and Conditions to log in.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await createFirestoreUser(userCredential.user);
      router.push('/dashboard'); 
    } catch (err) {
      console.error(err);
      let errorMessage = "Failed to log in. Please check your credentials.";
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          errorMessage = "Invalid email or password.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // --- 2. HANDLE GOOGLE LOGIN (OAuth) ---
  const handleGoogleLogin = async () => {
    setError('');
    
    if (!agreedToTerms) {
      setError("You must agree to the Terms and Conditions to sign in with Google.");
      return;
    }

    setLoading(true);
    try {
      if (Capacitor.isNativePlatform()) {
        // --- MOBILE ONLY: Native Android Google Account Picker ---
        GoogleAuth.initialize({
          clientId: 'PASTE_YOUR_WEB_CLIENT_ID_HERE', // <-- Don't forget your Client ID!
          scopes: ['profile', 'email'],
          grantOfflineAccess: true,
        });

        const googleUser = await GoogleAuth.signIn();
        const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
        const result = await signInWithCredential(auth, credential);
        
        await createFirestoreUser(result.user);
        router.push('/dashboard');

      } else {
        // --- WEB ONLY: Standard Firebase Redirect ---
        await signInWithRedirect(auth, provider);
      }
    } catch (err) {
      console.error("Google sign-in failed:", err);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title} style={{ color: 'var(--text-primary)' }}>Welcome Back</h1>
        
        {/* --- Terms & Conditions Scroll Box --- */}
        <div style={{ 
          backgroundColor: 'var(--card-bg)', 
          border: '1px solid var(--card-border)', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginTop: '1rem',
          marginBottom: '1rem', 
          maxHeight: '140px', 
          overflowY: 'auto', 
          fontSize: '0.85rem', 
          color: 'var(--text-secondary)', 
          textAlign: 'left',
          boxShadow: 'inset 0 2px 4px var(--shadow-color)'
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Terms and Conditions</p>
          <p style={{ marginBottom: '0.5rem' }}>By logging in or creating an account with EcoDex, you agree to the following terms:</p>
          <p style={{ marginBottom: '0.5rem', color: 'var(--danger-text)', fontWeight: '500' }}>
            1. Safety and Liability Waiver: EcoDex and its creators are NOT responsible for any injury, harm, property damage, or legal violations that occur while using this app. You are solely responsible for your own safety. Do not approach dangerous wildlife, trespass on private property, or put yourself in hazardous situations to acquire images.
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            2. Animal Welfare: Always maintain a safe and respectful distance from animals. Do not disturb nests, dens, or natural habitats.
          </p>
          <p>
            3. Data Usage: Your uploaded images may be processed by AI to identify species and improve our conservation database.
          </p>
        </div>

        {/* --- Terms & Conditions Checkbox --- */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '1.5rem', textAlign: 'left' }}>
          <input 
            type="checkbox" 
            id="termsCheck"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            disabled={loading}
            style={{ marginTop: '4px', transform: 'scale(1.2)' }}
          />
          <label htmlFor="termsCheck" style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.4', cursor: 'pointer' }}>
            I agree to the Terms and Conditions and acknowledge the wildlife safety guidelines.
          </label>
        </div>

        {/* --- Unified Google Button --- */}
        <button 
          type="button"
          onClick={handleGoogleLogin} 
          className={styles.button} 
          disabled={loading}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
        >
          {/* Clean White Google G Icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
          {loading ? 'Signing In...' : 'Continue with Google'}
        </button>

        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0', fontWeight: 'bold' }}>OR</p>

        {/* --- Standard Form --- */}
        <form onSubmit={handleLogin} className={styles.form}>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
            required 
            className={styles.input} 
            disabled={loading}
          />

          <div className={styles.passwordContainer}>
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
                required 
                className={styles.input} 
                disabled={loading}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className={styles.passwordToggle}
                disabled={loading}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Logging In...' : 'Log In with Email'}
          </button>
          
          {error && <p className={styles.error} style={{ color: 'var(--danger-text)' }}>{error}</p>}
        </form>

        <p className={styles.toggleText}>
          Don't have an account? <Link href="/signup" style={{ color: 'var(--accent-color)' }}>Sign Up</Link>
        </p>
      </main>
    </div>
    </>
  );
}