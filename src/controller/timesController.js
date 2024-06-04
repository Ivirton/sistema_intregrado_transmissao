const database = require("../config/database");
const { Time, Jogador, Categoria, Transmissao } = require("../model/models");

const timeController = {
    find: async (req, res) => {
        try {
            const query = `
            select Jogo.idjogo, jogo.id_equipe1,jogo.id_equipe2,Jogo.data, time1.nome  as nome_time1, pontos_time1, time2.nome as nome_time2 ,pontos_time2,estadio.nome as estadio,Categoria.nome as nomeCategoria,Categoria.id_categoria,Categoria.sexo  from Jogo ,Times AS time1,Times as time2,estadio,Categoria WHERE Jogo.id_equipe1 = time1.id_equipe and time2.id_equipe = Jogo.id_equipe2 and estadio.idestadio = Jogo.idestadio and Categoria.id_categoria = Jogo.id_categoria and (id_equipe1 = ${req.query.id} OR id_equipe2 = ${req.query.id})  order by jogo.data DESC;`
            const transmisoes = await Transmissao.findAll()
            const time = await Time.findByPk(req.query.id)
            const jogadores = await Jogador.findAll({ where: { id_equipe: req.query.id } })
            const jogos = await database.query(query)
            res.render('time', { transmisoes: transmisoes,jogos: jogos[0],time: time, jogadores: jogadores, categorias: await Categoria.findAll({ order: [['nome', 'ASC']] }) })
        } catch (error) {
            console.log(error)
        }

    },
    findCategoria: async (req, res) => {

        const times = await database.query(`select Times.id_equipe, Times.nome as nomeTime, Categoria.nome as nomeCategoria,Categoria.id_categoria ,Categoria.sexo  from Times,Categoria where Times.id_categoria = Categoria.id_categoria and Categoria.id_categoria = ${req.params.timeCategoria} ORDER BY nomeTime ASC`)

        res.render('times', {
            times: times[0],
            categorias: await Categoria.findAll({ order: [['nome', 'ASC']] })
        })
    },
    findAll: async (req, res) => {
        const times = await database.query("select Times.id_equipe, Times.nome as nomeTime, Categoria.nome as nomeCategoria,Categoria.id_categoria ,Categoria.sexo  from Times,Categoria where Times.id_categoria = Categoria.id_categoria ORDER BY nomeTime ASC")

        res.render('times', {
            times: times[0],
            categorias: await Categoria.findAll({ order: [['nome', 'ASC']] })
        })
    },
    create: async (req, res) => {
        try {
            const { nomeTime, id_categoria } = req.body;
            const novoTime = await Time.create({
                nome: nomeTime.toLocaleUpperCase(),
                id_categoria: id_categoria
            })
            res.redirect('/time?id='+novoTime.id_equipe)
        } catch (erro) {
            console.error('Erro ao adicionar o time:', erro);
            res.redirect('/times')
        }
       
    },
    delete: async (req, res) => {
        try {
            const remover = await Time.destroy({ where: { id_equipe: req.query.id } })
            console.log('Time removido', remover)
        } catch (erro) {
            console.error(erro);
        }
        res.redirect('/times')
    },
    update: async (req, res) => {
        try {
            const { nomeTime, id, id_categoria } = req.body;
            const result = await Time.update(
                {
                    nome: nomeTime,
                    id_categoria: id_categoria
                },
                {
                    where: {
                        id_equipe: id
                    }
                }
            );
            if (result[0] === 1) {
                console.log("Time atualizado com sucesso");
                res.redirect("/time?id=" + id);
            } else {
                console.log("Time não encontrado ou não atualizado.");
                res.redirect("/time?id=" + id);
            }
        } catch (error) {
            res.redirect("/time?id=" + id);
            console.error("Erro ao atualizar o time:", error);
            // res.status(500).send("Erro interno do servidor ao atualizar o time.");
        }

    }
}

module.exports = timeController