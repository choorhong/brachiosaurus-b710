import { RequestHandler } from 'express'
import moment from 'moment'
import { Op } from 'sequelize'
import Booking from '../db/models/booking'
import Contact from '../db/models/contact'
import PurchaseOrder from '../db/models/purchase-orders'
import Shipment from '../db/models/shipment'
import Vessel from '../db/models/vessel'
import { ErrorMessage } from '../types/error'
import { ShipmentStatus } from '../types/shipment'
import { weekStart, weekEnd } from '../utils/date'
import { isEmpty } from '../utils/helpers'
import { BaseController } from './base'

export default class ShipmentController extends BaseController {
  public create: RequestHandler = async (req, res) => {
    const {
      purchaseOrderId,
      vendorId,
      bookingId,
      status,
      users,
      remarks,
      container
    } = req.body
    try {
      const shipment = await Shipment.create({
        status: status || ShipmentStatus.CREATED,
        users,
        remarks,
        container,
        vendorId,
        bookingId,
        purchaseOrderId
      })
      return this.created(res, shipment)
    } catch (createError) {
      return this.fail(res, createError)
    }
  }

  public read: RequestHandler = async (req, res) => {
    const { id } = req.params
    if (!id) return this.fail(res, ErrorMessage.MISSING_DATA)

    try {
      const shipment = await Shipment.findByPk(id, {
        include: [
          { model: PurchaseOrder },
          { model: Contact, as: 'vendor' },
          {
            model: Booking,
            include: [{
              model: Vessel
            }]
          }]
      })
      if (!shipment) return this.notFound(res)
      return this.ok(res, shipment)
    } catch (readError) {
      return this.fail(res, readError)
    }
  }

  public update: RequestHandler = async (req, res) => {
    const {
      id,
      purchaseOrderId,
      vendorId,
      bookingId,
      status,
      users,
      remarks,
      container
    } = req.body
    const bodyArr = [id, status]
    if (isEmpty(bodyArr)) return this.clientError(res, ErrorMessage.MISSING_DATA)

    try {
      const [numOfUpdatedShipment, updatedShipment] = await Shipment.update({
        purchaseOrderId,
        vendorId,
        bookingId,
        status,
        users,
        remarks,
        container
      }, {
        where: {
          id
        }
      })
      return this.ok(res, updatedShipment)
    } catch (updateError) {
      return this.fail(res, updateError)
    }
  }

  public remove: RequestHandler = async (req, res) => {
    const { id } = req.params
    if (!id) return this.fail(res, ErrorMessage.MISSING_DATA)
    try {
      await Shipment.destroy({
        where: { id }
      })
      return this.ok(res)
    } catch (removeError) {
      return this.fail(res, removeError)
    }
  }

  /**
   * Use like '/shipment/?cutOff=2021-08-10T07:28:04.204Z&next=true' or '/shipment/?cutOff=2021-08-10T07:28:04.204Z&previous=true'
   * if next is true it will get next week's date from cutOff, if previous is true it will get last week's date from cutOff
   * For example: cutOff = '2021-08-10T07:28:04.204Z' and next = true, it will query from 2021-08-16 to 2021-08-22
   * Default '/shipment/' will query cutOff date within this week
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
      const shipments = await Shipment.findAll({
        include: [
          { model: PurchaseOrder },
          { model: Contact, as: 'vendor' },
          {
            model: Booking,
            include: [{
              model: Vessel,
              where: {
                cutOff: {
                  [Op.between]: [start, end]
                } as any
              },
              required: true
            }],
            required: true
          }
        ],
        order: [['booking', 'vessel', 'cutOff', 'ASC']]
      })
      if (!shipments) return this.notFound(res)
      return this.ok(res, shipments)
    } catch (error) {
      return this.fail(res, error)
    }
  }
}
