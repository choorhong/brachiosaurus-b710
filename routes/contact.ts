import { Router } from 'express'

import AuthMiddlewareController from '../middlewares/auth'
import QueryParamsMiddlewareController from '../middlewares/query-params'
import ContactController from '../controllers/contact'

const router = Router()
const auth = new AuthMiddlewareController()
const queryParams = new QueryParamsMiddlewareController()
const contact = new ContactController()

router.use(auth.verifyToken, auth.getUserRoleStatus, auth.verifyActiveStatus)

router.post('/create', contact.create)

// use as /search/?name=example
router.get('/search', contact.search)

router.get('/:id', queryParams.verifyIdParam, contact.read)

router.post('/update', contact.update)

router.delete('/:id', queryParams.verifyIdParam, contact.remove)

router.get('/', contact.getAll)

export default router
