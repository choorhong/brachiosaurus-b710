import { Request, RequestHandler, Response } from 'express'
import moment from 'moment'
import { Op } from 'sequelize'
import Booking from '../db/models/booking'
import Contact from '../db/models/contact'
import Vessel from '../db/models/vessel'
import { ErrorMessage } from '../types/error'
import { weekEnd, weekStart } from '../utils/date'
import { filters, isEmpty } from '../utils/helpers'
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

  /**
   * Use like '/booking/?cutOff=2021-08-10T07:28:04.204Z&next=true' or '/booking/?cutOff=2021-08-10T07:28:04.204Z&previous=true'
   * if next is true it will get next week's date from cutOff, if previous is true it will get last week's date from cutOff
   * For example: cutOff = '2021-08-10T07:28:04.204Z' and next = true, it will query from 2021-08-16 to 2021-08-22
   * Default '/booking/' will query cutOff date within this week
   */
  public getAll: RequestHandler = async (req, res) => {
    const { cutOff, previous, next } = req.query
    let start = weekStart
    let end = weekEnd
    if (cutOff) {
      const cutOffDate = cutOff.toString()
      if (previous) {
        start = moment(cutOffDate).subtract(1, 'week').startOf('isoWeek')
        end = moment(cutOffDate).subtract(1, 'week').endOf('isoWeek')
      } else if (next) {
        start = moment(cutOffDate).add(1, 'week').startOf('isoWeek')
        end = moment(cutOffDate).add(1, 'week').endOf('isoWeek')
      }
    }
    try {
      const bookings = await Booking.findAll({
        include: [
          { model: Contact, as: 'forwarder' },
          {
            model: Vessel,
            where: {
              // cutOff: {
              //   [Op.between]: [start, end]
              // } as any
            }
          }
        ],
        order: [['vessel', 'cutOff', 'ASC']]
      })
      if (!bookings) return this.notFound(res)
      return this.ok(res, bookings)
    } catch (error) {
      return this.fail(res, error)
    }
  }

  public search: RequestHandler = async (req, res) => {
    const { bookingId } = req.query
    if (!bookingId) return this.fail(res, ErrorMessage.MISSING_DATA)
    const term = bookingId.toString()
    // some length check
    if (term.length < 3) return this.fail(res, ErrorMessage.SHORT_LENGTH)
    try {
      const booking = await Booking.sequelize?.query('SELECT * FROM bookings WHERE vector @@ to_tsquery(:query);', {
        replacements: { query: `${term.replace(' ', '+')}:*` },
        type: 'SELECT'
      })
      return this.ok(res, booking)
    } catch (error) {
      return this.fail(res, error)
    }
  }

  public find: RequestHandler = async (req, res, next) => {
    const { bookingId, forwarder, cutOffStartDate, cutOffEndDate, departureLocation, arrivalLocation } = req.query
    const queryObj = { bookingId, forwarder, cutOffStartDate, cutOffEndDate, departureLocation, arrivalLocation }
    if (!bookingId && !forwarder && !cutOffStartDate && !cutOffEndDate && !departureLocation && !arrivalLocation) {
      return this.getAll(req, res, next)
    }
    try {
      const bookings = await Booking.findAll({
        where: filters('booking', queryObj),
        // {
        //   ...(bookingId && { bookingId: { [Op.iLike]: `%${bookingId}%` } }),
        //   ...(departureLocation && { 'departure.location': { [Op.iLike]: `%${departureLocation}%` } }),
        //   ...(arrivalLocation && { 'arrival.location': { [Op.iLike]: `%${arrivalLocation}%` } })
        // },
        include: [
          {
            model: Contact,
            as: 'forwarder',
            where: filters('contact', queryObj),
            // {
            //   ...(forwarder && {
            //     name: {
            //       [Op.iLike]: `%${forwarder}%`
            //     }
            //   })
            // },
            required: true
          },
          {
            model: Vessel,
            where: filters('vessel', queryObj),
            // {
            //   ...((cutOffStartDate && cutOffStartDate) && {
            //     cutOff: {
            //       [Op.between]: [cutOffStartDate, cutOffEndDate]
            //     } as any
            //   })
            // },
            required: true
          }
        ],
        order: [['vessel', 'cutOff', 'ASC']]
      })
      if (!bookings) return this.notFound(res)
      return this.ok(res, bookings)
    } catch (error) {
      return this.fail(res, error)
    }
  }
}
