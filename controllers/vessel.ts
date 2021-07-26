import { Request, Response } from 'express'
import Vessel from '../db/models/vessel'
import { generateUUID } from '../helpers'

export const create = async (req: Request, res: Response) => {
  const { name, earliestReturningDate, cutOff, remarks } = req.body
  if (!name || !earliestReturningDate || !cutOff) return res.status(400).json({ err: 'Missing data' })
  const id = generateUUID()
  try {
    const vessel = await Vessel.create({
      id,
      name,
      earliestReturningDate,
      cutOff,
      remarks
    })
    return res.status(201).json(vessel)
  } catch (createError) {
    return res.status(500).json({ err: createError.toString() })
  }
}

export const read = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const vessel = await Vessel.findByPk(id)
    if (!vessel) return res.status(404).send()
    return res.status(200).json(vessel)
  } catch (findError) {
    return res.status(500).json({ err: findError.toString() })
  }
}

export const update = async (req: Request, res: Response) => {
  const { id, name, earliestReturningDate, cutOff, remarks } = req.body
  if (!id || !name || !earliestReturningDate || !cutOff) return res.status(400).json({ err: 'Missing data' })
  try {
    const vessel = await Vessel.update({
      name,
      earliestReturningDate,
      cutOff,
      remarks
    }, {
      where: { id }
    })
    return res.status(200).json(vessel)
  } catch (updateError) {
    return res.status(500).json({ err: updateError.toString() })
  }
}

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    await Vessel.destroy({
      where: { id }
    })
    return res.status(200).send('ok')
  } catch (deleteError) {
    return res.status(500).json({ err: deleteError.toString() })
  }
}
