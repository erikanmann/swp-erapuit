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

    const [search, setSearch] = useState("");


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


            const existingWaybills = new Set(deliveries.map(d => d.waybillNo));
            const newLoads = loads.filter(l => !existingWaybills.has(l.waybillNumber));

            if (newLoads.length === 0) {
                alert("Kõik koormad on juba süsteemis olemas.");
                return;
            }

            if (!window.confirm(
                `Kas soovid importida ${newLoads.length} uut EVR koormat?`
            )) {
                return;
            }

            for (const load of newLoads) {
                try {
                    await importFromEvr(load);
                } catch (err) {
                    alert(`Koorma ${load.waybillNumber} import ebaõnnestus: ${err.message}`);
                }
            }

            const updated = await getDeliveries();
            setDeliveries(updated);
            alert("Kõik uued EVR koormad edukalt lattu lisatud!");

        } catch (err) {
            alert("EVR import ebaõnnestus: " + err.message);
        }
    };

    const filteredDeliveries = deliveries.filter((d) => {
        const text = search.toLowerCase();

        return (
            d.waybillNo?.toLowerCase().includes(text) ||
            d.driverName?.toLowerCase().includes(text) ||
            d.truckNo?.toLowerCase().includes(text) ||
            d.supplierName?.toLowerCase().includes(text) ||
            d.woodType?.toLowerCase().includes(text) ||
            d.arrivalDate?.split("T")[0].includes(text)
        );
    });


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
                initialValues={editingDelivery}
                mode={editingDelivery ? "edit" : "create"}
                onCancelEdit={handleCancelEdit}
            />

            <input
                type="text"
                placeholder="Otsi tarnete seast (veoseleht, juht, veok, tarnija, puiduliik...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    width: "100%",
                    padding: "10px",
                    margin: "20px 0",
                    fontSize: "16px",
                    borderRadius: "6px",
                    border: "1px solid #ccc"
                }}
            />

            {/* Tarnete tabel */}
            <DeliveryList
                deliveries={filteredDeliveries}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
        </div>
    );
};

export default RegisterDeliveryPage;
