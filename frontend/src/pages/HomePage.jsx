import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIncomingMaterials } from '../api/deliveryApi';
import { getShipments } from '../api/shipmentApi';
import '../styles/delivery.css';
import '../styles/main.css';
import '../styles/warehouse.css';
import '../styles/home.css'

function filterShipmentsByPeriod(shipments, period) {
    const now = new Date();
    return shipments.filter(shipment => {
        const date = new Date(shipment.dateSent);
        switch (period) {
            case "week":
                const weekAhead = new Date(now);
                weekAhead.setDate(now.getDate() + 7);
                return date > now && date <= weekAhead;
            case "month":
                const monthAhead = new Date(now);
                monthAhead.setMonth(now.getMonth() + 1);
                return date > now && date <= monthAhead;
            case "year":
                const yearAhead = new Date(now);
                yearAhead.setFullYear(now.getFullYear() + 1);
                return date > now && date <= yearAhead;
            default:
                return true;
        }
    });
}

const HomePage = () => {
    const navigate = useNavigate();

    // Default period is week for both sections
    const [incomingPeriod, setIncomingPeriod] = useState("week");
    const [outgoingPeriod, setOutgoingPeriod] = useState("week");

    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    const [shipments, setShipments] = useState([]);
    const [loadingShipments, setLoadingShipments] = useState(true);

    // Incoming fetch
    useEffect(() => {
        setLoading(true);
        getIncomingMaterials(incomingPeriod)
            .then(setMaterials)
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [incomingPeriod]);

    // Outgoing fetch
    useEffect(() => {
        setLoadingShipments(true);
        getShipments()
            .then(setShipments)
            .catch(err => console.error(err))
            .finally(() => setLoadingShipments(false));
    }, []);

    const filteredShipments = filterShipmentsByPeriod(shipments, outgoingPeriod);

    return (
        <div className="delivery-page">
            <div className="warehouse-tabs">
                <button className="active-tab">Home</button>
                <button onClick={() => navigate('/register-delivery')}>Register Delivery</button>
                <button onClick={() => navigate("/warehouse")}>Warehouse Dashboard</button>
                <button disabled>Production Usage</button>
            </div>

            <h2>Sissetulnud materjalid</h2>
            <div className="filter-bar">
                <button className={`filter-btn${incomingPeriod === "week" ? " active" : ""}`} onClick={() => setIncomingPeriod("week")}>Viimane nädal</button>
                <button className={`filter-btn${incomingPeriod === "month" ? " active" : ""}`} onClick={() => setIncomingPeriod("month")}>Viimane kuu</button>
                <button className={`filter-btn${incomingPeriod === "year" ? " active" : ""}`} onClick={() => setIncomingPeriod("year")}>Viimane aasta</button>
                <button className={`filter-btn${incomingPeriod === "all" ? " active" : ""}`} onClick={() => setIncomingPeriod("all")}>Kõik</button>
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
                        <tr><td colSpan="5">Saabunud tarneid ei leitud</td></tr>
                    ) : (
                        materials.map(item => (
                            <tr key={item.id}>
                                <td>{item.waybillNo}</td>
                                <td>{item.supplierName}</td>
                                <td>{item.woodType}</td>
                                <td>{new Date(item.arrivalDate).toLocaleDateString('et-EE')}</td>
                                <td>{item.totalVolumeTm?.toFixed(3)}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            )}

            <h2>Väljaminevad tellimused</h2>
            <div className="filter-bar">
                <button className={`filter-btn${outgoingPeriod === "week" ? " active" : ""}`} onClick={() => setOutgoingPeriod("week")}>Järgnev nädal</button>
                <button className={`filter-btn${outgoingPeriod === "month" ? " active" : ""}`} onClick={() => setOutgoingPeriod("month")}>Järgnev kuu</button>
                <button className={`filter-btn${outgoingPeriod === "year" ? " active" : ""}`} onClick={() => setOutgoingPeriod("year")}>Järgnev aasta</button>
                <button className={`filter-btn${outgoingPeriod === "all" ? " active" : ""}`} onClick={() => setOutgoingPeriod("all")}>Kõik</button>
            </div>
            {loadingShipments ? (
                <p>Laadimine...</p>
            ) : (
                <table className="shipments-table">
                    <thead>
                    <tr>
                        <th>Tellimuse number</th>
                        <th>Tellimuse kuupäev</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredShipments.length === 0 ? (
                        <tr>
                            <td colSpan={2}>Väljaminevaid tellimusi ei leitud.</td>
                        </tr>
                    ) : (
                        filteredShipments.map(shipment => (
                            <tr key={shipment.id}>
                                <td>{shipment.vehicleNo}</td>
                                <td>{new Date(shipment.dateSent).toLocaleDateString('et-EE')}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default HomePage;
