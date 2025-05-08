'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('123', salt);
    await queryInterface.bulkInsert('mecanicos', [
      {
        nome: 'Carlos Souza',
        telefone: '11987654321',
        email: 'carlos@gmail.com',
        senha: hash,
        especialidade: 'Retifica',
        salario: 3000.00,
        comissao: 500.00
      },
      {
        nome: 'Luciana Oliveira',
        telefone: '11976543210',
        email: 'luciana@gmail.com',
        senha: hash,
        especialidade: 'Suspensão e Direção',
        salario: 3500.00,
        comissao: 600.00
      },
      {
        nome: 'Roberto Lima',
        telefone: '11965432109',
        email: 'roberto@gmail.com',
        senha: hash,
        especialidade: 'Elétrica Automotiva',
        salario: 2800.00,
        comissao: 400.00
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('mecanicos', null, {});
  }
};



