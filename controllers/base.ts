import { Response } from 'express'
import { ErrorMessage } from '../types/error'

export abstract class BaseController {
  /*
    This class contains reusable methods to handle errors and responses,
    can only be extended by other classes.
  */

  public static jsonErrorResponse (res: Response, code: number, message: string) {
    return res.status(code).json({ message })
  }

  public static jsonSuccessResponse<T> (res: Response, code: number, dto?: T) {
    if (dto) {
      res.type('application/json')
      return res.status(code).json(dto)
    } else {
      return res.sendStatus(code)
    }
  }

  public ok<T> (res: Response, dto?: T) {
    return BaseController.jsonSuccessResponse(res, 200, dto)
  }

  public created<T> (res: Response, dto?: T) {
    return BaseController.jsonSuccessResponse(res, 201, dto)
  }

  public internalServerError (res: Response, message?: string) {
    return BaseController.jsonErrorResponse(res, 500, message || ErrorMessage.INTERNAL_SERVER_ERROR)
  }

  public clientError (res: Response, message?: string) {
    return BaseController.jsonErrorResponse(res, 400, message || ErrorMessage.INCORRECT_DETAILS)
  }

  public unauthorized (res: Response, message?: string) {
    return BaseController.jsonErrorResponse(res, 401, message || ErrorMessage.UNAUTHORIZED)
  }

  public paymentRequired (res: Response, message?: string) {
    return BaseController.jsonErrorResponse(res, 402, message || ErrorMessage.PAYMENT_REQUIRED)
  }

  public forbidden (res: Response, message?: string) {
    return BaseController.jsonErrorResponse(res, 403, message || ErrorMessage.FORBIDDEN)
  }

  public notFound (res: Response, message?: string) {
    return BaseController.jsonErrorResponse(res, 404, message || ErrorMessage.NOT_FOUND)
  }

  public conflict (res: Response, message?: string) {
    return BaseController.jsonErrorResponse(res, 409, message || ErrorMessage.CONFLICT)
  }

  public tooMany (res: Response, message?: string) {
    return BaseController.jsonErrorResponse(res, 429, message || ErrorMessage.TOO_MANY_REQUESTS)
  }

  public fail (res: Response, error: Error | string) {
    console.log(error)
    return res.status(500).json({
      message: error.toString()
    })
  }
}
