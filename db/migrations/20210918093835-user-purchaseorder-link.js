'use strict'
const { DataTypes } = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('purchaseOrders', 'users'),
      queryInterface.createTable('user_purchase_orders', {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: DataTypes.UUID,
          unique: true
        },
        userId: {
          type: DataTypes.UUID,
          references: {
            model: 'users',
            key: 'id'
          },
          as: 'userId'
        },
        purchaseOrderUUId: {
          type: DataTypes.UUID,
          references: {
            model: 'purchaseOrders',
            key: 'id'
          },
          as: 'purchaseOrderUUId'
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE
        }
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_purchase_orders')
  }
};
