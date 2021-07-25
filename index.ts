import express, { ErrorRequestHandler } from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import cors from './middlewares/cors'

import authRoutes from './routes/auth'
import contactRoutes from './routes/contact'

const handleError: ErrorRequestHandler = (err, req, res, next) => {
  res.status(500).json({ message: err.message, statusCode: err.statusCode })
}

// Initialize environmental variables
dotenv.config()
const { DATABASE_CONNECTION_STRING, DATABASE, PORT } = process.env

// Initialize app
const app = express()

// Configure app
app.use(cors)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Configure REST API routes
app.use('/auth', authRoutes)
app.use('/contact', contactRoutes)

// Configure Express fallback error handler
app.use(handleError)
// app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
//     res.status(500).json({ message: error.message })
// })

// Set up database & server
// if (!DATABASE_CONNECTION_STRING || !DATABASE) throw 'DB UNDEFINED'
// mongoose.connect(`${DATABASE_CONNECTION_STRING}/${DATABASE}`, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
//   .then(() => {
//     console.log(`Connected to db @ ${DATABASE_CONNECTION_STRING}/${DATABASE}, listening on Port ${PORT}`)
//     app.listen(PORT)
//   })
//   .catch(err => {
//     console.log('Mongoose error: ', err.message)
//   })
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
