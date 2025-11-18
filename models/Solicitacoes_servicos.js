module.exports = (sequelize, DataTypes) => {
    const Solicitacoes_servico = sequelize.define('Solicitacoes_servico', {
        id_mecanico: DataTypes.INTEGER,
        id_veiculo: DataTypes.INTEGER,
        // id_cliente: DataTypes.INTEGER,
        id_peca: DataTypes.INTEGER,
        tipo_pagamento: DataTypes.INTEGER,
        desconto: DataTypes.INTEGER,
        id_catalogo: DataTypes.INTEGER,
        descricao: DataTypes.STRING,
        status: {
            type: DataTypes.ENUM('PENDENTE', 'APROVADO', 'RECUSADO'),
            defaultValue: 'PENDENTE'
        }
    }, {});
        Solicitacoes_servico.associate = function(models) {
        Solicitacoes_servico.belongsTo(models.Mecanico, { foreignKey: 'id_mecanico' });
        // Solicitacoes_servico.belongsTo(models.Cliente, { foreignKey: 'id_cliente' });
        Solicitacoes_servico.belongsTo(models.Catalogo, { foreignKey: 'id_catalogo' });
        Solicitacoes_servico.belongsTo(models.Veiculo, { foreignKey: 'id_veiculo' });  
        Solicitacoes_servico.belongsTo(models.Peca, { foreignKey: 'id_peca' });
    };
    return Solicitacoes_servico;
};
