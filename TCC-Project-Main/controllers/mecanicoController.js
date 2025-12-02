const { Sequelize, Veiculo, Cliente, Pagamento, Servico, Mecanico, Catalogo, Peca, Solicitacoes_servico, Solicitacoes_peca, Estoque } = require('../models'); // Importação dos modelos de dados

// Veiculos --------------------------------------------------------------------------------------------------------------------------------------

exports.homeVeiculo = async(req, res) => {
    const clientes = await Cliente.findAll(); // Busca todos os clientes
    res.render('veiculo/cadastroVeiculo', { clientes });
};

exports.listandoVeiculos = async(req, res, id) => {
    // Veiculo.findAll().then(veiculo => {
    //     res.render('veiculo/listaVeiculos', {Veiculo: veiculo});
    // });
    
    try {
        const veiculo = await Veiculo.findAll({
            include: {
                model: Cliente,
                include: {
                    model: Veiculo,
                    include: {
                        model: Servico,
                        where: { id_mecanico: id },  // Use o ID do mecânico logado
                        required: true,
                    },
                    required: true            
                    },
                required: true
                },
        });
        res.render('veiculo/listaVeiculos', { Veiculo: veiculo });
    } catch (error) {
        console.error('Erro ao listar os veiculos: ', error);
        res.status(500).send("Erro ao listar os Veiculos");
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
exports.listarClientesMecanico = async(req, res, id) => {
    try {
        const clientes = await Cliente.findAll({
            include:{
                model: Veiculo,
                include: {
                    model: Servico,
                    where: { id_mecanico: id },  // Use o ID do mecânico logado
                    required: true,
                },
                required: true   
            }
        });
        res.render('cliente/listaClientes', { Cliente: clientes });
    } catch (error) {
        console.error('Erro ao listar os clientes: ', error);
        res.status(500).send("Erro ao listar os Clientes");
    }
}

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
exports.listarSolitacoesPecas = async(req, res) => {
    try {
        const pecas = await Solicitacoes_peca.findAll({
            include: [
                { model: Mecanico },
            ]
        });
        const gerente = false;
        res.render('peca/listaPeca', { pecas, gerente, mecanico: req.session.mecanico });
    } catch (error) {
        console.error('Erro ao listar as solicitações de peças: ', error);
        res.status(500).send('Erro ao listar as solicitações de peças');
    }
}

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