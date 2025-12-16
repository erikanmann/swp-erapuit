import React, { useState, useEffect } from "react";
import {
    addShipment,
    getShipments,
    deleteShipment,
    updateShipment,
} from "../api/shipmentApi";
import { tokenStorage } from "../api/authApi";

import "../styles/delivery.css";
import "../styles/main.css";
import "../styles/warehouse.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function OutboundShippingPage() {
    const navigate = useNavigate();

    const [packages, setPackages] = useState([]);
    const [selectedPackages, setSelectedPackages] = useState([]);
    const [shipments, setShipments] = useState([]);

    const [filterCustomer, setFilterCustomer] = useState("");

    const [errors, setErrors] = useState({});
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
            const token = tokenStorage.getToken();
            const pkgRes = await fetch("http://localhost:8080/api/packages/available", {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            const pkgData = await pkgRes.json();
            setPackages(pkgData);

            const shipmentsData = await getShipments();
            setShipments(shipmentsData);
        } catch (err) {
            setSuccess(null);
            setErrors({ global: "Andmete laadimine ebaõnnestus: " + err.message });
        }
    };

    const handlePackageSelect = (pkgId) => {
        setSelectedPackages((prev) =>
            prev.includes(pkgId)
                ? prev.filter((id) => id !== pkgId)
                : [...prev, pkgId]
        );
    };

    const validateForm = () => {
        const newErrors = {};

        if (!deliveryNoteNo.trim()) {
            newErrors.deliveryNoteNo = "Saatelehe number on kohustuslik.";
        }

        if (!customer.trim()) {
            newErrors.customer = "Klient / sihtkoht on kohustuslik.";
        }

        if (!transportCompany.trim()) {
            newErrors.transportCompany = "Transpordifirma on kohustuslik.";
        }

        if (!vehicleNo.trim()) {
            newErrors.vehicleNo = "Sõiduki reg-nr on kohustuslik.";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(null);
        setErrors({});

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
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
            setErrors({ global: err.message || "Saadetise salvestamine ebaõnnestus." });
        }
    };

    const resetForm = () => {
        setDeliveryNoteNo("");
        setCustomer("");
        setTransportCompany("");
        setVehicleNo("");
        setSelectedPackages([]);
        setEditingId(null);
        setErrors({});
    };

    const handleDelete = async (id, deliveryNoteNo) => {
        if (!window.confirm(`Kas soovid kindlasti kustutada saadetise ${deliveryNoteNo}?`))
            return;

        try {
            await deleteShipment(id);
            setSuccess({ message: `Saadetis ${deliveryNoteNo} kustutatud.` });
            await loadData();
        } catch (err) {
            setErrors({ global: "Kustutamine ebaõnnestus: " + err.message });
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

    const visibleShipments = shipments.filter((s) =>
        s.customer?.toLowerCase().includes(filterCustomer.toLowerCase())
    );

    return (
        <>
            <Navbar />
            <div className="delivery-page">

            {/* FORM */}
            <div className="form-section">
                <h2>{editingId ? "Muuda saadetist" : "Loo uus saadetis"}</h2>

                <form onSubmit={handleSubmit} className="form">

                    {/* DELIVERY NOTE NO */}
                    <label>
                        Saatelehe nr <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        value={deliveryNoteNo}
                        onChange={(e) => setDeliveryNoteNo(e.target.value)}
                        placeholder="nt SHP-20251112-0001"
                    />
                    {errors.deliveryNoteNo && (
                        <p className="error-msg">{errors.deliveryNoteNo}</p>
                    )}

                    {/* CUSTOMER */}
                    <label>
                        Klient / sihtkoht <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                        placeholder="nt Estfor OÜ"
                    />
                    {errors.customer && (
                        <p className="error-msg">{errors.customer}</p>
                    )}

                    {/* TRANSPORT COMPANY */}
                    <label>
                        Transpordifirma <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        value={transportCompany}
                        onChange={(e) => setTransportCompany(e.target.value)}
                        placeholder="nt Sumros Grupp AS"
                    />
                    {errors.transportCompany && (
                        <p className="error-msg">{errors.transportCompany}</p>
                    )}

                    {/* VEHICLE NR */}
                    <label>
                        Sõiduki reg-nr <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        value={vehicleNo}
                        onChange={(e) => setVehicleNo(e.target.value)}
                        placeholder="nt 896TNM"
                    />
                    {errors.vehicleNo && (
                        <p className="error-msg">{errors.vehicleNo}</p>
                    )}

                    {/* AVAILABLE PACKAGES */}
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

                    {/* BUTTONS */}
                    <div className="button-row">
                        <button type="submit" className="main-button">
                            {editingId ? "Salvesta muudatused" : "Loo saadetis"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={resetForm}
                            >
                                Tühista muutmine
                            </button>
                        )}
                    </div>
                </form>

                {errors.global && <div className="error">{errors.global}</div>}
                {success && <div className="success">{success.message}</div>}
            </div>

            {/* SHIPMENTS LIST */}
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
                                    <button
                                        className="edit-button"
                                        onClick={() => handleEdit(s)}
                                    >
                                        Muuda
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDelete(s.id, s.deliveryNoteNo)}
                                    >
                                        Kustuta
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
            </div>
        </>
    );
}

export default OutboundShippingPage;