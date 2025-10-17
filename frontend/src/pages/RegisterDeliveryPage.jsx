import React, { useEffect, useState } from "react";
import { getDeliveries, addDelivery, deleteDelivery } from "../api/deliveryApi";
import DeliveryForm from "../components/DeliveryForm";
import DeliveryList from "../components/DeliveryList";
import "../styles/delivery.css";

const RegisterDeliveryPage = () => {
    const [deliveries, setDeliveries] = useState([]);

    useEffect(() => {
        getDeliveries().then(setDeliveries);
    }, []);

    const handleSave = async (data) => {
        await addDelivery(data);
        const updated = await getDeliveries();
        setDeliveries(updated);
    };

    const handleDelete = async (id) => {
        const updated = await deleteDelivery(id);
        setDeliveries(updated);
    };

    return (
        <div className="delivery-page">
            <h1>Sissetuleva kauba registreerimine</h1>
            <DeliveryForm onSave={handleSave} />
            <DeliveryList deliveries={deliveries} onDelete={handleDelete} />
        </div>
    );
};

export default RegisterDeliveryPage;
