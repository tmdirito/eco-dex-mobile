import { AuthProvider } from '../context/AuthContext'; 
import { ThemeProvider } from '../context/ThemeContext'; // <-- NEW IMPORT
import BottomNav from './components/BottomNav';
import './globals.css'; 

export const metadata = {
  title: 'EcoDex',
  description: 'Identify animals and plants with AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider> {/* <-- ADDED */}
          <AuthProvider>
            <div style={{ paddingBottom: '80px' }}>
              {children}
            </div>
            <BottomNav />
          </AuthProvider>
        </ThemeProvider> {/* <-- ADDED */}
      </body>
    </html>
  );
}