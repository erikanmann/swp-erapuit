// src/api/shipmentPackageApi.js
const BASE = "http://localhost:8080/api/packages";

/**
 * Loob uue saadetise paki (mitme valmis tootega)
 */
export const createShipmentPackage = async (data) => {
    const res = await fetch(BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Shipment package creation failed");
    }

    return res.json();
};
