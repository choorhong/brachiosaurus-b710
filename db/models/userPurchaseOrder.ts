import { DataTypes } from 'sequelize'
import { sequelize } from './index'
import { UserPurchaseOrderInstance } from '../../types/purchase-order'

const UserPurchaseOrder = sequelize.define<UserPurchaseOrderInstance>(
  'user_purchase_orders',
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
    purchaseOrderUUId: {
      type: DataTypes.UUID
    }
  }
)

export default UserPurchaseOrder
