const http = require("http");
const register = require("./routes/register");
const verify = require("./routes/verify");


const PORT = process.env.PORT

const server = http.createServer(
    async (req, res) => {
        let body = "";
        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", async () => {
            body = body ? JSON.parse(body) : {};

            res.setHeader(
                "Content-type", "application/json"
            );

            //Cadastrar
            if (req.url === "/register" && req.method === "POST") {
                return register(req, res, body)
            }

            //Verificar
            if (req.url === "/verify" && req.method === "POST") {
                return (req, res, body);
            }

            res.writeHead(404);
            res.end(JSON.stringify({
                error: "Página não encontrada"
            })
            );
        });

    });


server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})


