import 'express-session'

export interface SessionUser {
  id: string
  email: string
  username: string
  name: string
  role: 'user' | 'admin'
  avatar?: string
}

declare module 'express-session' {
  interface SessionData {
    user?: SessionUser
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: SessionUser
  }
}
