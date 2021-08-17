import { Router } from 'express'

import AuthController from '../controllers/auth'
import AuthMiddlewareController from '../middlewares/auth'

const router = Router()
const { verifyToken, getUserRoleStatus, verifySuperAdmin } = new AuthMiddlewareController()
const auth = new AuthController()

router.use(verifyToken)

router.post('/create-find-user', auth.createOrFindUser)

router.post('/update', auth.update)

router.get('/users', getUserRoleStatus, verifySuperAdmin, auth.getAll)

router.get('/:id', getUserRoleStatus, verifySuperAdmin, auth.read)

router.patch('/:id', getUserRoleStatus, verifySuperAdmin, auth.updateRoleStatus)

export default router
