require('dotenv').config();

const pool = require('./db');

async function test() {
    try {
        const result = await pool.query('SELECT NOW()');

        console.log('✅ Banco conectado!');
        console.log(result.rows);

        process.exit(0);
    } catch (err) {
        console.error('❌ Erro:', err);

        process.exit(1);
    }
}

test();