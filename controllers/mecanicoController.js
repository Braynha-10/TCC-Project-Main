const { Sequelize, Veiculo, Cliente, Pagamento, Servico, Mecanico, Catalogo, Peca, Solicitacoes_servico, Solicitacoes_peca, Estoque } = require('../models'); // Importação dos modelos de dados
const { Op } = require('sequelize');
// Veiculos --------------------------------------------------------------------------------------------------------------------------------------

exports.homeVeiculo = async(req, res) => {
    const clientes = await Cliente.findAll(); // Busca todos os clientes
    res.render('veiculo/cadastroVeiculo', { clientes });
};

exports.listandoVeiculos = async (req, res, id) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10; 
        const offset = (page - 1) * limit;

        const search = req.query.search || "";
        console.log("Search query:", search);
        const whereVeiculo = search
            ? {
                  [Op.or]: [
                      { modelo: { [Op.like]: `%${search}%` } },
                      { marca: { [Op.like]: `%${search}%` } },
                      { ano: { [Op.like]: `%${search}%` } },
                  ]
              }
            : {};

        console.log("Where clause for Veiculo:", whereVeiculo);
        const { rows: veiculos, count: total } = await Veiculo.findAndCountAll({
            where: whereVeiculo,
            include: [
                {
                    model: Cliente,
                    required: true,
                    include: [
                        {
                            model: Veiculo,
                            required: true,
                            include: [
                                {
                                    model: Servico,
                                    where: { id_mecanico: id },
                                    required: true
                                }
                            ]
                        }
                    ]
                }
            ],
            limit,
            offset,
            distinct: true,  // necessário para count correto com include
            order: [["modelo", "ASC"]],
        });

        const totalPages = Math.ceil(total / limit);

        res.render("veiculo/listaVeiculos", {
            Veiculo: veiculos,
            currentPage: page,
            totalPages,
            search,
        });

    } catch (error) {
        console.error("Erro ao listar os veiculos: ", error);
        res.status(500).send("Erro ao listar os Veículos");
    }
};

exports.cadastroVeiculo = async(req, res) => {
    const { modelo, marca, ano, id_cliente } = req.body;

    try {
        // Recupere os dados do mecânico da sessão
        const mecanico = req.session.mecanico;
        // Salvar no banco de dados
        await Veiculo.create({  modelo, marca, ano, id_cliente });
        res.render('mecanico/painelMecanico', {mecanico});  // Redireciona para painel do mecanico
    } catch (error) {
        console.error('Erro ao cadastrar Veiculo:', error);
        res.status(500).send('Erro ao cadastrar veiculo');
    }
};

exports.editarVeiculo = async(req, res) => {
    const { id } = req.params;

    try {
        const clientes = await Cliente.findAll(); // Busca todos os clientes
        // Buscar o veículo pelo ID
        const veiculo = await Veiculo.findByPk(id);
        if (!veiculo) {
            return res.status(404).send('Veículo não encontrado');
        }
        // Renderizar a view de edição com os dados do veículo
        res.render('veiculo/editarVeiculo', { Veiculo: veiculo, clientes });
    } catch (error) {
        console.error('Erro ao buscar veículo:', error);
        res.status(500).send('Erro ao buscar veículo');
    }
};

exports.editarCliente = async(req, res) => {
    const { id } = req.params;

    try {
        // Buscar o veículo pelo ID
        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            return res.status(404).send('Cliente não encontrado');
        }
        // Renderizar a view de edição com os dados do veículo
        res.render('cliente/editarCliente', { cliente: cliente });
    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        res.status(500).send('Erro ao buscar cliente');
    }
};

exports.atualizandoVeiculo = async(req, res) => {
    const { id } = req.params;
    const { modelo, marca, ano, id_cliente } = req.body;

    try {
        // Recupere os dados do mecânico da sessão
        const mecanico = req.session.mecanico;
        await Veiculo.update({ modelo, marca, ano, id_cliente }, { where: { id } });
        res.redirect('/mecanico/painelMecanico');  // Redireciona para painel do mecanico
    } catch (error) {
        console.error('Erro ao atualizar Veiculo:', error);
        res.status(500).send('Erro ao atualizar veículo');
    }
};

exports.deletaVeiculo = async(req, res) => {
    const { id } = req.params;

    try {
        const mecanico = req.session.mecanico;
        await Veiculo.destroy({ where: { id } });
        res.redirect('/mecanico/painelMecanico');  // Redireciona para painel do mecanico
    } catch (error) {
        console.error('Erro ao deletar Veiculo:', error);
        res.status(500).send('Erro ao deletar veículo');
    }
};

// Clientes --------------------------------------------------------------------------------------------------------------------------------------
exports.listarClientesMecanico = async (req, res, id) => {
    try {

        // 📌 1. Parâmetros de paginação
        const page = parseInt(req.query.page) || 1;
        const limit = 10;  
        const offset = (page - 1) * limit;

        // 📌 2. Parâmetro de busca
        const search = req.query.search || "";

        // 📌 3. Condições do where (aplica busca se existir)
        const whereCliente = search
            ? { nome: { [Op.like]: `%${search}%` } }
            : {};

        // 📌 4. Consulta com paginação REAL (findAndCountAll)
        const { rows: clientes, count } = await Cliente.findAndCountAll({
            where: whereCliente,
            limit,
            offset,
            include: {
                model: Veiculo,
                required: true,
                include: {
                    model: Servico,
                    where: { id_mecanico: id },
                    required: true
                }
            }
        });

        const totalPages = Math.ceil(count / limit);

        // 📌 5. Renderiza mantendo tudo que sua view espera
        res.render("cliente/listaClientes", {
            Cliente: clientes,
            currentPage: page,
            totalPages,
            search
        });

    } catch (error) {
        console.error("Erro ao listar os clientes:", error);
        res.status(500).send("Erro ao listar os Clientes");
    }
};


exports.cadastroCliente = async(req, res) => {
    const { nome, telefone, email, endereco } = req.body;

    try {
        // Recupere os dados do mecânico da sessão
        const mecanico = req.session.mecanico;
        // Salvar no banco de dados
        await Cliente.create({  nome, telefone, email, endereco  });
        res.render('mecanico/painelMecanico', {mecanico});  // Redireciona para painel do mecanico
    } catch (error) {
        console.error('Erro ao cadastrar Cliente:', error);
        res.status(500).send('Erro ao cadastrar Cliente');
    }
}

exports.atualizandoCliente = async(req, res) => {
    // const { id } = req.params;
    // const { nome, telefone, email, endereco } = req.body;

    // try {
    //     // Recupere os dados do mecânico da sessão
    //     const mecanico = req.session.mecanico;
    //     await Cliente.update({ nome, telefone, email, endereco }, { where: { id } });
    //     res.render('mecanico/painelMecanico', {Mecanico: mecanico});  // Redireciona para painel do mecanico
    // } catch (error) {
    //     console.error('Erro ao atualizar Cliente:', error);
    //     res.status(500).send('Erro ao atualizar Cliente');
    // }
    const { id } = req.params;
    const { nome, telefone, email } = req.body;

    try {
        await Cliente.update({ nome, telefone, email }, { where: { id } });
        res.redirect('/mecanico/painelMecanico');  // Redireciona para painel do mecanico
    } catch (error) {
        console.error('Erro ao atualizar Cliente:', error);
        res.status(500).send('Erro ao atualizar cliente');
    }
}

exports.deletaCliente = async(req, res) => { 
    const { id } = req.params;

    try {
        await Cliente.destroy({ where: { id } });
        res.redirect('/mecanico/painelMecanico');  // Redireciona para painel do mecanico
    } catch (error) {
        console.error('Erro ao deletar Cliente:', error);
        res.status(500).send('Erro ao deletar cliente');
    }
}	

// Serviços --------------------------------------------------------------------------------------------------------------------------------------
exports.listarServicosEmAndamento = async(req, res) => {
    const {id} = req.session.mecanico;
    try {
        const servicos = await Servico.findAll({
            where: {id_mecanico: id, status: 'Pendente'},
            include: [
                {model: Veiculo, include: Cliente },
                {model: Catalogo},
                {model: Peca, include: Estoque},
                {model: Mecanico},
            ]
        })
        // console.log('teste: ', servicos);

        if(!servicos){
            return  res.status(404).send('Sem servicos para este cliente');
        }

        res.render('servico/listarServicosEmAndamento', {Servicos: servicos})
    } catch (error) {
        console.error('Erro ao encontrar servicos:', error);
        res.status(500).send('Erro ao encontrar servicos');
    }
}


exports.finalizarServicosEmAndamento = async(req, res) => {
    const {id} = req.params;
    try {
        const servico = await Servico.findByPk(id);
        if(!servico){
            return res.status(404).send('Servico nao encontrado!');
        }
        await servico.update({status: "Finalizado"})
        res.redirect('/mecanico/servico/listarServicos')
    } catch (error) {
    
        console.error('Erro ao atualizar Servico: ', error);
        res.status(500).json({ error: 'Erro ao atualizar Servico' });
     
    }
}



exports.listarServicos = async(req, res, id) => {  
    try {
        const catalogos = await Catalogo.findAll(); // Busca todos os serviços do catálogo
        // const veiculos = await Veiculo.findAll({
        //     include: {
        //         model: Cliente,
        //         include: {
        //             model: Pagamento,
        //             include: {
        //                 model: Servico,
        //                 where: { id_mecanico: id },  // Use o ID do mecânico logado
        //                 required: true,
        //             },
        //             required: true            
        //         },
        //         required: true
        //     },
        // });
  
        // Busca veículos atribuídos ao mecânico ou sem nenhum serviço atribuído
        const veiculos = await Veiculo.findAll({
            include: [
                {
                    model: Servico,
                    required: false, // Inclui veículos mesmo sem serviços
                    where: {
                        [Sequelize.Op.or]: [
                            { id_mecanico: id }, // Serviços atribuídos ao mecânico atual
                            { id_mecanico: null } // Veículos sem mecânico atribuído
                        ]
                    }
                }
            ]
        });
        const pecas = await Peca.findAll(
            {
                include: Estoque,
            }
        );
        const mecanico = req.session.mecanico; // Assume que o usuário está autenticado
        
        console.log(pecas[0].Estoque);

        res.render('servico/cadastroServico', { catalogos, mecanico, veiculos, pecas });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar a página de solicitação de serviço');
    }
}

exports.listandoSolicitacoesServicos = async(req, res, id) => {
    try {
        const servicos = await Solicitacoes_servico.findAll({
            include: [
                { model: Veiculo, include: Cliente },
                {model: Catalogo},
                {model: Peca},
                {model: Mecanico},
            ]
        });
        const gerente = false
        res.render('servico/listaServicos', { Servico: servicos, gerente, mecanico: req.session.mecanico });
    } catch (error) {
        console.error('Erro ao listar as solicitações de serviço: ', error);
        res.status(500).send("Erro ao listar as solicitações de serviço");
    }
}

// Solicitação de Serviço
exports.solicitarServico = async(req, res) => {
    const { id_mecanico, id_catalogo, id_veiculo, id_peca, pagamento, desconto, descricao } = req.body;
    const mecanico = req.session.mecanico; // Assume que o usuário está autenticado
    try {
        await Solicitacoes_servico.create({
            id_mecanico,
            id_veiculo,
            id_peca,
            id_catalogo,
            tipo_pagamento: pagamento,
            desconto,
            descricao,
            status: 'PENDENTE' // Sempre começa como pendente
        });
        res.render('mecanico/painelMecanico', {mecanico}); // Redireciona para a listagem
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao criar a solicitação de serviço');
    }
}

//pecas----------------------------------------------------------------------------------------------------------------------------------------
exports.listarSolitacoesPecas = async (req, res) => {
    try {
        let { page = 1, search = "" } = req.query;
        page = Number(page);
        const limit = 10;
        const offset = (page - 1) * limit;

        // Filtro de busca
        const where = {};
        if (search.trim() !== "") {
            where.nome = { [Op.like]: `%${search}%` };
        }

        // Consulta com paginação
        const { rows: pecas, count } = await Solicitacoes_peca.findAndCountAll({
            where,
            limit,
            offset,
            include: [{ model: Mecanico }]
        });

        const totalPages = Math.ceil(count / limit);

        res.render("peca/listaPeca", {
            pecas,
            gerente: req.session.gerente || false,
            mecanico: req.session.mecanico || false,
            currentPage: page,
            totalPages,
            search
        });

    } catch (error) {
        console.error("Erro ao listar as solicitações de peças:", error);
        res.status(500).send("Erro ao listar as solicitações de peças");
    }
};


exports.solicitarPeca = async(req, res) => {
    const { nome, descricao, preco } = req.body;
    const mecanico = req.session.mecanico; // Assume que o usuário está autenticado
    try {
        await Solicitacoes_peca.create({
            id_mecanico:mecanico.id,
            nome,
            descricao,
            preco,
            status: 'PENDENTE' // Sempre começa como pendente
        });
        res.render('mecanico/painelMecanico', {mecanico}); // Redireciona para a listagem
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao criar a solicitação de peça');
    }
}

async function postSolicitarPeca(req, res) {
  try {
    const body = req.body || {};
    const mecanicoId = req.session && req.session.mecanico ? req.session.mecanico.id : null;

    if (body.tipo === 'existente') {
      const pecaId = body.pecaId || body.id;
      const quantidade = parseInt(body.quantidade, 10) || 1;
      if (!pecaId) return res.status(400).json({ ok: false, message: 'Id da peça é obrigatório' });

      // busca a peça para obter o nome (campo 'nome' é NOT NULL na tabela)
      const peca = await Peca.findByPk(pecaId);
      if (!peca) return res.status(404).json({ ok: false, message: 'Peça não encontrada' });

      await Solicitacoes_peca.create({
        nome: peca.nome,                    // campo obrigatório conforme erro
        descricao: peca.descricao || null,
        preco: peca.preco || null,
        id_peca: peca.id,                   // variantes para diferentes schemas
        pecaId: peca.id,
        quantidade: quantidade,
        quantidade_solicitada: quantidade,
        status: 'PENDENTE',
        id_mecanico: mecanicoId,
        idMecanico: mecanicoId
      });

      return res.json({ ok: true, message: 'Solicitação de peça existente enviada' });
    } else {
      const nome = (body.nome || '').trim();
      if (!nome) return res.status(400).json({ ok: false, message: 'Nome da peça é obrigatório' });
      const quantidade = parseInt(body.quantidade, 10) || 1;

      await Solicitacoes_peca.create({
        nome: nome,
        descricao: body.descricao || null,
        preco: body.preco || null,
        id_peca: null,
        pecaId: null,
        quantidade: quantidade,
        quantidade_solicitada: quantidade,
        status: 'PENDENTE',
        id_mecanico: mecanicoId,
        idMecanico: mecanicoId
      });

      return res.json({ ok: true, message: 'Solicitação de nova peça enviada' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: 'Erro ao criar solicitação' });
  }
}

// Exporta sem sobrescrever as outras exports já definidas acima
exports.postSolicitarPeca = postSolicitarPeca;