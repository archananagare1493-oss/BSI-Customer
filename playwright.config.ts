import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

const testEnv = process.env.TEST_ENV?.trim().toLowerCase() || 'fait';
console.log(`Running tests against environment: ${testEnv}`);

function getBaseURL(envName: string) {
  switch (envName) {
    case 'abn':
      return process.env.BASE_URL_ABN || 'https://abn.example.com';
    case 'fait':
      return process.env.BASE_URL_FAIT || 'https://fait.example.com';
    default:
      return process.env.BASE_URL || 'https://example.com';
  }
}

const baseURL = process.env.BASE_URL || getBaseURL(testEnv);

export default defineConfig({
  //outputDir: '.playwright/artifacts',
  // testDir: './tests',
  testDir: './src/tests',
  //fullyParallel: true,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: '80%', //use all available CPU cores, but leave some free for other processes. Adjust as needed.
  //workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list']
    // ['json', { outputFile: 'test-results.json' }]
  ],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    //video: 'retain-on-failure',
    ignoreHTTPSErrors: true,

     // Set the locale to German (Germany)
    locale: 'de-DE',
    // Set timezone to Berlin (important for date-pickers)
    timezoneId: 'Europe/Berlin',
    // Optional: specifically disable the translate feature in Chromium
    launchOptions: {
      args: ['--disable-features=Translate'],
  },
},

  projects: [
    // {
    //   name: 'staging',
    //   use:{
    //     baseURL: process.env.BASE_URL,
    //   }

    // },
    // {
    //   name: 'abn',
    //   use:{
    //     baseURL: process.env.BASE_URL,
    //   }

    // },

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});