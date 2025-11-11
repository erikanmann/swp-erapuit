import React, { useState, useEffect } from "react";
import { getStockItems,  sendMaterialToProduction } from "../api/stockApi";
import "../styles/delivery.css";
import "../styles/main.css";
import "../styles/warehouse.css";
import { useNavigate } from "react-router-dom";

function ProductionUsagePage() {
    const navigate = useNavigate();
    const [stockItems, setStockItems] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [usage, setUsage] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        getStockItems()
            .then(setStockItems)
            .catch((err) => setError("Could not load warehouse items"));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResult(null);
        try {
            const updated = await  sendMaterialToProduction(selectedId, usage);
            setResult(updated);
        } catch (err) {
            setError(err.message || "Failed to update material.");
        }
    };

    return (
        <div className="delivery-page">
            <div className="warehouse-tabs">
                <button onClick={() => navigate("/home")}>Home</button>
                <button onClick={() => navigate("/register-delivery")}>Register Delivery</button>
                <button onClick={() => navigate("/warehouse")}>Warehouse Dashboard</button>
                <button className="active-tab">Production Usage</button>
            </div>
            <div className="form-section">
                <form onSubmit={handleSubmit} className="form">
                    <label>
                        <span>Vali materjal laost:</span>
                        <select
                            value={selectedId}
                            onChange={e => setSelectedId(e.target.value)}
                            required
                            className="dropdown"
                        >
                            <option value="">-- Vali --</option>
                            <option value="Mänd">Mänd</option>
                            <option value="Kuusk">Kuusk</option>
                            <option value="Kask">Kask</option>
                        </select>
                    </label>
                    <label>
                        <span>Sisesta kogus tootmisse (m³):</span>
                        <input
                            type="number"
                            value={usage}
                            min="0"
                            step="0.01"
                            onChange={e => setUsage(e.target.value)}
                            required
                            className="input"
                        />
                    </label>
                    <button type="submit" className="main-button">Saada tootmisse</button>
                </form>
                {error && <div className="error">{error}</div>}
                {result && (
                    <div className="success">
                        Uuendatud laoseis: {result.woodType} materjalil on nüüd {result.usableVolume} m³ alles.
                    </div>
                )}
            </div>
        </div>
    );

}

export default ProductionUsagePage;
