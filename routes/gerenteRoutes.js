const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {authMiddlewareGerente} = require('../middlewares/authMiddleware');
const { Mecanico, Solicitacoes_peca, Gerente, Peca } = require('../models');
const gerenteController = require('../controllers/gerenteController');

// router.get('/', authMiddleware, (req, res) => {
//     if (req.user.userType !== 'gerente') {
//         return res.status(403).json({ error: 'Acesso negado' });
//     }

//     res.render('gerente/painelGerente');
// });

router.get('/', (req, res) => {
    const {gerente} =  req.session.gerente;
    res.render('gerente/loginGerente', {gerente});
});


router.post('/', async (req, res) => {
    const { email, senha } = req.body;
    console.log('Requisição recebida:', req.body);
    
    try {
        // Verifique as credenciais no banco de dados
        const gerente = await Gerente.findOne({ where: { email } });
        
        //confere e covalida a senha encriptografada 
        if (!gerente || !bcrypt.compareSync(senha, gerente.senha)) {
            return res.status(401).render('gerente/loginGerente', { error: 'Credenciais inválidas' });
        }
        
        // Salva o gerente na sessão
        req.session.gerente = {
            id: gerente.id,
            email: gerente.email,
            nome: gerente.nome,
        };
        
        // Renderiza o painel do gerente
        res.render('gerente/painelGerente', { gerente });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno do servidor');
    }
});

// Proteger todas as rotas abaixo
router.use(authMiddlewareGerente);

//painel do gerente
router.get('/painelGerente', (req, res) => {
    const {gerente} =  req.session;
    res.render('gerente/painelGerente', {gerente});
})

//Rotas Controle do Mecanico
router.get('/mecanico/cadastro', async (req, res) => {
    res.render('mecanico/cadastro', {mecanico: null}); 
});

router.get('/mecanico/editar/:id', gerenteController.getEditarMecanico);
router.patch('/mecanicos/:id', gerenteController.atualizarMecanico);
router.delete('/mecanicos/:id', gerenteController.deletarMecanico);

router.post('/mecanico/cadastro', async (req,res) => {
    const {nome, email, telefone, senha, especialidade, salario, comissao} = req.body;
    const gerente = req.session.gerente;

    const user = await Mecanico.findOne({
        where: {email: email}
    });

    if(!user){
        await Mecanico.create({nome, email, telefone, senha, especialidade, salario, comissao})
        res.redirect('/gerente/painelGerente');
    } else {
        res.send('<h1>Ja existe um usuario com este email<h1>'); //deixar como unique
    }

})

router.get('/mecanico/listar', gerenteController.listarMecanicos);

//Rotas Controle das Pecas
router.get('/pecas/cadastro', async (req, res) => {
    const peca = null
    res.render('pecas/cadastro', {peca});
});

router.get('/pecas/solicitacoes', async (req, res) => { 
    try {
        const pecas = await Solicitacoes_peca.findAll({
            include: [
                { model: Mecanico },
            ]
        });
        const gerente = true
        res.render('peca/listaPeca', { pecas, gerente });
    } catch (error) {
        console.error('Erro ao listar as solicitações de peças: ', error);
        res.status(500).send('Erro ao listar as solicitações de peças');
    }
});

router.post('/pecas/solicitacoes', gerenteController.processarSolicitacaoPeca);

router.post('/pecas/cadastro', gerenteController.cadastrarPeca);

router.get('/pecas/listar', gerenteController.listarPeca);

router.get('/pecas/modifica/:id', gerenteController.getModificaPeca);

router.patch('/pecas/modifica/:id', gerenteController.modificaPeca);

router.delete('/pecas/deletar/:id', gerenteController.deletarPeca);


//Rotas Controle Servicos
router.get('/servicos/listar', gerenteController.listarServico);
router.get('/servicos/solicitacoes', gerenteController.listarSolicitacoesServicos);
router.post('/servicos/solicitacoes', gerenteController.processarSolicitacaoServicos);

// router.get('/servicos/listarServicos', gerenteController.listarServico);

//Rotas Controle Gerente
router.get('/gerentes/listar', gerenteController.listarGerente);

router.get('/gerentes/cadastro', async (req, res) => {
    const gerente = null;
    res.render('gerente/cadastro', {gerente});
});

//rota do pdf
router.get('/servico/pdf/:id', gerenteController.ordemServico);

router.post('/gerentes/cadastro', gerenteController.cadastrarGerente);
router.delete('/gerentes/deletar/:id', gerenteController.deletarGerente);
router.get('/gerentes/editar/:id', gerenteController.getEditarGerente);
router.patch('/gerentes/:id', gerenteController.atualizarGerente);

//Rota Fechamento Geral
router.get('/fechamento-geral', gerenteController.fechamentoGeral);



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
