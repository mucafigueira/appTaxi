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

async function register(req, res, body) {
    const { phone, address, latitude, longitude } = body;

    if (!phone || !address || !latitude || !longitude) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "Todos os campos são obrigatórios." }));
    }

    await ensureUsersTable();

    const userResult = await pool.query(
        `SELECT * FROM users WHERE phone = $1`,
        [phone]
    );

    if (userResult.rows.length > 0) {
        const user = userResult.rows[0];

        await pool.query(
            `UPDATE users SET address = $1, latitude = $2, longitude = $3, verified = TRUE WHERE phone = $4`,
            [address, latitude, longitude, phone]
        );

        res.writeHead(200);
        return res.end(JSON.stringify({
            success: true,
            message: "Conta criada com sucesso.",
            user: {
                phone: user.phone,
                address,
                latitude,
                longitude,
                verified: true
            }
        }));
    }

    await pool.query(
        `INSERT INTO users(phone, address, latitude, longitude, verified) VALUES($1, $2, $3, $4, TRUE)`,
        [phone, address, latitude, longitude]
    );

    res.writeHead(200);
    res.end(JSON.stringify({
        success: true,
        message: "Conta criada com sucesso.",
        user: {
            phone,
            address,
            latitude,
            longitude,
            verified: true
        }
    }));
}

module.exports = register;
