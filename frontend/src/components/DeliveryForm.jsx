import React, { useState } from "react";
import "../styles/delivery.css";

const emptyForm = {
    driverName: "",
    truckNo: "",
    waybillNo: "",
    supplierName: "",
    supplierAddress: "",
    woodType: "",
    arrivalDate: "",
    totalVolumeTm: "",
    deliveryStatus: "RECEIVED",
};

function DeliveryForm({ onSave }) {

    const [form, setForm] = useState(emptyForm);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const required = [
            "driverName",
            "truckNo",
            "waybillNo",
            "supplierName",
            "woodType",
            "arrivalDate",
            "totalVolumeTm",
        ];

        for (const f of required) {
            if (!form[f]) {
                alert("Palun täida kõik kohustuslikud väljad!");
                return;
            }
        }

        const arrival = form.arrivalDate + "T00:00:00+02:00";

        try {
            await onSave({
                ...form,
                arrivalDate: arrival
            });

            alert("Tarne edukalt salvestatud!");
            setForm(emptyForm);

        } catch (err) {
            alert(err.message || "Salvestamine ebaõnnestus");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form">

            <h2>Registreeri uus tarne</h2>

            <div>
                <label>Juhi nimi *</label>
                <input name="driverName" value={form.driverName} onChange={handleChange} required />
            </div>

            <div>
                <label>Veoki registrinumber *</label>
                <input name="truckNo" value={form.truckNo} onChange={handleChange} required />
            </div>

            <div>
                <label>Veoselehe number *</label>
                <input name="waybillNo" value={form.waybillNo} onChange={handleChange} required />
            </div>

            <div>
                <label>Tarnija nimi *</label>
                <input name="supplierName" value={form.supplierName} onChange={handleChange} required />
            </div>

            <div>
                <label>Tarnija aadress / päritolu</label>
                <input name="supplierAddress" value={form.supplierAddress} onChange={handleChange} />
            </div>

            <div>
                <label>Puiduliik *</label>
                <input type="text" name="woodType" value={form.woodType} onChange={handleChange} required />
            </div>

            <div>
                <label>Saabumiskuupäev *</label>
                <input type="date" name="arrivalDate" value={form.arrivalDate} onChange={handleChange} required />
            </div>

            <div>
                <label>Kogukogus (tm) *</label>
                <input type="number" name="totalVolumeTm" min="0" step="0.001" value={form.totalVolumeTm} onChange={handleChange} required />
            </div>

            <div>
                <label>Tarne staatus *</label>
                <select name="deliveryStatus" value={form.deliveryStatus} onChange={handleChange}>
                    <option value="RECEIVED">Saabunud</option>
                    <option value="UNLOADED">Mahalaaditud</option>
                    <option value="IN_STOCK">Lattu lisatud</option>
                    <option value="REJECTED">Tagasi lükatud</option>
                </select>
            </div>

            <button type="submit">Salvesta tarne</button>

        </form>
    );
}

export default DeliveryForm;
