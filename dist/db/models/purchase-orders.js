"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
const purchase_order_1 = require("../../types/purchase-order");
const contact_1 = __importDefault(require("./contact"));
const statuses = Object.values(purchase_order_1.STATUS);
const PurchaseOrder = index_1.sequelize.define('purchaseOrders', {
    id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: sequelize_1.DataTypes.UUID,
        unique: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4
    },
    purchaseOrderId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    users: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true,
        defaultValue: []
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...statuses),
        allowNull: true,
        defaultValue: purchase_order_1.STATUS.CREATED
    },
    remarks: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    vector: {
        type: 'TSVECTOR',
        allowNull: true
    }
});
// 1 contact (vendor) can own or has many purchase orders
// 1 purchase order can only belong to 1 contact (vendor)
contact_1.default.hasMany(PurchaseOrder, {
    foreignKey: 'vendorId',
    as: 'vendor'
});
PurchaseOrder.belongsTo(contact_1.default, {
    foreignKey: 'vendorId',
    as: 'vendor' // this is needed because of " as: 'vendor' " in PurchaseOrder.findAll({ include: [{ model: Contact, as: 'vendor' }]})
    // else the returned data would be populated as "contact: {....}"
});
exports.default = PurchaseOrder;
