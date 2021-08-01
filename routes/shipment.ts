import { Router } from 'express'

import AuthMiddlewareController from '../middlewares/auth'
import QueryParamsMiddlewareController from '../middlewares/query-params'
import ShipmentController from '../controllers/shipment'

const router = Router()
const auth = new AuthMiddlewareController()
const queryParams = new QueryParamsMiddlewareController()
const shipment = new ShipmentController()

router.use(auth.verifyToken)

router.post('/create', shipment.create)

router.get('/:id', queryParams.verifyIdParam, shipment.read)

router.post('/update', shipment.update)

router.delete('/:id', queryParams.verifyIdParam, shipment.remove)

router.get('/', shipment.getAll)

export default router
