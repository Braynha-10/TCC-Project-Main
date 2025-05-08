'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('catalogos', [
      {
        nome: 'Troca de Óleo e Filtro de Óleo',
        descricao: 'Serviço de troca de óleo do motor e substituição do filtro de óleo, essencial para o bom funcionamento do motor.',
        preco: 120.00
      },
      {
        nome: 'Alinhamento e Balanceamento',
        descricao: 'Serviço de alinhamento e balanceamento das rodas, garantindo a segurança e o conforto ao dirigir, além de evitar o desgaste irregular dos pneus.',
        preco: 150.00
      },
      {
        nome: 'Troca de Pastilhas de Freio',
        descricao: 'Substituição das pastilhas de freio para garantir que o sistema de frenagem funcione corretamente e com segurança.',
        preco: 200.00
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('catalogos', null, {});
  }
};