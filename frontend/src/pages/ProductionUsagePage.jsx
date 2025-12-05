import React, { useState, useEffect } from "react";
import { getStockItems, sendMaterialToProduction } from "../api/stockApi";
import "../styles/delivery.css";
import "../styles/main.css";
import "../styles/warehouse.css";
import { useNavigate } from "react-router-dom";

function ProductionUsagePage() {
    const navigate = useNavigate();

    const [stockItems, setStockItems] = useState([]);
    const [selectedDeliveryId, setSelectedDeliveryId] = useState(""); // CHANGED
    const [usage, setUsage] = useState("");

    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        getStockItems()
            .then((items) => {
                setStockItems(items);
            })
            .catch(() =>
                setError("Lao kirjete laadimine ebaõnnestus. Palun proovi hiljem uuesti.")
            );
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResult(null);

        if (!selectedDeliveryId) {
            setError("Palun vali laopartii.");
            return;
        }

        const usageValue = parseFloat(usage);
        if (isNaN(usageValue) || usageValue <= 0) {
            setError("Kogus peab olema positiivne number.");
            return;
        }

        try {
            const updated = await sendMaterialToProduction(
                selectedDeliveryId,
                usageValue
            );
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

                    {/* SELECT FIELD */}
                    <label>
                        <span>Vali laopartii (ID + puiduliik) <span className="required">*</span></span>
                        <select
                            value={selectedDeliveryId}
                            onChange={(e) => {
                                setSelectedDeliveryId(e.target.value);
                                setError("");     // clear error on change
                            }}
                            className={`dropdown ${error && !selectedDeliveryId ? "input-error" : ""}`}
                        >
                            <option value="">-- Vali laopartii --</option>
                            {stockItems.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.id} – {item.woodType} – {item.usableVolume} m³
                                </option>
                            ))}
                        </select>

                        {/* Custom error message */}
                        {error && !selectedDeliveryId && (
                            <p className="error-msg">Palun vali laopartii.</p>
                        )}
                    </label>

                    {/* USAGE FIELD */}
                    <label>
                        <span>Sisesta kogus tootmisse (m³) <span className="required">*</span></span>
                        <input
                            type="number"
                            value={usage}
                            min="0"
                            step="0.01"
                            onChange={(e) => {
                                setUsage(e.target.value);
                                setError("");     // clear error on change
                            }}
                            className={`input ${error && (!usage || usage <= 0) ? "input-error" : ""}`}
                        />

                        {error && (!usage || usage <= 0) && (
                            <p className="error-msg">Kogus peab olema positiivne number.</p>
                        )}
                    </label>

                    <button type="submit" className="main-button">
                        Saada tootmisse
                    </button>
                </form>

                {error && <div className="error">{error}</div>}

                {result && (
                    <div className="success">
                        Laopartii uuendatud: kasutatav kogus on nüüd{" "}
                        {result.usableVolume.toFixed(2)} m³.
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductionUsagePage;
