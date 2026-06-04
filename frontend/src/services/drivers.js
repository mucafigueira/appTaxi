// Simulação de motoristas próximos

function randomOffset() {
    return (Math.random() - 0.5) * 0.004;
}

export function generateDrivers(
    latitude,
    longitude
) {

    return [

        {
            id: 1,
            name: "Motorista 1",
            lat: latitude + randomOffset(),
            lng: longitude + randomOffset()
        },

        {
            id: 2,
            name: "Motorista 2",
            lat: latitude + randomOffset(),
            lng: longitude + randomOffset()
        },

        {
            id: 3,
            name: "Motorista 3",
            lat: latitude + randomOffset(),
            lng: longitude + randomOffset()
        },

        {
            id: 4,
            name: "Motorista 4",
            lat: latitude + randomOffset(),
            lng: longitude + randomOffset()
        }

    ];

}
