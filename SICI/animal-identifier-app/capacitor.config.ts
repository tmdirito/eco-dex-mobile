import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ecodex.app',
  appName: 'Eco-Dex',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
