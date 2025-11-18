const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const Gerente = sequelize.define('Gerente', {
        nome: DataTypes.STRING,
        telefone: DataTypes.STRING,
        email: DataTypes.STRING,
        senha: DataTypes.STRING,
        salario: DataTypes.DOUBLE
    }, {
        hooks: {
            beforeCreate: async (Gerente) => {
                if (Gerente.senha) {
                    const salt = await bcrypt.genSalt(10);
                    Gerente.senha = await bcrypt.hash(Gerente.senha, salt);
                }
            },
            beforeUpdate: async (Gerente) => {
                if (Gerente.senha) {
                    const salt = await bcrypt.genSalt(10);
                    Gerente.senha = await bcrypt.hash(Gerente.senha, salt);
                }
            }
        }
    });

    return Gerente;
};