import { Router } from 'express'
import { create, read, update, remove } from '../controllers/booking'
import AuthMiddlewareController from '../middlewares/auth'
import QueryParamsMiddlewareController from '../middlewares/query-params'

const router = Router()
const auth = new AuthMiddlewareController()
const queryParams = new QueryParamsMiddlewareController()

router.use(auth.verifyToken)

router.post('/create', create)

router.get('/:id', queryParams.verifyIdParam, read)

router.post('/update', update)

router.delete('/:id', queryParams.verifyIdParam, remove)

export default router
