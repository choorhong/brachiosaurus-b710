'use strict'
const { DataTypes } = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
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
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('bookings')
  }
}
