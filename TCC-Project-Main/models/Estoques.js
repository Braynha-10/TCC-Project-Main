const { Solicitacoes_peca, Pecas, sequelize } = require('./index');

module.exports = (sequelize, DataTypes) => {
  const Estoque = sequelize.define(
    "Estoque",
    {
      produtoId: DataTypes.INTEGER,
      quantidade: DataTypes.INTEGER,
      capacidade: DataTypes.INTEGER,
    },
  );
  
  /**
   * Metodo para reduzir quantidade no estoque 
   * @param {*} qtd 
   */
  Estoque.prototype.reduzirQuantidade = async function(qtd = 1) {
    if (this.quantidade - qtd < 0) {
      await this.tamoSemPeca();
      throw new Error('Estoque insuficiente para a quantidade solicitada');
    }
    // Atualiza a quantidade no estoque
    this.quantidade -= qtd;
    await this.save();
  };

  Estoque.prototype.abastecerEstoque = async function() {
    if(this.quantidade >= this.capacidade) {
      throw new Error('Capacidade maxima ja atingida!');
    }

    this.quantidade = this.capacidade;
    await this.save();
  }

  Estoque.prototype.tamoSemPeca = async function() {
    console.log(this.produtoId);
    
    // Buscar a peça associada ao estoque
    const peca = await sequelize.models.Peca.findByPk(this.produtoId);  // Corrigido para Peca (singular)
    if (!peca) {
      throw new Error('Peça não encontrada!');
    }
    
    // Criar a solicitação de peça
    const solicitacaoEncherEstoque = await sequelize.models.Solicitacoes_peca.create({
      id_mecanico: 1,
      nome: peca.nome,
      descricao: peca.descricao,
      preco: peca.preco,
      status: 'PENDENTE',
    });

    console.log(solicitacaoEncherEstoque);  // Verificando a solicitação criada
  }
  

  Estoque.associate = function (models) {
    Estoque.belongsTo(models.Peca, { foreignKey: "produtoId" });
  };
  return Estoque;
};
