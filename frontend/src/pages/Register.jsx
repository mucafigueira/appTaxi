import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";


export default function Register() {

    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    //função para submeter 
    async function handleSubmit() {
        //verificar se há dados no input
        if (!phone || !address) {
            alert("Preenche todos os campos");
            return;
        }

        setLoading(true);

        try {
            //chamar o backend
            const response = await registerUser({
                phone, address
            });
            //caso der certo vai para verificação
            if (response.sucess) {
                navigate("/verify", {
                    state: { phone }
                });
            } else {
                alert(response.error || "Erro ao registrar")
            }
        } catch (error) {
            alert("Erro de ligação ao servidor");
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex  justify-center p-6">
            <div className="w-full max-w-xl mt14 space-y-4">

                <img src="/loading.png" sizes="24" alt="logo" />
                <h1 className="text-xl font-bold text-center text-orange-600">Cria Saua Conta </h1>
                <p className="text-sm text-gray-400 text-center font-semibold">leva apenas alguns segundos. O seu táxi mais próximo</p>
                {/*Campo de telefone */}
                <input
                    type="tel"
                    placeholder="Número de Telefone"
                    className="input outline-0 w-full mt-8 text-md rounded-xl
                     border-orange-600/50 font-semibold"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                {/*Campo de morada */}
                <input
                    type="text"
                    placeholder="Digite seu endereço"
                    className="input outline-0 w-full mt-2 text-md rounded-xl
                     border-orange-600/50 font-semibold"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />

                <button
                    className="btn text-white bg-orange-600 border-0 mx-auto w-full"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "A enviar..." : "Continuar"}
                </button>



            </div>
        </div>
    );
}
