import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen p-6 flex flex-col justify-center gap">
            <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate("/taxi")}> Pedir Táxi</button>
            <button
                className="btn btn-secondary btn-lg"
                onClick={() => navigate("/order")}>
                Enviar Encomenda
            </button>
        </div>
    )
}
