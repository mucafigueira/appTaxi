import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("userSession");
        if (!stored) {
            navigate("/");
            return;
        }
        setUser(JSON.parse(stored));
    }, [navigate]);

    function handleLogout() {
        localStorage.removeItem("userSession");
        navigate("/");
    }

    return (
        <div className="min-h-screen bg-base-200 p-6 flex flex-col justify-center gap-4">
            <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 shadow-xl text-center">
                <div className="flex flex-col gap-2 items-center mb-6">
                    <h1 className="text-3xl font-bold text-orange-600">Bem-vindo ao Guess-Táxi</h1>
                    {user && (
                        <p className="text-sm text-gray-500">
                            Olá, {user.phone}. Sua morada atual é:{" "}
                            <span className="font-semibold">{user.address}</span>
                        </p>
                    )}
                </div>
                <div className="grid gap-4">
                    <button
                        className="btn btn-primary btn-lg w-full"
                        onClick={() => navigate("/taxi")}
                    >
                        Pedir Táxi
                    </button>
                    <button
                        className="btn btn-secondary btn-lg w-full"
                        onClick={() => navigate("/delivery")}
                    >
                        Enviar Encomenda
                    </button>
                    <button
                        className="btn btn-accent btn-lg w-full"
                        onClick={() => navigate("/driver/login")}
                    >
                        Login Motorista
                    </button>
                    <button
                        className="btn btn-ghost btn-lg w-full"
                        onClick={handleLogout}
                    >
                        Sair
                    </button>
                </div>
            </div>
        </div>
    );
}
