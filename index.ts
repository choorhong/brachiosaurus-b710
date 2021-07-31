import express, { ErrorRequestHandler } from 'express'
import dotenv from 'dotenv'

import cors from 'cors'

import authRoutes from './routes/auth'
import contactRoutes from './routes/contact'
import vesselRoutes from './routes/vessel'
import bookingRoutes from './routes/booking'
import purchaseOrderRoutes from './routes/purchase-order'
// import purchaseOrderRoutes from './routes/shipment'
import { sequelize } from './db/models'

const handleError: ErrorRequestHandler = (err, req, res, next) => {
  res.status(500).json({ message: err.message, statusCode: err.statusCode })
}

// Initialize environmental variables
dotenv.config()
const { PORT } = process.env

// Initialize app
const app = express()

// Configure app
app.use(cors({
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Configure REST API routes
app.use('/auth', authRoutes)
app.use('/contact', contactRoutes)
app.use('/vessel', vesselRoutes)
app.use('/booking', bookingRoutes)
app.use('/purchase-order', purchaseOrderRoutes)
// app.use('/shipment', shipmentRoutes)

// Configure Express fallback error handler
app.use(handleError)

// Set up database & server
sequelize.authenticate().then(
  () => {
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`)
    })
  })
  .catch(err => {
    console.log('Connection error: ', err.message)
  })
