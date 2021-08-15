"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
const user_1 = require("../../types/user");
const User = index_1.sequelize.define('users', {
    id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: sequelize_1.DataTypes.UUID,
        unique: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4
    },
    email: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING
    },
    name: {
        allowNull: true,
        type: sequelize_1.DataTypes.STRING
    },
    status: {
        allowNull: false,
        defaultValue: user_1.STATUS.PENDING,
        type: sequelize_1.DataTypes.STRING
    },
    role: {
        allowNull: false,
        defaultValue: user_1.ROLES.EXECUTIVE,
        type: sequelize_1.DataTypes.STRING
    },
    firebaseUserId: {
        allowNull: true,
        type: sequelize_1.DataTypes.STRING
    }
});
exports.default = User;
