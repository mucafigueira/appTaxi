/*Carregar variaveis de ambient */
require('dotenv').config()

/*Importar o cliente do postgres */
const { Pool } = require('pg')

/*Criar uma nova pool de conexões */
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool;