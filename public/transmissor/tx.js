socket = io();
const { createApp } = Vue
function enviarTransmissaoSocket(id_transmicao, entidade, valor_entidade, atributo, valor_atributo) {
  const send = {
    "entidade": "transmicao",
    "id_transmicao": id_transmicao,
    "tipo": atributo,
    [entidade]: valor_entidade,
    [atributo]: valor_atributo
  }
  send["id_transmicao"] = id_transmicao
  socket.emit(`transmissao_t${id_transmicao}`, send);
}
function enviarJogoSocket(id_transmicao, entidade, valor_entidade, atributo, valor_atributo) {
  const send = {
    "entidade": "jogo",
    "id_transmicao": id_transmicao,
    "tipo": atributo,
    [entidade]: valor_entidade,
    [atributo]: valor_atributo
  }
  send["id_transmicao"] = id_transmicao
  socket.emit(`transmissao_t${id_transmicao}`, send);
}
const appp = createApp({
  data() {
    return {
      transmisao: {
        id_placar: 0,
        id_transmicao: 0,
        placar_visibilidade: false,
        placar_x: 0,
        placar_y: 0,
        placar_z: 0,
        idjogo: 0,
        nome: 'EQUIPE 1',
        id_rotativo: 0,
        rotativo_visivilidade: true,
        rotativo_x: 0,
        rotativo_y: 0,
        rotativo_z: 0,
        id_cronometro: 1,
        tipo_cronometro: 0,
        minuto: 0,
        segundo: 0,
        icone: false,
        duracao: 45,
        icone: "play",
        id_cronometro: 0,
        minuto: 3,
        segundo: 0,
        tipo_cronometro: null
      },
      jogo: {
        idjogo: 0,
        nome_time1: "",
        nome_time2: "",
        pontos_time1: null,
        pontos_time2: null,
        partida: null
      }
    }
  },
  methods: {
    listen() {
      socket.on(`transmissao_t${this.transmisao.id_transmicao}`, (menssagem) => {
        console.log(menssagem)
        if (menssagem.tipo === "receptor") {
          this.transmisao = menssagem.transmissao
          this.transmisao.placar_visibilidade = menssagem.transmissao.placar_visibilidade === "true" ? true : false
          this.transmisao.rotativo_visibilidade = menssagem.transmissao.rotativo_visibilidade === "true" ? true : false
          this.transmisao.icone = menssagem.transmissao.icone === "true" ? true : false
          this.jogo = menssagem.jogo
        } else {
          switch (menssagem.entidade) {
            case "transmicao":
              this.transmisao[menssagem.tipo] = menssagem[menssagem.tipo]
              if (menssagem.tipo === "minuto") {
                if (this.transmisao.tipo_cronometro === 0 && this.transmisao.minuto === this.transmisao.duracao) {
                  this.transmisao.icone = false
                  enviarTransmissaoSocket(this.transmisao.id_transmicao, "id_cronometro", this.transmisao.id_cronometro, "icone", this.transmisao.icone)
                }
              }
              if (menssagem.tipo === "segundo") {
                if (this.transmisao.tipo_cronometro === 1 && this.transmisao.minuto === 0 && this.transmisao.segundo === 0) {
                  this.transmisao.icone = false
                  enviarTransmissaoSocket(this.transmisao.id_transmicao, "id_cronometro", this.transmisao.id_cronometro, "icone", this.transmisao.icone)
                }
              }
              break;
            case "jogo":
              this.jogo[menssagem.tipo] = menssagem[menssagem.tipo]
              break;
          }
        }
      });
    },
    incrementar_partida() {
      this.jogo.partida++
      enviarJogoSocket(this.transmisao.id_transmicao, "idjogo", this.transmisao.idjogo, "partida", this.jogo.partida)
    },
    decrementar_partida() {
      if (this.jogo.partida > 1) {
        this.jogo.partida--
        enviarJogoSocket(this.transmisao.id_transmicao, "idjogo", this.transmisao.idjogo, "partida", this.jogo.partida)
      }
    },
    incrementar_time1() {
      this.jogo.pontos_time1++
      enviarJogoSocket(this.transmisao.id_transmicao, "idjogo", this.transmisao.idjogo, "pontos_time1", this.jogo.pontos_time1)
    },
    incrementar_time2() {
      this.jogo.pontos_time2++
      enviarJogoSocket(this.transmisao.id_transmicao, "idjogo", this.transmisao.idjogo, "pontos_time2", this.jogo.pontos_time2)
    },
    decrementar_time1() {
      if (this.jogo.pontos_time1 > 0) {
        this.jogo.pontos_time1--
        enviarJogoSocket(this.transmisao.id_transmicao, "idjogo", this.transmisao.idjogo, "pontos_time1", this.jogo.pontos_time1)
      }
    },
    decrementar_time2() {
      if (this.jogo.pontos_time2 > 0) {
        this.jogo.pontos_time2--
        enviarJogoSocket(this.transmisao.id_transmicao, "idjogo", this.transmisao.idjogo, "pontos_time2", this.jogo.pontos_time2)
      }
    },
    placar_visibilidade_tx() {
      enviarTransmissaoSocket(this.transmisao.id_transmicao, "id_placar", this.transmisao.id_placar, "placar_visibilidade", this.transmisao.placar_visibilidade)
    },
    placar_x_tx() {
      enviarTransmissaoSocket(this.transmisao.id_transmicao, "id_placar", this.transmisao.id_placar, "placar_x", this.transmisao.placar_x)
    },
    placar_y_tx() {
      enviarTransmissaoSocket(this.transmisao.id_transmicao, "id_placar", this.transmisao.id_placar, "placar_y", this.transmisao.placar_y)
    },
    placar_z_tx() {
      enviarTransmissaoSocket(this.transmisao.id_transmicao, "id_placar", this.transmisao.id_placar, "placar_z", this.transmisao.placar_z)
    },
    rotativo_visibilidade_tx() {
      enviarTransmissaoSocket(this.transmisao.id_transmicao, "id_rotativo", this.transmisao.id_rotativo, "rotativo_visibilidade", this.transmisao.rotativo_visibilidade)
    },
    rotativo_x_tx() {
      enviarTransmissaoSocket(this.transmisao.id_transmicao, "id_rotativo", this.transmisao.id_rotativo, "rotativo_x", this.transmisao.rotativo_x)
    },
    rotativo_y_tx() {
      enviarTransmissaoSocket(this.transmisao.id_transmicao, "id_rotativo", this.transmisao.id_rotativo, "rotativo_y", this.transmisao.rotativo_y)
    },
    rotativo_z_tx() {
      enviarTransmissaoSocket(this.transmisao.id_transmicao, "id_rotativo", this.transmisao.id_rotativo, "rotativo_z", this.transmisao.rotativo_z)
    },
    cronometro_duracao_tx() {
      enviarTransmissaoSocket(this.transmisao.id_transmicao, "id_cronometro", this.transmisao.id_cronometro, "duracao", this.transmisao.duracao)
    },
    cronometro_play_tx() {
      this.transmisao.icone = !this.transmisao.icone
      enviarTransmissaoSocket(this.transmisao.id_transmicao, "id_cronometro", this.transmisao.id_cronometro, "icone", this.transmisao.icone)
    },
    cronometro_tipo_cronometro_tx() {
      enviarTransmissaoSocket(this.transmisao.id_transmicao, "id_cronometro", this.transmisao.id_cronometro, "tipo_cronometro", this.transmisao.tipo_cronometro)
    },
    cronometro_stop_tx() {
      enviarTransmissaoSocket(this.transmisao.id_transmicao, "id_cronometro", this.transmisao.id_cronometro, "stop", "stop")
      this.transmisao.icone = false
      enviarTransmissaoSocket(this.transmisao.id_transmicao, "id_cronometro", this.transmisao.id_cronometro, "icone", this.transmisao.icone)

    },
  },
}).mount('#app')

