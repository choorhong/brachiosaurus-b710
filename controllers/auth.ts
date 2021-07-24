import { RequestHandler } from 'express'
import User from '../db/models/user'
import { generateUUID } from '../helpers'

export const createOrFindUser: RequestHandler = async (req, res, next) => {
  try {
    const { firebaseUser } = res.locals
    if (!firebaseUser) throw new Error()

    const user = await User.findOne({ where: { email: firebaseUser.email } })
    // No user if it does not exist in the DB
    if (!user) {
      const userId = generateUUID()
      const newUser = await User.create({
        id: userId,
        name: firebaseUser.name,
        firebaseUserId: firebaseUser.firebaseUserId,
        email: firebaseUser.email,
        role: 'EXECUTIVE'
      })
      return res.status(201).json(newUser)
    } else {
      // User exists > next (Eg: when user refreshes the page)
      res.status(200).json(user)
      next()
      // return res.status(400).json({ err: 'USER_EXISTED' })
    }
  } catch (err) {
    console.log('err', err)
    return res.status(401).json({ err: 'INVALID_OR_EXPIRED_TOKEN' })
  }
}
