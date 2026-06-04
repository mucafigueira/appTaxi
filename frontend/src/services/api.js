const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-type": "application/json",
            ...(options.headers || {})
        }
    });
    return response.json();
}

export async function registerUser(data) {
    return request("/register", {
        method: "POST",
        body: JSON.stringify(data)
    });
}

export async function registerDriver(data) {
    return request("/driver/register", {
        method: "POST",
        body: JSON.stringify(data)
    });
}

export async function loginUser(data) {
    return request("/user/login", {
        method: "POST",
        body: JSON.stringify(data)
    });
}

export async function createRequest(data) {
    return request("/request/create", {
        method: "POST",
        body: JSON.stringify(data)
    });
}

export async function getRequestStatus(requestId) {
    return request(`/request/status?requestId=${encodeURIComponent(requestId)}`, {
        method: "GET"
    });
}

export async function driverLogin(data) {
    return request("/driver/login", {
        method: "POST",
        body: JSON.stringify(data)
    });
}

export async function getDriverRequests(driverPhone) {
    return request(`/driver/requests?driverPhone=${encodeURIComponent(driverPhone)}`, {
        method: "GET"
    });
}

export async function respondRequest(data) {
    return request("/request/respond", {
        method: "POST",
        body: JSON.stringify(data)
    });
}

export async function updateDriverLocation(data) {
    return request("/driver/location", {
        method: "POST",
        body: JSON.stringify(data)
    });
}

export async function getDrivers() {
    return request("/drivers", {
        method: "GET"
    });
}

