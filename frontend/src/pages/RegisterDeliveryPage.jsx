import React, { useEffect, useState } from "react";
import { getDeliveries, addDelivery } from "../api/deliveryApi";
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

    return (
        <div className="delivery-page">
            <h1>Delivery Registration</h1>
            <DeliveryForm onSave={handleSave} />
            <DeliveryList deliveries={deliveries} />
        </div>
    );
};

export default RegisterDeliveryPage;
