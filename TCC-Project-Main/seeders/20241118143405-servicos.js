'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('servicos', [
      {
        id_mecanico: 1, // Referência ao mecânico com ID 1 (Carlos Souza)
        id_veiculo: 1, // Referência ao veículo com ID 1 (Fusca 1971)
        id_catalogo: 1, // Referência ao serviço com ID 1 (Troca de Óleo e Filtro)
        id_peca: 1, // Referência à peça com ID 1 (Filtro de Óleo)
        id_pagamento: 1, // Referência ao pagamento com ID 1
        descricao: 'Troca de óleo e filtro realizada no Fusca 1971. O óleo foi trocado e o filtro de óleo foi substituído.',
        status: 'Concluído',
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        id_mecanico: 2, // Referência ao mecânico com ID 2 (Luciana Oliveira)
        id_veiculo: 2, // Referência ao veículo com ID 2 (Civic 2020)
        id_catalogo: 2, // Referência ao serviço com ID 2 (Alinhamento e Balanceamento)
        id_peca: null, // Não utilizou peça
        id_pagamento: 2, // Referência ao pagamento com ID 2
        descricao: 'Serviço de alinhamento e balanceamento realizado no Honda Civic 2020. Ajuste realizado nas rodas e suspensão.',
        status: 'Concluído',
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        id_mecanico: 3, // Referência ao mecânico com ID 3 (Roberto Lima)
        id_veiculo: 3, // Referência ao veículo com ID 3 (Fiesta 2015)
        id_catalogo: 3, // Referência ao serviço com ID 3 (Troca de Pastilhas de Freio)
        id_peca: 2, // Referência à peça com ID 2 (Pastilha de Freio)
        id_pagamento: 3, // Referência ao pagamento com ID 3
        descricao: 'Troca das pastilhas de freio no Ford Fiesta 2015. As pastilhas foram substituídas por novas.',
        status: 'Pendente',
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('servicos', null, {});
  }
};
