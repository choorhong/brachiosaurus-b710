"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
const Contact = index_1.sequelize.define('contacts', {
    id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: sequelize_1.DataTypes.UUID,
        unique: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4
    },
    name: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING
    },
    roles: {
        allowNull: false,
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING)
    },
    remarks: {
        allowNull: true,
        type: sequelize_1.DataTypes.STRING
    },
    vector: {
        type: 'TSVECTOR',
        allowNull: true
    }
});
exports.default = Contact;
