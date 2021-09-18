import { RequestHandler } from 'express'
import UserShipment from '../db/models/userShipment'
import { ErrorMessage } from '../types/error'
import { ROLES } from '../types/user'

export const checkUserShipmentPermission: RequestHandler = async (req, res, next) => {
  const { userRoleStatus } = res.locals
  if (!userRoleStatus) return res.status(403).json({ message: ErrorMessage.FORBIDDEN })
  const { id: userId, role } = userRoleStatus
  if (ROLES.SUPER_ADMIN === role) next()
  if (!userId) return res.status(403).json({ message: ErrorMessage.FORBIDDEN })

  let shipmentId = req.params.id
  if (!shipmentId) shipmentId = req.body.id

  try {
    const response = await UserShipment.findOne({
      where: {
        userId,
        shipmentId
      }
    })
    if (!response) return res.status(403).json({ message: ErrorMessage.FORBIDDEN })
    next()
  } catch (error) {
    return res.status(500).json({ message: ErrorMessage.INTERNAL_SERVER_ERROR })
  }
}
