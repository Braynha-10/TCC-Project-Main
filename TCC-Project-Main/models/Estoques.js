module.exports = (sequelize, DataTypes) => {
  const Estoque = sequelize.define(
    "Estoque",
    {
      produtoId: DataTypes.INTEGER,
      quantidade: DataTypes.INTEGER,
      capacidade: DataTypes.INTEGER,
    },
    {}
  );
  Estoque.associate = function (models) {
    Estoque.belongsTo(models.Peca, { foreignKey: "produtoId" });
  };
  return Estoque;
};
