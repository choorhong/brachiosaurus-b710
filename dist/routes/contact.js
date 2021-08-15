"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const query_params_1 = __importDefault(require("../middlewares/query-params"));
const contact_1 = __importDefault(require("../controllers/contact"));
const router = express_1.Router();
const auth = new auth_1.default();
const queryParams = new query_params_1.default();
const contact = new contact_1.default();
router.use(auth.verifyToken);
router.post('/create', contact.create);
// use as /search/?name=example
router.get('/search', contact.search);
router.get('/:id', queryParams.verifyIdParam, contact.read);
router.post('/update', contact.update);
router.delete('/:id', queryParams.verifyIdParam, contact.remove);
router.get('/', contact.getAll);
exports.default = router;
