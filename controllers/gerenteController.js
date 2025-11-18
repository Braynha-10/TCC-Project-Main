const { Mecanico, Peca, Servico, Veiculo, Pagamento, Catalogo, Gerente, Cliente, Solicitacoes_peca, Solicitacoes_servico, Estoque, sequelize } = require('../models');
const { get } = require('../routes/gerenteRoutes');
const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');




//Metodos Mecanico
const listarMecanicos = async(req,res) => {
    try{
        const mecanicos = await Mecanico.findAll();
        res.render('mecanico/listar', {mecanicos});
    } catch (error){
        console.error('Erro ao listar mecanicos: ', error);
        res.status(500).json({error: 'Erro ao listar mecanicos'});
    }
}

const getEditarMecanico = async(req, res) => {
    const {id} = req.params;

    try{
        const mecanico = await Mecanico.findByPk(id);
        if(!mecanico){
            return res.status(404).send('Mecanico nao encontrado!');
        }
        
        res.render('mecanico/cadastro', {mecanico});
    } catch (error){
        console.error('Erro ao buscar mecanico: ', error);
        res.status(500).json({error: 'Erro ao buscar mecanico'});
    }
}

const atualizarMecanico = async(req,res) => {
    const {id} = req.params;
    const {nome, telefone, email, senha, salario, comissao, especialidade} = req.body;

    try {
        const mecanico = await Mecanico.findByPk(id);
        if (!mecanico) {
            Mecanico.create({nome, telefone, email, senha, salario, comissao, especialidade});
        }
        await mecanico.update({nome, telefone, email, senha, salario, comissao, especialidade});
        res.redirect('/gerente/painelGerente');
    } catch (error){
        console.error('Erro ao atualizar mecânico: ', error);
        res.status(500).json({ error: 'Erro ao atualizar mecânico' });
    }
}

const deletarMecanico = async (req, res) => {
    const {id} = req.params;
    try {
        Mecanico.destroy({where: {id: id}});
        res.redirect('/gerente/painelGerente');
    } catch (error) { 
        console.error('Erro ao deletar mecanico: ', error);
        res.status(500).json({error: 'Erro ao deletar mecanico'}); 
    }
}


const cadastrarPeca = async(req, res) => {
    const {nome, descricao, preco} = req.body;
    try{
        const user = await Peca.findOne({where: {nome: nome}});
        if(!user){
            await Peca.create({nome, descricao, preco});
            res.redirect('/gerente/painelGerente');
        } else {
            res.send('<h1>Ja existe uma peca cadastrada com esse nome!</h1>')
        }
    } catch(error){
        console.error('Erro ao cadastrar peca: ', error);
        res.status(500).json({error: 'Erro ao cadastrar peca'})
    }
};

const listarPeca = async (req, res) => {
    try{
        const pecas = await Peca.findAll();
        res.render('pecas/listar', {pecas});
    } catch(error){
        console.error('Erro ao listar as pecas: ', error);
        res.status(500).json({error: "Erro ao listar Pecas"})
    }
}

const getModificaPeca = async(req, res) => {
    const {id} = req.params;
    if(!id){
        return res.render('pecas/cadastro');
    }
    try{
        const peca = await Peca.findByPk(id);
        
        if(!peca){
            return res.status(404).send('Peca nao encontrada!');
        }
        console.log(peca.id)
        res.render('pecas/cadastro', {peca});
    } catch (error){
        console.error('Erro ao buscar peca: ', error);
        res.status(500).json({error: 'Erro ao buscar peca'});
    }
}

const modificaPeca = async(req,res) => {
    const {id} = req.params;
    const {nome, descricao, preco} = req.body;

    try {
        const peca = await Peca.findByPk(id);
        if (!peca) {
            res.status(404).json({error: "peca nao encontrada!"})
        }
        await peca.update({nome, descricao, preco});
        res.redirect('/gerente/painelGerente');
    } catch (error){
        console.error('Erro ao atualizar peca: ', error);
        res.status(500).json({ error: 'Erro ao atualizar peca' });
    }
}

const deletarPeca = async (req, res) => {
    const {id} = req.params;
    try {
        Peca.destroy({where: {id: id}});
        res.redirect('/gerente/painelGerente');
    } catch (error) { 
        console.error('Erro ao deletar peca: ', error);
        res.status(500).json({error: 'Erro ao deletar peca'}); 
    }
}


const listarServico = async(req,res) => {
    try{
        const servicos = await Servico.findAll({
            include: [
                {model:Veiculo, include: Cliente},
                {model:Mecanico},
                {model:Peca},
                // {model:Pagamento},
                {model:Catalogo},
            ]
        });
        console.log(JSON.stringify(servicos, null, 2));

        res.render('servicos/listar', {servicos, gerente: false}); 
    } catch(error){
        console.error('Erro ao listar as servicos: ', error);
        res.status(500).json({error: "Erro ao listar Servicos"})
    }
}

//pdf da ordem de servico
const ordemServico = async (req, res) => {

    try {
        const { id } = req.params;

        // Buscar informações do serviço pelo ID
        const servico = await Servico.findOne({
            where: { id },
            include: [
                { model: Veiculo, include: Cliente },
                { model: Catalogo },
                { model: Peca },
                { model: Pagamento },
                { model: Mecanico },
            ]
        });

        if (!servico) {
            return res.status(404).send("Serviço não encontrado.");
        }

        // Criar o documento PDF
        const doc = new PDFDocument();

        // Configura o cabeçalho de resposta para abrir o PDF no navegador
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=servico_${id}.pdf`);

        // Envia o PDF diretamente para a resposta
        doc.pipe(res);

        // Adiciona conteúdo ao PDF
        doc.fontSize(16).text(`Detalhes do Serviço - ID: ${id}`, { align: 'center' });
        doc.moveDown();
        doc.text(`Mecânico: ${servico.Mecanico.nome}`);
        doc.text(`Veículo: ${servico.Veiculo.modelo}`);
        doc.text(`Cliente: ${servico.Veiculo.Cliente.nome}`);
        doc.text(`Peça: ${servico.Peca ? servico.Peca.nome : "Não utilizado"}`);
        doc.text(`Serviço: ${servico.Catalogo.nome}`);
        doc.text(`Descrição: ${servico.descricao}`);
        doc.text(`Status: ${servico.status}`);
        doc.moveDown();
        doc.text("Pagamento:");
        doc.text(`Tipo: ${servico.Pagamento.tipo === 0 ? 'Credito' : servico.Pagamento.tipo === 1 ? 'Débito' : 'Dinheiro/Pix'}`);
        doc.text(`Valor: R$ ${servico.Pagamento.valor.toFixed(2)}`);
        doc.end(); // Finaliza o documento PDF
    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        res.status(500).send("Erro ao gerar PDF.");
    }
};



//Methods Gerente
const cadastrarGerente = async (req, res) => {
    const {nome, telefone, email, salario, senha} = req.body;
    try{
        const user = await Gerente.findOne({where: {email:email}});
        if(!user){
            await Gerente.create({nome, telefone, email, salario, senha});
            res.redirect('/gerente/painelGerente');
        } else {
            res.send("<h1>Gerente ja cadastrado com esse email!</h1>")
        }
    } catch (error){
        console.error('Erro ao cadastrar gerente: ', error);
        res.status(500).json({error: 'Erro ao cadastrar gerente'})
    }
}

const deletarGerente = async (req, res) => {
    const {id} = req.params;
    try{
        Gerente.destroy({where: {id: id}})
        res.redirect('/gerente/painelGerente');
    } catch (error) { 
        console.error('Erro ao deletar gerente: ', error);
        res.status(500).json({error: 'Erro ao deletar gerente'}); 
    }
}

const atualizarGerente = async(req,res) => {
    const {id} = req.params;
    const {nome, telefone, email, senha, salario} = req.body;

    try {
        const gerente = await Gerente.findByPk(id);
        if (!gerente) {
            res.status(404).json({error: "Gerente nao encontrado!"})
        }
        await gerente.update({nome, telefone, email, senha, salario});
        res.redirect('/gerente/painelGerente');
    } catch (error){
        console.error('Erro ao atualizar gerente: ', error);
        res.status(500).json({ error: 'Erro ao atualizar gerente' });
    }
}

const getEditarGerente = async(req, res) => {
    const {id} = req.params;
    if(!id){
        return res.render('gerente/cadastro');
    }
    try{
        const gerente = await Gerente.findByPk(id);
        
        if(!gerente){
            return res.status(404).send('Gerente nao encontrado!');
        }
        console.log(gerente.id)
        res.render('gerente/cadastro', {gerente});
    } catch (error){
        console.error('Erro ao buscar gerente: ', error);
        res.status(500).json({error: 'Erro ao buscar gerente'});
    }
}


const listarGerente = async (req, res) => {
    try{
        const gerentes = await Gerente.findAll();
        res.render("gerente/listar", {gerentes: gerentes});
    } catch(error) {
        console.error('Erro ao listar Gerentes: ', error);
        res.status(500).json({error: "Erro ao listar Gerentes"})
    }
}



const processarSolicitacaoPeca = async (req, res) => {
    const {solicitacaoId, status} = req.body;

    const transaction = await sequelize.transaction();
    const solicitacao = await Solicitacoes_peca.findByPk(solicitacaoId);
    if (!solicitacao){
        await transaction.rollback();
        return res.status(404).send('Solicitacao nao encontrada!');
    }

    const statusNormalized = (status || '').toString().toUpperCase();

    if (statusNormalized === "APROVADO") {
        try {
            const peca = await Peca.findOne({
                where: {
                    nome: {
                        [Op.like]: `%${solicitacao.nome}%`
                    }
                }
            });

            if (peca){
                const pecaEstoque = await Estoque.findOne({
                    where: { produtoId: peca.id },
                    transaction
                });
                if(!pecaEstoque){
                    await Estoque.create({
                        produtoId: peca.id,
                        capacidade: 5,
                        quantidade: 0,
                    }, { transaction });
                } else {
                    if(pecaEstoque.quantidade >= pecaEstoque.capacidade) {
                        await transaction.rollback();
                        return res.status(400).send('Capacidade maxima preenchida!');
                    }
                    await pecaEstoque.abastecerEstoque();
                }
            } else {
                const novaPeca = await Peca.create({
                    nome: solicitacao.nome,
                    descricao: solicitacao.descricao,
                    preco: solicitacao.preco
                }, { transaction });

                await Estoque.create({
                    produtoId: novaPeca.id,
                    capacidade: 5,
                    quantidade: 5,
                }, { transaction });
            }

            solicitacao.status = 'APROVADO';
            await solicitacao.save({ transaction });

            await transaction.commit();
            return res.redirect("/gerente/pecas/solicitacoes");
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({error: error.message});
        }
    } else {
        try {
            solicitacao.status = 'RECUSADO';
            await solicitacao.save({ transaction });
            await transaction.commit();
            return res.redirect("/gerente/pecas/solicitacoes");
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({error: error.message});
        }
    }
};


const listarSolicitacoesServicos = async (req, res) =>{
    try {
        const servicos = await Solicitacoes_servico.findAll({
            include: [
                { model: Veiculo, include: Cliente },
                {model: Catalogo},
                {model: Peca},
                {model: Mecanico},
            ]
        });
        const gerente = true
        res.render('servico/listaServicos', { Servico: servicos, gerente });
    } catch (error) {
        console.error('Erro ao listar as solicitações de serviço: ', error);
        res.status(500).send("Erro ao listar as solicitações de serviço");
    }
}

const processarSolicitacaoServicos = async (req, res) => {
    const {idServico, status} = req.body;

    const transaction = await sequelize.transaction();
    const solicitacaoServico = await Solicitacoes_servico.findByPk(idServico, {
        include: [
            {model: Veiculo, include: Cliente},
            {model: Catalogo},
            {model: Peca},
            {model: Mecanico},
        ]
    });
    if(!solicitacaoServico){
        return res.status(404).send('Solicitacao de Servico nao encontrada!');
    }
    if(status === "APROVADO"){
        try {
            const novoPagamento = await Pagamento.create({
                /*tipoPagamento, valor, desconto, id_cliente, status(boolean)*/
                tipo: solicitacaoServico.tipo_pagamento,
                valor: parseFloat(solicitacaoServico.Peca.preco) + parseFloat(solicitacaoServico.Catalogo.preco),
                desconto: solicitacaoServico.desconto,
                id_cliente: solicitacaoServico.Veiculo.id_cliente,
                status: false,
            }, {transaction})

            const novoServico = await Servico.create({
                id_mecanico: solicitacaoServico.id_mecanico,
                id_veiculo: solicitacaoServico.id_veiculo,
                id_catalogo: solicitacaoServico.id_catalogo,
                id_peca:solicitacaoServico.id_peca || null,
                id_pagamento: novoPagamento.id,
                descricao: solicitacaoServico.descricao,
                status: 'Pendente',
            })
            if(solicitacaoServico.id_peca){
                const peca = await Estoque.findOne({
                    where: {
                        produtoId: solicitacaoServico.id_peca 
                    }, transaction
                });

                if(!peca){
                    return res.status(404).send('Peca nao encontrada!');
                }
                
                await peca.reduzirQuantidade();
                
            }

            solicitacaoServico.status = 'APROVADO';
            await solicitacaoServico.save({transaction});
            await transaction.commit();
            
            res.redirect("/gerente/servicos/solicitacoes");

        } catch (error) {
            await transaction.rollback();
                return res.status(500).json({error: error.message})
        } 
    } else {
        solicitacaoServico.status = 'RECUSADO';
        await solicitacaoServico.save({transaction});
        await transaction.commit();
        res.redirect("/gerente/servicos/solicitacoes");
    }
}

exports.alterarSolicitacaoPeca = async (req, res) => {
  try {
    console.log('POST /gerente/pecas/solicitacoes body:', req.body);
    const { solicitacaoId, status } = req.body;
    if (!solicitacaoId) return res.status(400).send('solicitacaoId ausente');

    // Exemplo usando Sequelize (ajuste ao seu modelo)
    const { Peca } = require('../models'); // ajuste path/model
    const peca = await Peca.findByPk(solicitacaoId);
    if (!peca) return res.status(404).send('Solicitação não encontrada');

    const novoStatus = (status || '').toUpperCase();
    if (!['APROVADO','REJEITADO'].includes(novoStatus)) return res.status(400).send('Status inválido');

    peca.status = novoStatus;
    await peca.save();

    return res.redirect('back'); // ou rota correta
  } catch (err) {
    console.error(err);
    return res.status(500).send('Erro interno');
  }
};

module.exports = {
    listarMecanicos, 
    atualizarMecanico, 
    getEditarMecanico, 
    deletarMecanico, 
    cadastrarPeca, 
    listarPeca, 
    getModificaPeca,
    modificaPeca,
    deletarPeca,
    listarServico, 
    listarGerente, 
    cadastrarGerente, 
    atualizarGerente, 
    getEditarGerente, 
    deletarGerente,
    processarSolicitacaoPeca,
    listarSolicitacoesServicos,
    processarSolicitacaoServicos,
    ordemServico,
};