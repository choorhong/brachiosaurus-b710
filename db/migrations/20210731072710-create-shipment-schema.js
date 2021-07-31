'use strict';
const { DataTypes } = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
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
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('shipments')
  }
};
