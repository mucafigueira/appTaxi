const API_URL = "http://localhost:8000";
export async function registerUser(data) {
    const response = await fetch(`${API_URL}/register`,

        {
            method: "POST",

            headers: {
                "Content-type": "application/json"
            },

            body: JSON.stringify(data)
        }
    )

    return response.json();
}

export async function verifyCode(data) {
    const response = await fetch(`${API_URL}/verify`,

        {
            method: "POST",

            headers: {
                "Content-type": "application/json"
            },

            body: JSON.stringify(data)
        }
    )

    return response.json();
}

