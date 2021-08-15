"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../controllers/base");
const user_1 = __importDefault(require("../db/models/user"));
const firebase_1 = __importDefault(require("../firebase"));
const error_1 = require("../types/error");
const user_2 = require("../types/user");
class AuthMiddlewareController extends base_1.BaseController {
    constructor() {
        super(...arguments);
        this.verifyToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = req.headers.authorization;
                if (!accessToken)
                    return this.unauthorized(res, error_1.ErrorMessage.MISSING_TOKEN);
                const firebaseUser = yield firebase_1.default.auth().verifyIdToken(accessToken);
                if (!firebaseUser)
                    return this.unauthorized(res, error_1.ErrorMessage.USER_ACCOUNT_NOT_FOUND);
                res.locals.firebaseUser = {
                    email: firebaseUser.email,
                    name: firebaseUser.name,
                    firebaseUserId: firebaseUser.user_id
                };
                next();
            }
            catch (err) {
                console.log('err', err);
                return this.unauthorized(res, error_1.ErrorMessage.INVALID_OR_EXPIRED_TOKEN);
            }
        });
        this.getUserRoleStatus = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { firebaseUser } = res.locals;
            if (!firebaseUser)
                throw new Error();
            try {
                const user = yield user_1.default.findOne({ where: { email: firebaseUser.email } });
                if (!user)
                    return this.notFound(res);
                // account suspended >> subsequent data request will be rejected
                if (user.status === user_2.STATUS.SUSPENDED) {
                    return this.unauthorized(res);
                }
                // account suspended >> subsequent data request will be rejected until account get approved > 'ACTIVE'
                if (user.status === user_2.STATUS.PENDING) {
                    return this.unauthorized(res, 'PENDING_ACCOUNT_APPROVAL');
                }
                res.locals.userRoleStatus = {
                    // status: user.status // assume user status is ONLY active (STATUS.ACTIVE) at this point
                    role: user.role
                };
                next();
            }
            catch (error) {
                return this.fail(res, error);
            }
        });
    }
}
exports.default = AuthMiddlewareController;
