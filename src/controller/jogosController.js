
const database = require("../config/database");
const moment = require('moment-timezone');
const {Estadio,Tranmiscao,Jogo} = require("../model/models");

const {Time } = require("../model/models");


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
                partida:1
            })
           
            res.redirect('/jogos');
        } catch (erro) {
            console.log("Erro ao adiconar Jogo")
            res.redirect('/jogos');
        }
    },
    findAll: async (req, res) => {
        const query = "select Jogo.idjogo, jogo.id_equipe1,jogo.id_equipe2,Jogo.data, time1.nome  as nome_time1, pontos_time1, time2.nome as nome_time2 ,pontos_time2,estadio.nome as estadio from Jogo ,Times AS time1,Times as time2,estadio WHERE Jogo.id_equipe1 = time1.id_equipe and time2.id_equipe = Jogo.id_equipe2 and estadio.idestadio = Jogo.idestadio  order by jogo.data ASC"
        const estadios = await Estadio.findAll()
        const times = await Time.findAll({order: [['nome', 'ASC']] })
        const jogos = await database.query(query)
        const transmisoes = await Tranmiscao.findAll()

        res.render('jogos', { jogos: jogos[0], times: times, estadios: estadios,transmisoes:transmisoes})
    },
    delete: async (req, res) => {
        try {
            await Jogo.destroy({ where: { idjogo: req.query.id } })
            res.redirect('/jogos');
        } catch (erro) {
            console.log(erro)
        }
    }
}
module.exports = jogoController