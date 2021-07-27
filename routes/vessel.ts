import { Router } from 'express'
import AuthMiddlewareController from '../middlewares/auth'
import QueryParamsMiddlewareController from '../middlewares/query-params'
import VesselController from '../controllers/vessel'

const router = Router()
const auth = new AuthMiddlewareController()
const queryParams = new QueryParamsMiddlewareController()
const vessel = new VesselController()

router.use(auth.verifyToken)

router.post('/create', vessel.create)

router.get('/:id', queryParams.verifyIdParam, vessel.read)

router.post('/update', vessel.update)

router.delete('/:id', queryParams.verifyIdParam, vessel.remove)

export default router
