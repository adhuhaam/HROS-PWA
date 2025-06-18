#!/usr/bin/env node
process.env.NODE_ENV = 'development';

import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting HRoS Frontend Application...');
console.log('API requests will connect to: https://api.rccmaldives.com/ess');

// Change to client directory and run vite
process.chdir(resolve(__dirname, 'client'));

const viteCmd = 'npx vite --host 0.0.0.0 --port 5000';

const child = exec(viteCmd, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});

child.stdout.on('data', (data) => {
  process.stdout.write(data);
});

child.stderr.on('data', (data) => {
  process.stderr.write(data);
});

child.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
  process.exit(code);
});

process.on('SIGINT', () => {
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
});