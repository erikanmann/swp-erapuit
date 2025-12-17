import { tokenStorage } from './authApi';
const BASE = "http://localhost:8080/api/deliveries";

export const getDeliveries = async () => {
  const token = tokenStorage.getToken();
  const res = await fetch(BASE, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error("Failed to fetch deliveries");
  return res.json();
};


export const getDeliveriesPaged = async (page = 0, size = 200) => {
  const token = tokenStorage.getToken();
  const res = await fetch(`${BASE}/paged-fast?page=${page}&size=${size}`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error("Failed to fetch paged deliveries");
  return res.json();
};



export const addDelivery = async (delivery) => {
  const token = tokenStorage.getToken();
  const res = await fetch(BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(delivery),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Post failed: ${res.status} ${text}`);
  }
  return res.json();
};

export const deleteDelivery = async (id) => {
  const token = tokenStorage.getToken();
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Delete failed: ${res.status} ${text}`);
  }

  // ÄRA lae kõiki tarneid tagasi!
  return true;
};

export const updateDelivery = async (id, data) => {
  const token = tokenStorage.getToken();
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Update failed: ${res.status} ${text}`);
  }
  return res.json();
};

export const getIncomingMaterials = async (period = 'all') => {
    const token = tokenStorage.getToken();
    const response = await fetch(`http://localhost:8080/api/deliveries/incoming?period=${period}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (!response.ok) throw new Error('Failed to fetch incoming materials');
    return response.json();
};

export const getEvrIncoming = async () => {
  const token = tokenStorage.getToken();
  const res = await fetch("http://localhost:8080/api/deliveries/evr-incoming", {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error("Failed to fetch EVR incoming loads");
  return res.json();
};

export const importFromEvr = async (waybillDto) => {
  const token = tokenStorage.getToken();
  const res = await fetch("http://localhost:8080/api/deliveries/from-evr", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(waybillDto),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error("EVR import failed: " + t);
  }

  return res.json();
};

// --- GET: üks delivery ID järgi ---
export const getDeliveryById = async (id) => {
  const token = tokenStorage.getToken();
  const res = await fetch(`${BASE}/${id}`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch delivery: ${res.status} ${text}`);
  }
  return res.json();
};

// --- GET: pakkide loetelu delivery kohta ---
export const getDeliveryPackages = async (id) => {
  const res = await fetch(`${BASE}/${id}/packages`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch delivery packages: ${res.status} ${text}`);
  }
  return res.json();
};

export const updateDeliveryPackage = async (id, data) => {
  const res = await fetch(`http://localhost:8080/api/delivery-packages/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error("Package update failed: " + txt);
  }

  return res.json();
};
