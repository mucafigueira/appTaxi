import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "../components/MapView";
import { getCurrentPosition } from "../services/gps";
import { getDrivers, createRequest, getRequestStatus } from "../services/api";
import { generateDrivers } from "../services/drivers";

export default function TaxiRequest() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [position, setPosition] = useState(null);
    const [drivers, setDrivers] = useState([]);
    const [error, setError] = useState("");
    const [requestInfo, setRequestInfo] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        const stored = localStorage.getItem("userSession");
        if (!stored) {
            navigate("/");
            return;
        }
        const session = JSON.parse(stored);
        setUser(session);

        async function init() {
            try {
                const userLocation = await getCurrentPosition();
                setPosition(userLocation);

                const apiDrivers = await getDrivers();
                if (apiDrivers && apiDrivers.length > 0) {
                    setDrivers(
                        apiDrivers.map((driver) => ({
                            id: driver.id,
                            name: driver.name,
                            lat: Number(driver.latitude),
                            lng: Number(driver.longitude)
                        }))
                    );
                } else {
                    setDrivers(generateDrivers(userLocation.latitude, userLocation.longitude));
                }
            } catch (err) {
                setError(err.message || "Não foi possível obter a localização.");
            }
        }

        init();
    }, [navigate]);

    useEffect(() => {
        if (!requestInfo?.id) return;

        const interval = setInterval(async () => {
            try {
                const response = await getRequestStatus(requestInfo.id);
                if (response.success) {
                    setRequestInfo(response.request);
                    if (response.request.status === "PENDING") {
                        setStatusMessage("Aguardando resposta do motorista...");
                    }
                    if (response.request.status === "ACCEPTED") {
                        setStatusMessage("Motorista a caminho. Acompanhe o trajeto no mapa.");
                    }
                    if (response.request.status === "REJECTED") {
                        setStatusMessage("Motorista recusou. Selecione outro veículo.");
                    }
                }
            } catch (err) {
                console.error(err);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [requestInfo?.id]);

    async function handleDriverSelect(driver) {
        if (!user) return;
        setSelectedDriver(driver);

        try {
            const response = await createRequest({
                userPhone: user.phone,
                driverId: driver.id,
                pickupAddress: user.address,
                pickupLat: user.latitude,
                pickupLng: user.longitude
            });

            if (response.success) {
                setRequestInfo(response.request);
                setStatusMessage("Solicitação enviada. Aguardando confirmação do motorista...");
            } else {
                alert(response.error || "Falha ao enviar solicitação.");
            }
        } catch (err) {
            alert(err.message || "Erro ao criar a solicitação.");
        }
    }

    if (error) {
        return (
            <div className="h-screen flex flex-col justify-center items-center p-6 text-center">
                <h1 className="text-2xl font-bold mb-4">Erro de localização</h1>
                <p className="text-base text-gray-700">{error}</p>
            </div>
        );
    }

    if (!position) {
        return (
            <div className="h-screen flex justify-center items-center">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    return (
        <div className="h-screen relative">
            <MapView
                center={[position.latitude, position.longitude]}
                drivers={drivers}
                onDriverSelect={handleDriverSelect}
                selectedDriverId={selectedDriver?.id}
                requestInfo={requestInfo}
            />

            <div className="absolute bottom-0 left-0 right-0 bg-base-100 p-4 rounded-t-3xl shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 className="text-lg font-bold">Motoristas próximos</h2>
                        <p className="text-sm text-gray-600">{drivers.length} carros disponíveis</p>
                    </div>
                    <button className="btn btn-ghost" onClick={() => navigate("/home")}>Voltar</button>
                </div>

                {requestInfo ? (
                    <div className="rounded-3xl border border-base-200 bg-base-100 p-4">
                        <p className="text-sm text-gray-500">Solicitação #{requestInfo.id}</p>
                        <p className="font-semibold mt-2">{statusMessage}</p>
                        {requestInfo.status === "ACCEPTED" && requestInfo.driver_lat && requestInfo.driver_lng && (
                            <p className="text-sm text-gray-500 mt-2">Localização do motorista atualizada.</p>
                        )}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-base-200 bg-base-100 p-4">
                        <p className="text-sm text-gray-500">Clique em um veículo no mapa para solicitar.</p>
                        <p className="text-sm text-gray-700 mt-2">O motorista receberá a notificação em seu painel.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
