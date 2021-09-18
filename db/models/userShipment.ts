import { DataTypes } from 'sequelize'
import { sequelize } from './index'
import { UserShipmentInstance } from '../../types/shipment'

const UserShipment = sequelize.define<UserShipmentInstance>(
  'user_shipments',
  {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      type: DataTypes.UUID
    },
    shipmentId: {
      type: DataTypes.UUID
    }
  }
)

export default UserShipment
