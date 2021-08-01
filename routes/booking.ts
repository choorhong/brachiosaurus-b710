import { Router } from 'express'

import AuthMiddlewareController from '../middlewares/auth'
import QueryParamsMiddlewareController from '../middlewares/query-params'
import BookingController from '../controllers/booking'

const router = Router()
const auth = new AuthMiddlewareController()
const queryParams = new QueryParamsMiddlewareController()
const booking = new BookingController()

router.use(auth.verifyToken)

router.post('/create', booking.create)

// use as /search/?bookingId=example
router.get('/search', booking.search)

router.get('/:id', queryParams.verifyIdParam, booking.read)

router.post('/update', booking.update)

router.delete('/:id', queryParams.verifyIdParam, booking.remove)

router.get('/', booking.getAll)

export default router
