require('dotenv').config();
const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser')
const router = require('./src/router/router');
const { initializeSocket } = require('./src/controller/socketController');
require('./src/model/sincronizar');


initializeSocket
const app = express();
const server = http.createServer(app);
initializeSocket(server)

// Configuração do diretório público para servir arquivos estáticos
router.use(express.static('public'))

// Habilita o middleware para interpretar dados codificados na URL (por exemplo, dados de formulário)
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Habilita o middleware para interpretar o corpo das requisições como JSON
router.use(express.json());

// Configuração do view engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Define o prefixo para as rotas 
app.use('/', router);


//inicializar servidor 
let port = process.env.PORT || 3000;
server.listen(port, () => {
	console.log(`Servidor rodando na porta :${port}`);
});