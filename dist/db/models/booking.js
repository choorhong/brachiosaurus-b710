"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
const contact_1 = __importDefault(require("./contact"));
const vessel_1 = __importDefault(require("./vessel"));
const Booking = index_1.sequelize.define('bookings', {
    id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: sequelize_1.DataTypes.UUID,
        unique: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4
    },
    bookingId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    departure: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false
    },
    arrival: {
        type: sequelize_1.DataTypes.JSONB,
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
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true,
        defaultValue: []
    },
    slots: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
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
// 1 contact (forwarder) can own or has many booking
// 1 booking can only belong to 1 contact (forwarder)
contact_1.default.hasMany(Booking, {
    foreignKey: 'forwarderId'
});
// Might throw error if define in different file
Booking.belongsTo(contact_1.default, {
    foreignKey: 'forwarderId',
    as: 'forwarder'
});
// 1 vessel can own or has many booking
// 1 booking can only belong to 1 vessel
vessel_1.default.hasMany(Booking, {
    foreignKey: 'vesselId'
});
Booking.belongsTo(vessel_1.default, {
    foreignKey: 'vesselId'
});
exports.default = Booking;
