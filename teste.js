class Cronometro {
    constructor(duracaoMaxima) {
        this.duracaoMaxima = duracaoMaxima;
        this.minutos = 0;
        this.segundos = 0;
        this.intervalId = null;
        this.tipo = "progressivo"; // Pode ser "progressivo" ou "regressivo"
    }

    iniciar() {
        this.intervalId = setInterval(() => {
            if (this.tipo === "progressivo") {
                this.segundos++;
                if (this.segundos === 60) {
                    this.segundos = 0;
                    this.minutos++;
                }
            } else {
                if (this.segundos === 0) {
                    if (this.minutos === 0) {
                        this.parar();
                        return;
                    }
                    this.minutos--;
                    this.segundos = 59;
                } else {
                    this.segundos--;
                }
            }
            console.log(`Tempo: ${this.minutos}:${this.segundos}`);
        }, 1000);
    }

    pausar() {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }

    resetar() {
        this.minutos = 0;
        this.segundos = 0;
        console.log("Cronômetro resetado.");
    }

    definirTipo(tipo) {
        this.tipo = tipo;
    }
}

const cronometro = new Cronometro(1); // Duração máxima de 5 minutos
cronometro.definirTipo("progressivo"); // Ou "regressivo"
cronometro.iniciar();

// Exemplo de como usar os botões:
// botão play
cronometro.iniciar();
// botão pause
cronometro.pausar();
// botão reset
// cronometro.resetar();
