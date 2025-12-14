// src/api/shipmentPackageApi.js
const BASE = "http://localhost:8080/api/packages";

export const createPackageWithItems = async (data) => {
    const res = await fetch(`${BASE}/with-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Paki loomine ebaõnnestus");
    }

    return res.json();
};
