const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Merchan } = require("../model/models");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/pictures/merchan');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, file.originalname); // Salva com o nome original do arquivo
    },
});
const MerchaController = {
    upload: multer({ storage: storage }),
    create: async (req, res) => {
        const id_transmicao = req.body.id_transmicao
        const idjogo = req.body.idjogo
        try {
            const novo = await Merchan.create({
                url: `${req.file.filename}`,
                ativo: "false"
            })
            res.redirect(`/transmisao?id=${id_transmicao}&idjogo=${idjogo}`);
        } catch (erro) {
            res.redirect(`/transmisao?id=${id_transmicao}&idjogo=${idjogo}`);
        }
    },
    delete: async (req, res) => {
        const id_transmissao = req.query.id_transmissao
        const idjogo = req.query.idjogo
        console.log(req.query)
        try {
            const remover = await Merchan.findAll({ where: { id_merchan: req.query.id } })
            let filePath = "public/pictures/merchan/" + remover[0].url
            await Merchan.destroy({ where: { id_merchan: req.query.id } })
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (erro) {
            console.log("erro ao deletar"+erro)
        }
        res.redirect(`/transmisao?id=${id_transmissao}&idjogo=${idjogo}`);
    }

}

module.exports = MerchaController;