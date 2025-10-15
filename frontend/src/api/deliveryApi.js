// Simuleerib backend API-t

let deliveries = [];

export const getDeliveries = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(deliveries), 200);
    });
};

export const addDelivery = async (delivery) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            deliveries.push({ id: Date.now(), ...delivery });
            resolve({ success: true });
        }, 200);
    });
};
