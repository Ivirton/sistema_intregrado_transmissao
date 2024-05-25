const { Time, Jogador } = require("../model/models");

const timeController = {
    find: async (req, res) => {
        try {
            const time = await Time.findByPk(req.query.id)
            const jogadores = await Jogador.findAll({ where: { id_equipe: req.query.id } })
            res.render('time', { time: time, jogadores: jogadores })
        } catch (error) {
            console.log(error)
        }

    },
    findAll: async (req, res) => {
        res.render('times', {
            times: await Time.findAll({ order: [['nome', 'ASC']] })
        })
    },
    create: async (req, res) => {
        try {
            const { nomeTime, sexoTime, categoriaTime } = req.body;
            const novoTime = await Time.create({
                nome: nomeTime,
                categoria: categoriaTime,
                sexo: sexoTime
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
            const { nomeTime, id,sexoTime, categoriaTime } = req.body;
            const result = await Time.update(
                {
                    nome: nomeTime,
                    categoria: categoriaTime,
                    sexo:sexoTime
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