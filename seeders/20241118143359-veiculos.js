'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('veiculos', [
      {
        modelo: 'Fusca 1971',
        marca: 'Volkswagen',
        ano: 1971,
        id_cliente: 1, // Referência ao cliente com ID 1 (ajuste conforme necessário)
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        modelo: 'Civic 2020',
        marca: 'Honda',
        ano: 2020,
        id_cliente: 2, // Referência ao cliente com ID 2 (ajuste conforme necessário)
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        modelo: 'Fiesta 2015',
        marca: 'Ford',
        ano: 2015,
        id_cliente: 3, // Referência ao cliente com ID 3 (ajuste conforme necessário)
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('veiculos', null, {});
  }
};
