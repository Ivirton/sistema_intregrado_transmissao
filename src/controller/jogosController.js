const database = require("../config/database");
const moment = require('moment-timezone');
const { Estadio, Transmissao, Jogo, Time, Categoria } = require("../model/models");

const jogoController = {
    create: async (req, res) => {
        try {
            console.log(req.body)
            const dataHora = moment(req.body.datatime).tz('America/Sao_Paulo').format('DD-MM-YYYY HH:mm');
            const novo = await Jogo.create({
                data: dataHora,
                id_equipe1: req.body.time1_jogo,
                id_equipe2: req.body.time2_jogo,
                idestadio: req.body.estadio,
                pontos_time1: 0,
                pontos_time2: 0,
                partida: 1,
                id_categoria:req.body.id_categoria
            })

            res.redirect('/jogos/'+req.body.id_categoria);
        } catch (erro) {
            console.log("Erro ao adiconar Jogo")
            res.redirect('/jogos/'+req.body.id_categoria);
        }
    },
    findCategoria: async (req, res) => {
        try {
            const query = `select Jogo.idjogo, jogo.id_equipe1,jogo.id_equipe2,Jogo.data, time1.nome  as nome_time1, pontos_time1, time2.nome as nome_time2 ,pontos_time2,estadio.nome as estadio,Categoria.nome as nomeCategoria,Categoria.id_categoria,Categoria.sexo from Jogo ,Times AS time1,Times as time2,estadio,Categoria WHERE Jogo.id_equipe1 = time1.id_equipe and time2.id_equipe = Jogo.id_equipe2 and estadio.idestadio = Jogo.idestadio and Categoria.id_categoria = Jogo.id_categoria  and Categoria.id_categoria = ${req.params.categoria} order by jogo.data DESC`

            const jogos = await database.query(query)
            const estadios = await Estadio.findAll({ order: [['nome', 'ASC']] })
            // const times = await Time.findAll({ order: [['nome', 'ASC']],where:{id_categoria:req.params.categoria}})
            const times = await database.query(`select Times.id_equipe, Times.nome as nomeTime, Categoria.nome as nomeCategoria,Categoria.id_categoria ,Categoria.sexo  from Times,Categoria where Times.id_categoria = Categoria.id_categoria and Categoria.id_categoria = ${req.params.categoria} ORDER BY nomeTime ASC`)
            const transmisoes = await Transmissao.findAll()
            const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] })
            res.render('jogos', { jogos: jogos[0], times: times[0], estadios: estadios, transmisoes: transmisoes, categorias: categorias ,id_categoria:req.params.categoria})
        } catch (error) {
            console.log(error)
        }

    },
    findAll: async (req, res) => {
        const query = "select Jogo.idjogo, jogo.id_equipe1,jogo.id_equipe2,Jogo.data, time1.nome  as nome_time1, pontos_time1, time2.nome as nome_time2 ,pontos_time2,estadio.nome as estadio,Categoria.nome as nomeCategoria,Categoria.id_categoria,Categoria.sexo from Jogo ,Times AS time1,Times as time2,estadio,Categoria WHERE Jogo.id_equipe1 = time1.id_equipe and time2.id_equipe = Jogo.id_equipe2 and estadio.idestadio = Jogo.idestadio and Categoria.id_categoria = Jogo.id_categoria order by jogo.data ASC"
        
        const estadios = await Estadio.findAll({ order: [['nome', 'ASC']] })
        const times = await database.query(`select Times.id_equipe, Times.nome as nomeTime, Categoria.nome as nomeCategoria,Categoria.id_categoria ,Categoria.sexo  from Times,Categoria where Times.id_categoria = Categoria.id_categoria  ORDER BY nomeTime ASC`)
        const jogos = await database.query(query)
        const transmisoes = await Transmissao.findAll()
        const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] })
        res.render('jogos', { jogos: jogos[0], times: times[0], estadios: estadios, transmisoes: transmisoes, categorias: categorias })
    },
    delete: async (req, res) => {
        try {
            req.query.categoria
            await Jogo.destroy({ where: { idjogo: req.query.id } })
            res.redirect('/jogos/'+ req.query.categoria);
        } catch (erro) {
            console.log(erro)
        }
    }
}
module.exports = jogoController