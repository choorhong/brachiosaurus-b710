import { RequestHandler } from 'express'
import { Op } from 'sequelize'
import Booking from '../db/models/booking'
import Contact from '../db/models/contact'
import PurchaseOrder from '../db/models/purchase-orders'
import Shipment from '../db/models/shipment'
import User from '../db/models/user'
import UserShipment from '../db/models/userShipment'
import Vessel from '../db/models/vessel'
import { ErrorMessage } from '../types/error'
import { ShipmentStatus } from '../types/shipment'
import { ROLES } from '../types/user'
import { filters, isEmpty } from '../utils/helpers'
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
        remarks,
        container,
        vendorId,
        bookingId, // uuid
        purchaseOrderId // uuid
      })
      if (users.length) {
        if (!shipment || !shipment.id) throw new Error('shipment missing')
        const userLinks = users.map((userId: string) => ({ userId, shipmentId: shipment.id }))
        await UserShipment.bulkCreate(userLinks)
      }
      return this.created(res, shipment)
    } catch (createError) {
      return this.fail(res, createError)
    }
  }

  public read: RequestHandler = async (req, res) => {
    const { userRoleStatus } = res.locals
    if (!userRoleStatus) return this.forbidden(res)
    const { id: userId, role } = userRoleStatus
    if (ROLES.SUPER_ADMIN !== role && !userId) return this.forbidden(res)

    const { id } = req.params
    if (!id) return this.fail(res, ErrorMessage.MISSING_DATA)

    try {
      const shipment = await Shipment.findOne({
        include: [
          { model: PurchaseOrder },
          { model: Contact, as: 'vendor' },
          {
            model: Booking,
            include: [{
              model: Vessel
            }]
          },
          { model: User }
        ],
        where: {
          id,
          ...(ROLES.SUPER_ADMIN !== role && {
            users: {
              [Op.contains]: [userId]
            }
          })
        }
      })
      if (!shipment) return this.notFound(res)
      return this.ok(res, shipment)
    } catch (readError) {
      return this.fail(res, readError)
    }
  }

  public update: RequestHandler = async (req, res) => {
    const { userRoleStatus } = res.locals
    if (!userRoleStatus) return this.forbidden(res)
    const { id: userId, role } = userRoleStatus
    if (ROLES.SUPER_ADMIN !== role && !userId) return this.forbidden(res)

    const {
      id,
      purchaseOrderId,
      vendorId,
      bookingId,
      status,
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
        remarks,
        container
      }, {
        where: {
          id,
          ...(ROLES.SUPER_ADMIN !== role && {
            users: {
              [Op.contains]: [userId]
            }
          })
        }
      })
      return this.ok(res, updatedShipment)
    } catch (updateError) {
      return this.fail(res, updateError)
    }
  }

  public addUsers: RequestHandler = async (req, res) => {
    const { userRoleStatus } = res.locals
    if (!userRoleStatus) return this.forbidden(res)
    const { id: userId, role } = userRoleStatus
    if (ROLES.SUPER_ADMIN !== role && !userId) return this.forbidden(res)

    // id is shipment uuid
    const { users, id } = req.body
    if (!users || !users.length || !id) return this.clientError(res, ErrorMessage.MISSING_DATA)

    try {
      const response = await UserShipment.bulkCreate(users.map((userId: string) => ({ userId, shipmentId: id })))
      return this.ok(res, response)
    } catch (error) {
      return this.fail(res, error)
    }
  }

  public removeUsers: RequestHandler = async (req, res) => {
    const { userRoleStatus } = res.locals
    if (!userRoleStatus) return this.forbidden(res)
    const { id: userId, role } = userRoleStatus
    if (ROLES.SUPER_ADMIN !== role && !userId) return this.forbidden(res)

    // id is shipment uuid
    const { users, id }: { users: string[], id: string } = req.body
    if (!users || !users.length || !id) return this.clientError(res, ErrorMessage.MISSING_DATA)

    try {
      const response = await UserShipment.destroy({
        where: {
          userId: users,
          shipmentId: id
        }
      })
      return this.ok(res, response)
    } catch (error) {
      return this.fail(res, error)
    }
  }

  public remove: RequestHandler = async (req, res) => {
    const { userRoleStatus } = res.locals
    if (!userRoleStatus) return this.forbidden(res)
    const { id: userId, role } = userRoleStatus
    if (ROLES.SUPER_ADMIN !== role && !userId) return this.forbidden(res)

    const { id } = req.params
    if (!id) return this.fail(res, ErrorMessage.MISSING_DATA)

    try {
      await Shipment.destroy({
        where: {
          id,
          ...(ROLES.SUPER_ADMIN !== role && {
            users: {
              [Op.contains]: [userId]
            }
          })
        }
      })
      return this.ok(res)
    } catch (removeError) {
      return this.fail(res, removeError)
    }
  }

  public find: RequestHandler = async (req, res, next) => {
    const { userRoleStatus } = res.locals
    if (!userRoleStatus) return this.forbidden(res)
    const { id: userId, role } = userRoleStatus
    if (ROLES.SUPER_ADMIN !== role && !userId) return this.forbidden(res)

    const { purchaseOrderId, vendor, bookingId, status, page = 1 } = req.query
    const queryObj = { purchaseOrderId, vendor, bookingId, status }
    const pagination = { pg: +page, pgSize: 10 }

    try {
      const shipments = await Shipment.findAll({
        where: {
          ...filters('shipment', queryObj),
          ...(ROLES.SUPER_ADMIN !== role && {
            users: {
              [Op.contains]: [userId]
            }
          })
        },
        include: [
          {
            model: PurchaseOrder,
            where: filters('purchaseOrder', queryObj)
          },
          {
            model: Contact,
            as: 'vendor',
            where: filters('contact', queryObj),
            required: true
          },
          {
            model: Booking,
            where: filters('booking', queryObj),
            include: [{ model: Vessel }]
          },
          { model: User }
        ],
        order: [['booking', 'vessel', 'cutOff', 'ASC']],
        offset: (pagination.pg - 1) * pagination.pgSize,
        limit: pagination.pgSize
      })
      if (!shipments) return this.notFound(res)
      return this.ok(res, shipments)
    } catch (error) {
      return this.fail(res, error)
    }
  }
}
