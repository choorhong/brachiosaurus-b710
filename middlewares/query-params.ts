import { RequestHandler } from 'express'
import { BaseController } from '../controllers/base'
import { ErrorMessage } from '../types/error'

export default class QueryParamsMiddlewareController extends BaseController {
  public verifyIdParam: RequestHandler = async (req, res, next) => {
    const { id } = req.params
    if (!id) return this.clientError(res, ErrorMessage.MISSING_PARAMS)
    next()
  }
}
