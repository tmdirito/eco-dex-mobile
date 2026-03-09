'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  const pathname = usePathname();

  // Don't show the bottom nav on the login, signup, or initial loading screens
  if (pathname === '/login' || pathname === '/signup' || pathname === '/') {
    return null;
  }

  return (
    <nav className={styles.bottomNav}>
      
      {/* 1. IDENTIFY (Larger Left Icon) */}
      <Link href="/dashboard" className={`${styles.navItem} ${styles.primaryAction} ${pathname === '/dashboard' ? styles.active : ''}`}>
        <div className={styles.iconWrapper}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
            <circle cx="12" cy="13" r="3"></circle>
          </svg>
        </div>
      </Link>

      {/* 2. HISTORY */}
      <Link href="/history" className={`${styles.navItem} ${pathname === '/history' ? styles.active : ''}`}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </Link>

      {/* 3. ABOUT */}
      <Link href="/about" className={`${styles.navItem} ${pathname === '/about' ? styles.active : ''}`}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </Link>

      {/* 4. ACCOUNT */}
      <Link href="/account" className={`${styles.navItem} ${pathname === '/account' ? styles.active : ''}`}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </Link>

    </nav>
  );
}