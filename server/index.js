import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import authRoute from './routes/auth.js'
import contentRoute from './routes/content.js'
import contactRoute from './routes/contact.js'

const app = express()
dotenv.config()

const normalizeOrigin = (value) => value.replace(/\/+$/, '').toLowerCase()

const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://thebureaucratsinstitute.com',
  'https://www.thebureaucratsinstitute.com',
]

const envAllowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const allowedOrigins = new Set(
  [...defaultAllowedOrigins, ...envAllowedOrigins].map(normalizeOrigin)
)

const corsOptions = {
  origin(origin, callback) {
    // Allow server-to-server and tools like Postman/curl that send no Origin header.
    if (!origin) {
      return callback(null, true)
    }

    const normalizedOrigin = normalizeOrigin(origin)
    if (allowedOrigins.has(normalizedOrigin)) {
      return callback(null, true)
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`))
  },
  credentials: true,
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())

mongoose.set('strictQuery', true)
app.use('/api/auth', authRoute)
app.use('/api/content', contentRoute)
app.use('/api/contact', contactRoute)

const connect = () => {
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log('Connected to MongoDB')
    })
    .catch((err) => console.log(err))
}

app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'Something went wrong'
  return res.status(status).json({
    success: false,
    status,
    message,
  })
})
app.listen(8800, () => {
  connect()
  console.log('Server running at 8800')
})
