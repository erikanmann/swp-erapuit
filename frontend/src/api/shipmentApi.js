const BASE = 'http://localhost:8080/api/shipments';

export const getShipments = async () => {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Failed to fetch shipments');
    return res.json();
};

export const addShipment = async (shipment) => {
    const res = await fetch(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shipment),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Post failed: ${res.status} ${text}`);
    }
    return res.json();
};

export const deleteShipment = async (id) => {
    const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Delete failed: ${res.status} ${text}`);
    }
    return getShipments();
};

export const updateShipment = async (id, data) => {
    const res = await fetch(`${BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Update failed: ${res.status} ${text}`);
    }
    return res.json();
};

export const getShipmentItems = async (id) => {
    const res = await fetch(`${BASE}/${id}/items`);
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch shipment items: ${res.status} ${text}`);
    }
    return res.json();
};
