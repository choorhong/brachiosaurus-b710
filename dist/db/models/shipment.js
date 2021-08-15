"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
const shipment_1 = require("../../types/shipment");
const purchase_orders_1 = __importDefault(require("./purchase-orders"));
const booking_1 = __importDefault(require("./booking"));
const contact_1 = __importDefault(require("./contact"));
const Shipment = index_1.sequelize.define('shipments', {
    id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: sequelize_1.DataTypes.UUID,
        unique: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: shipment_1.ShipmentStatus.CREATED
    },
    users: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true,
        defaultValue: []
    },
    remarks: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    container: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
});
purchase_orders_1.default.hasMany(Shipment, {
    foreignKey: 'purchaseOrderId'
});
Shipment.belongsTo(purchase_orders_1.default, {
    foreignKey: 'purchaseOrderId'
});
contact_1.default.hasMany(Shipment, {
    foreignKey: 'vendorId'
});
Shipment.belongsTo(contact_1.default, {
    foreignKey: 'vendorId',
    as: 'vendor'
});
booking_1.default.hasMany(Shipment, {
    foreignKey: 'bookingId'
});
Shipment.belongsTo(booking_1.default, {
    foreignKey: 'bookingId'
});
exports.default = Shipment;
