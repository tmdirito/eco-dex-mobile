import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ecodex.app',
  appName: 'Eco-Dex',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    GoogleAuth:{
      scopes: ['peofile', 'email'],
      serverClientId: '463909464724-2vr3t4hdblkaj2q07one7a65neqdb719.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    }
  }
};

export default config;
