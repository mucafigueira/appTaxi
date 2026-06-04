import { useEffect, useState } from "react";

export default function AddressAutocomplete({
    value,
    onSelect
}) {

    /*
    Texto digitado
    */
    const [query, setQuery] =
        useState(value || "");

    /*
    Lista de resultados
    */
    const [results, setResults] =
        useState([]);

    /*
    Loading
    */
    const [loading, setLoading] =
        useState(false);

    /*
    Pesquisa automática
    */
    useEffect(() => {

        /*
        Evita pesquisas pequenas
        */
        if (query.length < 3) {
            setResults([]);
            return;
        }

        /*
        Delay para evitar muitas chamadas
        */
        const timer = setTimeout(async () => {

            try {

                setLoading(true);

                const response =
                    await fetch(

                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                            query
                        )}&countrycodes=ao&limit=5`

                    );

                const data =
                    await response.json();

                setResults(data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        }, 500);

        return () =>
            clearTimeout(timer);

    }, [query]);

    return (

        <div className="relative w-full">

            <input
                type="text"
                placeholder="Digite seu endereço"
                className="input outline-0 w-full mt-2 text-md rounded-xl
                     border-orange-600/50 font-semibold"
                value={query}
                onChange={(e) =>
                    setQuery(e.target.value)
                }
            />

            {loading && (

                <div
                    className="
          absolute
          right-3
          top-3
          "
                >
                    <span
                        className="
            loading
            loading-spinner
            loading-sm
            "
                    />
                </div>

            )}

            { 
                results.length > 0 && (

                    <div
                        className="
            absolute
            z-50
            w-full
            bg-base-100
            border
            rounded-lg
            shadow-lg
            mt-1
            max-h-72
            overflow-auto
            "
                    >

                        {
                            results.map((item) => (

                                <button
                                    key={item.place_id}
                                    type="button"
                                    className="
                  w-full
                  text-left
                  p-3
                  hover:bg-base-200
                  "
                                    onClick={() => {

                                        setQuery(
                                            item.display_name
                                        );

                                        setResults([]);

                                        onSelect({
                                            address:
                                                item.display_name,

                                            latitude:
                                                item.lat,

                                            longitude:
                                                item.lon
                                        });

                                    }}
                                >
                                    {item.display_name}
                                </button>

                            ))
                        }

                    </div>

                )
            }

        </div>

    );
}