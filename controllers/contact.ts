import { Request, Response } from 'express'
import Contact from '../db/models/contact'
import { generateUUID } from '../helpers'

export const create = async (req: Request, res: Response) => {
  const { companyName, role, remarks } = req.body
  if (!companyName || !role || !remarks) return res.status(400).json({ err: 'Missing data' })
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
    return res.status(500).send()
  }
}

export const read = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const contact = await Contact.findByPk(id)
    if (!contact) return res.status(404).json()
    return res.status(200).json(contact)
  } catch (getContactError) {
    return res.status(500).send()
  }
}

export const update = async (req: Request, res: Response) => {
  const { id, companyName, roles, remarks } = req.body
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
    return res.status(500).send()
  }
}

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    await Contact.destroy({
      where: { id }
    })
    return res.status(200).send()
  } catch (error) {
    return res.status(500).send()
  }
}
