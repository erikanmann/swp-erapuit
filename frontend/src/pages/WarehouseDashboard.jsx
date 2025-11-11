import React, { useState, useEffect } from "react";
import '../styles/delivery.css';
import "../styles/main.css";
import "../styles/warehouse.css";
import { useNavigate } from "react-router-dom";
import { getStockItems, getStockByWoodType, updateUsableVolume } from "../api/stockApi";

const WarehouseDashboard = () => {
    const navigate = useNavigate();
    const [stock, setStock] = useState([]);
    const [allWoodTypes, setAllWoodTypes] = useState([]);
    const [woodTypeFilter, setWoodTypeFilter] = useState(""); // "" = Kõik

    // Keep a backup of ALL stock to derive dropdown options!
    useEffect(() => {
        getStockItems()
            .then(data => {
                // Only use this for dropdown, not for table
                const types = Array.from(new Set(data.map(item => item.woodType).filter(Boolean)));
                setAllWoodTypes(types);
                setStock(data); // Shows all initially
            })
            .catch(err => console.error("Stock load failed:", err));
    }, []);

    // Update stock based on selected dropdown
    useEffect(() => {
        if (!woodTypeFilter || woodTypeFilter === "Kõik") {
            getStockItems().then(setStock);
        } else {
            console.log(woodTypeFilter)
            getStockByWoodType(woodTypeFilter).then(setStock);
        }
    }, [woodTypeFilter]);

    // Now ALWAYS use THIS "stock" array for all table/stats calculations
    const totalDeliveries = stock.length;
    const totalStock = stock.reduce((sum, s) => sum + (s.totalVolumeTm ?? s.totalVolume ?? 0), 0);
    const usableStock = stock.reduce((sum, s) => sum + (s.actualVolumeTm ?? s.usableVolume ?? 0), 0);
    const usedPercent = totalStock > 0 ? (((totalStock - usableStock) / totalStock) * 100).toFixed(1) : 0;

    return (
        <div className="delivery-page">
            <div className="warehouse-tabs">
                <button onClick={() => navigate("/home")}>Home</button>
                <button onClick={() => navigate("/register-delivery")}>Register Delivery</button>
                <button className="active-tab">Warehouse Dashboard</button>
                <button disabled>Production Usage</button>
            </div>
            <h2>Lao ülevaade ja jälgimine</h2>
            <div className="filter-bar">
                <label htmlFor="woodTypeSelect">
                    Filtreeri puiduliigi järgi:
                </label>
                <select
                    id="woodTypeSelect"
                    className="warehouse-select"
                    value={woodTypeFilter}
                    onChange={e => setWoodTypeFilter(e.target.value)}
                >
                    <option value="">Kõik</option>
                    {allWoodTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {/* All following code reads ONLY from filtered stock */}
            <div className="warehouse-stats">
                <div className="stat-card">
                    <h4>Total Deliveries</h4>
                    <p>{totalDeliveries} registered</p>
                </div>
                <div className="stat-card">
                    <h4>Total Stock (Original)</h4>
                    <p>{totalStock.toFixed(2)} m³</p>
                </div>
                <div className="stat-card">
                    <h4>Usable Stock</h4>
                    <p>{usableStock.toFixed(2)} m³</p>
                </div>
                <div className="stat-card">
                    <h4>Material Loss</h4>
                    <p>{usedPercent}% difference</p>
                </div>
            </div>
            <div className="warehouse-section">
                <h3>Material Usage Statistics</h3>
                <p className="section-subtitle">Consumption rates</p>
                <div className="empty-box">{stock.length ? "Show your chart here" : "No material data available"}</div>
            </div>
            <div className="warehouse-section">
                <h3>Warehouse Inventory</h3>
                <p className="section-subtitle">
                    All registered deliveries and current stock levels
                </p>
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
                            <td>{item.waybillNo || item.deliveryId}</td>
                            <td>{item.supplierName || item.supplier}</td>
                            <td>{item.woodType}</td>
                            <td>
                                {item.arrivalDate
                                    ? new Date(item.arrivalDate).toLocaleDateString("et-EE")
                                    : "-"}
                            </td>
                            <td>
                                {(item.totalVolumeTm ?? item.totalVolume ?? 0).toFixed(3)}
                            </td>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.001"
                                    defaultValue={item.actualVolumeTm ?? item.usableVolume ?? 0}
                                    onBlur={async (e) => {
                                        const newValue = parseFloat(e.target.value);
                                        if (isNaN(newValue)) return;
                                        try {
                                            await updateUsableVolume(item.id, newValue);
                                            setStock((prev) =>
                                                prev.map((s) =>
                                                    s.id === item.id
                                                        ? { ...s, actualVolumeTm: newValue }
                                                        : s
                                                )
                                            );
                                        } catch (err) {
                                            alert("Update failed: " + err.message);
                                        }
                                    }}
                                    style={{
                                        width: "100px",
                                        textAlign: "right",
                                        padding: "4px",
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WarehouseDashboard;
