import { DataTypes } from 'sequelize'
import { sequelize } from './index'
import { BookingInstance } from '../../types/booking'
import Contact from './contact'
import Vessel from './vessel'

const Booking = sequelize.define<BookingInstance>(
  'bookings',
  {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true
    },
    bookingId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    departureETD: {
      type: DataTypes.DATE,
      allowNull: true
    },
    departureLocation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    arrivalETA: {
      type: DataTypes.DATE,
      allowNull: true
    },
    arrivalLocation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    users: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: []
    },
    slots: {
      type: DataTypes.STRING,
      allowNull: true
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }
)

Contact.hasMany(Booking, {
  foreignKey: 'forwarderId'
})
// Might throw error if define in different file
Booking.belongsTo(Contact, {
  foreignKey: 'forwarderId',
  as: 'forwarder'
})

Vessel.hasMany(Booking, {
  foreignKey: 'vesselId'
})
Booking.belongsTo(Vessel, {
  foreignKey: 'vesselId'
})

export default Booking
