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
        return queryInterface.createTable('bookings', {
            id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: DataTypes.UUID,
                unique: true
            },
            bookingId: {
                type: DataTypes.STRING,
                allowNull: false
            },
            departureETD: {
                type: DataTypes.DATE,
                allowNull: true
            },
            departureLocation: {
                type: DataTypes.STRING,
                allowNull: true
            },
            arrivalETA: {
                type: DataTypes.DATE,
                allowNull: true
            },
            arrivalLocation: {
                type: DataTypes.STRING,
                allowNull: true
            },
            users: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: false,
                defaultValue: []
            },
            slots: {
                type: DataTypes.STRING,
                allowNull: true
            },
            remarks: {
                type: DataTypes.STRING,
                allowNull: true
            },
            forwarderId: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'contacts',
                    key: 'id'
                },
                as: 'forwarder',
                onDelete: 'SET NULL'
            },
            vesselId: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'vessels',
                    key: 'id'
                },
                onDelete: 'SET NULL'
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE
            }
        });
    }),
    down: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        return queryInterface.dropTable('bookings');
    })
};
