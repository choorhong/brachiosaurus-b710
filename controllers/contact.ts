import { RequestHandler } from 'express'
import Contact from '../db/models/contact'
import { ErrorMessage } from '../types/error'
import { isEmpty } from '../utils/helpers'
import { BaseController } from './base'

export default class ContactController extends BaseController {
  public create: RequestHandler = async (req, res) => {
    const { name, role, remarks } = req.body
    const bodyArr = [name, role]
    if (isEmpty(bodyArr)) return this.clientError(res, ErrorMessage.MISSING_DATA)

    try {
      const contact = await Contact.create({
        name,
        roles: [role],
        remarks
      })
      return this.created(res, contact)
    } catch (createError) {
      return this.fail(res, createError)
    }
  }

  public read: RequestHandler = async (req, res) => {
    const { id } = req.params

    try {
      const contact = await Contact.findByPk(id)
      if (!contact) return this.notFound(res)
      return this.ok(res, contact)
    } catch (readError) {
      return this.fail(res, readError)
    }
  }

  public update: RequestHandler = async (req, res) => {
    const { id, name, role, remarks } = req.body
    const bodyArr = [id, name, role]
    if (isEmpty(bodyArr)) return this.clientError(res, ErrorMessage.MISSING_DATA)

    try {
      const [numOfUpdatedContacts, updatedContacts] = await Contact.update({
        name,
        roles: [role],
        remarks
      }, {
        where: {
          id
        }
      })
      return this.ok(res, updatedContacts)
    } catch (updateError) {
      return this.fail(res, updateError)
    }
  }

  public remove: RequestHandler = async (req, res) => {
    const { id } = req.params

    try {
      await Contact.destroy({
        where: { id }
      })
      return this.ok(res)
    } catch (removeError) {
      return this.fail(res, removeError)
    }
  }

  public getAll: RequestHandler = async (req, res) => {
    try {
      const contacts = await Contact.findAll()
      if (!contacts) return this.notFound(res)
      return this.ok(res, contacts)
    } catch (error) {
      return this.fail(res, error)
    }
  }

  public search: RequestHandler = async (req, res) => {
    const { name } = req.query
    if (!name) return this.fail(res, ErrorMessage.MISSING_DATA)
    const term = name.toString()
    if (term.length < 3) return this.ok(res)
    try {
      const contact = await Contact.sequelize?.query('SELECT * FROM contacts WHERE vector @@ to_tsquery(:query);', {
        replacements: { query: `${term.replace(' ', '+')}:*` },
        type: 'SELECT'
      })
      return this.ok(res, contact)
    } catch (error) {
      return this.fail(res, error)
    }
  }
}
