'use client';

// CHANGE 1: Import useEffect and getRedirectResult
import { useState, useEffect } from 'react'; 
import { 
  getAuth, 
  signInWithEmailAndPassword,
  GoogleAuthProvider, 
  signInWithRedirect, 
  getRedirectResult 
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { app } from '../lib/firebase';
import { createFirestoreUser } from '../lib/firestore-service';
import styles from '../page.module.css';
import loginStyles from './login.module.css';
import Header from '../components/Header';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  // --- CHANGE 2: Add a Listener for when Google redirects back ---
  useEffect(() => {
    const checkRedirect = async () => {
      try {
        // This checks: "Did we just come back from Google?"
        const result = await getRedirectResult(auth);
        
        if (result) {
          // If yes, we have the user!
          const user = result.user;
          await createFirestoreUser(user);
          router.push('/dashboard');
        }
      } catch (err) {
        console.error("Redirect login failed:", err);
        setError("Failed to sign in with Google. Please try again.");
      }
    };

    checkRedirect();
  }, [auth, router]);

  // --- HANDLE EMAIL/PASSWORD LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await createFirestoreUser(userCredential.user);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      let errorMessage = "Failed to log in. Please check your credentials.";
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
          errorMessage = "Invalid email or password.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // --- CHANGE 3: Switch to Redirect Method ---
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true); // Show loading while we redirect
    try {
      // This will take the user away from the page to Google's login screen
      await signInWithRedirect(auth, provider);
    } catch (err) {
      console.error("Google sign-in trigger failed:", err);
      setError("Failed to start Google sign in.");
      setLoading(false);
    }
  };

  return (
    <>
    <Header />
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome Back</h1>
        
        {/* Google Sign-In Button */}
        <button 
          onClick={handleGoogleLogin} 
          className={loginStyles.googleBtn} 
          disabled={loading}
        >
          {loading ? 'Connecting to Google...' : 'Sign In with Google'}
        </button>

        {/* Divider */}
        <p className={loginStyles.divider}>OR</p>

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
            {loading ? 'Logging In...' : 'Log In'}
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
        <p className={styles.toggleText}>Don't have an account? <Link href="/signup">Sign Up</Link></p>
      </main>
    </div>
    </>
  );
}