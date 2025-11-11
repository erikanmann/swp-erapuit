const BASE = "http://localhost:8080/api/stock";

/**
 * Kõigi laoseisu kirjete toomine
 */
export const getStockItems = async () => {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error("Failed to fetch stock items");
    return res.json();
};

/**
 * Uue laoseisu kirje lisamine
 */
export const addStockItem = async (item) => {
    const res = await fetch(BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Post failed: ${res.status} ${text}`);
    }
    return res.json();
};

/**
 * Laoseisu kirje uuendamine (nt usableVolume muutmine)
 */
export const updateStockItem = async (id, data) => {
    const res = await fetch(`${BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Update failed: ${res.status} ${text}`);
    }
    return res.json();
};

/**
 * Ühe kirje kustutamine (valikuline)
 */
export const deleteStockItem = async (id) => {
    const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Delete failed: ${res.status} ${text}`);
    }
    return res.json();
};

export const updateUsableVolume = async (id, value) => {
    const res = await fetch(`${BASE}/${id}/usable-volume`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actualVolumeTm: value }),
    });
    if (!res.ok) throw new Error("Failed to update usable volume");
    return res.json();
};

export const getStockByWoodType = async (woodType) => {
    const BASE = "http://localhost:8080/api/stock";
    const url = `${BASE}/by-wood-type?woodType=${encodeURIComponent(woodType)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch stock items by wood type");
    return res.json();
};

/**
 * US12
 */
export async function sendMaterialToProduction(woodType, usage) {
    const response = await fetch("/api/production/use-material", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ woodType, usage })
    });
    if (!response.ok) throw new Error("Tootmisesse saatmine ebaõnnestus");
    return await response.json();
}

