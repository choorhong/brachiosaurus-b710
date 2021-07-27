import { DataTypes } from 'sequelize'
import { sequelize } from './index'
import { PurchaseOrderInstance, STATUS } from '../../types/purchase-order'
import Contact from './contact'

const statuses = Object.values(STATUS)

const PurchaseOrder = sequelize.define<PurchaseOrderInstance>(
  'purchaseOrders',
  {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
      defaultValue: DataTypes.UUIDV4
    },
    purchaseOrderId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    users: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    status: {
      type: DataTypes.ENUM(...statuses),
      allowNull: true,
      defaultValue: STATUS.CREATED
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }
)

// 1 contact (vendor) can own or has many purchase orders
// 1 purchase order can only belong to 1 contact (vendor)
Contact.hasMany(PurchaseOrder, {
  foreignKey: 'vendorId',
  as: 'vendor'
})

PurchaseOrder.belongsTo(Contact)

export default PurchaseOrder