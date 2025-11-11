import React, { useEffect, useState } from "react";
import { getDeliveries, addDelivery, deleteDelivery, updateDelivery } from "../api/deliveryApi";
import DeliveryForm from "../components/DeliveryForm";
import DeliveryList from "../components/DeliveryList";
import "../styles/delivery.css";     // vormi ja tabeli stiil
import "../styles/main.css";         // globaalne teema
import "../styles/warehouse.css";    // ülemise tabi/nav stiil
import { useNavigate } from "react-router-dom";

const RegisterDeliveryPage = () => {
    const navigate = useNavigate();

    const [deliveries, setDeliveries] = useState([]);
    const [editingDelivery, setEditingDelivery] = useState(null);

    useEffect(() => {
        getDeliveries().then(setDeliveries);
    }, []);

    const handleSave = async (data) => {
        try {
            if (editingDelivery) {
                await updateDelivery(editingDelivery.id, data);
                setEditingDelivery(null);
            } else {
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

    const handleCancelEdit = () => setEditingDelivery(null);

    return (
        <div className="delivery-page">
            {/* Ülemine navigeerimisriba (samad tabid mis warehouse'is) */}
            <div className="warehouse-tabs">
                <button onClick={() => navigate('/home')}>Home</button>
                <button className="active-tab">Register Delivery</button>
                <button onClick={() => navigate("/warehouse")}>Warehouse Dashboard</button>
                <button onClick={() => navigate('/production-usage')}>Production usage</button>
            </div>

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
