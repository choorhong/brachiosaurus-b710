import { Router } from 'express'

import AuthMiddlewareController from '../middlewares/auth'
import QueryParamsMiddlewareController from '../middlewares/query-params'
import PurchaseOrderController from '../controllers/purchase-order'

const router = Router()
const auth = new AuthMiddlewareController()
const queryParams = new QueryParamsMiddlewareController()
const purchaseOrder = new PurchaseOrderController()

router.use(auth.verifyToken)

router.post('/create', purchaseOrder.create)

// use as /search/?purchaseOrderId=example
router.get('/search', purchaseOrder.search)

router.get('/:id', queryParams.verifyIdParam, purchaseOrder.read)

router.post('/update', purchaseOrder.update)

router.delete('/:id', queryParams.verifyIdParam, purchaseOrder.remove)

router.get('/', purchaseOrder.getAll)

export default router
