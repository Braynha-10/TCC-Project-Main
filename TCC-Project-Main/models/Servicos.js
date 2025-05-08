module.exports = (sequelize, DataTypes) => {
    const Servico = sequelize.define('Servico', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        id_mecanico: DataTypes.INTEGER,
        id_veiculo: DataTypes.INTEGER,
        id_catalogo: DataTypes.INTEGER,
        id_peca: DataTypes.INTEGER,
        id_pagamento: DataTypes.INTEGER,
        descricao: DataTypes.STRING,
        status: DataTypes.STRING,
    }, {});
    Servico.associate = function(models) {
        Servico.belongsTo(models.Mecanico, {foreignKey: 'id_mecanico'}),
        Servico.belongsTo(models.Veiculo, {foreignKey: 'id_veiculo'}),
        Servico.belongsTo(models.Catalogo, {foreignKey: 'id_catalogo'}),
        Servico.belongsTo(models.Peca, {foreignKey: 'id_peca'}),
        Servico.belongsTo(models.Pagamento, {foreignKey: 'id_pagamento'})
    };
    return Servico;
};
 
