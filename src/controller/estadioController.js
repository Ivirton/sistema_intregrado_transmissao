const {Estadio} = require("../model/models");
const estadioController = {
    create: async (req, res) => {
        try {
            const novo = await Estadio.create({ nome: req.body.nomeEstadio })
            res.redirect('/estadios');
        } catch (erro) {
            console.log("Erro ao adiconar estadio")
            res.redirect('/estadios');
        }
    },
    findAll: async (req, res) => {
        const estadios = await Estadio.findAll({order: [['nome', 'ASC']] })
        res.render('estadios', { estadios: estadios })

    },
    delete: async (req, res) => {
        try {
            console.log(req.query.id)
            await Estadio.destroy({ where: { idestadio: req.query.id } })
            res.redirect('/estadios');
        }catch(erro){
            console.log(erro)
        }
    }
}

module.exports = estadioController