import { Router } from 'express'

import AuthController from '../controllers/auth'
import AuthMiddlewareController from '../middlewares/auth'

const router = Router()
const authMiddleware = new AuthMiddlewareController()
const auth = new AuthController()

router.post('/create-find-user', authMiddleware.verifyToken, auth.createOrFindUser)

router.post('/update', authMiddleware.verifyToken, auth.update)

export default router
