'use strict';
const { DataTypes } = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('contacts', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true
      },
      companyName: {
        allowNull: false,
        type: DataTypes.STRING
      },
      roles: {
        allowNull: false,
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      remarks: {
        allowNull: true,
        type: DataTypes.STRING
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('contacts')
  }
};
