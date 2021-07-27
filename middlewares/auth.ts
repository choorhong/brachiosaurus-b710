import { RequestHandler } from 'express'
import { BaseController } from '../controllers/base'
import admin from '../firebase'
import { ErrorMessage } from '../types/error'

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
}
