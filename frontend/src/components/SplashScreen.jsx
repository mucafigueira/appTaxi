//Logo e loading inicial 

export default function SplashScreen() {
    return (
        <section className="h-screen flex flex-col justify-center items-center bg-orange-700">

            <img src="/loading.png" alt="Taxi"
                className="w-48 p-0" />
            <span
                className="loading loading-spinner loading-lg text-white"
            />
            <p className="text-white mt-2">Carregando...</p>

        </section>
    )
}
