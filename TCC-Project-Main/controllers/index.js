const mecanicoController = require('./mecanicoController');
const gerenteController = require('./gerenteController')
controllers = {
    mecanico: mecanicoController,
    gerente: gerenteController,
}

module.exports = controllers;