const { Estadio, Tranmiscao, Rotativo, Placar, Jogo, Cronometro, Imagem, Time, Jogador, Overlay, Merchan, Campeonatos,
    Categorias,
    Campeonato_Categorias } = require("./models");
Imagem.sync()
    .then(() => {
        console.log('Tabela IMAGEM sincronizada com sucesso.');
    })
Rotativo.sync()
    .then(() => {
        console.log('Tabela Rotativo sincronizada com sucesso.');
    })
Tranmiscao.sync()
    .then(() => {
        console.log('Tabela transmisao sincronizada com sucesso.');
    })
Placar.sync()
    .then(() => {
        console.log('Tabela Placar sincronizada com sucesso.');
    })
    .catch(error => {
        console.error('Erro ao sincronizar a tabela:', error);
    });
Cronometro.sync()
    .then(() => {
        console.log('Tabela Cronometro sincronizada com sucesso.');
    })
    .catch(error => {
        console.error('Erro ao sincronizar a tabela:', error);
    });
Jogo.sync()
    .then(() => {
        console.log('Tabela Jogo sincronizada com sucesso.');
    })
    .catch(error => {
        console.error('Erro ao sincronizar a tabela:', error);
    });
Jogador.sync()
    .then(() => {
        console.log('Tabela Jogador sincronizada com sucesso.');
    })
    .catch(error => {
        console.error('Erro ao sincronizar a tabela:', error);
    });
Time.sync()
    .then(() => {
        console.log('Tabela Time sincronizada com sucesso.');
    })
    .catch(error => {
        console.error('Erro ao sincronizar a tabela:', error);
    });
Estadio.sync()
    .then(() => {
        console.log('Tabela Estadio sincronizada com sucesso.');
    })
    .catch(error => {
        console.error('Erro ao sincronizar a tabela:', error);
    });
Overlay.sync()
    .then(() => {
        console.log('Tabela Overlay sincronizada com sucesso.');
    })
    .catch(error => {
        console.error('Erro ao sincronizar a tabela:', error);
    });
Merchan.sync()
    .then(() => {
        console.log('Tabela Merchan sincronizada com sucesso.');
    })
    .catch(error => {
        console.error('Erro ao sincronizar a tabela:', error);
    });
Campeonatos.sync()
    .then(() => {
        console.log('Tabela Campeonatos sincronizada com sucesso.');
    })
    .catch(error => {
        console.error('Erro ao sincronizar a tabela:', error);
    });
