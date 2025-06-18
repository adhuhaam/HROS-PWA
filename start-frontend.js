#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting HRoS Frontend Development Server...');
console.log('API requests will be proxied to: https://api.rccmaldives.com/ess');

const viteProcess = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5000'], {
  cwd: resolve(__dirname, 'client'),
  stdio: 'inherit',
  env: {
    ...process.env,
    VITE_API_BASE_URL: 'https://api.rccmaldives.com/ess'
  }
});

viteProcess.on('error', (error) => {
  console.error('Failed to start development server:', error);
  process.exit(1);
});

viteProcess.on('close', (code) => {
  console.log(`Development server exited with code ${code}`);
  process.exit(code);
});

process.on('SIGINT', () => {
  console.log('\nShutting down development server...');
  viteProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\nShutting down development server...');
  viteProcess.kill('SIGTERM');
});