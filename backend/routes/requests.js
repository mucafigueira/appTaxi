const pool = require('../database/db');

async function ensureRequestsTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS ride_requests (
            id SERIAL PRIMARY KEY,
            user_phone TEXT NOT NULL,
            driver_id INTEGER NOT NULL,
            status TEXT NOT NULL,
            pickup_address TEXT,
            pickup_lat NUMERIC,
            pickup_lng NUMERIC,
            driver_lat NUMERIC,
            driver_lng NUMERIC,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
    `);
}

async function createRequest(req, res, body) {
    const { userPhone, driverId, pickupAddress, pickupLat, pickupLng } = body;

    if (!userPhone || !driverId || !pickupAddress || !pickupLat || !pickupLng) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "Dados de solicitação incompletos." }));
    }

    await ensureRequestsTable();

    const result = await pool.query(
        `INSERT INTO ride_requests(user_phone, driver_id, status, pickup_address, pickup_lat, pickup_lng)
         VALUES($1, $2, 'PENDING', $3, $4, $5)
         RETURNING id, status`,
        [userPhone, driverId, pickupAddress, pickupLat, pickupLng]
    );

    res.writeHead(200);
    res.end(JSON.stringify({ success: true, request: result.rows[0] }));
}

async function getRequestStatus(req, res, requestId) {
    if (!requestId) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "requestId é obrigatório." }));
    }

    await ensureRequestsTable();

    const result = await pool.query(
        `SELECT r.id, r.user_phone, r.driver_id, r.status, r.pickup_address, r.pickup_lat, r.pickup_lng,
                r.driver_lat, r.driver_lng, r.created_at, r.updated_at,
                d.name AS driver_name, d.phone AS driver_phone
         FROM ride_requests r
         JOIN drivers d ON d.id = r.driver_id
         WHERE r.id = $1`,
        [requestId]
    );

    if (!result.rows.length) {
        res.writeHead(404);
        return res.end(JSON.stringify({ error: "Solicitação não encontrada." }));
    }

    res.writeHead(200);
    res.end(JSON.stringify({ success: true, request: result.rows[0] }));
}

async function getDriverRequests(req, res, driverPhone) {
    if (!driverPhone) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "driverPhone é obrigatório." }));
    }

    await ensureRequestsTable();

    const driverResult = await pool.query(
        `SELECT id FROM drivers WHERE phone = $1`,
        [driverPhone]
    );

    if (!driverResult.rows.length) {
        res.writeHead(404);
        return res.end(JSON.stringify({ error: "Motorista não encontrado." }));
    }

    const driverId = driverResult.rows[0].id;

    const result = await pool.query(
        `SELECT r.id, r.user_phone, r.driver_id, r.status, r.pickup_address, r.pickup_lat, r.pickup_lng,
                r.driver_lat, r.driver_lng, r.created_at, r.updated_at,
                u.address AS user_address, u.latitude AS user_lat, u.longitude AS user_lng
         FROM ride_requests r
         JOIN users u ON u.phone = r.user_phone
         WHERE r.driver_id = $1 AND r.status = 'PENDING'
         ORDER BY r.created_at DESC`,
        [driverId]
    );

    res.writeHead(200);
    res.end(JSON.stringify({ success: true, requests: result.rows }));
}

async function respondRequest(req, res, body) {
    const { requestId, accept } = body;

    if (!requestId || typeof accept !== 'boolean') {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "requestId e accept são obrigatórios." }));
    }

    await ensureRequestsTable();

    const status = accept ? 'ACCEPTED' : 'REJECTED';

    const result = await pool.query(
        `UPDATE ride_requests SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, status, user_phone, driver_id, pickup_address, pickup_lat, pickup_lng, driver_lat, driver_lng`,
        [status, requestId]
    );

    if (!result.rows.length) {
        res.writeHead(404);
        return res.end(JSON.stringify({ error: "Solicitação não encontrada." }));
    }

    res.writeHead(200);
    res.end(JSON.stringify({ success: true, request: result.rows[0] }));
}

async function updateDriverLocation(req, res, body) {
    const { requestId, driverLat, driverLng } = body;

    if (!requestId || !driverLat || !driverLng) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "requestId, driverLat e driverLng são obrigatórios." }));
    }

    await ensureRequestsTable();

    const result = await pool.query(
        `UPDATE ride_requests SET driver_lat = $1, driver_lng = $2, updated_at = NOW() WHERE id = $3 RETURNING id, status, driver_lat, driver_lng`,
        [driverLat, driverLng, requestId]
    );

    if (!result.rows.length) {
        res.writeHead(404);
        return res.end(JSON.stringify({ error: "Solicitação não encontrada." }));
    }

    res.writeHead(200);
    res.end(JSON.stringify({ success: true, request: result.rows[0] }));
}

module.exports = {
    createRequest,
    getRequestStatus,
    getDriverRequests,
    respondRequest,
    updateDriverLocation
};
