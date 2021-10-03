'use strict';

const vectorName = 'vector'
const table = 'vessels'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn(table, `${vectorName}`, 'TSVECTOR', { transaction })
      await queryInterface.sequelize.query(`UPDATE ${table} SET ${vectorName} = to_tsvector(name);`, { transaction })
      await queryInterface.sequelize.query(`CREATE INDEX ${table}_search ON ${table} USING gin(${vectorName});`, { transaction })
      await queryInterface.sequelize.query(`
        CREATE TRIGGER ${table}_vector_update
        BEFORE INSERT OR UPDATE ON ${table}
        FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger(${vectorName}, 'pg_catalog.simple', name);
      `, { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.sequelize.query(`DROP TRIGGER ${table}_vector_update ON ${table}`, { transaction })
      await queryInterface.sequelize.query(`DROP INDEX ${table}_search;`, { transaction })
      await queryInterface.removeColumn(table, vectorName, { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
};
