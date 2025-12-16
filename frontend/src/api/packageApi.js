import { tokenStorage } from './authApi';
const BASE = "http://localhost:8080/api/delivery-packages";

export const getPackageById = async (id) => {
    const token = tokenStorage.getToken();
    const res = await fetch(`${BASE}/${id}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error("Failed to fetch package");
    return res.json();
};

export const getPackagesForDelivery = async (deliveryId) => {
    const token = tokenStorage.getToken();
    const res = await fetch(`${BASE}/delivery/${deliveryId}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error("Failed to fetch packages");
    return res.json();
};
