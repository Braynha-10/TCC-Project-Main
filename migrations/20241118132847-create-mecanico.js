'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('mecanicos', { 
      id: {
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      telefone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      senha: {
        type: Sequelize.STRING,
        allowNull: false
      },
      especialidade: {
        type: Sequelize.STRING,
        allowNull: false
      },
      salario: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      comissao: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull:false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue:  Sequelize.fn('NOW')
      }
    });
  },

  async down (queryInterface, Sequelize) {

     await queryInterface.dropTable('mecanicos');

  }
};