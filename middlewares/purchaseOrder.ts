import { RequestHandler } from 'express'
import UserPurchaseOrder from '../db/models/userPurchaseOrder'
import { ErrorMessage } from '../types/error'
import { ROLES } from '../types/user'

export const checkUserPurchaseOrderPermission: RequestHandler = async (req, res, next) => {
  const { userRoleStatus } = res.locals
  if (!userRoleStatus) return res.status(403).json({ message: ErrorMessage.FORBIDDEN })
  const { id: userId, role } = userRoleStatus
  if (ROLES.SUPER_ADMIN === role) next()
  if (!userId) return res.status(403).json({ message: ErrorMessage.FORBIDDEN })

  let purchaseOrderUUId = req.params.id
  if (!purchaseOrderUUId) purchaseOrderUUId = req.body.id

  try {
    const response = await UserPurchaseOrder.findOne({
      where: {
        userId,
        purchaseOrderUUId
      }
    })
    if (!response) return res.status(403).json({ message: ErrorMessage.FORBIDDEN })
    next()
  } catch (error) {
    return res.status(500).json({ message: ErrorMessage.INTERNAL_SERVER_ERROR })
  }
}
