const { Jogador } = require("../model/models");
const jogadorController = {
    find  : async (req, res) => {
        const jogador = await Jogador.findByPk(req.query.id)
        console.log(jogador)
        res.render('jogador', { jogador: jogador })
    },
    create: async (req, res) => {
        try {
            await Jogador.create({
                nome: req.body.nomeJogador,
                numero: req.body.numeroJogador,
                posicao: req.body.posicaoJogador,
                foto: null,
                titular: null,
                id_equipe: req.body.id
            });

        } catch (error) {
            console.error('Erro ao adicionar o novoJogador:', error);
        }
        res.redirect('time?id=' + req.body.id)
    },
    delete: async (req, res) => {
        try {
            await Jogador.destroy({ where: { id_jogador: req.query.jogador } })
        } catch (erro) {
            console.error(erro)
        }
        res.redirect('time?id=' + req.query.time)
    },
    update: async (req, res) => {
        try {
            const { nomeJogador, numeroJogador, posicaoJogador, id } = req.body;
            const result = await Jogador.update(
                {
                    nome: nomeJogador,
                    numero: numeroJogador,
                    posicao: posicaoJogador,
                },
                { where: { id_jogador: id } }
            );
            if (result[0] === 1) {
                res.redirect("/jogador?id=" + id);
            } else {
                res.redirect("/jogador?id=" + id);
            }
        } catch (error) {
            res.redirect("/jogador?id=" + id);
            // res.status(500).send("Erro interno do servidor ao atualizar o time.");
        }

    }
}



module.exports = jogadorController