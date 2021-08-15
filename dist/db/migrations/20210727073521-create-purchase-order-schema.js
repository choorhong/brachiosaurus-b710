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
module.exports = {
    up: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        return queryInterface.createTable('purchaseOrders', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                unique: true,
                defaultValue: Sequelize.UUIDV4
            },
            purchaseOrderId: {
                type: Sequelize.STRING,
                allowNull: false
            },
            users: {
                type: Sequelize.ARRAY(Sequelize.STRING),
                allowNull: true,
                defaultValue: []
            },
            status: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: 'CREATED'
            },
            remarks: {
                type: Sequelize.STRING,
                allowNull: true
            },
            vendorId: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'contacts',
                    key: 'id'
                },
                as: 'vendor',
                onDelete: 'SET NULL'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    }),
    down: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        return queryInterface.dropTable('purchaseOrders');
    })
};
