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
import Navbar from "../components/Navbar";

import "../styles/delivery.css";
import "../styles/main.css";
import "../styles/warehouse.css";

import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 200;

const RegisterDeliveryPage = () => {
    const navigate = useNavigate();// eslint-disable-line no-unused-vars

    const [pageData, setPageData] = useState(null);
    const [editingDelivery, setEditingDelivery] = useState(null);
    const [search, setSearch] = useState("");

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

            await loadPage(pageData.number);
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

    // ---------------------------
    // SEARCH (filters only client-side page content)
    // ---------------------------
    const filteredPageData = pageData
        ? {
            ...pageData,
            content: pageData.content.filter((d) => {
                const t = search.toLowerCase();
                return (
                    d.driverName?.toLowerCase().includes(t) ||
                    d.truckNo?.toLowerCase().includes(t) ||
                    d.waybillNo?.toLowerCase().includes(t) ||
                    d.supplierName?.toLowerCase().includes(t) ||
                    d.woodType?.toLowerCase().includes(t) ||
                    d.arrivalDate?.split("T")[0].includes(t)
                );
            }),
        }
        : null;

    return (
        <>
            <Navbar />
            <div className="delivery-page">

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
                initialValues={editingDelivery}
                mode={editingDelivery ? "edit" : "create"}
                onCancelEdit={handleCancelEdit}
            />

            {/* 🟦 SEARCH FIELD */}
            <input
                type="text"
                placeholder="Otsi tarnete seast..."
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

            {/* LIST + PAGINATION (WITH SEARCH APPLIED) */}
            <DeliveryList
                pageData={filteredPageData}
                onPageChange={loadPage}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
            </div>
        </>
    );
};

export default RegisterDeliveryPage;
