'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('clientes', [
      {
        nome: 'Arthur morgan',
        telefone: '11987654321',
        email: 'arthur.morgan@example.com',
        endereco: 'Rua A, 123, São Paulo, SP'
      },
      {
        nome: 'Bryan Santos',
        telefone: '11976543210',
        email: 'bryan.santos@example.com',
        endereco: 'Avenida B, 456, São Paulo, SP'
      },
      {
        nome: 'Carlos Pereira',
        telefone: '11965432109',
        email: 'carlos.pereira@example.com',
        endereco: 'Praça C, 789, São Paulo, SP'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('clientes', null, {});
  }
};
