import React, { useState, useEffect } from "react";
import { getStockItems, sendMaterialToProduction } from "../api/stockApi";
import "../styles/delivery.css";
import "../styles/main.css";
import "../styles/warehouse.css";
import { useNavigate } from "react-router-dom";

function ProductionUsagePage() {
    const navigate = useNavigate();

    const [stockItems, setStockItems] = useState([]);
    const [woodTypes, setWoodTypes] = useState([]);

    const [selectedWoodType, setSelectedWoodType] = useState("");
    const [usage, setUsage] = useState("");

    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        getStockItems()
            .then((items) => {
                setStockItems(items);
                const types = Array.from(
                    new Set(items.map((i) => (i.woodType || "").trim()).filter(Boolean))
                );
                setWoodTypes(types);
            })
            .catch(() =>
                setError("Lao kirjete laadimine ebaõnnestus. Palun proovi hiljem uuesti.")
            );
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResult(null);

        if (!selectedWoodType) {
            setError("Palun vali puiduliik.");
            return;
        }

        const usageValue = parseFloat(usage);
        if (isNaN(usageValue) || usageValue <= 0) {
            setError("Kogus peab olema positiivne number.");
            return;
        }

        try {
            const updated = await sendMaterialToProduction(selectedWoodType, usageValue);
            setResult(updated);
        } catch (err) {
            setError(
                err.message || "Materjali kasutamise salvestamine ebaõnnestus."
            );
        }
    };

    return (
        <div className="delivery-page">
            <div className="warehouse-tabs">
                <button onClick={() => navigate("/home")}>Avaleht</button>
                <button onClick={() => navigate("/register-delivery")}>
                    Tarne registreerimine
                </button>
                <button onClick={() => navigate("/warehouse")}>Lao ülevaade</button>
                <button className="active-tab">Tootmise kasutus</button>
                <button onClick={() => navigate("/outbound-shipping")}>
                    Väljaminev kaup
                </button>
            </div>

            <div className="form-section">
                <form onSubmit={handleSubmit} className="form">
                    <h2>Materjali kasutamine tootmises</h2>

                    <label>
                        <span>Vali materjal laost (puiduliik):</span>
                        <select
                            value={selectedWoodType}
                            onChange={(e) => setSelectedWoodType(e.target.value)}
                            required
                            className="dropdown"
                        >
                            <option value="">-- Vali puiduliik --</option>
                            {woodTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        <span>Sisesta kogus tootmisse (m³):</span>
                        <input
                            type="number"
                            value={usage}
                            min="0"
                            step="0.01"
                            onChange={(e) => setUsage(e.target.value)}
                            required
                            className="input"
                        />
                    </label>

                    <button type="submit" className="main-button">
                        Saada tootmisse
                    </button>
                </form>

                {error && <div className="error">{error}</div>}

                {result && (
                    <div className="success">
                        Uuendatud laoseis: {result.woodType} materjalil on nüüd{" "}
                        {result.usableVolume.toFixed(2)} m³ alles.
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductionUsagePage;
