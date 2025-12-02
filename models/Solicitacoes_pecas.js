module.exports = (sequelize, DataTypes) => {
    const Solicitacoes_peca = sequelize.define('Solicitacoes_peca', {
        nome: DataTypes.STRING,
        descricao: DataTypes.STRING,
        preco: DataTypes.DOUBLE,
        quantidade: DataTypes.INTEGER,
        status: {
            type: DataTypes.ENUM('pendente', 'aprovado', 'recusado'),
            defaultValue: 'pendente'
        }
    }, {});
        Solicitacoes_peca.associate = function(models) {
        Solicitacoes_peca.belongsTo(models.Mecanico, { foreignKey: 'id_mecanico' });
    };
    return Solicitacoes_peca;
};
