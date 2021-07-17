import express, { ErrorRequestHandler } from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import cors from './middlewares/cors'

import authRoutes from './routes/auth'

const handleError: ErrorRequestHandler = (err, req, res, next) => {
  res.status(500).json({ message: err.message, statusCode: err.statusCode })
}

// Initialize environmental variables
dotenv.config()
const { MONGO_URI, PORT } = process.env

// Initialize app
const app = express()

// Configure app
app.use(cors)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Configure REST API routes
app.use('/auth', authRoutes)

// Configure Express fallback error handler
app.use(handleError)
// app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
//     res.status(500).json({ message: error.message })
// })

// Set up database & server
mongoose.connect(MONGO_URI!, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log('Listening on Port', PORT)
    app.listen(PORT)
  })
  .catch(err => {
    console.log('Mongoose error: ', err.message)
  })
