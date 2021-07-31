import { RequestHandler } from 'express'
import Contact from '../db/models/contact'
import PurchaseOrder from '../db/models/purchase-orders'
import { ErrorMessage } from '../types/error'
import { isEmpty } from '../utils/helpers'
import { BaseController } from './base'

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
      const vessel = await PurchaseOrder.findByPk(id)
      if (!vessel) return this.notFound(res)
      return this.ok(res, vessel)
    } catch (readError) {
      return this.fail(res, readError)
    }
  }

  public update: RequestHandler = async (req, res) => {
    const { id, name, earliestReturningDate, cutOff, remarks } = req.body
    const bodyArr = [id, name, earliestReturningDate, cutOff]
    if (isEmpty(bodyArr)) return this.clientError(res, ErrorMessage.MISSING_DATA)

    try {
      const [numOfUpdatedVessels, updatedVessels] = await PurchaseOrder.update({
        remarks
      }, {
        where: { id },
        returning: true
      })
      return this.ok(res, updatedVessels)
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
      const vessels = await PurchaseOrder.findAll({
        include: [
          { model: Contact, as: 'vendor' }
        ]
      })
      if (!vessels) return this.notFound(res)
      return this.ok(res, vessels)
    } catch (error) {
      return this.fail(res, error)
    }
  }
}
