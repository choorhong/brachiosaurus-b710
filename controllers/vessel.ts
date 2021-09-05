import { RequestHandler } from 'express'
import moment from 'moment'
import { Op } from 'sequelize'
import Vessel from '../db/models/vessel'
import { ErrorMessage } from '../types/error'
import { weekEnd, weekStart } from '../utils/date'
import { isEmpty } from '../utils/helpers'
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

  /**
   * Use like '/vessel/?cutOff=2021-08-10T07:28:04.204Z&next=true' or '/vessel/?cutOff=2021-08-10T07:28:04.204Z&previous=true'
   * if next is true it will get next week's date from cutOff, if previous is true it will get last week's date from cutOff
   * For example: cutOff = '2021-08-10T07:28:04.204Z' and next = true, it will query from 2021-08-16 to 2021-08-22
   * Default '/vessel/' will query cutOff date within this week
   */
  public getAll: RequestHandler = async (req, res) => {
    const { cutOff, previous, next } = req.query
    let start = weekStart
    let end = weekEnd
    if (cutOff) {
      const cutOffDate = cutOff.toString()
      if (previous) {
        start = moment(cutOffDate).subtract(1, 'week').startOf('isoWeek')
        end = moment(cutOffDate).subtract(1, 'week').endOf('isoWeek')
      } else if (next) {
        start = moment(cutOffDate).add(1, 'week').startOf('isoWeek')
        end = moment(cutOffDate).add(1, 'week').endOf('isoWeek')
      }
    }
    try {
      const vessels = await Vessel.findAll({
        // where: {
        //   cutOff: {
        //     [Op.between]: [start, end]
        //   } as any
        // },
        // order: [['cutOff', 'ASC']]
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
