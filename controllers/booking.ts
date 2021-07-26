import { Request, Response } from 'express'
import Booking from '../db/models/booking'
import { generateUUID } from '../helpers'

export const create = async (req: Request, res: Response) => {
  const {
    bookingId,
    forwarderId,
    departureETD,
    departureLocation,
    arrivalETA,
    arrivalLocation,
    vesselId,
    users, // array or string?
    slots,
    remarks
  } = req.body
  const bodyArr = [bookingId, forwarderId, vesselId, users]
  if (bodyArr.includes(undefined) || bodyArr.includes(null) || bodyArr.includes('')) return res.status(400).json({ err: 'Missing data' })
  const id = generateUUID()
  try {
    const booking = Booking.create({
      id,
      bookingId,
      forwarderId,
      departureETD,
      departureLocation,
      arrivalETA,
      arrivalLocation,
      vesselId,
      users,
      slots,
      remarks
    })
    return res.status(201).json(booking)
  } catch (createError) {
    return res.status(500).json({ err: createError.toString() })
  }
}

export const read = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    // include or not?
    // const booking = await Booking.findByPk(id, { include: [{ model: Vessel }, { model: Contact, as: 'forwarder' }] })
    const booking = await Booking.findByPk(id)
    return res.status(200).json(booking)
  } catch (error) {
    return res.status(500).json({ err: error.toString() })
  }
}

export const update = async (req: Request, res: Response) => {
  const {
    id,
    bookingId,
    forwarderId,
    departureETD,
    departureLocation,
    arrivalETA,
    arrivalLocation,
    vesselId,
    users, // array or string?
    slots,
    remarks
  } = req.body
  const bodyArr = [id, bookingId, forwarderId, vesselId, users]
  if (bodyArr.includes(undefined) || bodyArr.includes(null) || bodyArr.includes('')) return res.status(400).json({ err: 'Missing data' })
  try {
    const booking = await Booking.update({
      bookingId,
      forwarderId,
      departureETD,
      departureLocation,
      arrivalETA,
      arrivalLocation,
      vesselId,
      users,
      slots,
      remarks
    }, { where: { id } })
    return res.status(200).json(booking)
  } catch (error) {
    return res.status(500).json({ err: error.toString() })
  }
}

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    await Booking.destroy({
      where: { id }
    })
    return res.status(200).send('ok')
  } catch (error) {
    return res.status(500).json({ err: error.toString() })
  }
}
