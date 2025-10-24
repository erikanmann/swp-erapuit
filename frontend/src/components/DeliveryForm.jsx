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
        totalVolumeTm: "",
    });

    const convertDateToISO = (dateStr) => {
        if (!dateStr) return "";
        const match = dateStr.match(/(\d{2})\.(\d{2})\.(\d{4})/);
        if (match) {
            const [, dd, mm, yyyy] = match;

            return `${yyyy}-${mm}-${dd}`;
        }
        return dateStr; // juba õiges formaadis
    };

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
            !form.totalVolumeTm
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
                totalVolumeTm: "",
            });
        } catch (err) {
            alert(err.message || "Salvestamine ebaõnnestus");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <h2>Registreeri saabuv tarne</h2>

            <div>
                <label>Upload Waybill (PDF):</label>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append("file", file);

                        const res = await fetch("http://localhost:8080/api/file/parse-waybill", {
                            method: "POST",
                            body: formData,
                        });
                        const data = await res.json();

                        if (data.arrivalDate) {
                            data.arrivalDate = convertDateToISO(data.arrivalDate);
                        }

                        setForm({ ...form, ...data });
                    }}
                />
            </div>

            <div>
                <label>Juhi nimi<span style={{ color: "red" }}> *</span>:</label>
                <input name="driverName" value={form.driverName} onChange={handleChange} required />
            </div>

            <div>
                <label>Veoki number<span style={{ color: "red" }}> *</span>:</label>
                <input name="truckNo" value={form.truckNo} onChange={handleChange} required />
            </div>

            <div>
                <label>Veoselehe number<span style={{ color: "red" }}> *</span>:</label>
                <input name="waybillNo" value={form.waybillNo} onChange={handleChange} required />
            </div>

            <div>
                <label>Tarnija nimi<span style={{ color: "red" }}> *</span>:</label>
                <input name="supplierName" value={form.supplierName} onChange={handleChange} required />
            </div>

            <div>
                <label>Tarnija aadress / päritolu<span style={{ color: "red" }}> *</span>:</label>
                <input name="supplierAddress" value={form.supplierAddress} onChange={handleChange} required />
            </div>

            <div>
                <label>Puiduliik<span style={{ color: "red" }}> *</span>:</label>
                <select name="woodType" value={form.woodType} onChange={handleChange} required>
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
                    placeholder="yyyy-mm-dd või vali kalendrist"
                    value={form.arrivalDate}
                    onChange={handleChange}
                    required
                    style={{ width: "100%" }}
                />
            </div>

            <div>
                <label>Kogukogus (tm)<span style={{ color: "red" }}> *</span>:</label>
                <input
                    type="number"
                    name="totalVolumeTm"
                    min="0"
                    step="0.001"
                    value={form.totalVolumeTm}
                    onChange={handleChange}
                    required
                />
            </div>

            <button type="submit">Salvesta</button>
        </form>
    );
};

export default DeliveryForm;
