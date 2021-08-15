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
        return queryInterface.createTable('shipments', {
            id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: DataTypes.UUID,
                unique: true
            },
            status: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: 'CREATED'
            },
            users: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: false,
                defaultValue: []
            },
            remarks: {
                type: DataTypes.STRING,
                allowNull: true
            },
            container: {
                type: DataTypes.STRING,
                allowNull: true
            },
            purchaseOrderId: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'purchaseOrders',
                    key: 'id'
                },
                as: 'purchaseOrder',
                onDelete: 'SET NULL'
            },
            vendorId: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'contacts',
                    key: 'id'
                },
                onDelete: 'SET NULL'
            },
            bookingId: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'bookings',
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
        return queryInterface.dropTable('shipments');
    })
};
