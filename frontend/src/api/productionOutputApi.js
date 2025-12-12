const BASE = "http://localhost:8080/api/production-output";

export const getAvailableProductionOutputs = async () => {
    const res = await fetch(`${BASE}/available`);

    if (!res.ok) {
        const txt = await res.text();
        console.error("API ERROR:", txt);
        throw new Error("Failed to load production outputs");
    }

    return res.json();
};
