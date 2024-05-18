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
        try {
            console.log(req.body)
            const novo = await Merchan.create({
                url:`${req.file.filename}`,
                ativo: "false"
            })
            res.redirect('/carrossel');
        } catch (erro) {
            console.log("Erro ao adiconar merchan")
            res.redirect('/carrossel');
        }
    },
    findAll: async (req, res) => {
       

    },
    delete: async (req, res) => {
        try {
            const remover = await Merchan.findAll({ where: { id_merchan: req.query.id } })
            let filePath = "public/pictures/merchan/" + remover[0].url
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                const remover =  await Merchan.destroy({ where: { id_merchan: req.query.id } })
                console.log(`File ${filePath} arquivo removido.`);
            } else {
                console.log(`File ${filePath} arquivo nao existe.`);
            }
            res.redirect('/carrossel');
        } catch (erro) {
            console.log(erro)
            res.redirect('/carrossel');
        }
    }

}

module.exports = MerchaController;