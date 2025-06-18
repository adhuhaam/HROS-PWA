#!/usr/bin/env node

// Simple frontend development server for HRoS
import { spawn } from 'child_process';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const clientDir = resolve(__dirname, 'client');

console.log('Starting HRoS Frontend Development Server...');
console.log('Client directory:', clientDir);
console.log('API Target: https://api.rccmaldives.com/ess');

// Start Vite dev server
const child = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5000'], {
  cwd: clientDir,
  stdio: 'inherit',
  shell: process.platform === 'win32'
});

child.on('error', (err) => {
  console.error('Failed to start development server:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  console.log(`Development server exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\nShutting down...');
  child.kill('SIGTERM');
});