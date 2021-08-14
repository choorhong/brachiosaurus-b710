import { Router } from 'express'

import AuthController from '../controllers/auth'
import AuthMiddlewareController from '../middlewares/auth'

const router = Router()
const authMiddleware = new AuthMiddlewareController()
const auth = new AuthController()

router.use(authMiddleware.verifyToken)

router.post('/create-find-user', auth.createOrFindUser)

router.post('/update', auth.update)

router.get('/users', auth.getAll)

router.get('/:id', auth.read)

router.patch('/:id', auth.updateRoleStatus)

export default router
