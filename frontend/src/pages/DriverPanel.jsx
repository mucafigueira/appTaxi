import { useEffect, useState } from "react";
import { getCurrentPosition } from "../services/gps";
import { useNavigate } from "react-router-dom";
import MapView from "../components/MapView";
import { getDriverRequests, respondRequest, updateDriverLocation } from "../services/api";

export default function DriverPanel() {
    const [driver, setDriver] = useState(null);
    const [status, setStatus] = useState("Disponível");
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState([]);
    const [activeRequest, setActiveRequest] = useState(null);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem("driverSession");
        if (!stored) {
            navigate("/driver/login");
            return;
        }

        const parsed = JSON.parse(stored);
        setDriver(parsed);
        setLocation({
            latitude: Number(parsed.latitude),
            longitude: Number(parsed.longitude)
        });
    }, [navigate]);

    useEffect(() => {
        if (!driver) return;

        const fetchRequests = async () => {
            try {
                const response = await getDriverRequests(driver.phone);
                if (response.success) {
                    setRequests(response.requests || []);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchRequests();
        const interval = setInterval(fetchRequests, 5000);
        return () => clearInterval(interval);
    }, [driver]);

    useEffect(() => {
        if (!activeRequest) return;

        const interval = setInterval(async () => {
            try {
                const current = await getCurrentPosition();
                setLocation(current);
                await updateDriverLocation({
                    requestId: activeRequest.id,
                    driverLat: current.latitude,
                    driverLng: current.longitude
                });
            } catch (error) {
                console.error(error);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [activeRequest]);

    async function refreshLocation() {
        setLoading(true);
        try {
            const current = await getCurrentPosition();
            setLocation(current);
        } catch (error) {
            alert(error.message || "Não foi possível atualizar a localização.");
        }
        setLoading(false);
    }

    async function handleAccept(request) {
        try {
            const response = await respondRequest({ requestId: request.id, accept: true });
            if (response.success) {
                setActiveRequest({ ...request, status: "ACCEPTED" });
                setMessage("Você aceitou a solicitação. Dirija até o cliente.");
            }
        } catch (error) {
            alert(error.message || "Erro ao aceitar a solicitação.");
        }
    }

    async function handleReject(request) {
        try {
            const response = await respondRequest({ requestId: request.id, accept: false });
            if (response.success) {
                setRequests((prev) => prev.filter((item) => item.id !== request.id));
                setMessage("Você recusou a solicitação.");
            }
        } catch (error) {
            alert(error.message || "Erro ao recusar a solicitação.");
        }
    }

    function handleLogout() {
        localStorage.removeItem("driverSession");
        navigate("/driver/login");
    }

    if (!driver) {
        return null;
    }

    return (
        <div className="min-h-screen bg-base-200 p-6">
            <div className="max-w-7xl mx-auto grid gap-6 lg:grid-cols-[360px_1fr]">
                <section className="bg-white rounded-3xl shadow-xl p-6 space-y-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">Painel do Motorista</h1>
                            <p className="text-sm text-gray-500">Acompanhe solicitações e seu trajeto.</p>
                        </div>
                        <button className="btn btn-sm btn-outline" onClick={handleLogout}>Sair</button>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-3xl border border-base-200 p-4">
                            <h2 className="font-semibold text-lg">Seu perfil</h2>
                            <p className="text-sm text-gray-600">{driver.name}</p>
                            <p className="text-sm">{driver.phone}</p>
                            <p className="text-sm">{driver.vehicle} — {driver.plate}</p>
                            <p className="text-sm text-gray-500">{driver.address}</p>
                        </div>
                        <div className="rounded-3xl border border-base-200 p-4">
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold text-lg">Seu estado</h2>
                                <button
                                    className="btn btn-sm btn-outline"
                                    onClick={() => setStatus((prev) => prev === "Disponível" ? "Em pausa" : "Disponível")}
                                >
                                    {status === "Disponível" ? "Pausar" : "Voltar"}
                                </button>
                            </div>
                            <p className="mt-2 text-sm text-gray-600">
                                {status === "Disponível"
                                    ? "Aceite corridas e mantenha o app aberto."
                                    : "A pausa impede novas solicitações."}
                            </p>
                        </div>
                        <div className="rounded-3xl border border-base-200 p-4">
                            <h2 className="font-semibold text-lg">Solicitações pendentes</h2>
                            <div className="space-y-3 mt-4">
                                {requests.length === 0 && (
                                    <p className="text-sm text-gray-500">Nenhuma solicitação no momento.</p>
                                )}
                                {requests.map((request) => (
                                    <div key={request.id} className="rounded-2xl bg-base-100 p-4">
                                        <h3 className="font-medium">Solicitação #{request.id}</h3>
                                        <p className="text-sm text-gray-500">Endereço do cliente: {request.user_address}</p>
                                        <p className="text-sm text-gray-500">Distância aproximada: --</p>
                                        <div className="mt-3 flex gap-2">
                                            <button className="btn btn-sm btn-success" onClick={() => handleAccept(request)}>
                                                Aceitar
                                            </button>
                                            <button className="btn btn-sm btn-error" onClick={() => handleReject(request)}>
                                                Recusar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {activeRequest && (
                            <div className="rounded-3xl border border-base-200 p-4 bg-base-100">
                                <h2 className="font-semibold text-lg">Corrida ativa</h2>
                                <p className="text-sm text-gray-500">Solicitação #{activeRequest.id}</p>
                                <p className="text-sm">Cliente: {activeRequest.user_phone}</p>
                                <p className="text-sm">Destino: {activeRequest.pickup_address}</p>
                                <p className="text-sm text-gray-500">Status: {activeRequest.status}</p>
                                <p className="mt-2 text-sm text-green-600">{message}</p>
                            </div>
                        )}
                    </div>

                    <button className="btn btn-primary w-full" onClick={refreshLocation} disabled={loading}>
                        {loading ? "Atualizando localização..." : "Atualizar posição"}
                    </button>
                </section>

                <section className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {location ? (
                        <div style={{ height: "520px" }}>
                            <MapView
                                center={[location.latitude, location.longitude]}
                                drivers={[]}
                                requestInfo={activeRequest}
                            />
                        </div>
                    ) : (
                        <div className="p-6">Carregando mapa...</div>
                    )}
                </section>
            </div>
        </div>
    );
}
