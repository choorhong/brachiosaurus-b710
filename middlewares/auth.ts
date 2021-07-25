import { RequestHandler } from 'express'
import admin from '../firebase'

export const verifyToken: RequestHandler = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization
    if (!accessToken) throw new Error()

    const firebaseUser = await admin.auth().verifyIdToken(accessToken)
    if (!firebaseUser) throw new Error()

    res.locals.firebaseUser = {
      email: firebaseUser.email,
      name: firebaseUser.name,
      firebaseUserId: firebaseUser.user_id
    }

    next()
  } catch (err) {
    console.log('err', err)
    return res.status(401).json({ err: 'INVALID_OR_EXPIRED_TOKEN' })
  }
}

export const verifyIdParam: RequestHandler = async (req, res, next) => {
  const { id } = req.params
  if (!id) return res.status(400).json({ err: 'Missing param' })
  next()
}
