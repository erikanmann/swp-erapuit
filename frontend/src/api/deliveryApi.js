// Simuleerib backend API-t

const BASE = "http://localhost:8080/api/deliveries";

export const getDeliveries = async () => {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error("Failed to fetch deliveries");
  return res.json();
};

export const addDelivery = async (delivery) => {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(delivery),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Post failed: ${res.status} ${text}`);
  }
  return res.json();
};
