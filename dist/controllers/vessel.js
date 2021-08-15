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
const vessel_1 = __importDefault(require("../db/models/vessel"));
const error_1 = require("../types/error");
const date_1 = require("../utils/date");
const helpers_1 = require("../utils/helpers");
const base_1 = require("./base");
class VesselController extends base_1.BaseController {
    constructor() {
        super(...arguments);
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name, earliestReturningDate, cutOff, remarks } = req.body;
            const bodyArr = [name, earliestReturningDate, cutOff];
            if (helpers_1.isEmpty(bodyArr))
                return this.clientError(res, error_1.ErrorMessage.MISSING_DATA);
            try {
                const vessel = yield vessel_1.default.create({
                    name,
                    earliestReturningDate,
                    cutOff,
                    remarks
                });
                return this.created(res, vessel);
            }
            catch (createError) {
                return this.fail(res, createError);
            }
        });
        this.read = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const vessel = yield vessel_1.default.findByPk(id);
                if (!vessel)
                    return this.notFound(res);
                return this.ok(res, vessel);
                // return res.status(200).json(vessel)
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
                const [numOfUpdatedVessels, updatedVessels] = yield vessel_1.default.update({
                    name,
                    earliestReturningDate,
                    cutOff,
                    remarks
                }, {
                    where: { id },
                    returning: true
                });
                return this.ok(res, updatedVessels);
            }
            catch (updateError) {
                return this.fail(res, updateError);
            }
        });
        this.remove = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield vessel_1.default.destroy({
                    where: { id }
                });
                return this.ok(res);
            }
            catch (removeError) {
                return this.fail(res, removeError);
            }
        });
        /**
         * Use like '/vessel/?cutOff=2021-08-10T07:28:04.204Z&next=true' or '/vessel/?cutOff=2021-08-10T07:28:04.204Z&previous=true'
         * if next is true it will get next week's date from cutOff, if previous is true it will get last week's date from cutOff
         * For example: cutOff = '2021-08-10T07:28:04.204Z' and next = true, it will query from 2021-08-16 to 2021-08-22
         * Default '/vessel/' will query cutOff date within this week
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
                const vessels = yield vessel_1.default.findAll({
                    where: {
                        cutOff: {
                            [sequelize_1.Op.between]: [start, end]
                        }
                    },
                    order: [['cutOff', 'ASC']]
                });
                if (!vessels)
                    return this.notFound(res);
                return this.ok(res, vessels);
            }
            catch (error) {
                return this.fail(res, error);
            }
        });
        this.search = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { name } = req.query;
            if (!name)
                return this.fail(res, error_1.ErrorMessage.MISSING_DATA);
            const term = name.toString();
            // some length check
            if (term.length < 3)
                return this.fail(res, error_1.ErrorMessage.SHORT_LENGTH);
            try {
                const vessel = yield ((_a = vessel_1.default.sequelize) === null || _a === void 0 ? void 0 : _a.query('SELECT * FROM vessels WHERE vector @@ to_tsquery(:query);', {
                    replacements: { query: `${term.replace(' ', '+')}:*` },
                    type: 'SELECT'
                }));
                return this.ok(res, vessel);
            }
            catch (error) {
                return this.fail(res, error);
            }
        });
    }
}
exports.default = VesselController;
