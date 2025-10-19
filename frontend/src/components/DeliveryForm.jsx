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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.driverName || !form.truckNo) {
            return alert("Palun täida kõik kohustuslikud väljad");
        }
        onSave(form);
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
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <h2>Registreeri saabuv tarne</h2>

            <div>
                <label>Juhi nimi:</label>
                <input name="driverName" value={form.driverName} onChange={handleChange} required />
            </div>

            <div>
                <label>Veoki number:</label>
                <input name="truckNo" value={form.truckNo} onChange={handleChange} required />
            </div>

            <div>
                <label>Veoselehe number:</label>
                <input name="waybillNo" value={form.waybillNo} onChange={handleChange} />
            </div>

            <div>
                <label>Tarnija nimi:</label>
                <input name="supplierName" value={form.supplierName} onChange={handleChange} />
            </div>

            <div>
                <label>Tarnija aadress / päritolu:</label>
                <input name="supplierAddress" value={form.supplierAddress} onChange={handleChange} />
            </div>

            <div>
                <label>Puiduliik:</label>
                <select name="woodType" value={form.woodType} onChange={handleChange} required>
                    <option value="">Vali liik</option>
                    <option value="Kuusk">Kuusk</option>
                    <option value="Mänd">Mänd</option>
                    <option value="Kask">Kask</option>
                </select>
            </div>

            <div>
                <label>Saabumiskuupäev:</label>
                <input type="date" name="arrivalDate" value={form.arrivalDate} onChange={handleChange} required />
            </div>

            <div>
                <label>Palkide pikkus (cm):</label>
                <input type="number" name="logLengthCm" value={form.logLengthCm} onChange={handleChange} />
            </div>

            <div>
                <label>Palkide diameeter (cm):</label>
                <input type="number" name="logDiameterCm" value={form.logDiameterCm} onChange={handleChange} />
            </div>

            <div>
                <label>Kogumaht (m³):</label>
                <input type="number" name="totalVolumeM3" value={form.totalVolumeM3} onChange={handleChange} />
            </div>

            <button type="submit">Salvesta</button>
        </form>
    );
};

export default DeliveryForm;
