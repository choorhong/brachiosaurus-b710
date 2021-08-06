'use strict';

const vectorName = 'vector'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn('purchaseOrders', `${vectorName}`, 'TSVECTOR', { transaction })
      await queryInterface.sequelize.query(`UPDATE "purchaseOrders" SET ${vectorName} = to_tsvector("purchaseOrderId");`, { transaction })
      await queryInterface.sequelize.query(`CREATE INDEX "purchaseOrders_search" ON "purchaseOrders" USING gin(${vectorName});`, { transaction })
      await queryInterface.sequelize.query(`
        CREATE TRIGGER "purchaseOrders_vector_update"
        BEFORE INSERT OR UPDATE ON "purchaseOrders"
        FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger(${vectorName}, 'pg_catalog.simple', "purchaseOrderId");
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
      await queryInterface.sequelize.query('DROP TRIGGER "purchaseOrders_vector_update" ON "purchaseOrders"', { transaction })
      await queryInterface.sequelize.query('DROP INDEX "purchaseOrders_search";', { transaction })
      await queryInterface.removeColumn('purchaseOrders', vectorName, { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
};
