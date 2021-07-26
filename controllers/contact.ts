import { Request, Response } from 'express'
import Contact from '../db/models/contact'
import { generateUUID } from '../helpers'

export const create = async (req: Request, res: Response) => {
  const { companyName, role, remarks } = req.body
  if (!companyName || !role) return res.status(400).json({ err: 'Missing data' })
  const id = generateUUID()
  try {
    const contact = await Contact.create({
      id,
      companyName,
      roles: [role], // just one role on create?
      remarks
    })
    return res.status(201).json(contact)
  } catch (createContactErr) {
    return res.status(500).json({ err: createContactErr.toString() })
  }
}

export const read = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const contact = await Contact.findByPk(id)
    if (!contact) return res.status(404).send()
    return res.status(200).json(contact)
  } catch (getContactError) {
    return res.status(500).json({ err: getContactError.toString() })
  }
}

export const update = async (req: Request, res: Response) => {
  const { id, companyName, roles, remarks } = req.body
  if (!id || !companyName || !roles) return res.status(400).json({ err: 'Missing data' })
  try {
    const contact = await Contact.update({
      companyName,
      roles,
      remarks
    }, {
      where: {
        id
      }
    })
    return res.status(200).json(contact)
  } catch (updateError) {
    return res.status(500).json({ err: updateError.toString() })
  }
}

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    await Contact.destroy({
      where: { id }
    })
    return res.status(200).send('ok')
  } catch (error) {
    return res.status(500).json({ err: error.toString() })
  }
}
