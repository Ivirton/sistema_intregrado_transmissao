const { Tranmiscao, Rotativo, Placar, Jogo, Cronometro, Merchan, Overlay } = require("../model/models")
const database = require("../config/database");
const trasmisaoController = {
    getTransmisao: async function (id_transmicao) {
        const data = await database.query("select * from Placar,Transmicao,Rotativo,Cronometro,Overlay where Placar.id_transmicao = Transmicao.id_transmicao and Rotativo.id_rotativo = Transmicao.id_rotativo and Cronometro.id_placar = Placar.id_placar  and Overlay.id_transmicao = Transmicao.id_transmicao and Transmicao.id_transmicao=" + id_transmicao)
        return data[0][0]
    },
    getJogo: async function (idjogo) {
        const data = await database.query("select Jogo.idjogo, jogo.id_equipe1,jogo.id_equipe2,Jogo.data, time1.nome  as nome_time1,partida,pontos_time1, time2.nome as nome_time2 ,pontos_time2,estadio.nome as estadio from Jogo,Times AS time1,Times as time2,estadio WHERE Jogo.id_equipe1 = time1.id_equipe and time2.id_equipe = Jogo.id_equipe2 and estadio.idestadio = Jogo.idestadio and Jogo.idjogo = " + idjogo)
        return data[0][0]
    },
    receptor: async (req, res) => {
        if (req.query.id_transmicao) {
            const transmissao = await database.query(`select Placar.id_placar,Transmicao.nome ,Transmicao.id_transmicao,Rotativo.id_rotativo,placar_visibilidade,placar_x,placar_y,placar_z, rotativo_visibilidade,rotativo_x,rotativo_y,rotativo_z,Cronometro.id_cronometro,Cronometro.tipo_cronometro,Cronometro.duracao,
            Cronometro.icone,Cronometro.minuto,Cronometro.segundo
            from Placar,Transmicao,Rotativo,Cronometro
            where Placar.id_transmicao = Transmicao.id_transmicao and Rotativo.id_rotativo = Transmicao.id_rotativo and Cronometro.id_placar = Placar.id_placar and Transmicao.id_transmicao= ${req.query.id_transmicao}`)
            console.log(transmissao[0][0])
            res.render('receptor', { transmissao: transmissao[0][0] })
        } else {
            res.render('naoencontrada')
        }

    },
    transmisoes: async (req, res) => {
        const transmisoes = await Tranmiscao.findAll();
        res.render('transmisoes', { transmisoes: transmisoes });
    },
    transmisao: async (req, res) => {
        if (req.query.idjogo && req.query.id) {
            const jogo = await trasmisaoController.getJogo(req.query.idjogo)
            const transmissao = await trasmisaoController.getTransmisao(req.query.id)
            const merchans = await Merchan.findAll()
            await database.query(`UPDATE Placar SET idjogo =${req.query.idjogo} WHERE id_placar =${transmissao.id_placar}`)
            // await Placar.update({ idjogo: req.query.idjogo }, { where: { id_placar: transmissao.id_placar } });

            res.render('transmisao', { transmissao: transmissao, jogo: jogo, merchans: merchans });
        }
    },
    create: async (req, res) => {
        const rotativo = await Rotativo.create({
            rotativo_visivilidade: true,
            rotativo_x: 0,
            rotativo_y: 0,
            rotativo_z: 100
        })

        const novoTransmisao = await Tranmiscao.create({
            nome: req.body.nome,
            id_rotativo: rotativo.id_rotativo
        });
        const placar = await Placar.create({
            idjogo: null,
            id_transmicao: novoTransmisao.id_transmicao,
            placar_visivilidade: true,
            placar_x: 1,
            placar_y: 1,
            placar_z: 100
        })

        await Cronometro.create({
            id_placar: placar.id_placar,
            tipo_cronometro: 0,
            minuto: 1,
            segundo: 4,
            icone: "play",
            duracao: 0
        })
        await Overlay.create({ ativo: false, id_transmicao: novoTransmisao.id_transmicao })
        res.redirect('/transmisoes');
    },
    delete: async (req, res) => {
        await Tranmiscao.destroy({ where: { id_transmicao: req.query.id } });
        res.redirect('/transmisoes');
    },
    socket: async (io, socket) => {
        socket.on("transmissao", async function (menssagem) {
            if (menssagem.tipo === "transmissao") {
                const send = {
                    tipo: "receptor",
                    transmissao: await trasmisaoController.getTransmisao(menssagem.id_transmicao),
                    jogo: await trasmisaoController.getJogo(menssagem.idjogo)
                }
                io.emit(`transmissao_t${menssagem.id_transmicao}`, send)
            } else {
                io.emit(`transmissao_t${menssagem.id_transmicao}`, menssagem)
            }
            console.log(menssagem)
            socket.on(`transmissao_t${menssagem.id_transmicao}`, async function (menssagem) {
                console.log(menssagem)
                switch (menssagem.tipo) {
                    //PLACAR
                    case "placar_visibilidade":
                        await database.query(`UPDATE Placar SET placar_visibilidade= '${menssagem.placar_visibilidade}' WHERE id_placar =${menssagem.id_placar}`)
                        break;
                    case "placar_x":
                        await Placar.update({ placar_x: menssagem.placar_x }, { where: { id_placar: menssagem.id_placar } });
                        break;
                    case "placar_y":
                        await Placar.update({ placar_y: menssagem.placar_y }, { where: { id_placar: menssagem.id_placar } });
                        break;
                    case "placar_z":
                        await Placar.update({ placar_z: menssagem.placar_z }, { where: { id_placar: menssagem.id_placar } });
                        break;
                    //JOGO
                    case "pontos_time1":
                        await Jogo.update({ pontos_time1: menssagem.pontos_time1 }, { where: { idjogo: menssagem.idjogo } });
                        break;
                    case "pontos_time2":
                        await Jogo.update({ pontos_time2: menssagem.pontos_time2 }, { where: { idjogo: menssagem.idjogo } });
                        break;
                    case "partida":
                        await Jogo.update({ partida: menssagem.partida }, { where: { idjogo: menssagem.idjogo } });
                        break;
                    //ROTATIVO
                    case "rotativo_visibilidade":
                        await database.query(`UPDATE Rotativo SET rotativo_visibilidade= "${menssagem.rotativo_visibilidade}" WHERE id_rotativo = ${menssagem.id_rotativo}`)
                        break;
                    case "rotativo_x":
                        await Rotativo.update({ rotativo_x: menssagem.rotativo_x }, { where: { id_rotativo: menssagem.id_rotativo } });
                        break;
                    case "rotativo_y":
                        await Rotativo.update({ rotativo_y: menssagem.rotativo_y }, { where: { id_rotativo: menssagem.id_rotativo } });
                        break;
                    case "rotativo_z":
                        await Rotativo.update({ rotativo_z: menssagem.rotativo_z }, { where: { id_rotativo: menssagem.id_rotativo } });
                        break;
                    //CRONOMETRO
                    case "duracao":
                        await Cronometro.update({ duracao: menssagem.duracao }, { where: { id_cronometro: menssagem.id_cronometro } });
                        break;
                    case "tipo_cronometro":
                        await Cronometro.update({ tipo_cronometro: parseInt(menssagem.tipo_cronometro) }, { where: { id_cronometro: menssagem.id_cronometro } });
                        break;
                    case "icone":
                        await database.query(`UPDATE Cronometro SET icone= '${menssagem.icone}' WHERE id_cronometro =${menssagem.id_cronometro}`)
                        break;
                    case "minuto":
                        await Cronometro.update({ minuto: menssagem.minuto }, { where: { id_cronometro: menssagem.id_cronometro } });
                        break
                    case "segundo":
                        await Cronometro.update({ segundo: menssagem.segundo }, { where: { id_cronometro: menssagem.id_cronometro } });
                        break
                    case "overlay_visibilidade":
                        await database.query(`UPDATE Overlay SET overlay_visibilidade= "${menssagem.overlay_visibilidade}" WHERE id_overlay = ${menssagem.id_overlay}`)
                        break
                        case "fundo":
                            await database.query(`UPDATE Overlay SET fundo= "${menssagem.fundo}" WHERE id_overlay = ${menssagem.id_overlay}`)
                            break
                }
                io.emit(`transmissao_t${menssagem.id_transmicao}`, menssagem)
            })
        })
    }

}
module.exports = trasmisaoController;