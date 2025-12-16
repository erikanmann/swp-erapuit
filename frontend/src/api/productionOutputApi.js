// src/api/productionOutputApi.js

export async function createProductionOutput(deliveryPackageId, payload) {
    const res = await fetch(
        `http://localhost:8080/api/production/process/${deliveryPackageId}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }
    );

    if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
        throw new Error("Tootmisse saatmine ebaõnnestus");
    }

    return res.json();
}

export async function getAvailableProductionOutputs() {
    const res = await fetch(
        "http://localhost:8080/api/production-output/available"
    );
    return res.json();
}
