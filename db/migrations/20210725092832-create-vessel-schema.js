'use strict';
const { DataTypes } = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('vessels', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      earliestReturningDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      cutOff: {
        type: DataTypes.DATE,
        allowNull: false
      },
      remarks: {
        type: DataTypes.STRING,
        allowNull: true
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
    return queryInterface.dropTable('vessels')
  }
};
