import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getIncomingMaterials } from "../api/deliveryApi";
import { getShipments } from "../api/shipmentApi";
import "../styles/delivery.css";
import "../styles/main.css";
import "../styles/warehouse.css";
import "../styles/home.css";

// Filtreerib mineviku saadetisi perioodi järgi
function filterShipmentsByPeriod(shipments, period) {
    const now = new Date();
    return shipments.filter((shipment) => {
        const date = new Date(shipment.dateSent);

        switch (period) {
            case "week": {
                const weekAgo = new Date(now);
                weekAgo.setDate(now.getDate() - 7);
                return date >= weekAgo && date <= now;
            }
            case "month": {
                const monthAgo = new Date(now);
                monthAgo.setMonth(now.getMonth() - 1);
                return date >= monthAgo && date <= now;
            }
            case "year": {
                const yearAgo = new Date(now);
                yearAgo.setFullYear(now.getFullYear() - 1);
                return date >= yearAgo && date <= now;
            }
            default:
                return true;
        }
    });
}

const HomePage = () => {
    const navigate = useNavigate();

    const [incomingPeriod, setIncomingPeriod] = useState("week");
    const [outgoingPeriod, setOutgoingPeriod] = useState("week");

    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    const [shipments, setShipments] = useState([]);
    const [loadingShipments, setLoadingShipments] = useState(true);

    // Sissetulevad tarned
    useEffect(() => {
        setLoading(true);
        getIncomingMaterials(incomingPeriod)
            .then(setMaterials)
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [incomingPeriod]);

    // Väljaminevad saadetised
    useEffect(() => {
        setLoadingShipments(true);
        getShipments()
            .then(setShipments)
            .catch((err) => console.error(err))
            .finally(() => setLoadingShipments(false));
    }, [outgoingPeriod]);

    const filteredShipments = filterShipmentsByPeriod(shipments, outgoingPeriod);

    return (
        <div className="delivery-page">
            {/* Ülemine navigeerimisriba */}
            <div className="warehouse-tabs">
                <button className="active-tab">Avaleht</button>
                <button onClick={() => navigate("/register-delivery")}>
                    Tarne registreerimine
                </button>
                <button onClick={() => navigate("/warehouse")}>Lao ülevaade</button>
                <button onClick={() => navigate("/production-usage")}>
                    Tootmise kasutus
                </button>
                <button onClick={() => navigate("/outbound-shipping")}>
                    Väljaminev kaup
                </button>
            </div>

            {/* SISSETULEVAD TARNED */}
            <h2>Sissetulevad tarned</h2>
            <div className="filter-bar">
                <button
                    className={`filter-btn${
                        incomingPeriod === "week" ? " active" : ""
                    }`}
                    onClick={() => setIncomingPeriod("week")}
                >
                    Viimane nädal
                </button>
                <button
                    className={`filter-btn${
                        incomingPeriod === "month" ? " active" : ""
                    }`}
                    onClick={() => setIncomingPeriod("month")}
                >
                    Viimane kuu
                </button>
                <button
                    className={`filter-btn${
                        incomingPeriod === "year" ? " active" : ""
                    }`}
                    onClick={() => setIncomingPeriod("year")}
                >
                    Viimane aasta
                </button>
                <button
                    className={`filter-btn${
                        incomingPeriod === "all" ? " active" : ""
                    }`}
                    onClick={() => setIncomingPeriod("all")}
                >
                    Kõik
                </button>
            </div>

            {loading ? (
                <p>Laadimine...</p>
            ) : (
                <table className="materials-table">
                    <thead>
                    <tr>
                        <th>Veoselehe number</th>
                        <th>Tarnija nimi</th>
                        <th>Puiduliik</th>
                        <th>Saabumiskuupäev</th>
                        <th>Kogukogus (tm)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {materials.length === 0 ? (
                        <tr>
                            <td colSpan="5">Saabunud tarneid ei leitud.</td>
                        </tr>
                    ) : (
                        materials.map((item) => (
                            <tr key={item.id}>
                                <td>{item.waybillNo}</td>
                                <td>{item.supplierName}</td>
                                <td>{item.woodType}</td>
                                <td>
                                    {new Date(item.arrivalDate).toLocaleDateString("et-EE")}
                                </td>
                                <td>{item.totalVolumeTm?.toFixed(3)}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            )}

            {/* VÄLJASAadetud tellimused */}
            <h2>Väljasaadetud tellimused</h2>
            <div className="filter-bar">
                <button
                    className={`filter-btn${
                        outgoingPeriod === "week" ? " active" : ""
                    }`}
                    onClick={() => setOutgoingPeriod("week")}
                >
                    Viimane nädal
                </button>
                <button
                    className={`filter-btn${
                        outgoingPeriod === "month" ? " active" : ""
                    }`}
                    onClick={() => setOutgoingPeriod("month")}
                >
                    Viimane kuu
                </button>
                <button
                    className={`filter-btn${
                        outgoingPeriod === "year" ? " active" : ""
                    }`}
                    onClick={() => setOutgoingPeriod("year")}
                >
                    Viimane aasta
                </button>
                <button
                    className={`filter-btn${
                        outgoingPeriod === "all" ? " active" : ""
                    }`}
                    onClick={() => setOutgoingPeriod("all")}
                >
                    Kõik
                </button>
            </div>

            {loadingShipments ? (
                <p>Laadimine...</p>
            ) : (
                <table className="materials-table">
                    <thead>
                    <tr>
                        <th>Veoselehe number</th>
                        <th>Tarnija nimi</th>
                        <th>Saabumiskuupäev</th>
                        <th>Kogukogus (tm)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {materials.map(item => (
                        <tr key={item.id}>
                            <td>{item.waybillNo}</td>
                            <td>{item.supplierName}</td>
                            <td>{new Date(item.arrivalDate).toLocaleDateString("et-EE")}</td>
                            <td>{item.totalVolumeTm?.toFixed(3)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

            )}
        </div>
    );
};

export default HomePage;
