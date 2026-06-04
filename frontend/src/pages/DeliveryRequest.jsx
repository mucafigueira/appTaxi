

import { useNavigate } from "react-router-dom";

export default function DeliveryRequest() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-6">
            <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-8 text-center">
                <h1 className="text-3xl font-bold mb-4">Pedido de Entrega</h1>
                <p className="text-gray-500 mb-8">
                    A funcionalidade de entrega já está preparada. Em breve estará disponível para enviar encomendas com facilidade.
                </p>
                <button className="btn btn-primary" onClick={() => navigate('/home')}>
                    Voltar ao Início
                </button>
            </div>
        </div>
    );
}
