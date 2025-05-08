'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('solicitacoes_pecas', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            id_mecanico: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Mecanicos',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            nome: {
                type: Sequelize.STRING,
                allowNull: false
            },
            descricao: {
                type: Sequelize.STRING,
                allowNull: false
            },
            preco: {
                type: Sequelize.DOUBLE,
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('PENDENTE', 'APROVADO', 'RECUSADO'),
                defaultValue: 'PENDENTE'
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('solicitacoes_pecas');
    }
};
