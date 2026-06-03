const pool = require('../database/db');

async function verify(req, res, body) {
    const { phone, code } = body;

    const result = await pool.query(`SELECT * FROM opt_codes WHERE phone=$1 AND code=$2 
        ORDER BY id DESC LIMIT 1`,
        [phone, code]
    );

    if (!result.rows.length) {
        res.writeHead(400);
        return res.end(JSON.stringify({
            error: "Código inválido"
        })
        );
    }

    const otp = result.rows[0];

    //Expirado?
    if (new Date() > otp.expires_at) {
        res.writeHead(400);
        return res.end(JSON.stringify({
            error: "Código expirado"
        })
        );
    }

    //verificar usuário 
    await pool.query(`UPDATE users SET verified=true WHERE phone=$1`,
        [phone]
    );
    res.writeHead(200);
    res.end(JSON.stringify({
        sucess: true
    })
    );

}

module.exports = verify;