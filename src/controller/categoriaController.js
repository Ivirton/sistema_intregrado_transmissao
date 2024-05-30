const { Categoria } = require("../model/models");
const categoriaController = {
    create: async (req, res) => {
        try {
            await Categoria.create({
                nome: req.body.nomeCategoria.toLocaleUpperCase(),
                sexo: req.body.sexo
            })
            res.redirect('/categoria');
        } catch (erro) {
            console.log("Erro ao adiconar Categoria")
            res.redirect('/categoria');
        }
    },
    findAll: async (req, res) => {
        const categorias = await Categoria.findAll({order: [['nome', 'ASC']] })
        res.render('categoria',{categorias:categorias})
    },
    delete: async (req, res) => {
        try {
            await Categoria.destroy({ where: { id_categoria: req.query.id } })
            res.redirect('/categoria');
        } catch (erro) {
            console.log(erro)
        }
    }
}

module.exports = categoriaController