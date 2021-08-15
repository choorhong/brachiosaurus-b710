'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const vectorName = 'vector';
module.exports = {
    up: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        const transaction = yield queryInterface.sequelize.transaction();
        try {
            yield queryInterface.addColumn('purchaseOrders', `${vectorName}`, 'TSVECTOR', { transaction });
            yield queryInterface.sequelize.query(`UPDATE "purchaseOrders" SET ${vectorName} = to_tsvector("purchaseOrderId");`, { transaction });
            yield queryInterface.sequelize.query(`CREATE INDEX "purchaseOrders_search" ON "purchaseOrders" USING gin(${vectorName});`, { transaction });
            yield queryInterface.sequelize.query(`
        CREATE TRIGGER "purchaseOrders_vector_update"
        BEFORE INSERT OR UPDATE ON "purchaseOrders"
        FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger(${vectorName}, 'pg_catalog.simple', "purchaseOrderId");
      `, { transaction });
            yield transaction.commit();
        }
        catch (error) {
            yield transaction.rollback();
            throw error;
        }
    }),
    down: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        const transaction = yield queryInterface.sequelize.transaction();
        try {
            yield queryInterface.sequelize.query('DROP TRIGGER "purchaseOrders_vector_update" ON "purchaseOrders"', { transaction });
            yield queryInterface.sequelize.query('DROP INDEX "purchaseOrders_search";', { transaction });
            yield queryInterface.removeColumn('purchaseOrders', vectorName, { transaction });
            yield transaction.commit();
        }
        catch (error) {
            yield transaction.rollback();
            throw error;
        }
    })
};
