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
const contact_1 = __importDefault(require("../db/models/contact"));
const purchase_orders_1 = __importDefault(require("../db/models/purchase-orders"));
const error_1 = require("../types/error");
const helpers_1 = require("../utils/helpers");
const base_1 = require("./base");
const sequelize_1 = require("sequelize");
class PurchaseOrderController extends base_1.BaseController {
    constructor() {
        super(...arguments);
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { purchaseOrderId, users, status, vendorId, remarks } = req.body;
            const bodyArr = [purchaseOrderId, vendorId];
            if (helpers_1.isEmpty(bodyArr))
                return this.clientError(res, error_1.ErrorMessage.MISSING_DATA);
            try {
                const purchaseOrder = yield purchase_orders_1.default.create({
                    purchaseOrderId,
                    users,
                    status,
                    vendorId,
                    remarks
                });
                return this.created(res, purchaseOrder);
            }
            catch (createError) {
                return this.fail(res, createError);
            }
        });
        this.read = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const purchaseOrder = yield purchase_orders_1.default.findByPk(id, {
                    include: [
                        { model: contact_1.default, as: 'vendor' }
                    ]
                });
                if (!purchaseOrder)
                    return this.notFound(res);
                return this.ok(res, purchaseOrder);
            }
            catch (readError) {
                return this.fail(res, readError);
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, name, earliestReturningDate, cutOff, remarks } = req.body;
            const bodyArr = [id, name, earliestReturningDate, cutOff];
            if (helpers_1.isEmpty(bodyArr))
                return this.clientError(res, error_1.ErrorMessage.MISSING_DATA);
            try {
                const [numOfUpdatedPurchaseOrders, updatedPurchaseOrders] = yield purchase_orders_1.default.update({
                    remarks
                }, {
                    where: { id },
                    returning: true
                });
                return this.ok(res, updatedPurchaseOrders);
            }
            catch (updateError) {
                return this.fail(res, updateError);
            }
        });
        this.remove = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield purchase_orders_1.default.destroy({
                    where: { id }
                });
                return this.ok(res);
            }
            catch (removeError) {
                return this.fail(res, removeError);
            }
        });
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const purchaseOrders = yield purchase_orders_1.default.findAll({
                    include: [
                        { model: contact_1.default, as: 'vendor' }
                    ]
                });
                if (!purchaseOrders)
                    return this.notFound(res);
                return this.ok(res, purchaseOrders);
            }
            catch (error) {
                return this.fail(res, error);
            }
        });
        this.inputSearch = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { query } = req.body;
            try {
                const purchaseOrders = yield purchase_orders_1.default.findAll({
                    limit: 5,
                    where: {
                        purchaseOrderId: {
                            [sequelize_1.Op.iLike]: `%${query}%`
                        }
                    }
                });
                if (!purchaseOrders)
                    return this.notFound(res);
                return this.ok(res, purchaseOrders);
            }
            catch (error) {
                return this.fail(res, error);
            }
        });
        this.search = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { purchaseOrderId } = req.query;
            if (!purchaseOrderId)
                return this.fail(res, error_1.ErrorMessage.MISSING_DATA);
            const term = purchaseOrderId.toString();
            // some length check
            if (term.length < 3)
                return this.fail(res, error_1.ErrorMessage.SHORT_LENGTH);
            try {
                const purchaseOrder = yield ((_a = purchase_orders_1.default.sequelize) === null || _a === void 0 ? void 0 : _a.query('SELECT * FROM "purchaseOrders" WHERE vector @@ to_tsquery(:query);', {
                    replacements: { query: `${term.replace(' ', '+')}:*` },
                    type: 'SELECT'
                }));
                return this.ok(res, purchaseOrder);
            }
            catch (error) {
                return this.fail(res, error);
            }
        });
    }
}
exports.default = PurchaseOrderController;
