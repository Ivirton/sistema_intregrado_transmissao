const express = require('express');
const router = express.Router();

const trasmisaoController = require('../controller/transmicaoController');
const timeController = require('../controller/timesController');
const jogadorController = require('../controller/jogadorController');
const estadioController = require('../controller/estadioController');
const jogoController = require('../controller/jogosController');
const rotativoControler = require('../controller/rotativoController');
const MerchaController = require('../controller/merchanController');
const categoriaController = require('../controller/categoriaController');

//TRANSMISSÃO
router.get('/', trasmisaoController.transmisoes);
router.get('/receptor', trasmisaoController.receptor);
router.get('/transmisao', trasmisaoController.transmisao);
router.get('/transmisoes', trasmisaoController.transmisoes);
router.post('/createtransmisao', trasmisaoController.create);
router.get('/deletetransmisao', trasmisaoController.delete);

//TIME
router.get('/times',timeController.findAll);
router.get('/times/:timeCategoria',timeController.findCategoria);
router.post('/create_time',timeController.create);
router.get('/time', timeController.find);
router.get('/deletetime', timeController.delete);
router.post('/updatetime',timeController.update);

//locais
router.post('/create_estadio',estadioController.create);
router.get('/estadios', estadioController.findAll);
router.get('/delete_estadio',estadioController.delete);

//categorias

router.post('/create_categoria',categoriaController.create);
router.get('/categoria', categoriaController.findAll);
router.get('/delete_categoria',categoriaController.delete);

//JOGADOR
router.post('/create_jogador',jogadorController.create);
router.post('/update_jogador',jogadorController.update);
router.get('/jogador', jogadorController.find);
router.get('/delete_jogador',jogadorController.delete);

// JOGOS
// router.get('/jogos',jogoController.findAll);
router.get('/jogos/:categoria',jogoController.findCategoria);
router.post('/create_jogo',jogoController.create);
router.get('/deletejogo',jogoController.delete);

//Rotativo Carrosel
router.get('/carrossel',rotativoControler.findAll);
router.post('/create_carrosel', rotativoControler.upload.single('imagem'),rotativoControler.create);
router.get('/delete_carrosel',rotativoControler.delete);
router.get('/api_carroselAtivo',rotativoControler.api_carroselAtivo);
//MERCHAN
router.post('/create_merchan', MerchaController.upload.single('imagem'),MerchaController.create);
router.get('/delete_merchan',MerchaController.delete);

module.exports = router;