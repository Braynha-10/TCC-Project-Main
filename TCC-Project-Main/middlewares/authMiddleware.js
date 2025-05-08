const authMiddleware = (req, res, next) => {
    if (!req.session.mecanico) {
        // res.render("errorPage");
        return res.status(401).json({ error: 'Acesso negado para mecanico. Por favor, faça login.' });
    }
    // else if (!req.session.gerente) {
    //     res.render("errorPage");
    //     return
    //     // res.status(401).json({ message: 'Acesso negado para gerente. Por favor, faça login.' });
    // }
    next();
};

const authMiddlewareGerente = (req, res, next) => {
    if (!req.session.gerente) {
        // res.render("errorPage");
        return res.status(401).json({ error: 'Acesso negado para gerente. Por favor, faça login.' });
    }
    next();
};

module.exports = {
    authMiddleware, 
    authMiddlewareGerente
};