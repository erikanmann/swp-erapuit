import React, { useState, useEffect } from "react";
import "../styles/delivery.css";

const DeliveryForm = ({ onSave, editingDelivery, onCancelEdit }) => {
    const emptyForm = {
        driverName: "",
        truckNo: "",
        waybillNo: "",
        supplierName: "",
        supplierAddress: "",
        woodType: "",
        arrivalDate: "",
        totalVolumeTm: "",
    };

    const [form, setForm] = useState(emptyForm);

    // Kui editingDelivery muutub, täida vormi väärtused
    useEffect(() => {
        if (editingDelivery) {
            setForm(editingDelivery);
        } else {
            setForm(emptyForm);
        }
    }, [editingDelivery]);

    const convertDateToISO = (dateStr) => {
        if (!dateStr) return "";
        const match = dateStr.match(/(\d{2})\.(\d{2})\.(\d{4})/);
        if (match) {
            const [, dd, mm, yyyy] = match;
            return `${yyyy}-${mm}-${dd}`;
        }
        return dateStr;
    };

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const required = [
            "driverName",
            "truckNo",
            "waybillNo",
            "supplierName",
            "supplierAddress",
            "woodType",
            "arrivalDate",
            "totalVolumeTm",
        ];
        for (const field of required) {
            if (!form[field]) {
                alert("Palun täida kõik kohustuslikud väljad");
                return;
            }
        }

        try {
            await onSave(form);
            alert(editingDelivery ? "Andmed edukalt uuendatud!" : "Tarne edukalt salvestatud!");
            setForm(emptyForm);
        } catch (err) {
            alert(err.message || "Salvestamine ebaõnnestus");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <h2>{editingDelivery ? "Muuda tarnet" : "Registreeri saabuv tarne"}</h2>

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

            <div style={{ display: "flex", gap: "1rem" }}>
                <button type="submit">
                    {editingDelivery ? "Uuenda" : "Salvesta"}
                </button>

                {editingDelivery && (
                    <button
                        type="button"
                        onClick={() => {
                            setForm(emptyForm);
                            onCancelEdit?.();
                        }}
                        style={{ backgroundColor: "#ccc" }}
                    >
                        Tühista
                    </button>
                )}
            </div>
        </form>
    );
};

export default DeliveryForm;
