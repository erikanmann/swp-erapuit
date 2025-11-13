import React, { useState, useEffect } from "react";
import "../styles/delivery.css";
import "../styles/main.css";
import "../styles/warehouse.css";
import { useNavigate } from "react-router-dom";

import {
    getStockItems,
    getStockByWoodType,
    filterStock,
    updateUsableVolume,
    sendMaterialToProduction,
    getStatsByWoodType,
} from "../api/stockApi";

const WarehouseDashboard = () => {
    const navigate = useNavigate();

    // --- STATE ---
    const [stock, setStock] = useState([]);
    const [woodTypes, setWoodTypes] = useState([]);

    // Filters
    const [woodTypeFilter, setWoodTypeFilter] = useState("");
    const [supplierFilter, setSupplierFilter] = useState("");
    const [fromDateFilter, setFromDateFilter] = useState("");

    // Modals / messages
    const [showProductionModal, setShowProductionModal] = useState(false);
    const [selectedWoodType, setSelectedWoodType] = useState("");
    const [usage, setUsage] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // --- Load initial stock ---
    useEffect(() => {
        loadStock();
    }, []);

    const loadStock = () => {
        getStockItems()
            .then((items) => {
                setStock(items);

                const types = Array.from(
                    new Set(items.map((i) => (i.woodType || "").trim()).filter(Boolean))
                );

                setWoodTypes(types);
            })
            .catch((err) => console.error(err));
    };

    // --- Apply filters ---
    useEffect(() => {
        const params = {};

        if (woodTypeFilter) params.woodType = woodTypeFilter;
        if (supplierFilter) params.supplier = supplierFilter;
        if (fromDateFilter) params.fromDate = fromDateFilter;

        if (Object.keys(params).length === 0) {
            loadStock();
            return;
        }

        filterStock(params)
            .then(setStock)
            .catch((err) => console.error("Filter failed:", err));
    }, [woodTypeFilter, supplierFilter, fromDateFilter]);

    // --- Stats ---
    const totalStock = stock.reduce((sum, s) => sum + (s.totalVolume ?? 0), 0);
    const usableStock = stock.reduce((sum, s) => sum + (s.usableVolume ?? 0), 0);
    const usedPercent = totalStock > 0 ? (((totalStock - usableStock) / totalStock) * 100).toFixed(1) : 0;

    // --- Handle usableVolume update ---
    const handleUsableVolumeChange = async (id, newVal) => {
        try {
            const updated = await updateUsableVolume(id, newVal);
            setStock((prev) =>
                prev.map((item) => (item.id === id ? { ...item, usableVolume: updated.usableVolume } : item))
            );
            setMessage("Usable volume updated successfully.");
        } catch (err) {
            setError(err.message);
        }
    };

    // --- Production Usage Modal Submit ---
    const handleSendToProduction = async () => {
        setError("");
        setMessage("");

        try {
            const updated = await sendMaterialToProduction(selectedWoodType, parseFloat(usage));
            setMessage(
                `${updated.woodType} updated: remaining ${updated.usableVolume.toFixed(2)} m³`
            );
            setShowProductionModal(false);
            loadStock();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="delivery-page">
            <div className="warehouse-tabs">
                <button onClick={() => navigate("/home")}>Home</button>
                <button onClick={() => navigate("/register-delivery")}>Register Delivery</button>
                <button className="active-tab">Warehouse Dashboard</button>
                <button onClick={() => navigate("/production-usage")}>Production Usage</button>
                <button onClick={() => navigate("/outbound-shipping")}>Outbound Shipping</button>
            </div>

            <h2>Warehouse Dashboard</h2>

            {/* --- FILTER BAR --- */}
            <div className="filter-bar">
                <label>Puiduliik:</label>
                <select
                    className="warehouse-select"
                    value={woodTypeFilter}
                    onChange={(e) => setWoodTypeFilter(e.target.value)}
                >
                    <option value="">Kõik</option>
                    {woodTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>

                <label>Tarnija:</label>
                <input
                    type="text"
                    placeholder="RMK, Estfor..."
                    value={supplierFilter}
                    onChange={(e) => setSupplierFilter(e.target.value)}
                />

                <label>Alates kuupäevast:</label>
                <input
                    type="date"
                    value={fromDateFilter}
                    onChange={(e) => setFromDateFilter(e.target.value)}
                />
            </div>

            {/* --- SUCCESS & ERROR MESSAGES --- */}
            {message && <div className="success">{message}</div>}
            {error && <div className="error">{error}</div>}

            {/* --- STAT CARDS --- */}
            <div className="warehouse-stats">
                <div className="stat-card">
                    <h4>Total Stock</h4>
                    <p>{totalStock.toFixed(2)} m³</p>
                </div>
                <div className="stat-card">
                    <h4>Usable Stock</h4>
                    <p>{usableStock.toFixed(2)} m³</p>
                </div>
                <div className="stat-card">
                    <h4>Material Loss</h4>
                    <p>{usedPercent}%</p>
                </div>
            </div>

            {/* --- STOCK TABLE --- */}
            <div className="warehouse-section">
                <h3>Warehouse Inventory</h3>

                <table className="warehouse-table">
                    <thead>
                    <tr>
                        <th>Delivery ID</th>
                        <th>Supplier</th>
                        <th>Wood Type</th>
                        <th>Arrival Date</th>
                        <th>Total (m³)</th>
                        <th>Usable (m³)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {stock.map((item) => (
                        <tr key={item.id}>
                            <td>{item.deliveryId}</td>
                            <td>{item.supplier}</td>
                            <td>{item.woodType}</td>
                            <td>{item.arrivalDate || "-"}</td>
                            <td>{item.totalVolume?.toFixed(2)}</td>

                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    defaultValue={item.usableVolume}
                                    onBlur={(e) =>
                                        handleUsableVolumeChange(
                                            item.id,
                                            parseFloat(e.target.value)
                                        )
                                    }
                                    style={{ width: "90px", textAlign: "right" }}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* --- PRODUCTION MODAL --- */}
            {showProductionModal && (
                <div className="modal-bg">
                    <div className="modal-card">
                        <h3>Send Material to Production</h3>

                        <label>Puiduliik:</label>
                        <select
                            value={selectedWoodType}
                            onChange={(e) => setSelectedWoodType(e.target.value)}
                            className="warehouse-select"
                        >
                            <option value="">-- select --</option>
                            {woodTypes.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>

                        <label>Kogus (m³):</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={usage}
                            onChange={(e) => setUsage(e.target.value)}
                        />

                        <button onClick={handleSendToProduction}>Kinnita</button>
                        <button
                            style={{ background: "#ccc", color: "#222" }}
                            onClick={() => setShowProductionModal(false)}
                        >
                            Sulge
                        </button>
                    </div>
                </div>
            )}

            <div style={{ marginTop: "1.5rem" }}>
                <button onClick={() => setShowProductionModal(true)}>
                    Kasuta materjali tootmises
                </button>
            </div>
        </div>
    );
};

export default WarehouseDashboard;
