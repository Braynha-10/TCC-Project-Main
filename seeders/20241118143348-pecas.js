'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('pecas', [
      {
        nome: 'Filtro de Óleo',
        descricao: 'Filtro de óleo para motores de carros, garantindo que o óleo permaneça limpo e eficaz.',
        preco: 50.00,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        nome: 'Pastilha de Freio',
        descricao: 'Pastilhas de freio de alta qualidade para garantir uma frenagem eficiente e segura.',
        preco: 200.00,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        nome: 'Amortecedor',
        descricao: 'Amortecedor para suspensão de veículos, garantindo a estabilidade e o conforto durante a direção.',
        preco: 350.00,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        nome: 'Pino do Coquilho',
        descricao: 'Pino do coquilho traseiro do guindaste zulein 75',
        preco: 600.00,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        nome: 'Pneu R15',
        descricao: 'Pneu 175/70 R15',
        preco: 360.00,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        nome: 'Oléo 5W30',
        descricao: 'Oléo de motor 5W30 para veículos de passeio, garantindo a lubrificação adequada do motor.',
        preco: 80.00,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pecas', null, {});
  }
};
