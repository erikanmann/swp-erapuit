import React, { useEffect, useState } from "react";
import {
    getDeliveriesPaged,
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

const PAGE_SIZE = 200;

const RegisterDeliveryPage = () => {
    const navigate = useNavigate();

    const [pageData, setPageData] = useState(null);
    const [editingDelivery, setEditingDelivery] = useState(null);

    // ---------------------------
    // LOAD PAGINATED PAGE
    // ---------------------------
    const loadPage = async (page = 0) => {
        const data = await getDeliveriesPaged(page, PAGE_SIZE);
        setPageData(data);
    };

    useEffect(() => {
        loadPage(0);
    }, []);

    // ---------------------------
    // SAVE / UPDATE DELIVERY
    // ---------------------------
    const handleSave = async (data) => {
        try {
            if (editingDelivery) {
                await updateDelivery(editingDelivery.id, data);
                setEditingDelivery(null);
            } else {
                await addDelivery(data);
            }

            await loadPage(pageData.number); // reload current page
        } catch (err) {
            alert(err.message || "Salvestamine ebaõnnestus");
        }
    };

    // ---------------------------
    // DELETE DELIVERY
    // ---------------------------
    const handleDelete = async (id) => {
        try {
            await deleteDelivery(id);

            // Reload same page or previous if the last item is gone
            const nextPage =
                pageData.content.length === 1 && pageData.number > 0
                    ? pageData.number - 1
                    : pageData.number;

            await loadPage(nextPage);
        } catch (err) {
            alert(err.message || "Kustutamine ebaõnnestus");
        }
    };

    // ---------------------------
    // EDIT DELIVERY
    // ---------------------------
    const handleEdit = (delivery) => {
        setEditingDelivery(delivery);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCancelEdit = () => setEditingDelivery(null);

    // ---------------------------
    // EVR MASS IMPORT
    // ---------------------------
    const handleImportAllEvrLoads = async () => {
        try {
            const loads = await getEvrIncoming();

            if (loads.length === 0) {
                alert("EVR-ist ei leitud ühtegi saabuvat koormat.");
                return;
            }

            const existingWaybills = new Set(pageData.content.map(d => d.waybillNo));
            const newLoads = loads.filter(l => !existingWaybills.has(l.waybillNumber));

            if (newLoads.length === 0) {
                alert("Kõik koormad on juba süsteemis olemas.");
                return;
            }

            if (!window.confirm(`Kas soovid importida ${newLoads.length} uut EVR koormat?`)) {
                return;
            }

            for (const load of newLoads) {
                try {
                    await importFromEvr(load);
                } catch (err) {
                    alert(`Koorma ${load.waybillNumber} import ebaõnnestus: ${err.message}`);
                }
            }

            await loadPage(pageData.number);
            alert("Kõik uued EVR koormad edukalt lattu lisatud!");

        } catch (err) {
            alert("EVR import ebaõnnestus: " + err.message);
        }
    };

    return (
        <div className="delivery-page">

            <div className="warehouse-tabs">
                <button onClick={() => navigate("/home")}>Avaleht</button>
                <button className="active-tab">Tarne registreerimine</button>
                <button onClick={() => navigate("/warehouse")}>Lao ülevaade</button>
                <button onClick={() => navigate("/production-usage")}>Tootmise kasutus</button>
                <button onClick={() => navigate("/outbound-shipping")}>Väljaminev kaup</button>
            </div>

            <h1>Tarne registreerimine</h1>

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

            <DeliveryForm
                onSave={handleSave}
                editingDelivery={editingDelivery}
                onCancelEdit={handleCancelEdit}
            />

            {/* Tarne tabel + pagination */}
            <DeliveryList
                pageData={pageData}
                onPageChange={loadPage}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
        </div>
    );
};

export default RegisterDeliveryPage;
