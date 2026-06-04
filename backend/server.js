require('dotenv').config();
const http = require("http");
const register = require("./routes/register");
const users = require("./routes/user");
const drivers = require("./routes/drivers");
const requests = require("./routes/requests");

const PORT = process.env.PORT || 8000



const server = http.createServer(
    async (req, res) => {

        //Configuração do Cors
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        //Tratar requisições OPTIONS
        if (req.method === "OPTIONS") {
            res.writeHead(200);
            res.end();
            return;
        }

        let body = "";
        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", async () => {
            try {
                body = body ? JSON.parse(body) : {};
                const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
                const path = parsedUrl.pathname;

                res.setHeader(
                    "Content-type", "application/json"
                );

                //Cadastrar
                if (path === "/register" && req.method === "POST") {
                    return register(req, res, body)
                }

                // Login do usuário
                if (path === "/user/login" && req.method === "POST") {
                    return users.login(req, res, body);
                }

                // Registrar motorista
                if (path === "/driver/register" && req.method === "POST") {
                    return drivers.registerDriver(req, res, body);
                }

                // Login do motorista
                if (path === "/driver/login" && req.method === "POST") {
                    return drivers.login(req, res, body);
                }

                // Listar motoristas ativos
                if (path === "/drivers" && req.method === "GET") {
                    return drivers.getDrivers(req, res);
                }

                // Buscar solicitações do motorista
                if (path === "/driver/requests" && req.method === "GET") {
                    return requests.getDriverRequests(req, res, parsedUrl.searchParams.get('driverPhone'));
                }

                // Criar solicitação de corrida
                if (path === "/request/create" && req.method === "POST") {
                    return requests.createRequest(req, res, body);
                }

                // Verificar status da solicitação
                if (path === "/request/status" && req.method === "GET") {
                    return requests.getRequestStatus(req, res, parsedUrl.searchParams.get('requestId'));
                }

                // Aceitar ou recusar solicitação
                if (path === "/request/respond" && req.method === "POST") {
                    return requests.respondRequest(req, res, body);
                }

                // Atualizar localização do motorista para um pedido aceito
                if (path === "/driver/location" && req.method === "POST") {
                    return requests.updateDriverLocation(req, res, body);
                }

                res.writeHead(404);
                res.end(JSON.stringify({
                    error: "Página não encontrada"
                }));
            } catch (error) {
                console.error("Erro ao processar requisição:", error);
                res.writeHead(500);
                res.end(JSON.stringify({
                    error: "Erro interno do servidor"
                }));
            }
        });

    });


server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})


