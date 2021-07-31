import { Request, RequestHandler, Response } from 'express'
import Booking from '../db/models/booking'
import Contact from '../db/models/contact'
import Vessel from '../db/models/vessel'
import { ErrorMessage } from '../types/error'
import { isEmpty } from '../utils/helpers'
import { BaseController } from './base'

export default class BookingController extends BaseController {
  public create: RequestHandler = async (req: Request, res: Response) => {
    const {
      bookingId, forwarderId, departure, arrival, vesselId,
      users, // array or string?
      slots, remarks
    } = req.body
    const bodyArr = [bookingId, forwarderId, vesselId, slots]
    if (isEmpty(bodyArr)) return this.clientError(res, ErrorMessage.MISSING_DATA)

    try {
      const booking = await Booking.create({
        bookingId,
        forwarderId,
        departure,
        arrival,
        vesselId,
        users,
        slots,
        remarks
      })
      console.log('booking', booking)
      return this.created(res, booking)
    } catch (createError) {
      return this.fail(res, createError)
    }
  }

  public read: RequestHandler = async (req, res) => {
    const { id } = req.params

    try {
      const booking = await Booking.findByPk(id, { include: [{ model: Vessel }, { model: Contact, as: 'forwarder' }] })
      // const booking = await Booking.findByPk(id)
      return this.ok(res, booking)
    } catch (readError) {
      return this.fail(res, readError)
    }
  }

  public update: RequestHandler = async (req, res) => {
    const {
      id, bookingId, forwarderId, departure = {}, arrival = {}, vesselId,
      users, // array or string?
      slots, remarks
    } = req.body
    // departure.date = new Date()
    // departure.location = 'LOS ANGELES, CA'
    // arrival.date = new Date()
    // arrival.location = 'PENANG, MALAYSIA'
    const bodyArr = [id, bookingId, forwarderId, vesselId, slots]
    if (isEmpty(bodyArr)) return this.clientError(res, ErrorMessage.MISSING_DATA)

    try {
      const [numOfUpdatedBookings, updatedBookings] = await Booking.update({
        bookingId,
        forwarderId,
        departure,
        arrival,
        vesselId,
        users,
        slots,
        remarks
      }, { where: { id } })
      return this.ok(res, updatedBookings)
    } catch (updateError) {
      return this.fail(res, updateError)
    }
  }

  public remove: RequestHandler = async (req, res) => {
    const { id } = req.params

    try {
      await Booking.destroy({
        where: { id }
      })
      return this.ok(res)
    } catch (removeError) {
      return this.fail(res, removeError)
    }
  }

  public getAll: RequestHandler = async (req, res) => {
    try {
      const bookings = await Booking.findAll({ include: [{ model: Contact, as: 'forwarder' }, { model: Vessel }] })
      if (!bookings) return this.notFound(res)
      return this.ok(res, bookings)
    } catch (error) {
      return this.fail(res, error)
    }
  }
}
