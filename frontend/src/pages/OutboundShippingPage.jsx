import React, { useState, useEffect } from "react";
import { addShipment, getShipments, deleteShipment, updateShipment } from "../api/shipmentApi";
import "../styles/delivery.css";
import "../styles/main.css";
import "../styles/warehouse.css";
import { useNavigate } from "react-router-dom";

function OutboundShippingPage() {
    const navigate = useNavigate();

    const [packages, setPackages] = useState([]);
    const [selectedPackages, setSelectedPackages] = useState([]);
    const [shipments, setShipments] = useState([]);

    const [filterCustomer, setFilterCustomer] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(null);

    const [deliveryNoteNo, setDeliveryNoteNo] = useState("");
    const [customer, setCustomer] = useState("");
    const [transportCompany, setTransportCompany] = useState("");
    const [vehicleNo, setVehicleNo] = useState("");
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const pkgRes = await fetch("http://localhost:8080/api/packages/available");
            const pkgData = await pkgRes.json();
            setPackages(pkgData);
            const shipmentsData = await getShipments();
            setShipments(shipmentsData);
        } catch (err) {
            setError("Andmete laadimine ebaõnnestus: " + err.message);
        }
    };

    const handlePackageSelect = (pkgId) => {
        setSelectedPackages(prev =>
            prev.includes(pkgId)
                ? prev.filter(id => id !== pkgId)
                : [...prev, pkgId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(null);

        if (!deliveryNoteNo.trim()) {
            setError("Saatelehe number on kohustuslik.");
            return;
        }

        try {
            let message = "";
            if (editingId) {
                await updateShipment(editingId, {
                    deliveryNoteNo,
                    customer,
                    transportCompany,
                    vehicleNo,
                });
                message = `Saadetis ${deliveryNoteNo} uuendatud.`;
            } else {
                const created = await addShipment({
                    deliveryNoteNo,
                    customer,
                    transportCompany,
                    vehicleNo,
                    dateSent: new Date().toISOString(),
                    packageIds: selectedPackages,
                });
                message = `Saadetis ${created.deliveryNoteNo} loodud. Laost eemaldati ${selectedPackages.length} pakki.`;
            }

            setSuccess({ message });
            resetForm();
            await loadData();
        } catch (err) {
            setError(err.message || "Saadetise salvestamine ebaõnnestus.");
        }
    };

    const resetForm = () => {
        setDeliveryNoteNo("");
        setCustomer("");
        setTransportCompany("");
        setVehicleNo("");
        setSelectedPackages([]);
        setEditingId(null);
    };

    const handleDelete = async (id, deliveryNoteNo) => {
        if (!window.confirm(`Kas soovid kindlasti kustutada saadetise ${deliveryNoteNo}?`)) return;

        try {
            await deleteShipment(id);
            setSuccess({ message: `Saadetis ${deliveryNoteNo} kustutatud.` });
            await loadData();
        } catch (err) {
            setError("Kustutamine ebaõnnestus: " + err.message);
        }
    };

    const handleEdit = (s) => {
        setEditingId(s.id);
        setDeliveryNoteNo(s.deliveryNoteNo || "");
        setCustomer(s.customer || "");
        setTransportCompany(s.transportCompany || "");
        setVehicleNo(s.vehicleNo || "");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // 🔍 Filtreerime saadetised kliendi järgi
    const visibleShipments = shipments.filter(s =>
        s.customer?.toLowerCase().includes(filterCustomer.toLowerCase())
    );

    return (
        <div className="delivery-page">
            <div className="warehouse-tabs">
                <button onClick={() => navigate("/home")}>Avaleht</button>
                <button onClick={() => navigate("/register-delivery")}>Sisenev kaup</button>
                <button onClick={() => navigate("/warehouse")}>Lao ülevaade</button>
                <button onClick={() => navigate("/production-usage")}>Tootmine</button>
                <button className="active-tab">Väljaminev kaup</button>
            </div>

            <div className="form-section">
                <h2>{editingId ? "Muuda saadetist" : "Loo uus saadetis"}</h2>

                <form onSubmit={handleSubmit} className="form">
                    <label>
                        <span>Saatelehe nr:</span>
                        <input
                            type="text"
                            value={deliveryNoteNo}
                            onChange={(e) => setDeliveryNoteNo(e.target.value)}
                            required
                            placeholder="nt SHP-20251112-0001"
                        />
                    </label>

                    <label>
                        <span>Klient / sihtkoht:</span>
                        <input
                            type="text"
                            value={customer}
                            onChange={(e) => setCustomer(e.target.value)}
                            required
                            placeholder="nt Estfor OÜ"
                        />
                    </label>

                    <label>
                        <span>Transpordifirma:</span>
                        <input
                            type="text"
                            value={transportCompany}
                            onChange={(e) => setTransportCompany(e.target.value)}
                            required
                            placeholder="nt Sumros Grupp AS"
                        />
                    </label>

                    <label>
                        <span>Sõiduki reg-nr:</span>
                        <input
                            type="text"
                            value={vehicleNo}
                            onChange={(e) => setVehicleNo(e.target.value)}
                            placeholder="nt 896TNM"
                        />
                    </label>

                    {!editingId && (
                        <>
                            <h3>Saadaval pakid</h3>
                            <div className="package-list">
                                {packages.length === 0 ? (
                                    <p>Saadaval pakke ei ole.</p>
                                ) : (
                                    packages.map((pkg) => (
                                        <label key={pkg.id} className="package-item">
                                            <input
                                                type="checkbox"
                                                checked={selectedPackages.includes(pkg.id)}
                                                onChange={() => handlePackageSelect(pkg.id)}
                                            />
                                            {pkg.productId || "Pakk"} – {pkg.volumeM3} m³, {pkg.weightKg} kg, {pkg.location}
                                        </label>
                                    ))
                                )}
                            </div>
                        </>
                    )}

                    <div className="button-row">
                        <button type="submit" className="main-button">
                            {editingId ? "Salvesta muudatused" : "Loo saadetis"}
                        </button>
                        {editingId && (
                            <button type="button" className="secondary-button" onClick={resetForm}>
                                Tühista muutmine
                            </button>
                        )}
                    </div>
                </form>

                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success.message}</div>}
            </div>

            {/* 🔍 Filtri väli */}
            <div className="shipments-section">
                <h3>Olemasolevad saadetised</h3>
                <input
                    type="text"
                    placeholder="Otsi kliendi järgi..."
                    value={filterCustomer}
                    onChange={(e) => setFilterCustomer(e.target.value)}
                    className="filter-input"
                />

                {visibleShipments.length === 0 ? (
                    <p className="no-shipments">Ühtegi saadetist ei leitud.</p>
                ) : (
                    <table className="materials-table">
                        <thead>
                        <tr>
                            <th>Saatelehe nr</th>
                            <th>Kuupäev</th>
                            <th>Klient</th>
                            <th>Transpordifirma</th>
                            <th>Reg-nr</th>
                            <th>Toimingud</th>
                        </tr>
                        </thead>
                        <tbody>
                        {visibleShipments.map((s) => (
                            <tr key={s.id}>
                                <td>{s.deliveryNoteNo || "—"}</td>
                                <td>{new Date(s.dateSent).toLocaleDateString("et-EE")}</td>
                                <td>{s.customer || "—"}</td>
                                <td>{s.transportCompany || "—"}</td>
                                <td>{s.vehicleNo || "—"}</td>
                                <td>
                                    <button className="edit-button" onClick={() => handleEdit(s)}>Muuda</button>
                                    <button className="delete-button" onClick={() => handleDelete(s.id, s.deliveryNoteNo)}>Kustuta</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default OutboundShippingPage;
