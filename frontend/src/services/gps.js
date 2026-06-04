export function getCurrentPosition() {

    if (!navigator.geolocation) {
        return Promise.reject(
            new Error("Geolocalização não suportada pelo navegador.")
        );
    }

    return new Promise(

        (resolve, reject) => {

            navigator.geolocation.getCurrentPosition(

                (position) => {

                    resolve({

                        latitude:
                            position.coords.latitude,

                        longitude:
                            position.coords.longitude

                    });

                },

                (error) => {
                    reject(
                        new Error(
                            error.message || "Não foi possível obter a localização."
                        )
                    );
                },

                {
                    enableHighAccuracy: true
                }

            );

        }

    );

}
