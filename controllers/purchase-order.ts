import { RequestHandler } from 'express'
import Contact from '../db/models/contact'
import PurchaseOrder from '../db/models/purchase-orders'
import { ErrorMessage } from '../types/error'
import { isEmpty } from '../utils/helpers'
import { BaseController } from './base'
import { Op } from 'sequelize'

export default class PurchaseOrderController extends BaseController {
  public create: RequestHandler = async (req, res) => {
    const { purchaseOrderId, users, status, vendorId, remarks } = req.body
    const bodyArr = [purchaseOrderId, vendorId]
    if (isEmpty(bodyArr)) return this.clientError(res, ErrorMessage.MISSING_DATA)

    try {
      const purchaseOrder = await PurchaseOrder.create({
        purchaseOrderId,
        users,
        status,
        vendorId,
        remarks
      })
      return this.created(res, purchaseOrder)
    } catch (createError) {
      return this.fail(res, createError)
    }
  }

  public read: RequestHandler = async (req, res) => {
    const { id } = req.params

    try {
      const purchaseOrder = await PurchaseOrder.findByPk(id,
        {
          include: [
            { model: Contact, as: 'vendor' }
          ]
        }
      )
      if (!purchaseOrder) return this.notFound(res)
      return this.ok(res, purchaseOrder)
    } catch (readError) {
      return this.fail(res, readError)
    }
  }

  public update: RequestHandler = async (req, res) => {
    const { id, name, earliestReturningDate, cutOff, remarks } = req.body
    const bodyArr = [id, name, earliestReturningDate, cutOff]
    if (isEmpty(bodyArr)) return this.clientError(res, ErrorMessage.MISSING_DATA)

    try {
      const [numOfUpdatedPurchaseOrders, updatedPurchaseOrders] = await PurchaseOrder.update({
        remarks
      }, {
        where: { id },
        returning: true
      })
      return this.ok(res, updatedPurchaseOrders)
    } catch (updateError) {
      return this.fail(res, updateError)
    }
  }

  public remove: RequestHandler = async (req, res) => {
    const { id } = req.params

    try {
      await PurchaseOrder.destroy({
        where: { id }
      })
      return this.ok(res)
    } catch (removeError) {
      return this.fail(res, removeError)
    }
  }

  public getAll: RequestHandler = async (req, res) => {
    try {
      const purchaseOrders = await PurchaseOrder.findAll({
        include: [
          { model: Contact, as: 'vendor' }
        ]
      })
      if (!purchaseOrders) return this.notFound(res)
      return this.ok(res, purchaseOrders)
    } catch (error) {
      return this.fail(res, error)
    }
  }

  public inputSearch: RequestHandler = async (req, res) => {
    const { query } = req.body

    try {
      const purchaseOrders = await PurchaseOrder.findAll({
        limit: 5,
        where: {
          purchaseOrderId: {
            [Op.iLike]: `%${query}%`
          }
        }
      })
      if (!purchaseOrders) return this.notFound(res)
      return this.ok(res, purchaseOrders)
    } catch (error) {
      return this.fail(res, error)
    }
  }

  public search: RequestHandler = async (req, res) => {
    const { purchaseOrderId } = req.query
    if (!purchaseOrderId) return this.fail(res, ErrorMessage.MISSING_DATA)
    const term = purchaseOrderId.toString()
    // some length check
    if (term.length < 3) return this.fail(res, ErrorMessage.SHORT_LENGTH)
    try {
      const purchaseOrder = await PurchaseOrder.sequelize?.query('SELECT * FROM "purchaseOrders" WHERE vector @@ to_tsquery(:query);', {
        replacements: { query: `${term.replace(' ', '+')}:*` },
        type: 'SELECT'
      })
      return this.ok(res, purchaseOrder)
    } catch (error) {
      return this.fail(res, error)
    }
  }
}
