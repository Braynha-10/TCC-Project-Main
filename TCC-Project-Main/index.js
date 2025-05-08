const express = require("express");
const session = require('express-session');
const path = require("path");
const methodOverride = require("method-override");
const authRoutes = require('./routes/authRoutes');
const mecanicoRoutes = require('./routes/mecanicoRoutes');
const gerenteRoutes = require('./routes/gerenteRoutes');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const {sequelize} = require('./models');

const app = express();

//Traduzir os dados do corpo da requisição para variáveis
app.use(express.urlencoded({extended: true}));

//Indica que o formato dos dados seja JSON
app.use(express.json());

//Chama a o method override a partir da query "_method"
app.use(methodOverride('_method'));

// Configurar o middleware de sessão
const sessionStore = new SequelizeStore({
    db: sequelize,
});

app.use(
    session({
        secret: 'opala123', // Use um segredo forte
        store: sessionStore,
        resave: false, // Evita salvar a sessão sem alterações
        saveUninitialized: false, // Não cria sessões vazias
        cookie: {
            secure: false, // Use "true" em produção com HTTPS
            maxAge: 1000 * 60 * 60, // Expira em 1 hora
        },
    })
);

// Sincroniza a tabela de sessões no banco de dados
sessionStore.sync();

// // Configuração do middleware express-session para manter o usuario numa sessao inciada apos o login
// app.use(session({
//     secret: 'opala123', // Usado para assinar o cookie de sessão
//     resave: false, // Evita que a sessão seja salva novamente se não for modificada
//     saveUninitialized: false, // Não salva sessões que não foram inicializadas
//     cookie: { secure: false } // Defina como `true` se usar HTTPS
// }));

// // Servindo arquivos estáticos da pasta public
// app.use(express.static(path.join(__dirname, 'views/public')));
// app.use(express.static(path.join(__dirname, 'views/mecanico')));
app.use('/public', express.static(path.join(__dirname, 'views/public')));
// app.use('/mecanico', express.static(path.join(__dirname, 'views/mecanico')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// app.use('/mecanico', mecanico);
// // app.use('/chefe', chefe)

// Rotas
app.get('/', (req, res) => {
    res.render('index'); // Página inicial
});

app.get('/login', (req, res) => {
    res.render('login'); // Página de escolha de login
});

app.use('/login', authRoutes); // Rotas de login
app.use('/gerente', gerenteRoutes); // Rotas do painel do gerente
app.use('/mecanico', mecanicoRoutes); // Rotas do painel do mecânico

app.listen(8080, () => {
    console.log("Ouvindo a porta 8080");
});