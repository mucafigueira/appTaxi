import { validateAngolaPhone } from "../utils/validatePhone";
import { formatPhone } from "../utils/phoneMask";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import AddressAutocomplete from "../components/AddressAutocomplete";



export default function Register() {

    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        const storedUser = localStorage.getItem("userSession");
        if (storedUser) {
            navigate("/home");
        }
    }, [navigate]);

    //função para submeter 
    async function handleSubmit() {
        //verificar se há dados no input
        if (!phone || !address || !latitude || !longitude) {
            alert("Preenche todos os campos e selecione um endereço válido");
            return;
        }
        //Verificar se dados é válido
        if (!validateAngolaPhone(phone)) {
            alert("Número de telefone inválido")
            return;
        }



        setLoading(true);

        try {
            //chamar o backend
            const response = await registerUser({
                phone,
                address,
                latitude,
                longitude
            });

            if (response.success) {
                alert(response.message || "Conta criada com sucesso.");
                localStorage.setItem(
                    "userSession",
                    JSON.stringify({
                        phone,
                        address,
                        latitude,
                        longitude,
                        verified: true
                    })
                );
                navigate("/home");
                return;
            }

            alert(response.error || "Erro ao registrar");
        } catch (error) {
            alert(error.message || "Erro de ligação ao servidor");
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex  justify-center p-6">
            <div className="w-full max-w-xl mt14 space-y-4">

                <img src="/loading.png" sizes="24" alt="logo" />
                <h1 className="text-xl font-bold text-center text-orange-600">Que Bom Ver-te Aqui,  Cria Sua Conta </h1>
                <p className="text-sm text-gray-400 text-center font-semibold">leva apenas alguns segundos. O seu táxi mais próximo</p>


                {/*Campo de telefone */}

                <div className="join w-full">
                    <span className="join-item mt-8 btn border-r-0 text-orange-600/50 rounded-l-xl
                      border-orange-600/50
                    "
                    >
                        +244
                    </span>

                    <input
                        type="tel"
                        placeholder="923 000 000"
                        className="input outline-0 w-full mt-8 text-md rounded-r-xl
                     border-orange-600/50 font-semibold"
                        value={phone}
                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                    />
                </div>

                {/*Campo de morada */}
                <AddressAutocomplete
                    value={address}
                    onSelect={(location) => {
                        setAddress(location.address);
                        setLatitude(location.latitude);
                        setLongitude(location.longitude);
                    }}
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
