import { RequestHandler } from 'express'
import Contact from '../db/models/contact'
import PurchaseOrder from '../db/models/purchase-orders'
import { ErrorMessage } from '../types/error'
import { filters, isEmpty } from '../utils/helpers'
import { BaseController } from './base'
import { Op } from 'sequelize'
import { ROLES } from '../types/user'
import UserPurchaseOrder from '../db/models/userPurchaseOrder'
import User from '../db/models/user'

export default class PurchaseOrderController extends BaseController {
  public create: RequestHandler = async (req, res) => {
    const { purchaseOrderId, status, vendorId, remarks, users } = req.body
    const bodyArr = [purchaseOrderId, vendorId]
    if (isEmpty(bodyArr)) return this.clientError(res, ErrorMessage.MISSING_DATA)

    try {
      const purchaseOrder = await PurchaseOrder.create({
        purchaseOrderId,
        status,
        vendorId,
        remarks
      })
      if (users.length) {
        if (!purchaseOrder || !purchaseOrder.id) throw new Error('purchase order missing')
        const userLinks = users.map((userId: string) => ({ userId, purchaseOrderUUId: purchaseOrder.id }))
        await UserPurchaseOrder.bulkCreate(userLinks)
      }
      return this.created(res, purchaseOrder)
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
      const purchaseOrder = await PurchaseOrder.findOne({
        include: [
          { model: Contact, as: 'vendor' },
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
      if (!purchaseOrder) return this.notFound(res)
      return this.ok(res, purchaseOrder)
    } catch (readError) {
      return this.fail(res, readError)
    }
  }

  public update: RequestHandler = async (req, res) => {
    const { userRoleStatus } = res.locals
    if (!userRoleStatus) return this.forbidden(res)
    const { id: userId, role } = userRoleStatus
    if (ROLES.SUPER_ADMIN !== role && !userId) return this.forbidden(res)

    const { id, purchaseOrderId, status, vendorId, remarks } = req.body
    const bodyArr = [purchaseOrderId, vendorId]
    if (isEmpty(bodyArr)) return this.clientError(res, ErrorMessage.MISSING_DATA)

    try {
      const [numOfUpdatedPurchaseOrders, updatedPurchaseOrders] = await PurchaseOrder.update({
        purchaseOrderId,
        status,
        vendorId,
        remarks
      }, {
        where: {
          id,
          ...(ROLES.SUPER_ADMIN !== role && {
            users: {
              [Op.contains]: [userId]
            }
          })
        },
        returning: true
      })
      return this.ok(res, updatedPurchaseOrders)
    } catch (updateError) {
      return this.fail(res, updateError)
    }
  }

  public addUsers: RequestHandler = async (req, res) => {
    const { userRoleStatus } = res.locals
    if (!userRoleStatus) return this.forbidden(res)
    const { id: userId, role } = userRoleStatus
    if (ROLES.SUPER_ADMIN !== role && !userId) return this.forbidden(res)

    // id is purchaseOrder row id, not to be confused with purchaseOrderId
    const { users, id } = req.body
    if (!users || !users.length || !id) return this.clientError(res, ErrorMessage.MISSING_DATA)

    try {
      const response = await UserPurchaseOrder.bulkCreate(users.map((userId: string) => ({ userId, purchaseOrderUUId: id })))
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

    // id is purchaseOrder uuid, not to be confused with purchaseOrderId
    const { users, id }: { users: string[], id: string } = req.body
    if (!users || !users.length || !id) return this.clientError(res, ErrorMessage.MISSING_DATA)

    try {
      const response = await UserPurchaseOrder.destroy({
        where: {
          userId: users,
          purchaseOrderUUId: id
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
      await PurchaseOrder.destroy({
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

  public inputSearch: RequestHandler = async (req, res) => {
    const { userRoleStatus } = res.locals
    if (!userRoleStatus) return this.forbidden(res)
    const { id: userId, role } = userRoleStatus
    if (ROLES.SUPER_ADMIN !== role && !userId) return this.forbidden(res)
    const { query } = req.body

    try {
      const purchaseOrders = await PurchaseOrder.findAll({
        limit: 5,
        where: {
          purchaseOrderId: {
            [Op.iLike]: `%${query}%`
          },
          ...(ROLES.SUPER_ADMIN !== role && {
            users: {
              [Op.contains]: [userId]
            }
          })
        }
      })
      if (!purchaseOrders) return this.notFound(res)
      return this.ok(res, purchaseOrders)
    } catch (error) {
      return this.fail(res, error)
    }
  }

  /**
   * Search by indexed purchaseOrderId column, used for text search, better performance.
   */
  public search: RequestHandler = async (req, res) => {
    const { userRoleStatus } = res.locals
    if (!userRoleStatus) return this.forbidden(res)
    const { id: userId, role } = userRoleStatus
    if (ROLES.SUPER_ADMIN !== role && !userId) return this.forbidden(res)

    const { purchaseOrderId } = req.query
    if (!purchaseOrderId) return this.fail(res, ErrorMessage.MISSING_DATA)
    const term = purchaseOrderId.toString()
    // some length check
    if (term.length < 3) return this.fail(res, ErrorMessage.SHORT_LENGTH)
    let query = 'SELECT * FROM "purchaseOrders" WHERE vector @@ to_tsquery(:query)'
    if (ROLES.SUPER_ADMIN !== role) {
      query = 'SELECT * FROM "purchaseOrders" t1 JOIN "user_purchase_orders" t2 ON t1.id=t2."purchaseOrderUUId" WHERE vector @@ to_tsquery(:query) AND t2."userId"=:userId;'
    }
    try {
      const purchaseOrder = await PurchaseOrder.sequelize?.query(`${query};`, {
        replacements: {
          query: `${term.replace(' ', '+')}:*`,
          userId
        },
        type: 'SELECT'
      })
      return this.ok(res, purchaseOrder)
    } catch (error) {
      return this.fail(res, error)
    }
  }

  public find: RequestHandler = async (req, res, next) => {
    const { userRoleStatus } = res.locals
    if (!userRoleStatus) return this.forbidden(res)
    const { id: userId, role } = userRoleStatus
    if (ROLES.SUPER_ADMIN !== role && !userId) return this.forbidden(res)

    const { purchaseOrderId, vendor, status, page = 1 } = req.query
    const pagination = { pg: +page, pgSize: 10 }
    const queryObj = { purchaseOrderId, vendor, status }
    try {
      const purchaseOrders = await PurchaseOrder.findAll({
        where: {
          ...filters('purchaseOrder', queryObj),
          ...(ROLES.SUPER_ADMIN !== role && {
            users: {
              [Op.contains]: [userId]
            }
          })
        },
        include: [{
          model: Contact,
          as: 'vendor',
          where: filters('contact', queryObj),
          required: true
        }, {
          model: User
        }],
        offset: (pagination.pg - 1) * pagination.pgSize,
        limit: pagination.pgSize
      })
      if (!purchaseOrders) return this.notFound(res)
      return this.ok(res, purchaseOrders)
    } catch (error) {
      return this.fail(res, error)
    }
  }
}
