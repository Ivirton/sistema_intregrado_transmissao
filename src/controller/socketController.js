const socketIo = require('socket.io');
const trasmisaoController = require('./transmicaoController');
const rotativoControler = require('./rotativoController');



const initializeSocket  =  (server) => {
    const io = socketIo(server);
    io.on('connection', async function (socket)  {
        console.log(`Socket conectado `) 
        trasmisaoController.socket(io,socket)
        rotativoControler.socket(io,socket)
    });
};
module.exports = { initializeSocket };