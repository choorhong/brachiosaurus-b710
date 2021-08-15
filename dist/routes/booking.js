"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const query_params_1 = __importDefault(require("../middlewares/query-params"));
const booking_1 = __importDefault(require("../controllers/booking"));
const router = express_1.Router();
const auth = new auth_1.default();
const queryParams = new query_params_1.default();
const booking = new booking_1.default();
router.use(auth.verifyToken);
router.post('/create', booking.create);
// use as /search/?bookingId=example
router.get('/search', booking.search);
router.get('/:id', queryParams.verifyIdParam, booking.read);
router.post('/update', booking.update);
router.delete('/:id', queryParams.verifyIdParam, booking.remove);
router.get('/', booking.getAll);
exports.default = router;
