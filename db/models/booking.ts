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
      unique: true,
      defaultValue: DataTypes.UUIDV4
    },
    bookingId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    departure: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    arrival: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    // departureETD: {
    //   type: DataTypes.DATE,
    //   allowNull: true
    // },
    // departureLocation: {
    //   type: DataTypes.STRING,
    //   allowNull: true
    // },
    // arrivalETA: {
    //   type: DataTypes.DATE,
    //   allowNull: true
    // },
    // arrivalLocation: {
    //   type: DataTypes.STRING,
    //   allowNull: true
    // },
    users: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    slots: {
      type: DataTypes.NUMBER,
      allowNull: true
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }
)

// 1 contact (forwarder) can own or has many booking
// 1 booking can only belong to 1 contact (forwarder)
Contact.hasMany(Booking, {
  foreignKey: 'forwarderId'
})
// Might throw error if define in different file
Booking.belongsTo(Contact, {
  foreignKey: 'forwarderId',
  as: 'forwarder'
})

// 1 vessel can own or has many booking
// 1 booking can only belong to 1 vessel
Vessel.hasMany(Booking, {
  foreignKey: 'vesselId'
})
Booking.belongsTo(Vessel, {
  foreignKey: 'vesselId'
})

export default Booking
