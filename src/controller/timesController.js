const database = require("../config/database");
const { Time, Jogador, Categoria } = require("../model/models");

const timeController = {
    find: async (req, res) => {
        try {
            const time = await Time.findByPk(req.query.id)
            const jogadores = await Jogador.findAll({ where: { id_equipe: req.query.id } })
            res.render('time', { time: time, jogadores: jogadores,categorias: await Categoria.findAll({order: [['nome', 'ASC']] }) })
        } catch (error) {
            console.log(error)
        }

    },
    findAll: async (req, res) => {
        const times = await database.query("select Times.id_equipe, Times.nome as nomeTime, Categoria.nome as nomeCategoria,Categoria.id_categoria ,Categoria.sexo  from Times,Categoria where Times.id_categoria = Categoria.id_categoria ORDER BY nomeTime ASC")
        
        res.render('times', {
            times: times[0],
            categorias: await Categoria.findAll({order: [['nome', 'ASC']] })
        })
    },
    create: async (req, res) => {
        try {
            const { nomeTime,id_categoria } = req.body;
            const novoTime = await Time.create({
                nome: nomeTime.toLocaleUpperCase(),
                id_categoria: id_categoria
            })
            console.log('Time adicionado :', novoTime.toJSON());
        } catch (erro) {
            console.error('Erro ao adicionar o time:', error);
        }
        res.redirect('/times')
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