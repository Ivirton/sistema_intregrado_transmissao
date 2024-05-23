const { Campeonatos } = require("../model/models");

const campeonatosController = {
    create: async (req, res) => {
        try {
            const { nome, ano } = req.body;
            await Campeonatos.create({
                nome: nome,
                ano: ano
            })
        } catch (erro) {
            console.error('Erro ao adicionar o campeonato:', error);
        } finally {
            res.redirect('/campeonatos')
        }
    },
    findAll: async (req, res) => {
        const campeonatos = await Campeonatos.findAll()
        res.render('campeonatos', { campeonatos: campeonatos })
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const team = await Campeonatos.findByPk(id);
            await team.destroy();
            res.redirect('/campeonatos');
        } catch (erro) {
            console.log(erro)
        }
    },
    find: async (req, res) => {
        const { id } = req.params;
        try {
            const campeonato = await Campeonatos.findByPk(id);
            res.render('campeonato', { campeonato: campeonato});
        } catch (error) {
            res.redirect('/');
        }
    }
}

module.exports = campeonatosController