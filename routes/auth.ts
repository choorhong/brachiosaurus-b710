import { Router } from 'express'
import { createOrFindUser } from '../controllers/auth'
import { verifyToken } from '../middlewares/auth'

const router = Router()

router.post('/create-find-user', verifyToken, createOrFindUser)

export default router
