"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const error_1 = require("../types/error");
class BaseController {
    /*
      This class contains reusable methods to handle errors and responses,
      can only be extended by other classes.
    */
    static jsonErrorResponse(res, code, message) {
        return res.status(code).json({ message });
    }
    static jsonSuccessResponse(res, code, dto) {
        if (dto) {
            res.type('application/json');
            return res.status(code).json(dto);
        }
        else {
            return res.sendStatus(code);
        }
    }
    ok(res, dto) {
        return BaseController.jsonSuccessResponse(res, 200, dto);
    }
    created(res, dto) {
        return BaseController.jsonSuccessResponse(res, 201, dto);
    }
    internalServerError(res, message) {
        return BaseController.jsonErrorResponse(res, 500, message || error_1.ErrorMessage.INTERNAL_SERVER_ERROR);
    }
    clientError(res, message) {
        return BaseController.jsonErrorResponse(res, 400, message || error_1.ErrorMessage.INCORRECT_DETAILS);
    }
    unauthorized(res, message) {
        return BaseController.jsonErrorResponse(res, 401, message || error_1.ErrorMessage.UNAUTHORIZED);
    }
    paymentRequired(res, message) {
        return BaseController.jsonErrorResponse(res, 402, message || error_1.ErrorMessage.PAYMENT_REQUIRED);
    }
    forbidden(res, message) {
        return BaseController.jsonErrorResponse(res, 403, message || error_1.ErrorMessage.FORBIDDEN);
    }
    notFound(res, message) {
        return BaseController.jsonErrorResponse(res, 404, message || error_1.ErrorMessage.NOT_FOUND);
    }
    conflict(res, message) {
        return BaseController.jsonErrorResponse(res, 409, message || error_1.ErrorMessage.CONFLICT);
    }
    tooMany(res, message) {
        return BaseController.jsonErrorResponse(res, 429, message || error_1.ErrorMessage.TOO_MANY_REQUESTS);
    }
    fail(res, error) {
        console.log(error);
        return res.status(500).json({
            message: error.toString()
        });
    }
}
exports.BaseController = BaseController;
