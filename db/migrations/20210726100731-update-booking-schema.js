'use strict'
const { DataTypes } = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
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
        type: 'INTEGER USING CAST("slots" as INTEGER)', // DataTypes.INTEGER resulted in 'column "slots" cannot be cast automatically to type integer', not sure why?
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
    ])
  },

  down: async (queryInterface, Sequelize) => {
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
    ])
  }
}
