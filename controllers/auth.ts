import { RequestHandler } from 'express'
import User from '../models/user'
import { omit } from 'lodash'

export const createOrFindUser: RequestHandler = async (req, res, next) => {
  try {
    const { firebaseUser } = res.locals
    if (!firebaseUser) throw new Error()

    const user = await User.findOne({ email: firebaseUser.email }, { __v: 0 })
    if (!user) {
      // No user if it does not exist in the DB
      const newUser = await new User({
        email: firebaseUser.email,
        name: firebaseUser.name,
        firebaseUserId: firebaseUser.firebaseUserId
      }).save()
      const modNewUser = omit(newUser, ['__v'])
      return res.status(201).json(modNewUser)
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
