const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota para a página de login do gerente
router.get('/gerente', (req, res) => res.render('gerente/loginGerente'));
router.post('/gerente', authController.loginGerente);

// Rota para a página de login do mecânico
router.get('/mecanico', (req, res) => res.render('mecanico/loginMecanico'));
router.post('/mecanico', authController.loginMecanico);

module.exports = router;