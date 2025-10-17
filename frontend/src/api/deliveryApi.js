// api/deliveryApi.js
// Mock API — töötab ilma backendita, kasutades localStorage't

const STORAGE_KEY = "deliveries_mock_data";

// Lae kõik tarned localStoragest
export const getDeliveries = async () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
};

// Lisa uus tarne
export const addDelivery = async (delivery) => {
    const saved = await getDeliveries();
    const newDelivery = { id: Date.now(), ...delivery };
    saved.push(newDelivery);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    return newDelivery;
};

// Kustuta tarne ID järgi
export const deleteDelivery = async (id) => {
    const saved = await getDeliveries();
    const updated = saved.filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
};
