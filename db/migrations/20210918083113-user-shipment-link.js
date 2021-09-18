'use strict'
const { DataTypes } = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('shipments', 'users'),
      queryInterface.createTable('user_shipments', {
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
          as: 'userId',
          onDelete: 'CASCADE'
        },
        shipmentId: {
          type: DataTypes.UUID,
          references: {
            model: 'shipments',
            key: 'id'
          },
          as: 'shipmentId',
          onDelete: 'CASCADE'
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
    return queryInterface.dropTable('user_shipments')
  }
};
