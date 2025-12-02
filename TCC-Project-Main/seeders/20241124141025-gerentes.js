'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('123', salt);
    await queryInterface.bulkInsert('gerentes', [
      {
        nome: 'Bryan',
        telefone: '1299999999',
        email: 'bryan@gmail.com',
        senha: hash,
        salario: 30000.00,
      },
      {
        nome: 'Arthur',
        telefone: '12988888888',
        email: 'arthur@gmail.com',
        senha: hash,
        salario: 35000.00,
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('gerentes', null, {});
  }
};



