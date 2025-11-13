import React, { useState, useEffect } from "react";
import "../styles/delivery.css";

function convertDateToISO(dateStr) {
    if (!dateStr) return "";
    const match = dateStr.match(/(\d{2})\.(\d{2})\.(\d{4})/);
    if (match) {
        const [, dd, mm, yyyy] = match;
        return `${yyyy}-${mm}-${dd}`;
    }
    return dateStr;
}

const enumDeliveryStatus = ["RECEIVED", "UNLOADED", "IN_STOCK", "REJECTED"];

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

const DeliveryForm = ({ onSave, editingDelivery, onCancelEdit }) => {
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (editingDelivery) {
            setForm(editingDelivery);
        } else {
            setForm(emptyForm);
        }
    }, [editingDelivery]);

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
                alert("Palun täida kõik kohustuslikud väljad!");
                return;
            }
        }

        const offsetDateTime =
            form.arrivalDate && !form.arrivalDate.includes("T")
                ? `${form.arrivalDate}T00:00:00+02:00`
                : form.arrivalDate;

        const fixedDeliveryStatus = enumDeliveryStatus.includes(form.deliveryStatus)
            ? form.deliveryStatus
            : "RECEIVED";

        try {
            await onSave({
                ...form,
                arrivalDate: offsetDateTime,
                deliveryStatus: fixedDeliveryStatus,
            });
            alert(editingDelivery ? "Tarne edukalt uuendatud!" : "Tarne edukalt salvestatud!");
            setForm(emptyForm);
        } catch (err) {
            alert(err.message || "Salvestamine ebaõnnestus");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <h2>{editingDelivery ? "Muuda tarnet" : "Registreeri uus tarne"}</h2>

            <div>
                <label>Lae üles veoseleht (PDF):</label>
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
                <label>Tarnija aadress / päritolu *</label>
                <input name="supplierAddress" value={form.supplierAddress} onChange={handleChange} required />
            </div>

            <div>
                <label>Puiduliik *</label>
                <select name="woodType" value={form.woodType} onChange={handleChange} required>
                    <option value="">Vali liik</option>
                    <option value="Kuusk">Kuusk</option>
                    <option value="Mänd">Mänd</option>
                    <option value="Kask">Kask</option>
                </select>
            </div>

            <div>
                <label>Saabumiskuupäev *</label>
                <input
                    type="date"
                    name="arrivalDate"
                    value={form.arrivalDate}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label>Kogukogus (tm) *</label>
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

            <div>
                <label>Tarne staatus *</label>
                <select
                    name="deliveryStatus"
                    value={form.deliveryStatus || "RECEIVED"}
                    onChange={handleChange}
                    required
                >
                    <option value="RECEIVED">Saabunud</option>
                    <option value="UNLOADED">Mahalaaditud</option>
                    <option value="IN_STOCK">Lattu lisatud</option>
                    <option value="REJECTED">Tagasi lükatud</option>
                </select>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
                <button type="submit">
                    {editingDelivery ? "Uuenda tarnet" : "Salvesta tarne"}
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
