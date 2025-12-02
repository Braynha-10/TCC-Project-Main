module.exports = (sequelize, DataTypes) => {
    const Veiculo = sequelize.define('Veiculo', {
        modelo: DataTypes.STRING,
        marca: DataTypes.STRING,
        ano: DataTypes.INTEGER,
        id_cliente: DataTypes.INTEGER
    }, {});
    Veiculo.associate = function(models){
        Veiculo.belongsTo(models.Cliente, {foreignKey: 'id_cliente'})
        Veiculo.hasMany(models.Servico, {foreignKey: 'id_veiculo'})
    }
    return Veiculo;
};
 


