const pool = require('../database/db');

async function ensureUsersTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            phone TEXT PRIMARY KEY,
            address TEXT,
            latitude NUMERIC,
            longitude NUMERIC,
            verified BOOLEAN DEFAULT TRUE
        )
    `);
}

async function login(req, res, body) {
    const { phone } = body;

    if (!phone) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "Telefone é obrigatório." }));
    }

    await ensureUsersTable();

    const userResult = await pool.query(
        `SELECT phone, address, latitude, longitude, verified FROM users WHERE phone = $1`,
        [phone]
    );

    if (!userResult.rows.length) {
        res.writeHead(404);
        return res.end(JSON.stringify({ error: "Usuário não encontrado." }));
    }

    const user = userResult.rows[0];

    if (!user.verified) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "Usuário não está verificado." }));
    }

    res.writeHead(200);
    res.end(JSON.stringify({ success: true, user }));
}

module.exports = {
    login
};
