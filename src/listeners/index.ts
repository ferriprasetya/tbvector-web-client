import { Server as HttpServer } from 'http'
import { Server, Socket } from 'socket.io'

let io: Server

/**
 * Initializes the Socket.IO server and attaches it to the provided HTTP server.
 * It also sets up basic connection and disconnection event listeners.
 * @param httpServer The HTTP server instance from Express.
 * @returns The configured Socket.IO server instance.
 */
export const initializeSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: '*', // For development, allow all. In production, restrict to your frontend's URL.
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket: Socket) => {
    console.log(`New client connected: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`)
    })
  })

  return io
}

/**
 * Exports a function to get the initialized Socket.IO instance.
 * This allows other parts of the application (like services) to emit events.
 * @returns The singleton Socket.IO server instance.
 */
export const getIoInstance = (): Server => {
  if (!io) {
    throw new Error(
      'Socket.IO has not been initialized. Please call initializeSocket first.',
    )
  }
  return io
}
