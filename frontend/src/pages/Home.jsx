import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CarTaxiFront, CircleUserRound, LogIn, Truck, UserKey } from "lucide-react";
import Navbar from "../components/Navbar";

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
        <>
            <Navbar />

            <div className="min-h-screen bg-base-200 p-2 flex flex-col justify-center gap-4">

                <div className=" rounded-3xl p-4  text-center md:mx-w-lg mx-auto">
                    <div className="flex flex-col gap-2 items-center mb-6">
                        <h1 className="text-3xl text-orange-600 font-bold">
                            <CircleUserRound size={62} strokeWidth={1.5} />
                        </h1>
                        {user && (
                            <div>
                                <p className="text-xl text-gradient font-semibold">
                                    Olá, {user.phone} </p>
                                <p className="text-sm text-gray-500">
                                    Sua morada atual é:{" "}
                                    <span className="font-semibold">{user.address}</span>
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
                        <button
                            className="flex flex-col items-center justify-center hover:scale-105
                         transition-transform duration-200 w-full p-4 rounded-md bg-primary cursor-pointer 
                         font-semibold text-emerald-700"

                            onClick={() => navigate("/taxi")}
                        >
                            <span className="p-2 rounded-xl bg-emerald-700/40 mb-1">
                                <CarTaxiFront size={22} color="#fff" strokeWidth={1.2} />
                            </span>
                            Pedir Táxi
                        </button>
                        <button
                            className="flex flex-col items-center justify-center cursor-pointer hover:scale-105 
                        transition-transform duration-200 w-full p-3 rounded-md bg-secondary leading-none 
                        font-semibold text-pink-400"
                            onClick={() => navigate("/delivery")}
                        >
                            <span className="p-2 rounded-xl bg-pink-400/50 mb-1">
                                <Truck size={22} color="#fff" strokeWidth={1.2} />
                            </span>
                            Enviar Encomenda
                        </button>
                        <div className="hidden md:block">
                            <button
                                className="flex flex-col items-center justify-center cursor-pointer hover:scale-105 
                        transition-transform duration-200 w-full p-5 rounded-md bg-accent leading-none font-semibold
                         text-orange-400"

                                onClick={() => navigate("/driver/login")}
                            >
                                <span className="p-2 rounded-xl bg-orange-300 mb-1">
                                    <UserKey size={22} color="#fff" strokeWidth={1.2} />
                                </span>
                                Login Motorista
                            </button>
                        </div>
                        <button
                            className="flex flex-col items-center justify-center  cursor-pointer hover:scale-105 
                        transition-transform duration-200 w-full p-3 rounded-md bg-yellow-300  font-semibold 
                        text-yellow-500"
                            onClick={handleLogout}
                        >
                            <span className="p-2 rounded-xl bg-yellow-200/60 mb-1">
                                <LogIn size={22} color="#fff" strokeWidth={1.2} />
                            </span>
                            Sair
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
