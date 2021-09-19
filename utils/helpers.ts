import { v4 as uuidv4 } from 'uuid'
import { isDate } from 'lodash'
import { Op } from 'sequelize'

export const generateUUID = () => uuidv4()

/**
 *
 * @param undefined, null, {}, [], '' > true
 * @returns boolean
 */

export const checkEmpty = <T>(value: T) => {
  if (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0 && !isDate(value)) ||
    (typeof value === 'string' && value.trim().length === 0)
  ) return true
  return false
}

export const isEmpty = <T>(arr: Array<T>) => {
  return arr.some(checkEmpty)
}

export const filters = (filterType: string, queryObj: Record<string, any>) => {
  switch (filterType) {
    case 'booking':
      return {
        ...(queryObj.bookingId && { bookingId: { [Op.iLike]: `%${queryObj.bookingId}%` } }),
        ...(queryObj.departureLocation && { 'departure.location': { [Op.iLike]: `%${queryObj.departureLocation}%` } }),
        ...(queryObj.arrivalLocation && { 'arrival.location': { [Op.iLike]: `%${queryObj.arrivalLocation}%` } })
      }
    case 'contact':
      return {
        ...(queryObj.forwarder && { id: { [Op.eq]: queryObj.forwarder } }),
        ...(queryObj.vendor && { id: { [Op.eq]: queryObj.vendor } }),
        ...(queryObj.name && { name: { [Op.iLike]: `%${queryObj.name}%` } }),
        ...(queryObj.role && { roles: { [Op.contains]: [queryObj.role] } })
      }
    case 'vessel':
      return {
        ...(queryObj.name && { name: { [Op.iLike]: `%${queryObj.name}%` } }),
        ...((queryObj.cutOffStartDate && queryObj.cutOffEndDate) && { cutOff: { [Op.between]: [queryObj.cutOffStartDate, queryObj.cutOffEndDate] } })
      }
    case 'purchaseOrder':
      return {
        ...(queryObj.purchaseOrderId && { purchaseOrderId: { [Op.iLike]: `%${queryObj.purchaseOrderId}%` } }),
        ...(queryObj.status && { status: { [Op.iLike]: `%${queryObj.status}%` } })
      }
    case 'shipment':
      return {
        ...(queryObj.status && { status: { [Op.iLike]: `%${queryObj.status}%` } })
      }
    default:
      return {}
  }
}
