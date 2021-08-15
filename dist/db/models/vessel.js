"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
const Vessel = index_1.sequelize.define('vessels', {
    id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: sequelize_1.DataTypes.UUID,
        unique: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    earliestReturningDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    cutOff: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
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
exports.default = Vessel;
