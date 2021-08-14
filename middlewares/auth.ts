import { RequestHandler } from 'express'
import { BaseController } from '../controllers/base'
import User from '../db/models/user'
import admin from '../firebase'
import { ErrorMessage } from '../types/error'
import { ROLES, STATUS } from '../types/user'

export default class AuthMiddlewareController extends BaseController {
  public verifyToken: RequestHandler = async (req, res, next) => {
    try {
      const accessToken = req.headers.authorization
      if (!accessToken) return this.unauthorized(res, ErrorMessage.MISSING_TOKEN)

      const firebaseUser = await admin.auth().verifyIdToken(accessToken)
      if (!firebaseUser) return this.unauthorized(res, ErrorMessage.USER_ACCOUNT_NOT_FOUND)

      res.locals.firebaseUser = {
        email: firebaseUser.email,
        name: firebaseUser.name,
        firebaseUserId: firebaseUser.user_id
      }

      next()
    } catch (err) {
      console.log('err', err)
      return this.unauthorized(res, ErrorMessage.INVALID_OR_EXPIRED_TOKEN)
    }
  }

  public getUserRoleStatus: RequestHandler = async (req, res, next) => {
    const { firebaseUser } = res.locals
    if (!firebaseUser) throw new Error()

    try {
      const user = await User.findOne({ where: { email: firebaseUser.email } })
      if (!user) return this.notFound(res)

      // account suspended >> subsequent data request will be rejected
      if (user.status === STATUS.SUSPENDED) {
        return this.unauthorized(res)
      }

      // account suspended >> subsequent data request will be rejected until account get approved > 'ACTIVE'
      if (user.status === STATUS.PENDING) {
        return this.unauthorized(res, 'PENDING_ACCOUNT_APPROVAL')
      }

      res.locals.userRoleStatus = {
        // status: user.status // assume user status is ONLY active (STATUS.ACTIVE) at this point
        role: user.role
      }
      next()
    } catch (error) {
      return this.fail(res, error)
    }
  }

  public verifySuperAdmin: RequestHandler = async (req, res, next) => {
    const { userRoleStatus } = res.locals
    if (!userRoleStatus) return this.unauthorized(res)
    if (ROLES.SUPER_ADMIN !== userRoleStatus.role) return this.unauthorized(res)
    next()
  }
}
