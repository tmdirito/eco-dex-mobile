'use client';

import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { app } from '../lib/firebase';
import { createFirestoreUser } from '../lib/firestore-service';
import styles from '../page.module.css';


export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isExpert, setIsExpert] = useState(false);
  
  // --- NEW: Terms and Conditions State ---
  const [agreedToTerms, setAgreedToTerms] = useState(false); 
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = getAuth(app);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    // --- NEW: Validation Check for T&C ---
    if (!agreedToTerms) {
      setError("You must agree to the Terms and Conditions to create an account.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password); 
      
      // 2. Create corresponding Firestore Document
      const user = userCredential.user;
      await createFirestoreUser(user, isExpert); 
      
      router.push('/dashboard'); 
    } catch (err) {
      let errorMessage = "Failed to create an account.";
      if (err.code === 'auth/weak-password') {
          errorMessage = "Password should be at least 6 characters long.";
      } else if (err.code === 'auth/email-already-in-use') {
          errorMessage = "This email is already in use. Try logging in.";
      } else if (err.message) {
          errorMessage = err.message; 
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
    
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title} style={{ color: 'var(--text-primary)' }}>Create an Account</h1>
        
        <form onSubmit={handleSignUp} className={styles.form}>
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
            
          {/* Expert Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', textAlign: 'left' }}>
            <input 
              type="checkbox" 
              id="expertCheck"
              checked={isExpert}
              onChange={(e) => setIsExpert(e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="expertCheck" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              Sign up as an Expert / Researcher
            </label>
          </div>

          {/* --- NEW: Terms & Conditions Scroll Box --- */}
          <div style={{ 
            backgroundColor: 'var(--card-bg)', 
            border: '1px solid var(--card-border)', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginTop: '0.5rem',
            marginBottom: '1rem', 
            maxHeight: '140px', 
            overflowY: 'auto', 
            fontSize: '0.85rem', 
            color: 'var(--text-secondary)', 
            textAlign: 'left',
            boxShadow: 'inset 0 2px 4px var(--shadow-color)'
          }}>
            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Terms and Conditions</p>
            <p style={{ marginBottom: '0.5rem' }}>By creating an account with EcoDex, you agree to the following terms:</p>
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

          {/* --- NEW: Terms & Conditions Checkbox --- */}
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

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
          
          {error && <p className={styles.error} style={{ color: 'var(--danger-text)' }}>{error}</p>}
        </form>
        
        <p className={styles.toggleText}>
          Already have an account? <Link href="/login" style={{ color: 'var(--accent-color)' }}>Log In</Link>
        </p>
      </main>
    </div>
    </>
  );
}