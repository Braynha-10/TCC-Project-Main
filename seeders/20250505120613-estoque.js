'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('estoques', [
      {
        produtoId: 1, // Referência à peça com ID 1 (Filtro de Óleo)
        quantidade: 5,
        capacidade: 10,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        produtoId: 2, // Referência à peça com ID 2 (Pastilha de Freio)
        quantidade: 3,
        capacidade: 5,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        produtoId: 3, // Referência à peça com ID 3 (Amortecedor)
        quantidade: 2,
        capacidade: 4,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        produtoId: 4, // Referência à peça com ID 4 (Pino do Coquilho)
        quantidade: 1,
        capacidade: 2,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        produtoId: 5, // Referência à peça com ID 5 (Pneu R15)
        quantidade: 5,
        capacidade: 10,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        produtoId: 6, // Referência à peça com ID 6 (Óleo 5W30)
        quantidade: 9,
        capacidade: 20,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
