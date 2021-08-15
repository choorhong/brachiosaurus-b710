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
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = require("sequelize");
const booking_1 = __importDefault(require("../db/models/booking"));
const contact_1 = __importDefault(require("../db/models/contact"));
const purchase_orders_1 = __importDefault(require("../db/models/purchase-orders"));
const shipment_1 = __importDefault(require("../db/models/shipment"));
const vessel_1 = __importDefault(require("../db/models/vessel"));
const error_1 = require("../types/error");
const shipment_2 = require("../types/shipment");
const date_1 = require("../utils/date");
const helpers_1 = require("../utils/helpers");
const base_1 = require("./base");
class ShipmentController extends base_1.BaseController {
    constructor() {
        super(...arguments);
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { purchaseOrderId, vendorId, bookingId, status, users, remarks, container } = req.body;
            try {
                const shipment = yield shipment_1.default.create({
                    status: status || shipment_2.ShipmentStatus.CREATED,
                    users,
                    remarks,
                    container,
                    vendorId,
                    bookingId,
                    purchaseOrderId
                });
                return this.created(res, shipment);
            }
            catch (createError) {
                return this.fail(res, createError);
            }
        });
        this.read = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id)
                return this.fail(res, error_1.ErrorMessage.MISSING_DATA);
            try {
                const shipment = yield shipment_1.default.findByPk(id, {
                    include: [
                        { model: purchase_orders_1.default },
                        { model: contact_1.default, as: 'vendor' },
                        {
                            model: booking_1.default,
                            include: [{
                                    model: vessel_1.default
                                }]
                        }
                    ]
                });
                if (!shipment)
                    return this.notFound(res);
                return this.ok(res, shipment);
            }
            catch (readError) {
                return this.fail(res, readError);
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, purchaseOrderId, vendorId, bookingId, status, users, remarks, container } = req.body;
            const bodyArr = [id, status];
            if (helpers_1.isEmpty(bodyArr))
                return this.clientError(res, error_1.ErrorMessage.MISSING_DATA);
            try {
                const [numOfUpdatedShipment, updatedShipment] = yield shipment_1.default.update({
                    purchaseOrderId,
                    vendorId,
                    bookingId,
                    status,
                    users,
                    remarks,
                    container
                }, {
                    where: {
                        id
                    }
                });
                return this.ok(res, updatedShipment);
            }
            catch (updateError) {
                return this.fail(res, updateError);
            }
        });
        this.remove = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id)
                return this.fail(res, error_1.ErrorMessage.MISSING_DATA);
            try {
                yield shipment_1.default.destroy({
                    where: { id }
                });
                return this.ok(res);
            }
            catch (removeError) {
                return this.fail(res, removeError);
            }
        });
        /**
         * Use like '/shipment/?cutOff=2021-08-10T07:28:04.204Z&next=true' or '/shipment/?cutOff=2021-08-10T07:28:04.204Z&previous=true'
         * if next is true it will get next week's date from cutOff, if previous is true it will get last week's date from cutOff
         * For example: cutOff = '2021-08-10T07:28:04.204Z' and next = true, it will query from 2021-08-16 to 2021-08-22
         * Default '/shipment/' will query cutOff date within this week
         */
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { cutOff, previous, next } = req.query;
            let start = date_1.weekStart;
            let end = date_1.weekEnd;
            if (cutOff) {
                const cutOffDate = cutOff.toString();
                if (previous) {
                    start = moment_1.default(cutOffDate).subtract(1, 'week').startOf('isoWeek');
                    end = moment_1.default(cutOffDate).subtract(1, 'week').endOf('isoWeek');
                }
                else if (next) {
                    start = moment_1.default(cutOffDate).add(1, 'week').startOf('isoWeek');
                    end = moment_1.default(cutOffDate).add(1, 'week').endOf('isoWeek');
                }
            }
            try {
                const shipments = yield shipment_1.default.findAll({
                    include: [
                        { model: purchase_orders_1.default },
                        { model: contact_1.default, as: 'vendor' },
                        {
                            model: booking_1.default,
                            include: [{
                                    model: vessel_1.default,
                                    where: {
                                        cutOff: {
                                            [sequelize_1.Op.between]: [start, end]
                                        }
                                    },
                                    required: true
                                }],
                            required: true
                        }
                    ],
                    order: [['booking', 'vessel', 'cutOff', 'ASC']]
                });
                if (!shipments)
                    return this.notFound(res);
                return this.ok(res, shipments);
            }
            catch (error) {
                return this.fail(res, error);
            }
        });
    }
}
exports.default = ShipmentController;
