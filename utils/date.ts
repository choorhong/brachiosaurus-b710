import moment from 'moment-timezone'

const currentMomentDate = moment()
// currentMomentDate.tz('Asia/Kuala_Lumpur')

// Monday
export const weekStart = currentMomentDate.clone().startOf('isoWeek')

// Sunday
export const weekEnd = currentMomentDate.clone().endOf('isoWeek')
