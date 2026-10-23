import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests/browser',
  outputDir: 'test-results/browser',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:5173', channel: 'msedge', trace: 'retain-on-failure' },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: false,
    env: {
      VITE_FIREBASE_API_KEY: '',
      VITE_FIREBASE_AUTH_DOMAIN: '',
      VITE_FIREBASE_PROJECT_ID: '',
      VITE_FIREBASE_APP_ID: '',
      VITE_USE_EMULATORS: 'false',
    },
  },
})
