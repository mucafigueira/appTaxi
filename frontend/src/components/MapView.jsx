import L from "leaflet";

import markerIcon2x
    from "leaflet/dist/images/marker-icon-2x.png";

import markerIcon
    from "leaflet/dist/images/marker-icon.png";

import markerShadow
    from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

    iconRetinaUrl:
        markerIcon2x,

    iconUrl:
        markerIcon,

    shadowUrl:
        markerShadow

});


import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
}
    from "react-leaflet";

export default function MapView({

    center,

    drivers,

    onDriverSelect,

    selectedDriverId,

    requestInfo

}) {

    return (

        <MapContainer

            center={center}

            zoom={15}

            className="h-full w-full"

        >

            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Utilizador */}

            <Marker
                position={[
                    center[0],
                    center[1]
                ]}
            >
                <Popup>
                    Você está aqui
                </Popup>
            </Marker>

            {/* Motoristas */}

            {
                drivers.map(

                    (driver) => (

                        <Marker

                            key={driver.id}

                            position={[
                                driver.lat,
                                driver.lng
                            ]}
                            eventHandlers={{
                                click: () => onDriverSelect?.(driver)
                            }}
                        >

                            <Popup>

                                <div className="space-y-2">
                                    <p>{driver.name}</p>
                                    <button
                                        className="btn btn-sm btn-primary w-full"
                                        onClick={() => onDriverSelect?.(driver)}
                                    >
                                        Solicitar corrida
                                    </button>
                                </div>

                            </Popup>

                        </Marker>

                    )

                )
            }

            {requestInfo?.status === "ACCEPTED" && requestInfo.driver_lat && requestInfo.driver_lng && (
                <Marker
                    key="accepted-driver"
                    position={[requestInfo.driver_lat, requestInfo.driver_lng]}
                >
                    <Popup>
                        Motorista a caminho
                    </Popup>
                </Marker>
            )}

            {requestInfo?.pickup_lat && requestInfo?.pickup_lng && (
                <Marker
                    key="pickup-location"
                    position={[requestInfo.pickup_lat, requestInfo.pickup_lng]}
                >
                    <Popup>
                        Local de embarque
                    </Popup>
                </Marker>
            )}

        </MapContainer>

    );

}