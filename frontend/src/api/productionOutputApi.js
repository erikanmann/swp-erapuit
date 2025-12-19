// src/api/productionOutputApi.js
import { tokenStorage } from "./authApi";

export async function createProductionOutput(id, payload) {
    const token = tokenStorage.getToken();

    const res = await fetch(
        `http://localhost:8080/api/production/process/${id}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(payload)
        }
    );

    if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", res.status, text);
        throw new Error(text || "Tootmisse saatmine ebaõnnestus");
    }

    return res.json();
}


export async function getAvailableProductionOutputs() {
    const token = tokenStorage.getToken();

    const res = await fetch("http://localhost:8080/api/production-output/available", {
        headers: token
            ? { Authorization: `Bearer ${token}` }
            : {}
    });

    if (!res.ok) {
        throw new Error("Failed to load production outputs");
    }

    return res.json();
}

