module.exports = (sequelize, DataTypes) => {
    const Catalogo = sequelize.define('Catalogo', {
        nome: DataTypes.STRING,
        descricao: DataTypes.STRING,
        preco: DataTypes.DECIMAL
    }, {});
    return Catalogo;
};
 


