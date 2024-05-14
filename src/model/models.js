const { DataTypes } = require('sequelize');
//Conexão com o banco de dados 
const database = require('../config/database');
//Todos os modelos de entidades 
const Estadio = database.define('Estadio', {
    idestadio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
}, {
    tableName: 'estadio',
    timestamps: false
});
const Cronometro = database.define('Cronometro', {
    id_cronometro: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo_cronometro: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    minuto: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    segundo: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    icone: {
        type: DataTypes.BLOB,
        allowNull: true
    },
    id_placar: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Placar',
            key: 'id_placar',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    },
    duracao: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'Cronometro',
    timestamps: false
});
const Jogador = database.define('Jogador', {
    id_jogador: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    numero: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    posicao: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    foto: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    titular: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    id_equipe: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Time',
            key: 'id_equipe',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    }
}, {
    tableName: 'jogador',
    timestamps: false // Se você não estiver rastreando timestamps de criação/atualização
});
const Jogo = database.define('Jogo', {
    idjogo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    data: {
        type: DataTypes.STRING,
        allowNull: true
    },
    id_equipe1: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Times',
            key: 'id_equipe',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    },
    id_equipe2: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Times',
            key: 'id_equipe',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    },
    pontos_time1: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    partida: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    pontos_time2: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    idestadio: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Estadio',
            key: 'idestadio',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    }
}, {
    tableName: 'Jogo',
    timestamps: false
});
const Placar = database.define('Placar', {
    id_placar: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idjogo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Jogo',
            key: 'idjogo',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    },
    id_transmicao: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: 'Transmicao',
            key: 'id_transmicao',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    },
    placar_visibilidade: {
        type: DataTypes.BLOB,
        allowNull: true,
    },
    placar_x: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    placar_y: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    placar_z: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'Placar',
    timestamps: false
});
const Rotativo = database.define('Rotativo', {
    id_rotativo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rotativo_visibilidade: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    rotativo_x: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    rotativo_y: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    rotativo_z: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'Rotativo',
    timestamps: false
});
const Time = database.define('Time', {
    id_equipe: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    categoria: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    estado: {
        type: DataTypes.STRING,
    },
    cidade: {
        type: DataTypes.STRING,
    },
    esculdo: {
        type: DataTypes.STRING,
    },

});
const Tranmiscao = database.define('Transmicao', {
    id_transmicao: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    id_rotativo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Rotativo',
            key: 'id_rotativo',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    },
}, {
    tableName: 'Transmicao',
    timestamps: false
});
const Imagem = database.define('Imagem', {
    id_imagem: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    url: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    duracao: {
        type: DataTypes.INTEGER,
        allowNull: false
    }, 
    ativo: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'Imagem',
    timestamps: false
});

module.exports = { Tranmiscao, Time, Rotativo, Placar, Jogo, Jogador, Estadio, Cronometro, Imagem }
