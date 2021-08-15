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
const vessel_1 = __importDefault(require("../db/models/vessel"));
const error_1 = require("../types/error");
const date_1 = require("../utils/date");
const helpers_1 = require("../utils/helpers");
const base_1 = require("./base");
class BookingController extends base_1.BaseController {
    constructor() {
        super(...arguments);
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { bookingId, forwarderId, departure, arrival, vesselId, users, // array or string?
            slots, remarks } = req.body;
            const bodyArr = [bookingId, forwarderId, vesselId, slots];
            if (helpers_1.isEmpty(bodyArr))
                return this.clientError(res, error_1.ErrorMessage.MISSING_DATA);
            try {
                const booking = yield booking_1.default.create({
                    bookingId,
                    forwarderId,
                    departure,
                    arrival,
                    vesselId,
                    users,
                    slots,
                    remarks
                });
                return this.created(res, booking);
            }
            catch (createError) {
                return this.fail(res, createError);
            }
        });
        this.read = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const booking = yield booking_1.default.findByPk(id, { include: [{ model: vessel_1.default }, { model: contact_1.default, as: 'forwarder' }] });
                // const booking = await Booking.findByPk(id)
                return this.ok(res, booking);
            }
            catch (readError) {
                return this.fail(res, readError);
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, bookingId, forwarderId, departure = {}, arrival = {}, vesselId, users, // array or string?
            slots, remarks } = req.body;
            // departure.date = new Date()
            // departure.location = 'LOS ANGELES, CA'
            // arrival.date = new Date()
            // arrival.location = 'PENANG, MALAYSIA'
            const bodyArr = [id, bookingId, forwarderId, vesselId, slots];
            if (helpers_1.isEmpty(bodyArr))
                return this.clientError(res, error_1.ErrorMessage.MISSING_DATA);
            try {
                const [numOfUpdatedBookings, updatedBookings] = yield booking_1.default.update({
                    bookingId,
                    forwarderId,
                    departure,
                    arrival,
                    vesselId,
                    users,
                    slots,
                    remarks
                }, { where: { id } });
                return this.ok(res, updatedBookings);
            }
            catch (updateError) {
                return this.fail(res, updateError);
            }
        });
        this.remove = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield booking_1.default.destroy({
                    where: { id }
                });
                return this.ok(res);
            }
            catch (removeError) {
                return this.fail(res, removeError);
            }
        });
        /**
         * Use like '/booking/?cutOff=2021-08-10T07:28:04.204Z&next=true' or '/booking/?cutOff=2021-08-10T07:28:04.204Z&previous=true'
         * if next is true it will get next week's date from cutOff, if previous is true it will get last week's date from cutOff
         * For example: cutOff = '2021-08-10T07:28:04.204Z' and next = true, it will query from 2021-08-16 to 2021-08-22
         * Default '/booking/' will query cutOff date within this week
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
                const bookings = yield booking_1.default.findAll({
                    include: [
                        { model: contact_1.default, as: 'forwarder' },
                        {
                            model: vessel_1.default,
                            where: {
                                cutOff: {
                                    [sequelize_1.Op.between]: [start, end]
                                }
                            }
                        }
                    ],
                    order: [['vessel', 'cutOff', 'ASC']]
                });
                if (!bookings)
                    return this.notFound(res);
                return this.ok(res, bookings);
            }
            catch (error) {
                return this.fail(res, error);
            }
        });
        this.search = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { bookingId } = req.query;
            if (!bookingId)
                return this.fail(res, error_1.ErrorMessage.MISSING_DATA);
            const term = bookingId.toString();
            // some length check
            if (term.length < 3)
                return this.fail(res, error_1.ErrorMessage.SHORT_LENGTH);
            try {
                const booking = yield ((_a = booking_1.default.sequelize) === null || _a === void 0 ? void 0 : _a.query('SELECT * FROM bookings WHERE vector @@ to_tsquery(:query);', {
                    replacements: { query: `${term.replace(' ', '+')}:*` },
                    type: 'SELECT'
                }));
                return this.ok(res, booking);
            }
            catch (error) {
                return this.fail(res, error);
            }
        });
    }
}
exports.default = BookingController;
