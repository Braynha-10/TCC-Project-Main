module.exports = (sequelize, DataTypes) => {
    const Cliente = sequelize.define('Cliente', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nome: DataTypes.STRING,
        telefone: DataTypes.STRING,
        email: DataTypes.STRING,
        endereco: DataTypes.STRING
    }, {});

    Cliente.associate = function(models) {
        Cliente.hasMany(models.Pagamento, { foreignKey: 'id_cliente' });
        Cliente.hasMany(models.Veiculo, {foreignKey: 'id_cliente'});
    };

    return Cliente;
};