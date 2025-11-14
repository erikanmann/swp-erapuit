import React, { useEffect, useState } from "react";
import {
    getDeliveries,
    addDelivery,
    deleteDelivery,
    updateDelivery,
    getEvrIncoming,
    importFromEvr
} from "../api/deliveryApi";

import DeliveryForm from "../components/DeliveryForm";
import DeliveryList from "../components/DeliveryList";

import "../styles/delivery.css";
import "../styles/main.css";
import "../styles/warehouse.css";

import { useNavigate } from "react-router-dom";

const RegisterDeliveryPage = () => {
    const navigate = useNavigate();

    const [deliveries, setDeliveries] = useState([]);
    const [editingDelivery, setEditingDelivery] = useState(null);

    // Lae algsed tarned
    useEffect(() => {
        getDeliveries().then(setDeliveries);
    }, []);

    // Salvesta / uuenda tarnet
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

    // Kustuta tarne
    const handleDelete = async (id) => {
        try {
            const updated = await deleteDelivery(id);
            setDeliveries(updated);
        } catch (err) {
            alert(err.message || "Kustutamine ebaõnnestus");
        }
    };

    // Muuda tarne → ava vormis
    const handleEdit = (delivery) => {
        setEditingDelivery(delivery);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancelEdit = () => setEditingDelivery(null);

    // 🟧 EVR MASSIMPORT
    const handleImportAllEvrLoads = async () => {
        try {
            const loads = await getEvrIncoming();

            if (loads.length === 0) {
                alert("EVR-ist ei leitud ühtegi saabuvat koormat.");
                return;
            }

            if (!window.confirm(
                `Kas soovid importida ${loads.length} EVR koormat lattu?`
            )) {
                return;
            }

            for (const load of loads) {
                try {
                    await importFromEvr(load);
                } catch (err) {
                    alert(`Koorma ${load.waybillNumber} import ebaõnnestus: ${err.message}`);
                }
            }

            const updated = await getDeliveries();
            setDeliveries(updated);

            alert("Kõik EVR koormad edukalt lattu lisatud!");

        } catch (err) {
            alert("EVR import ebaõnnestus: " + err.message);
        }
    };

    return (
        <div className="delivery-page">

            {/* Ülemine navigeerimisriba */}
            <div className="warehouse-tabs">
                <button onClick={() => navigate("/home")}>Avaleht</button>
                <button className="active-tab">Tarne registreerimine</button>
                <button onClick={() => navigate("/warehouse")}>Lao ülevaade</button>
                <button onClick={() => navigate("/production-usage")}>
                    Tootmise kasutus
                </button>
                <button onClick={() => navigate("/outbound-shipping")}>
                    Väljaminev kaup
                </button>
            </div>

            <h1>Tarne registreerimine</h1>

            {/* 🟩 EVR massimport nupp */}
            <button
                onClick={handleImportAllEvrLoads}
                style={{
                    marginBottom: "20px",
                    padding: "10px 20px",
                    background: "#d89e49",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "16px"
                }}
            >
                Laadi kõik EVR koormad lattu
            </button>

            {/* Käsitsi registreerimise vorm */}
            <DeliveryForm
                onSave={handleSave}
                editingDelivery={editingDelivery}
                onCancelEdit={handleCancelEdit}
            />

            {/* Tarnete tabel */}
            <DeliveryList
                deliveries={deliveries}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
        </div>
    );
};

export default RegisterDeliveryPage;
