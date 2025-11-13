import React, { useState, useEffect } from "react";
import "../styles/delivery.css";
import "../styles/main.css";
import "../styles/warehouse.css";
import { useNavigate } from "react-router-dom";

import {
    getStockItems,
    filterStock,
    updateUsableVolume,
    sendMaterialToProduction,
} from "../api/stockApi";

const WarehouseDashboard = () => {
    const navigate = useNavigate();

    const [stock, setStock] = useState([]);
    const [woodTypes, setWoodTypes] = useState([]);

    const [woodTypeFilter, setWoodTypeFilter] = useState("");
    const [supplierFilter, setSupplierFilter] = useState("");
    const [fromDateFilter, setFromDateFilter] = useState("");

    const [showProductionModal, setShowProductionModal] = useState(false);
    const [selectedWoodType, setSelectedWoodType] = useState("");
    const [usage, setUsage] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

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
            .catch((err) => console.error("Filtreerimine ebaõnnestus:", err));
    }, [woodTypeFilter, supplierFilter, fromDateFilter]);

    const totalStock = stock.reduce((sum, s) => sum + (s.totalVolume ?? 0), 0);
    const usableStock = stock.reduce((sum, s) => sum + (s.usableVolume ?? 0), 0);
    const usedPercent =
        totalStock > 0
            ? (((totalStock - usableStock) / totalStock) * 100).toFixed(1)
            : 0;

    const handleUsableVolumeChange = async (id, newVal) => {
        try {
            const updated = await updateUsableVolume(id, newVal);
            setStock((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? { ...item, usableVolume: updated.usableVolume }
                        : item
                )
            );
            setMessage("Kasutatav kogus edukalt uuendatud.");
            setError("");
        } catch (err) {
            setError(err.message);
            setMessage("");
        }
    };

    const handleSendToProduction = async () => {
        setError("");
        setMessage("");

        try {
            const updated = await sendMaterialToProduction(
                selectedWoodType,
                parseFloat(usage)
            );
            setMessage(
                `Materjal ${updated.woodType} uuendatud: alles ${updated.usableVolume.toFixed(
                    2
                )} m³.`
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
                <button onClick={() => navigate("/home")}>Avaleht</button>
                <button onClick={() => navigate("/register-delivery")}>
                    Tarne registreerimine
                </button>
                <button className="active-tab">Lao ülevaade</button>
                <button onClick={() => navigate("/production-usage")}>
                    Tootmise kasutus
                </button>
                <button onClick={() => navigate("/outbound-shipping")}>
                    Väljaminev kaup
                </button>
            </div>

            <h2>Lao ülevaade ja jälgimine</h2>

            {/* Filtririba */}
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
                    placeholder="nt RMK, Estfor..."
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

            {message && <div className="success">{message}</div>}
            {error && <div className="error">{error}</div>}

            {/* Statistika kaardid */}
            <div className="warehouse-stats">
                <div className="stat-card">
                    <h4>Kogu maht</h4>
                    <p>{totalStock.toFixed(2)} m³</p>
                </div>
                <div className="stat-card">
                    <h4>Kasutatav maht</h4>
                    <p>{usableStock.toFixed(2)} m³</p>
                </div>
                <div className="stat-card">
                    <h4>Materjalikadu</h4>
                    <p>{usedPercent}%</p>
                </div>
            </div>

            {/* Lao tabel */}
            <div className="warehouse-section">
                <h3>Lao kirjed</h3>

                <table className="warehouse-table">
                    <thead>
                    <tr>
                        <th>Tarne ID</th>
                        <th>Tarnija</th>
                        <th>Puiduliik</th>
                        <th>Saabumiskuupäev</th>
                        <th>Kogukogus (m³)</th>
                        <th>Kasutatav (m³)</th>
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

            {/* Tootmise modal */}
            {showProductionModal && (
                <div className="modal-bg">
                    <div className="modal-card">
                        <h3>Kasuta materjali tootmises</h3>

                        <label>Puiduliik:</label>
                        <select
                            value={selectedWoodType}
                            onChange={(e) => setSelectedWoodType(e.target.value)}
                            className="warehouse-select"
                        >
                            <option value="">-- vali puiduliik --</option>
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
