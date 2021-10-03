import { RequestHandler } from 'express'
import moment from 'moment'
import Vessel from '../db/models/vessel'
import { ErrorMessage } from '../types/error'
import { weekEnd, weekStart } from '../utils/date'
import { filters, isEmpty } from '../utils/helpers'
import { BaseController } from './base'

export default class VesselController extends BaseController {
  public create: RequestHandler = async (req, res) => {
    const { name, earliestReturningDate, cutOff, remarks } = req.body
    const bodyArr = [name, earliestReturningDate, cutOff]
    if (isEmpty(bodyArr)) return this.clientError(res, ErrorMessage.MISSING_DATA)

    try {
      const vessel = await Vessel.create({
        name,
        earliestReturningDate,
        cutOff,
        remarks
      })
      return this.created(res, vessel)
    } catch (createError) {
      return this.fail(res, createError)
    }
  }

  public read: RequestHandler = async (req, res) => {
    const { id } = req.params

    try {
      const vessel = await Vessel.findByPk(id)
      if (!vessel) return this.notFound(res)
      return this.ok(res, vessel)
      // return res.status(200).json(vessel)
    } catch (readError) {
      return this.fail(res, readError)
    }
  }

  public update: RequestHandler = async (req, res) => {
    const { id, name, earliestReturningDate, cutOff, remarks } = req.body
    const bodyArr = [id, name, earliestReturningDate, cutOff]
    if (isEmpty(bodyArr)) return this.clientError(res, ErrorMessage.MISSING_DATA)

    try {
      const [numOfUpdatedVessels, updatedVessels] = await Vessel.update({
        name,
        earliestReturningDate,
        cutOff,
        remarks
      }, {
        where: { id },
        returning: true
      })
      return this.ok(res, updatedVessels)
    } catch (updateError) {
      return this.fail(res, updateError)
    }
  }

  public remove: RequestHandler = async (req, res) => {
    const { id } = req.params

    try {
      await Vessel.destroy({
        where: { id }
      })
      return this.ok(res)
    } catch (removeError) {
      return this.fail(res, removeError)
    }
  }

  public find: RequestHandler = async (req, res, next) => {
    const { name, cutOffStartDate, cutOffEndDate, page = 1 } = req.query

    let start
    let end
    if (!name && (!cutOffStartDate || !cutOffEndDate)) {
      // has no filters and no cutoff dates
      start = new Date(weekStart.toISOString())
      end = new Date(weekEnd.toISOString())
    } else if (cutOffStartDate && cutOffEndDate) {
      // has cutoff dates
      start = new Date(cutOffStartDate.toString())
      end = new Date(cutOffEndDate.toString())
    }

    const pagination = { pg: +page, pgSize: 10 }
    const queryObj = { name, cutOffStartDate: start, cutOffEndDate: end }

    try {
      const vessels = await Vessel.findAndCountAll({
        where: filters('vessel', queryObj),
        offset: (pagination.pg - 1) * pagination.pgSize,
        limit: pagination.pgSize
      })
      if (!vessels) return this.notFound(res)
      return this.ok(res, vessels)
    } catch (error) {
      return this.fail(res, error)
    }
  }

  public search: RequestHandler = async (req, res) => {
    const { name } = req.query
    if (!name) return this.fail(res, ErrorMessage.MISSING_DATA)
    const term = name.toString()
    // some length check
    if (term.length < 3) return this.fail(res, ErrorMessage.SHORT_LENGTH)
    try {
      const vessel = await Vessel.sequelize?.query('SELECT * FROM vessels WHERE vector @@ to_tsquery(:query);', {
        replacements: { query: `${term.replace(' ', '+')}:*` },
        type: 'SELECT'
      })
      return this.ok(res, vessel)
    } catch (error) {
      return this.fail(res, error)
    }
  }
}
