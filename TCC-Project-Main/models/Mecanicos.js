// Importa o bcrypt para criptografar a senha
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const Mecanico = sequelize.define('Mecanico', {
        nome: DataTypes.STRING,
        telefone: DataTypes.STRING,
        email: DataTypes.STRING,
        senha: DataTypes.STRING,
        especialidade: DataTypes.STRING,
        salario: DataTypes.DOUBLE,
        comissao: DataTypes.DOUBLE
    }, {
        hooks: {
            beforeCreate: async (Mecanico) => {
                if (Mecanico.senha) {
                    const salt = await bcrypt.genSalt(10);
                    Mecanico.senha = await bcrypt.hash(Mecanico.senha, salt);
                }
            },
            beforeUpdate: async (Mecanico) => {
                if (Mecanico.senha) {
                    const salt = await bcrypt.genSalt(10);
                    Mecanico.senha = await bcrypt.hash(Mecanico.senha, salt);
                }
            }
        }
    });

    return Mecanico;
};