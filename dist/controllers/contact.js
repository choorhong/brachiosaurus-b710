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
const error_1 = require("../types/error");
const helpers_1 = require("../utils/helpers");
const base_1 = require("./base");
class ContactController extends base_1.BaseController {
    constructor() {
        super(...arguments);
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name, role, remarks } = req.body;
            const bodyArr = [name, role];
            if (helpers_1.isEmpty(bodyArr))
                return this.clientError(res, error_1.ErrorMessage.MISSING_DATA);
            try {
                const contact = yield contact_1.default.create({
                    name,
                    roles: [role],
                    remarks
                });
                return this.created(res, contact);
            }
            catch (createError) {
                return this.fail(res, createError);
            }
        });
        this.read = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const contact = yield contact_1.default.findByPk(id);
                if (!contact)
                    return this.notFound(res);
                return this.ok(res, contact);
            }
            catch (readError) {
                return this.fail(res, readError);
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, name, role, remarks } = req.body;
            const bodyArr = [id, name, role];
            if (helpers_1.isEmpty(bodyArr))
                return this.clientError(res, error_1.ErrorMessage.MISSING_DATA);
            try {
                const [numOfUpdatedContacts, updatedContacts] = yield contact_1.default.update({
                    name,
                    roles: [role],
                    remarks
                }, {
                    where: {
                        id
                    }
                });
                return this.ok(res, updatedContacts);
            }
            catch (updateError) {
                return this.fail(res, updateError);
            }
        });
        this.remove = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield contact_1.default.destroy({
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
                const contacts = yield contact_1.default.findAll();
                if (!contacts)
                    return this.notFound(res);
                return this.ok(res, contacts);
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
            if (term.length < 3)
                return this.fail(res, error_1.ErrorMessage.SHORT_LENGTH);
            try {
                const contact = yield ((_a = contact_1.default.sequelize) === null || _a === void 0 ? void 0 : _a.query('SELECT * FROM contacts WHERE vector @@ to_tsquery(:query);', {
                    replacements: { query: `${term.replace(' ', '+')}:*` },
                    type: 'SELECT'
                }));
                return this.ok(res, contact);
            }
            catch (error) {
                return this.fail(res, error);
            }
        });
    }
}
exports.default = ContactController;
