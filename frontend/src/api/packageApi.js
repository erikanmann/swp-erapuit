const BASE = "http://localhost:8080/api/delivery-packages";

export const getPackageById = async (id) => {
    const res = await fetch(`${BASE}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch package");
    return res.json();
};

export const getPackagesForDelivery = async (deliveryId) => {
    const res = await fetch(`${BASE}/delivery/${deliveryId}`);
    if (!res.ok) throw new Error("Failed to fetch packages");
    return res.json();
};
