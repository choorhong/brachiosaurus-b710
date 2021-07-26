import { RequestHandler } from 'express'
import User from '../db/models/user'
import { generateUUID } from '../helpers'
import { ROLES, STATUS } from '../types/user'

export const createOrFindUser: RequestHandler = async (req, res, next) => {
  try {
    const { firebaseUser } = res.locals
    if (!firebaseUser) throw new Error()

    const userId = generateUUID()
    const [user, created] = await User.findOrCreate({
      where: { email: firebaseUser.email },
      defaults: {
        id: userId,
        name: firebaseUser.name,
        firebaseUserId: firebaseUser.firebaseUserId,
        email: firebaseUser.email,
        role: ROLES.EXECUTIVE,
        status: STATUS.PENDING
      }
    })
    // If user has just been created
    if (created) return res.status(201).json(user)
    // User exists > next (Eg: when user refreshes the page)
    res.status(200).json(user)
    next()
  } catch (err) {
    console.log('err', err)
    return res.status(401).json({ err: 'INVALID_OR_EXPIRED_TOKEN' })
  }
}
