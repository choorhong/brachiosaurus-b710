"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const query_params_1 = __importDefault(require("../middlewares/query-params"));
const vessel_1 = __importDefault(require("../controllers/vessel"));
const router = express_1.Router();
const auth = new auth_1.default();
const queryParams = new query_params_1.default();
const vessel = new vessel_1.default();
router.use(auth.verifyToken);
router.post('/create', vessel.create);
// use as /search/?name=example
router.get('/search', vessel.search);
router.get('/:id', queryParams.verifyIdParam, vessel.read);
router.post('/update', vessel.update);
router.delete('/:id', queryParams.verifyIdParam, vessel.remove);
router.get('/', vessel.getAll);
exports.default = router;
