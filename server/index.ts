import { spawn } from 'child_process';
import path from 'path';

// Start the Vite development server for the client
const clientDir = path.join(process.cwd(), 'client');

console.log('Starting HRoS Frontend Application...');
console.log('Client directory:', clientDir);
console.log('API Target: https://api.rccmaldives.com/ess');

// Start Vite dev server with proxy configuration
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
  process.exit(code || 0);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down development server...');
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Shutting down development server...');
  child.kill('SIGTERM');
});