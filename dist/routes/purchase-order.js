"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const query_params_1 = __importDefault(require("../middlewares/query-params"));
const purchase_order_1 = __importDefault(require("../controllers/purchase-order"));
const router = express_1.Router();
const auth = new auth_1.default();
const queryParams = new query_params_1.default();
const purchaseOrder = new purchase_order_1.default();
router.use(auth.verifyToken);
router.post('/create', purchaseOrder.create);
// use as /search/?purchaseOrderId=example
router.get('/search', purchaseOrder.search);
router.post('/input-search', purchaseOrder.inputSearch);
router.get('/:id', queryParams.verifyIdParam, purchaseOrder.read);
router.post('/update', purchaseOrder.update);
router.delete('/:id', queryParams.verifyIdParam, purchaseOrder.remove);
router.get('/', purchaseOrder.getAll);
exports.default = router;
