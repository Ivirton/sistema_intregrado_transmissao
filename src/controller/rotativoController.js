const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Imagem } = require('../model/models');
// Configuração do Multer para o upload de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/pictures/carrossel');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, file.originalname); // Salva com o nome original do arquivo
    },
});


const rotativoControler = {
    upload: multer({ storage: storage }),
    create: async (req, res) => {
        try {
            console.log(req.body)
            const novo = await Imagem.create({
                url:`${req.file.filename}`,
                duracao:parseInt(req.body.duracao),
                ativo: req.body.ativo === "on" ? "true": "false"
            })
            res.redirect('/carrossel');
        } catch (erro) {
            console.log("Erro ao adiconar Jogo")
            res.redirect('/carrossel');
        }
    },
    findAll: async (req, res) => {
        const imagens = await Imagem.findAll()
        res.render('carrossel',{imagens:imagens})
    },
    delete: async (req, res) => {
        try {
            const remover = await Imagem.findAll({ where: { id_imagem: req.query.id } })
            

            let filePath = "public/pictures/carrossel/" + remover[0].url
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                const remover =  await Imagem.destroy({ where: { id_imagem: req.query.id } })
                console.log(`File ${filePath} arquivo removido.`);
            } else {
                console.log(`File ${filePath} arquivo nao existe.`);
            }
            res.redirect('/carrossel');
        } catch (erro) {
            console.log(erro)
            res.redirect('/carrossel');
        }
    },
    socket:(io,socket)=>{
        socket.on("imagem_duracao", async function (menssagem) {
            console.log(menssagem)
            await Imagem.update({duracao:menssagem.duracao},{where:{id_imagem:menssagem.id_imagem}})
            io.emit(`imagem_duracao`, menssagem)
        })
    },
    api_carroselAtivo : async (req,res) =>{
        try {
            const imagens = await Imagem.findAll({ where: { ativo: "true" } });
            res.json(imagens);
            // if (imagens.length > 0) {
            //     res.json(imagens);
            // } else {
            //     res.status(404).json({ error: "No active images found" });
            // }
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

}
module.exports = rotativoControler