'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { DataTypes } = require('sequelize');
module.exports = {
    up: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        return Promise.all([
            queryInterface.changeColumn('bookings', 'id', {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                autoIncrement: false,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            }),
            queryInterface.changeColumn('bookings', 'slots', {
                type: 'INTEGER USING CAST("slots" as INTEGER)',
                allowNull: true
            }),
            queryInterface.changeColumn('bookings', 'users', {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: true,
                defaultValue: []
            }),
            queryInterface.addColumn('bookings', 'departure', {
                type: DataTypes.JSONB,
                allowNull: false
            }),
            queryInterface.addColumn('bookings', 'arrival', {
                type: DataTypes.JSONB,
                allowNull: false
            }),
            queryInterface.removeColumn('bookings', 'departureETD'),
            queryInterface.removeColumn('bookings', 'departureLocation'),
            queryInterface.removeColumn('bookings', 'arrivalETA'),
            queryInterface.removeColumn('bookings', 'arrivalLocation')
        ]);
    }),
    down: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        return Promise.all([
            queryInterface.changeColumn('bookings', 'id', {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                autoIncrement: false,
                unique: true
            }),
            queryInterface.changeColumn('bookings', 'slots', {
                type: DataTypes.STRING,
                allowNull: true
            }),
            queryInterface.changeColumn('bookings', 'users', {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: false,
                defaultValue: []
            }),
            queryInterface.removeColumn('bookings', 'departure'),
            queryInterface.removeColumn('bookings', 'arrival'),
            queryInterface.addColumn('bookings', 'departureETD', {
                type: DataTypes.DATE,
                allowNull: true
            }),
            queryInterface.addColumn('bookings', 'departureLocation', {
                type: DataTypes.STRING,
                allowNull: true
            }),
            queryInterface.addColumn('bookings', 'arrivalETA', {
                type: DataTypes.DATE,
                allowNull: true
            }),
            queryInterface.addColumn('bookings', 'arrivalLocation', {
                type: DataTypes.STRING,
                allowNull: true
            })
        ]);
    })
};
