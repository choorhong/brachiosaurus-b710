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

// use as /search/?name=example
router.get('/search', vessel.search)

router.get('/:id', queryParams.verifyIdParam, vessel.read)

router.post('/update', vessel.update)

router.delete('/:id', queryParams.verifyIdParam, vessel.remove)

router.get('/', vessel.getAll)

export default router
