// src/api/shipmentPackageApi.js
import { tokenStorage } from "./authApi";

const BASE = "http://localhost:8080/api/packages";

export const createPackageWithItems = async (data) => {
    const token = tokenStorage.getToken();

    const res = await fetch(`${BASE}/with-items`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const msg = await res.text();
        console.error("Backend error:", res.status, msg);
        throw new Error(msg || "Paki loomine ebaõnnestus");
    }

    return res.json();
};
