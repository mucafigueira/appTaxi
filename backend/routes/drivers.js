const pool = require('../database/db');

async function ensureDriversTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS drivers (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            phone TEXT UNIQUE NOT NULL,
            vehicle TEXT,
            plate TEXT,
            address TEXT,
            latitude NUMERIC,
            longitude NUMERIC,
            active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT NOW()
        )
    `);
}

async function registerDriver(req, res, body) {
    const { name, phone, vehicle, plate, address, latitude, longitude } = body;

    if (!name || !phone || !vehicle || !plate || !address || !latitude || !longitude) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "Preencha todos os campos obrigatórios." }));
    }

    await ensureDriversTable();

    const existing = await pool.query(
        `SELECT * FROM drivers WHERE phone = $1`,
        [phone]
    );

    if (existing.rows.length > 0) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "Este número de telefone já está cadastrado." }));
    }

    await pool.query(
        `INSERT INTO drivers(name, phone, vehicle, plate, address, latitude, longitude)
         VALUES($1, $2, $3, $4, $5, $6, $7)`,
        [name, phone, vehicle, plate, address, latitude, longitude]
    );

    res.writeHead(200);
    res.end(JSON.stringify({ success: true, message: "Motorista cadastrado com sucesso." }));
}

async function getDrivers(req, res) {
    await ensureDriversTable();

    const result = await pool.query(
        `SELECT id, name, phone, vehicle, plate, address, latitude, longitude
         FROM drivers WHERE active = TRUE`
    );

    res.writeHead(200);
    res.end(JSON.stringify(result.rows));
}

async function login(req, res, body) {
    const { phone } = body;

    if (!phone) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "Telefone é obrigatório." }));
    }

    await ensureDriversTable();

    const result = await pool.query(
        `SELECT id, name, phone, vehicle, plate, address, latitude, longitude, active
         FROM drivers WHERE phone = $1`,
        [phone]
    );

    if (!result.rows.length) {
        res.writeHead(404);
        return res.end(JSON.stringify({ error: "Motorista não encontrado." }));
    }

    const driver = result.rows[0];
    if (!driver.active) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "Motorista inativo." }));
    }

    res.writeHead(200);
    res.end(JSON.stringify({ success: true, driver }));
}

module.exports = {
    registerDriver,
    getDrivers,
    login
};
