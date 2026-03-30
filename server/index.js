import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import authRoute from './routes/auth.js'
import contentRoute from './routes/content.js'
import contactRoute from './routes/contact.js'

const app = express()
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true, // This allows cookies and credentials to be sent
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
