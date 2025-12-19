import { tokenStorage } from "./authApi";

const BASE = "http://localhost:8080/api/shipments";

function authHeaders(extra = {}) {
    const token = tokenStorage.getToken();
    return {
        ...extra,
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
}

/* ---- GET all shipments ---- */
export const getShipments = async () => {
    const res = await fetch(BASE, {
        headers: authHeaders()
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch shipments: ${res.status} ${text}`);
    }

    return res.json();
};

/* ---- CREATE shipment ---- */
export const addShipment = async (shipment) => {
    const res = await fetch(BASE, {
        method: "POST",
        headers: authHeaders({
            "Content-Type": "application/json"
        }),
        body: JSON.stringify(shipment)
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Post failed: ${res.status} ${text}`);
    }

    return res.json();
};

/* ---- DELETE shipment ---- */
export const deleteShipment = async (id) => {
    const res = await fetch(`${BASE}/${id}`, {
        method: "DELETE",
        headers: authHeaders()
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Delete failed: ${res.status} ${text}`);
    }

    return getShipments();
};

/* ---- UPDATE shipment ---- */
export const updateShipment = async (id, data) => {
    const res = await fetch(`${BASE}/${id}`, {
        method: "PUT",
        headers: authHeaders({
            "Content-Type": "application/json"
        }),
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Update failed: ${res.status} ${text}`);
    }

    return res.json();
};

/* ---- GET shipment items ---- */
export const getShipmentItems = async (id) => {
    const res = await fetch(`${BASE}/${id}/items`, {
        headers: authHeaders()
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch shipment items: ${res.status} ${text}`);
    }

    return res.json();
};
