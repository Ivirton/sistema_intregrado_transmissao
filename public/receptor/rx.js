socket = io();

function enviarMensagemSocket(id_transmissao, entidade, valor_entidade, atributo, valor_atributo) {
  const send = {
    id_socket: socket.id,
    cliente:'rx',
    "entidade": "transmissao",
    "id_transmissao": id_transmissao,
    "tipo": atributo,
    [entidade]: valor_entidade,
    [atributo]: valor_atributo
  }
  send["id_transmissao"] = id_transmissao
  socket.emit(`transmissao_t${id_transmissao}`, send);
}

const { createApp } = Vue;
const appp = createApp({
  data() {
    return {
      cronometro: {
        ativo: null,
        interval: null,
      },
      transmisao: {
        id_placar: 0,
        id_transmissao: 0,
        placar_visibilidade: null,
        placar_x: 0,
        placar_y: 0,
        placar_z: 0,
        idjogo: 0,
        nome: '',
        id_rotativo: 0,
        rotativo_visibilidade: 0,
        rotativo_x: 0,
        rotativo_y: 0,
        rotativo_z: 0,
        duracao: 0,
        icone: null,
        id_cronometro: 0,
        minuto: 3,
        segundo: 0,
        tipo_cronometro: null,
      },
      jogo: {
        idjogo: null,
        nome_time1: "nome",
        nome_time2: "nome",
        pontos_time1: 0,
        pontos_time2: 0,
        partida: null
      },
      carrosel: {
        imagemAtual: null,
        value: [],
        interval: null,
        duracao: 0,
        indice: 0,
        contador: 0,
      }
    }
  },
  mounted() {
  },
  methods: {
    listen() {
      const send = {
        entidade: "transmissao",
        tipo: "segundo",
        id_transmissao: this.transmisao.id_transmissao,
        id_cronometro: this.transmisao.id_cronometro,
        segundo: this.transmisao.segundo
      }
      socket.emit(`transmissao`, send)
      socket.on(`transmissao_t${this.transmisao.id_transmissao}`, (menssagem) => {
        console.log(menssagem)
        if (menssagem.tipo === "receptor") {
          this.transmisao = menssagem.transmissao
          this.transmisao.placar_visibilidade = menssagem.transmissao.placar_visibilidade === "true" ? true : false
          this.transmisao.rotativo_visibilidade = menssagem.transmissao.rotativo_visibilidade === "true" ? true : false
          this.transmisao.overlay_visibilidade = menssagem.transmissao.overlay_visibilidade === "true" ? true : false
          this.transmisao.icone = menssagem.transmissao.icone === "true" ? true : false
          this.jogo = menssagem.jogo
        } else {
          switch (menssagem.entidade) {
            case "transmissao":
              this.transmisao[menssagem.tipo] = menssagem[menssagem.tipo]
              if (menssagem.tipo === "icone") {
                if (menssagem.icone) {
                  this.play();
                } else {
                  this.pause();
                }
              }
              if (menssagem.tipo === "stop") {
                this.stop()
              }
              break;
            case "jogo":
              this.jogo[menssagem.tipo] = menssagem[menssagem.tipo]
              break;
          }
        }
      });
    },
    //CRONÔMETRO
    pause() {
      clearInterval(this.cronometro.interval);
      this.transmisao.icone = false
      this.cronometro.ativo = false;
    },
    stop() {
      clearInterval(this.cronometro.interval);
      this.transmisao.minuto = 0
      this.transmisao.segundo = 0
      this.cronometro.ativo = false;
      enviarMensagemSocket(this.transmisao.id_transmissao, "id_cronometro", this.transmisao.id_cronometro, "minuto", this.transmisao.minuto)
      enviarMensagemSocket(this.transmisao.id_transmissao, "id_cronometro", this.transmisao.id_cronometro, "segundo", this.transmisao.segundo)
    },
    play() {
      this.cronometro.interval = setInterval(() => {

        if (this.transmisao.tipo_cronometro === 0) {
          this.contagemProgressiva();
          this.cronometro.ativo = true;
        } else {
          this.contagemRegressiva();
          this.cronometro.ativo = true;
        }
      }, 1200);
    },
    contagemProgressiva() {

      if (this.transmisao.minuto === this.transmisao.duracao) {
        this.transmisao.minuto = 0
        this.transmisao.segundo = 0
        enviarMensagemSocket(this.transmisao.id_transmissao, "id_cronometro", this.transmisao.id_cronometro, "minuto", this.transmisao.minuto)
        enviarMensagemSocket(this.transmisao.id_transmissao, "id_cronometro", this.transmisao.id_cronometro, "segundo", this.transmisao.segundo)
      }
      else {
        if (this.transmisao.segundo === 59) {
          this.transmisao.minuto++;
          this.transmisao.segundo = 0;
          enviarMensagemSocket(this.transmisao.id_transmissao, "id_cronometro", this.transmisao.id_cronometro, "minuto", this.transmisao.minuto);
        } else {
          this.transmisao.segundo++
        }
        enviarMensagemSocket(this.transmisao.id_transmissao, "id_cronometro", this.transmisao.id_cronometro, "segundo", this.transmisao.segundo);
      }
    },
    contagemRegressiva() {

      if (!this.cronometro.ativo && this.transmisao.minuto === 0 && this.transmisao.segundo === 0) {
        this.transmisao.minuto = this.transmisao.duracao
        this.transmisao.segundo = 0
      }
      if (this.transmisao.minuto === 0 && this.transmisao.segundo === 0) {
        this.stop();
      } else {
        if (this.cronometro.ativo) {
          if (this.transmisao.segundo === 0) {
            if (this.transmisao.minuto !== 0) {
              this.transmisao.minuto--;
              this.transmisao.segundo = 59;
              enviarMensagemSocket(this.transmisao.id_transmissao, "id_cronometro", this.transmisao.id_cronometro, "minuto", this.transmisao.minuto);
            }
          } else {
            this.transmisao.segundo--;
            enviarMensagemSocket(this.transmisao.id_transmissao, "id_cronometro", this.transmisao.id_cronometro, "segundo", this.transmisao.segundo);
          }
        }
      }
    },
    //CARROSEL
    atualizarCarrosel() {
      fetch('/api_carroselAtivo')
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao buscar imagens');
          }
          return response.json();
        })
        .then((data) => {
          console.log(data)
          this.carrosel.value = data
        })
        .catch(error => {
          console.error('Erro ao buscar imagens:', error);
        });
    },
    proximo() {
      this.carrosel.indice++;
      // Verifica se o índice ultrapassou o limite máximo
      if (this.carrosel.indice >= this.carrosel.value.length) {
        //atualiza a lista
        this.atualizarCarrosel()
        this.carrosel.indice = 0;
      }
      if (this.carrosel.value.length != 0) {
        // Obtém a próxima imagem e sua duração
        const proximaImagem = this.carrosel.value[this.carrosel.indice];
        this.carrosel.imagemAtual = `/pictures/carrossel/${proximaImagem.url}`;
        this.carrosel.duracao = proximaImagem.duracao;
      } else {
        this.carrosel.imagemAtual = ""
      }
    },
    carrosel_play() {
      this.carrosel.interval = setInterval(() => {
        if (this.carrosel.duracao === this.carrosel.contador) {
          this.proximo()
          this.carrosel.contador = 0
        }
        // console.log(this.carrosel.contador)
        this.carrosel.contador++
      }, 1000)
    },
    carrosel_pause() {
      clearInterval(this.carrosel.interval)
      this.carrosel.contador = 0
      this.carrosel.duracao = 0

    }
  }
}
).mount('#app');


