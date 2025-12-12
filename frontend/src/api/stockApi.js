// src/api/stockApi.js

const STOCK_BASE = "http://localhost:8080/api/stock";
const PROD_BASE = "http://localhost:8080/api/production";

/**
 * Kõigi laoseisu kirjete toomine
 */
export const getStockItems = async () => {
    const res = await fetch(STOCK_BASE);
    if (!res.ok) throw new Error("Failed to fetch stock items");
    return res.json();
};

export const getStockPaged = async (page = 0, size = 200, filters = {}) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("size", size);

    if (filters.woodType) params.append("woodType", filters.woodType);
    if (filters.supplier) params.append("supplier", filters.supplier);
    if (filters.fromDate) params.append("fromDate", filters.fromDate);

    const res = await fetch(`${STOCK_BASE}/paged-fast?${params.toString()}`);

    if (!res.ok) throw new Error("Failed to fetch paged stock");

    return res.json();
};



/**
 * Filtreerimine: woodType / supplier / fromDate
 */
export const filterStock = async (params) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${STOCK_BASE}/filter?${query}`);
    if (!res.ok) throw new Error("Failed to filter stock");
    return res.json();
};

/**
 * Filtreerimine ainult puuliigi järgi
 */
export const getStockByWoodType = async (woodType) => {
    const url = `${STOCK_BASE}/by-wood-type?woodType=${encodeURIComponent(woodType)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch stock items by wood type");
    return res.json();
};

/**
 * Laoseisu kirje uuendamine (usableVolume)
 * NB! Backend ootab: { usableVolume: number }
 */
export const updateUsableVolume = async (id, usableVolume) => {
    const res = await fetch(`${STOCK_BASE}/${id}/usable-volume`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usableVolume }),
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to update usable volume");
    }

    return res.json();
};

/**
 * Materjali kasutamine tootmises (UC2: US 2.6, 2.7)
 * Backend ootab body:
 * {
 *   "woodType": "KUUSK",
 *   "usage": 10
 * }
 */
export const sendMaterialToProduction = async (deliveryPackageId, usage) => {
    const response = await fetch(`${PROD_BASE}/use-material/${deliveryPackageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usage }),
    });

    if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Tootmisesse saatmine ebaõnnestus");
    }

    return response.json();
};


/**
 * Statistika puuliigi kaupa
 */
export const getStatsByWoodType = async () => {
    const res = await fetch(`${STOCK_BASE}/stats/usage-by-wood-type`);
    if (!res.ok) throw new Error("Failed to load wood-type statistics");
    return res.json();
};

export const createProductionOutput = async (data) => {
    const res = await fetch(`${PROD_BASE}/output`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Tootmisväljundi loomine ebaõnnestus");
    }

    return res.json();
};