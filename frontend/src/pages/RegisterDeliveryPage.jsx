import React, { useEffect, useState } from "react";
import { getDeliveries, addDelivery, deleteDelivery, updateDelivery } from "../api/deliveryApi";
import DeliveryForm from "../components/DeliveryForm";
import DeliveryList from "../components/DeliveryList";
import "../styles/delivery.css";

const RegisterDeliveryPage = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [editingDelivery, setEditingDelivery] = useState(null); // 👈 lisatud

    // lae tarned esmasel laadimisel
    useEffect(() => {
        getDeliveries().then(setDeliveries);
    }, []);

    const handleSave = async (data) => {
        try {
            if (editingDelivery) {
                // uuenda olemasolev
                await updateDelivery(editingDelivery.id, data);
                setEditingDelivery(null);
            } else {
                // lisa uus
                await addDelivery(data);
            }

            const updated = await getDeliveries();
            setDeliveries(updated);
        } catch (err) {
            alert(err.message || "Salvestamine ebaõnnestus");
        }
    };

    const handleDelete = async (id) => {
        try {
            const updated = await deleteDelivery(id);
            setDeliveries(updated);
        } catch (err) {
            alert(err.message || "Kustutamine ebaõnnestus");
        }
    };

    const handleEdit = (delivery) => {
        setEditingDelivery(delivery);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancelEdit = () => {
        setEditingDelivery(null);
    };

    return (
        <div className="delivery-page">
            <h1>Sissetuleva kauba registreerimine</h1>

            <DeliveryForm
                onSave={handleSave}
                editingDelivery={editingDelivery}
                onCancelEdit={handleCancelEdit}
            />

            <DeliveryList
                deliveries={deliveries}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
        </div>
    );
};

export default RegisterDeliveryPage;
