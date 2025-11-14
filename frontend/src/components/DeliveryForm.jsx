import React, { useState, useEffect } from "react";
import "../styles/delivery.css";

function trimDate(dateStr) {
    if (!dateStr) return "";
    if (dateStr.includes("T")) {
        return dateStr.split("T")[0]; // <-- võtab ainult YYYY-MM-DD
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
            setForm({
                ...editingDelivery,
                arrivalDate: trimDate(editingDelivery.arrivalDate),
                supplierAddress: editingDelivery.supplierAddress || "",
            });
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

        const arrival = form.arrivalDate.includes("T")
            ? form.arrivalDate
            : `${form.arrivalDate}T00:00:00+02:00`;

        const fixedStatus = enumDeliveryStatus.includes(form.deliveryStatus)
            ? form.deliveryStatus
            : "RECEIVED";

        try {
            await onSave({
                ...form,
                arrivalDate: arrival,
                deliveryStatus: fixedStatus,
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

            {/* PDF upload jääb samaks */}

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
                <input
                    type="text"
                    name="woodType"
                    value={form.woodType}
                    onChange={handleChange}
                    required
                />
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
