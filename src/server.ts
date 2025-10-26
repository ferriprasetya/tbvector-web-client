import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import { createServer } from 'http'
import path from 'path'
import { config } from './config/env'
import { connectDB } from './config/db'
import routes from './routes'
import { errorHandler } from './middlewares/errorHandler'
import { initializeSocket } from './listeners'
import expressLayouts from 'express-ejs-layouts'
import cookieParser from 'cookie-parser'
import methodOverride from 'method-override'
import session from 'express-session'
import flash from 'connect-flash'
import { localsMiddleware } from './middlewares/locals.middleware'

const app: Application = express()
const httpServer = createServer(app)

// Connect to Database
connectDB()

// Middlewares
app.use(cors())

// View Engine Setup
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(expressLayouts)
app.set('layout', 'layouts/main')

// Static Files
// Serve from root /public folder first (for assets like images, colormap, etc.)
app.use(express.static(path.join(__dirname, '../public')))
// Serve from src/public folder (for compiled CSS/JS if any)
app.use(express.static(path.join(__dirname, 'public')))
// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Body Parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(methodOverride('_method'))

// Session Configuration
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'lax',
    },
  }),
)

// Flash Messages
app.use(flash())

// Template Locals Middleware
app.use(localsMiddleware)

// Socket.IO
const io = initializeSocket(httpServer)
app.set('io', io)

// Routes
app.use('/', routes)

// Global Error Handler
app.use(errorHandler)

const PORT = config.port || 5001
const HOST = '0.0.0.0'

httpServer.listen(Number(PORT), HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`)
})
