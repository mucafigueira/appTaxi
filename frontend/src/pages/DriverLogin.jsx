import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatPhone } from "../utils/phoneMask";
import { validateAngolaPhone } from "../utils/validatePhone";
import { driverLogin } from "../services/api";

export default function DriverLogin() {
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem("driverSession");
        if (stored) {
            navigate("/driver/panel");
        }
    }, [navigate]);

    async function handleSubmit() {
        if (!phone) {
            alert("Digite o telefone do motorista.");
            return;
        }
        if (!validateAngolaPhone(phone)) {
            alert("Telefone inválido.");
            return;
        }

        setLoading(true);
        try {
            const response = await driverLogin({ phone });
            if (response.success) {
                localStorage.setItem("driverSession", JSON.stringify(response.driver));
                navigate("/driver/panel");
            } else {
                alert(response.error || "Motorista não encontrado.");
            }
        } catch (error) {
            alert(error.message || "Erro ao conectar com o servidor.");
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6">
                <h1 className="text-2xl font-bold mb-4">Login do Motorista</h1>
                <p className="text-gray-500 mb-6">Entre com o telefone cadastrado para acessar seu painel.</p>
                <div className="mb-4">
                    <label className="label">
                        <span className="label-text">Telefone</span>
                    </label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                        placeholder="923 000 000"
                        className="input input-bordered w-full"
                    />
                </div>
                <button className="btn btn-primary w-full" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                </button>
            </div>
        </div>
    );
}
