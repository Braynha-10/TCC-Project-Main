const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {authMiddleware} = require('../middlewares/authMiddleware');
const { Veiculo, Cliente, Pagamento, Servico, Peca, Mecanico, Catalogo, Solicitacoes_servico, Solicitacoes_peca} = require('../models'); // Importação dos modelos de dados
const { homeVeiculo,listandoVeiculos, listarServicosEmAndamento, finalizarServicosEmAndamento,cadastroVeiculo, atualizandoVeiculo, deletaVeiculo, cadastroCliente, atualizandoCliente, deletaCliente, editarVeiculo, listarClientesMecanico, listarServicos, listandoSolicitacoesServicos, solicitarServico, listarSolitacoesPecas, solicitarPeca, editarCliente } = require('../controllers/mecanicoController');

// router.get('/', authMiddleware, (req, res) => {
//     if (req.user.userType !== 'mecanico') {
//         return res.status(403).json({ error: 'Acesso negado' });
//     }

//     // Recupere os dados do mecânico da sessão
//     const mecanico = req.session.mecanico;
//     res.render('mecanico/painelMecanico', {Mecanico: mecanico});
// });

router.get('/', (req, res) => {
    res.render('mecanico/loginMecanico');
});

router.post('/', async (req, res) => {
    const { email, senha } = req.body;
    console.log('Requisição recebida:', req.body);

    try {
        // Verifique as credenciais no banco de dados
        const mecanico = await Mecanico.findOne({ where: { email } });

        if (!mecanico || !bcrypt.compareSync(senha, mecanico.senha)) {
            return res.status(401).render('mecanico/loginMecanico', { error: 'Credenciais inválidas' });
        }

        // Salva o mecânico na sessão
        req.session.mecanico = {
            id: mecanico.id,
            email: mecanico.email,
            nome: mecanico.nome,
        };

        // Renderiza o painel do mecânico
        res.render('mecanico/painelMecanico', { mecanico });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno do servidor');
    }
});

// Proteger todas as rotas abaixo
router.use(authMiddleware);

//painel do mecânico
router.get('/painelMecanico', (req, res) => {
    const {mecanico} =  req.session;
    res.render('mecanico/painelMecanico', {mecanico});
})

// Veiculos --------------------------------------------------------------------------------------------------------------------------------------

// Home veiculo
router.get('/veiculo', (req, res) => {
    homeVeiculo(req, res);
});

// listar veiculos
router.get('/veiculos', (req, res) => {
    // Recupere os dados do mecânico da sessão
    const {id} = req.session.mecanico;

    listandoVeiculos(req, res, id);
});

// modificar veiculos
router.get('/veiculos/:id/editar', async (req, res) => {
    editarVeiculo(req, res);
});

//cadastro veiculo
router.post("/veiculo", async(req, res)=>{
    cadastroVeiculo(req, res);
});

// Atualizar veiculo
router.patch('/veiculo/:id', async (req, res) => {
    atualizandoVeiculo(req, res);
});

// Deletar veiculo
router.delete('/veiculos/:id', async (req, res) => {
    deletaVeiculo(req, res);
});

// Clientes
// Cadastrar cliente
router.get('/cliente', (req, res) => {
    res.render('cliente/cadastroCliente');
});

// listar clientes
router.get('/clientes', (req, res) => {
    // Recupere os dados do mecânico da sessão
    const {id} = req.session.mecanico;
    
    listarClientesMecanico(req, res, id);
});

router.get('/cliente/:id/editar', (req, res) => {
    editarCliente(req, res);
});

// cadastro clientes
router.post("/cliente", async(req, res)=>{
    cadastroCliente(req, res);
});

// Atualizar cliente
router.patch('/cliente/:id', async (req, res) => {
    atualizandoCliente(req, res);
});

// Deletar cliente
router.delete('/cliente/:id', async (req, res) => {
    deletaCliente(req, res);
});

// Serviços
// Listagem de serviços em andamento
router.get('/servico/listarServicos', listarServicosEmAndamento);

router.patch('/servico/listarServicos/finalizarServico/:id', finalizarServicosEmAndamento);

// Cadastrar serviço
router.get('/servico', async(req, res) => {
    const {id} = req.session.mecanico; // Assume que o usuário está autenticado
    listarServicos(req, res, id);
});

//Listando solicitações de serviço
router.get('/servicos', async(req, res) => {
    const {id} = req.session.mecanico; // Assume que o usuário está autenticado
    listandoSolicitacoesServicos(req, res, id);    
});

// Solicitar servico
router.post("/servico", async (req, res) => {
    solicitarServico(req, res);
});

// PECAS----------------------------------------------------------------------------------------------------------------------------------------
// Solicitar pecas
router.get('/peca', async (req, res) => { 
    const pecas = await Peca.findAll();
    res.render('peca/cadastroPeca', {pecas});
});

// Listar pecas
router.get('/pecas', async (req, res) => {
    listarSolitacoesPecas(req, res);
});

//Cadastro de Solicitação de pecas
router.post('/pecas', async (req, res) => {
    solicitarPeca(req, res);
});



// Atualizar serviço
router.patch('/servicos/:id', async (req, res) => {
    const { id } = req.params;
    const { id_mecanico, id_veiculo, id_servico, id_peca, id_pagamento, descricao, status } = req.body;

    try {
        await Servico.update({ id_mecanico, id_veiculo, id_servico, id_peca, id_pagamento, descricao, status }, { where: { id } });
        res.redirect('/mecanico/painelMecanico');  // Redireciona para painel do mecanico
    } catch (error) {
        console.error('Erro ao atualizar Serviço:', error);
        res.status(500).send('Erro ao atualizar serviço');
    }
});

// Deletar serviço
router.delete('/servicos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Servico.destroy({ where: { id } });
        res.redirect('/mecanico/painelMecanico');  // Redireciona para painel do mecanico
    } catch (error) {
        console.error('Erro ao deletar Serviço:', error);
        res.status(500).send('Erro ao deletar serviço');
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.render('index');
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao encerrar a sessão' });
        }
        res.clearCookie('connect.sid'); // Limpa o cookie da sessão
        res.redirect('/');  // Redireciona para o inicio
    });
});

module.exports = router;