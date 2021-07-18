'use strict';
const { DataTypes } = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true
      },
      email: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      name: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      status: {
        allowNull: true,
        type: DataTypes.UUID
      },
      role: {
        allowNull: false,
        defaultValue: 'EXECUTIVE',
        type: DataTypes.STRING
      },
      firebaseUserId: {
        allowNull: true,
        type: DataTypes.STRING
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users')
  }
};
