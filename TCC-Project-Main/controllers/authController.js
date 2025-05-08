const { Gerente, Mecanico } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.loginGerente = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const user = await Gerente.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        const token = jwt.sign({ id: user.id, userType: 'gerente' }, 'seu_segredo_jwt', { expiresIn: '24h' });

        req.session.gerente = user;

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginMecanico = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const user = await Mecanico.findOne({ where: { email } });
        req.user = user;
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        const token = jwt.sign({ id: user.id, userType: 'mecanico' }, 'seu_segredo_jwt', { expiresIn: '24h' });


        // Armazene os dados do mecânico na sessão
        req.session.mecanico = user;

        res.json({ token, user });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};