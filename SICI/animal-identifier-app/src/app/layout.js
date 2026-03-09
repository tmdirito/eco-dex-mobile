// --- ADD THIS MISSING IMPORT ---
import { AuthProvider } from '../context/AuthContext'; 

import BottomNav from './components/BottomNav';
import './globals.css'; // (Keep whatever global CSS imports you already had here)

export const metadata = {
  title: 'EcoDex',
  description: 'Identify animals and plants with AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {/* Wrapper with bottom padding so content isn't hidden behind the bar */}
          <div style={{ paddingBottom: '80px' }}>
            {children}
          </div>
          
          {/* The new Bottom Navigation */}
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}