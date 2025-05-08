module.exports = (sequelize, DataTypes) => {
    const Pagamento = sequelize.define('Pagamento', {
        tipo: DataTypes.INTEGER,
        valor: DataTypes.DOUBLE, //valor servicoCatalogo + peca
        desconto: DataTypes.DOUBLE,
        id_cliente: DataTypes.INTEGER,
        // id_servico: DataTypes.INTEGER, 
        status: DataTypes.BOOLEAN
    }, {});

    Pagamento.associate = function(models) {
        Pagamento.belongsTo(models.Cliente, {foreignKey: 'id_cliente'})
        // Pagamento.belongsTo(models.Servico, {foreignKey: 'id_servico'})
    }
    return Pagamento;
};