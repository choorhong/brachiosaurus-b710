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

Booking.hasOne(Contact, {
  sourceKey: 'id',
  foreignKey: 'forwarderId',
  onDelete: 'SET NULL'
})
// Might throw error if defined in different file
Contact.belongsTo(Booking, {
  foreignKey: 'bookingId'
})

Booking.hasOne(Vessel, {
  sourceKey: 'id',
  foreignKey: 'vesselId',
  onDelete: 'SET NULL'
})
Vessel.belongsTo(Booking, {
  foreignKey: 'bookingId'
})

export default Booking
