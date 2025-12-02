'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("solicitacoes_pecas", "quantidade", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("solicitacoes_pecas", "quantidade");
  },
};
