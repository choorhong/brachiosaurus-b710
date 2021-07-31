import { v4 as uuidv4 } from 'uuid'
import { isDate } from 'lodash'
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
