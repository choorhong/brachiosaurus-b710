import { Router } from 'express'

import AuthMiddlewareController from '../middlewares/auth'
import QueryParamsMiddlewareController from '../middlewares/query-params'
import ShipmentController from '../controllers/shipment'

const router = Router()
const auth = new AuthMiddlewareController()
const queryParams = new QueryParamsMiddlewareController()
const shipment = new ShipmentController()

router.use(auth.verifyToken, auth.getUserRoleStatus, auth.verifyActiveStatus)

router.post('/create', shipment.create)

// use as /?vendor=example
router.get('/', shipment.find)

router.get('/:id', queryParams.verifyIdParam, shipment.read)

router.post('/update', shipment.update)

router.post('/update/add-user', shipment.addUsers)

router.post('/update/remove-user', shipment.removeUsers)

router.delete('/:id', queryParams.verifyIdParam, shipment.remove)

export default router
