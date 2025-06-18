import { createServer } from 'vite'

async function startServer() {
  const server = await createServer({
    root: './client',
    server: {
      host: '0.0.0.0',
      port: 5000
    }
  })
  
  await server.listen()
  console.log('Development server running at http://localhost:5000')
}

startServer().catch(console.error)