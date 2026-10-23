import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests/integration',
  outputDir: 'test-results/integration',
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:5174', channel: 'msedge', trace: 'retain-on-failure' },
  webServer: {
    command: 'npm run dev:emulator -- --port 5174',
    url: 'http://127.0.0.1:5174',
    reuseExistingServer: false,
    env: {
      VITE_FIREBASE_API_KEY: 'demo-key-not-a-real-credential',
      VITE_FIREBASE_AUTH_DOMAIN: 'demo-profind.firebaseapp.com',
      VITE_FIREBASE_PROJECT_ID: 'demo-profind',
      VITE_FIREBASE_APP_ID: 'demo-profind-web',
      VITE_USE_EMULATORS: 'true',
    },
  },
})
