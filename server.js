#!/usr/bin/env node
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('🚀 Starting HRoS Frontend Application')
console.log('📡 API Target: https://api.rccmaldives.com/ess')
console.log('🌐 Server will be available at http://localhost:5000')

// Start Vite development server
const viteProcess = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5000'], {
  cwd: resolve(__dirname, 'client'),
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
})

viteProcess.on('error', (error) => {
  console.error('❌ Failed to start development server:', error)
  process.exit(1)
})

viteProcess.on('close', (code) => {
  if (code !== 0) {
    console.log(`❌ Development server exited with code ${code}`)
  }
  process.exit(code)
})

// Handle shutdown gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development server...')
  viteProcess.kill('SIGINT')
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down development server...')
  viteProcess.kill('SIGTERM')
})