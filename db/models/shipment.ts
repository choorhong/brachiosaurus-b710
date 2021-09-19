import { DataTypes } from 'sequelize'
import { sequelize } from './index'
import { ShipmentInstance, ShipmentStatus } from '../../types/shipment'
import PurchaseOrder from './purchase-orders'
import Booking from './booking'
import Contact from './contact'
import User from './user'
import UserShipment from './userShipment'

const Shipment = sequelize.define<ShipmentInstance>(
  'shipments',
  {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
      defaultValue: DataTypes.UUIDV4
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ShipmentStatus.CREATED
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true
    },
    container: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }
)

User.belongsToMany(Shipment, {
  through: UserShipment,
  foreignKey: 'userId'
})
Shipment.belongsToMany(User, {
  through: UserShipment,
  foreignKey: 'shipmentId'
})

PurchaseOrder.hasMany(Shipment, {
  foreignKey: 'purchaseOrderId'
})
Shipment.belongsTo(PurchaseOrder, {
  foreignKey: 'purchaseOrderId'
})

Contact.hasMany(Shipment, {
  foreignKey: 'vendorId'
})
Shipment.belongsTo(Contact, {
  foreignKey: 'vendorId',
  as: 'vendor'
})

Booking.hasMany(Shipment, {
  foreignKey: 'bookingId'
})
Shipment.belongsTo(Booking, {
  foreignKey: 'bookingId'
})

export default Shipment
