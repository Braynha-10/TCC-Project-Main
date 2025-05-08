'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('pagamentos', [
      {
        tipo: 1, // 1 pode representar um serviço de manutenção
        valor: 150, // Valor do serviço
        desconto: 10, // Desconto de 10% no serviço
        id_cliente: 1, // Cliente com ID 1 (ajuste conforme necessário)
        // id_servico: 1, // ID do serviço específico (ajuste conforme necessário)
        status: true, // Serviço concluído
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        tipo: 2, // 2 pode representar um serviço de reparo
        valor: 350, // Valor do serviço
        desconto: 20, // Desconto de 20% no serviço
        id_cliente: 2, // Cliente com ID 2 (ajuste conforme necessário)
        // id_servico: 2, // ID do serviço específico (ajuste conforme necessário)
        status: true, // Serviço concluído
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        tipo: 3, // 3 pode representar um serviço de diagnóstico
        valor: 100, // Valor do serviço
        desconto: 5, // Desconto de 5% no serviço
        id_cliente: 3, // Cliente com ID 3 (ajuste conforme necessário)
        // id_servico: 3, // ID do serviço específico (ajuste conforme necessário)
        status: false, // Serviço pendente
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pagamentos', null, {});
  }
};
