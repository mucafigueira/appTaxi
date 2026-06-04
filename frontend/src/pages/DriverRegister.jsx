import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatPhone } from "../utils/phoneMask";
import { validateAngolaPhone } from "../utils/validatePhone";
import AddressAutocomplete from "../components/AddressAutocomplete";
import { registerDriver } from "../services/api";

export default function DriverRegister() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [vehicle, setVehicle] = useState("");
    const [plate, setPlate] = useState("");
    const [address, setAddress] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit() {
        if (!name || !phone || !vehicle || !plate || !address || !latitude || !longitude) {
            alert("Preencha todos os campos do cadastro do motorista.");
            return;
        }

        if (!validateAngolaPhone(phone)) {
            alert("Número de telefone inválido.");
            return;
        }

        setLoading(true);

        try {
            const response = await registerDriver({
                name,
                phone,
                vehicle,
                plate,
                address,
                latitude,
                longitude
            });

            if (response.success) {
                localStorage.setItem(
                    "driverSession",
                    JSON.stringify({
                        name,
                        phone,
                        vehicle,
                        plate,
                        address,
                        latitude,
                        longitude
                    })
                );
                navigate("/driver/panel");
            } else {
                alert(response.error || "Erro ao cadastrar motorista.");
            }
        } catch (error) {
            alert(error.message || "Erro ao conectar com o servidor.");
        }

        setLoading(false);
    }

    return (
        <div className="min-h-screen flex justify-center p-6 bg-base-200">
            <div className="w-full max-w-2xl space-y-6 bg-white p-6 rounded-3xl shadow-xl">
                <div>
                    <h1 className="text-3xl font-bold text-orange-600">Cadastro de Motorista</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Preencha seus dados e comece a receber corridas imediatamente.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="label">
                            <span className="label-text">Nome completo</span>
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input input-bordered w-full"
                            placeholder="João da Silva"
                        />
                    </div>
                    <div>
                        <label className="label">
                            <span className="label-text">Telefone</span>
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(formatPhone(e.target.value))}
                            className="input input-bordered w-full"
                            placeholder="923 000 000"
                        />
                    </div>
                    <div>
                        <label className="label">
                            <span className="label-text">Veículo</span>
                        </label>
                        <input
                            value={vehicle}
                            onChange={(e) => setVehicle(e.target.value)}
                            className="input input-bordered w-full"
                            placeholder="Toyota Corolla"
                        />
                    </div>
                    <div>
                        <label className="label">
                            <span className="label-text">Matrícula</span>
                        </label>
                        <input
                            value={plate}
                            onChange={(e) => setPlate(e.target.value.toUpperCase())}
                            className="input input-bordered w-full"
                            placeholder="AAB-1234"
                        />
                    </div>
                </div>

                <div>
                    <label className="label">
                        <span className="label-text">Endereço base</span>
                    </label>
                    <AddressAutocomplete
                        value={address}
                        onSelect={(location) => {
                            setAddress(location.address);
                            setLatitude(location.latitude);
                            setLongitude(location.longitude);
                        }}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    className="btn btn-primary w-full"
                    disabled={loading}
                >
                    {loading ? "Registrando..." : "Cadastrar Motorista"}
                </button>
            </div>
        </div>
    );
}
