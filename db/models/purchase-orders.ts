import { DataTypes } from 'sequelize'
import { sequelize } from './index'
import { PurchaseOrderInstance, STATUS } from '../../types/purchase-order'
import Contact from './contact'
import User from './user'
import UserPurchaseOrder from './userPurchaseOrder'

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
    status: {
      type: DataTypes.ENUM(...statuses),
      allowNull: true,
      defaultValue: STATUS.CREATED
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true
    },
    vector: {
      type: 'TSVECTOR',
      allowNull: true
    }
  }
)

User.belongsToMany(PurchaseOrder, {
  through: UserPurchaseOrder,
  foreignKey: 'userId'
})
PurchaseOrder.belongsToMany(User, {
  through: UserPurchaseOrder,
  foreignKey: 'purchaseOrderUUId'
})

// 1 contact (vendor) can own or has many purchase orders
// 1 purchase order can only belong to 1 contact (vendor)
Contact.hasMany(PurchaseOrder, {
  foreignKey: 'vendorId',
  as: 'vendor'
})

PurchaseOrder.belongsTo(Contact, {
  foreignKey: 'vendorId', // if this is not included, the schema will try to return `contactId` which does not exist in purchase order.
  as: 'vendor' // this is needed because of " as: 'vendor' " in PurchaseOrder.findAll({ include: [{ model: Contact, as: 'vendor' }]})
  // else the returned data would be populated as "contact: {....}"
})

export default PurchaseOrder
