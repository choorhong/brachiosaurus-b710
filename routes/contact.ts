import { Router } from 'express'
import { create, read, update, remove } from '../controllers/contact'
import { verifyIdParam, verifyToken } from '../middlewares/auth'

const router = Router()

router.use(verifyToken)

router.post('/create', create)

router.get('/:id', verifyIdParam, read)

router.post('/update', update)

router.delete('/:id', verifyIdParam, remove)

export default router
