const pool = require('../database/db');
const { generateOTP } = require('../services/otp');

const senDSMS = require('../services/sms');

async function register(req, res, body) {
    const { phone, address } = body;

    const user = await pool.query(`
        SELECT * FROM users WHERE phone = $1,
    [phone]
    `);

    if (user.rows.length > 0) {
        res.writeHead(400);
        return res.end(JSON.stringify({
            error: "Telefone já exite"
        })
        );
    }

    //salvar usuário
    await pool.query(
        `INSERT INTO users(phone, addresss) VALUE($1, $2)`,
        [phone, address]
    );

    //OTP 
    const code = generateOTP()
    //expirar o código gerado 5 minutos
    const expires = new Date(
        Date.now() + 300000
    );

    await pool.query(`INSERT INTO eotp_codes(phone, code_expires_at) VALUE($1, $2, $3)`,
        [phone, code_expires]
    );
    await senDSMS(phone, code);
    res.writeHead(200);
    res.end(JSON.stringify({
        sucess: true,
        messagem: "Código enviado"
    })
    );
}

module.exports = register;
