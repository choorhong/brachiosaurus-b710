import { Router } from 'express'

import AuthController from '../controllers/auth'
import AuthMiddlewareController from '../middlewares/auth'

const router = Router()
const { verifyToken, getUserRoleStatus, verifyActiveStatus, verifySuperAdmin } = new AuthMiddlewareController()
const auth = new AuthController()

router.use(verifyToken)

router.post('/create-find-user', auth.createOrFindUser)

// update user info
router.post('/update', auth.update)

router.use(getUserRoleStatus, verifyActiveStatus, verifySuperAdmin)

router.get('/users', auth.getAll)

router.get('/:id', auth.read)

router.patch('/:id', auth.updateRoleStatus)

export default router
