import React, { useState } from "react";
import "../styles/delivery.css";

const DeliveryForm = ({ onSave }) => {
    const [form, setForm] = useState({
        driverName: "",
        truckNo: "",
        waybillNo: "",
        supplierName: "",
        supplierAddress: "",
        woodType: "",
        arrivalDate: "",
        logLengthCm: "",
        logDiameterCm: "",
        totalVolumeM3: "",
    });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !form.driverName ||
            !form.truckNo ||
            !form.waybillNo ||
            !form.supplierName ||
            !form.supplierAddress ||
            !form.woodType ||
            !form.arrivalDate ||
            !form.totalVolumeM3
        ) {
            return alert("Palun täida kõik kohustuslikud väljad");
        }

        try {
            await onSave(form);
            alert("Tarne edukalt salvestatud!");
            setForm({
                driverName: "",
                truckNo: "",
                waybillNo: "",
                supplierName: "",
                supplierAddress: "",
                woodType: "",
                arrivalDate: "",
                logLengthCm: "",
                logDiameterCm: "",
                totalVolumeM3: "",
            });
        } catch (err) {
            alert(err.message || "Salvestamine ebaõnnestus");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <h2>Registreeri saabuv tarne</h2>

            <div>
                <label>Juhi nimi<span style={{ color: "red" }}> *</span>:</label>
                <input
                    name="driverName"
                    value={form.driverName}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label>Veoki number<span style={{ color: "red" }}> *</span>:</label>
                <input
                    name="truckNo"
                    value={form.truckNo}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label>Veoselehe number<span style={{ color: "red" }}> *</span>:</label>
                <input
                    name="waybillNo"
                    value={form.waybillNo}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label>Tarnija nimi<span style={{ color: "red" }}> *</span>:</label>
                <input
                    name="supplierName"
                    value={form.supplierName}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label>Tarnija aadress / päritolu<span style={{ color: "red" }}> *</span>:</label>
                <input
                    name="supplierAddress"
                    value={form.supplierAddress}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label>Puiduliik<span style={{ color: "red" }}> *</span>:</label>
                <select
                    name="woodType"
                    value={form.woodType}
                    onChange={handleChange}
                    required
                >
                    <option value="">Vali liik</option>
                    <option value="Kuusk">Kuusk</option>
                    <option value="Mänd">Mänd</option>
                    <option value="Kask">Kask</option>
                </select>
            </div>

            <div>
                <label>Saabumiskuupäev<span style={{ color: "red" }}> *</span>:</label>
                <input
                    type="date"
                    name="arrivalDate"
                    value={form.arrivalDate}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label>Palkide pikkus (cm):</label>
                <input
                    type="number"
                    name="logLengthCm"
                    min="0"
                    value={form.logLengthCm}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Palkide diameeter (cm):</label>
                <input
                    type="number"
                    name="logDiameterCm"
                    min="0"
                    value={form.logDiameterCm}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Kogumaht (m³)<span style={{ color: "red" }}> *</span>:</label>
                <input
                    type="number"
                    name="totalVolumeM3"
                    min="0"
                    step="0.001"
                    value={form.totalVolumeM3}
                    onChange={handleChange}
                    required
                />
            </div>

            <button type="submit">Salvesta</button>
        </form>
    );
};

export default DeliveryForm;
