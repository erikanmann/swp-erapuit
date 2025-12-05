import React, { useEffect, useState } from "react";
import "../styles/delivery.css";
import { validateIsoDateYear } from "../utils/dateValidation";

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

export default function DeliveryForm({
                                         onSave,
                                         initialValues = null,
                                         mode = "create",
                                         onCancelEdit = null
                                     }) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialValues) {
            setForm({
                driverName: initialValues.driverName,
                truckNo: initialValues.truckNo,
                waybillNo: initialValues.waybillNo,
                supplierName: initialValues.supplierName,
                supplierAddress: initialValues.supplierAddress ?? "",
                woodType: initialValues.woodType,
                arrivalDate: initialValues.arrivalDate?.split("T")[0] || "",
                totalVolumeTm: initialValues.totalVolumeTm,
                deliveryStatus: initialValues.deliveryStatus ?? "RECEIVED",
            });
        } else {
            setForm(emptyForm);
        }
        setErrors({});
    }, [initialValues]);

    const setField = (name, value) => {
        setForm({ ...form, [name]: value });
        setErrors({ ...errors, [name]: null });
    };

    const validateForm = () => {
        const newErrors = {};
        const required = [
            "driverName",
            "truckNo",
            "waybillNo",
            "supplierName",
            "woodType",
            "arrivalDate",
            "totalVolumeTm",
        ];

        required.forEach((f) => {
            if (!form[f]) newErrors[f] = "See väli on kohustuslik.";
        });

        const dateErr = validateIsoDateYear(form.arrivalDate);
        if (dateErr) newErrors.arrivalDate = dateErr;

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        await onSave({
            ...form,
            arrivalDate: form.arrivalDate + "T00:00:00+02:00",
        });

        if (mode === "create") {
            setForm(emptyForm);
            alert("Tarne edukalt salvestatud!");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form">

            <h2>{mode === "create" ? "Registreeri uus tarne" : "Muuda tarnet"}</h2>

            {/* DRIVER */}
            <div>
                <label htmlFor="driverName">
                    Juhi nimi <span className="required">*</span>
                </label>
                <input
                    id="driverName"
                    name="driverName"
                    value={form.driverName}
                    onChange={(e) => setField("driverName", e.target.value)}
                />
                {errors.driverName && <p className="error-msg">{errors.driverName}</p>}
            </div>

            {/* TRUCK */}
            <div>
                <label htmlFor="truckNo">
                    Veoki nr <span className="required">*</span>
                </label>
                <input
                    id="truckNo"
                    name="truckNo"
                    value={form.truckNo}
                    onChange={(e) => setField("truckNo", e.target.value)}
                />
                {errors.truckNo && <p className="error-msg">{errors.truckNo}</p>}
            </div>

            {/* WAYBILL */}
            <div>
                <label htmlFor="waybillNo">
                    Veoselehe nr <span className="required">*</span>
                </label>
                <input
                    id="waybillNo"
                    name="waybillNo"
                    value={form.waybillNo}
                    onChange={(e) => setField("waybillNo", e.target.value)}
                />
                {errors.waybillNo && <p className="error-msg">{errors.waybillNo}</p>}
            </div>

            {/* SUPPLIER NAME */}
            <div>
                <label htmlFor="supplierName">
                    Tarnija nimi <span className="required">*</span>
                </label>
                <input
                    id="supplierName"
                    name="supplierName"
                    value={form.supplierName}
                    onChange={(e) => setField("supplierName", e.target.value)}
                />
                {errors.supplierName && <p className="error-msg">{errors.supplierName}</p>}
            </div>

            {/* SUPPLIER ADDRESS */}
            <div>
                <label htmlFor="supplierAddress">
                    Tarnija aadress / päritolu
                </label>
                <input
                    id="supplierAddress"
                    name="supplierAddress"
                    value={form.supplierAddress}
                    onChange={(e) => setField("supplierAddress", e.target.value)}
                />
            </div>

            {/* WOOD TYPE */}
            <div>
                <label htmlFor="woodType">
                    Puiduliik <span className="required">*</span>
                </label>
                <input
                    id="woodType"
                    name="woodType"
                    value={form.woodType}
                    onChange={(e) => setField("woodType", e.target.value)}
                />
                {errors.woodType && <p className="error-msg">{errors.woodType}</p>}
            </div>

            {/* ARRIVAL DATE */}
            <div>
                <label htmlFor="arrivalDate">
                    Saabumiskuupäev <span className="required">*</span>
                </label>
                <input
                    id="arrivalDate"
                    type="date"
                    name="arrivalDate"
                    value={form.arrivalDate}
                    onChange={(e) => setField("arrivalDate", e.target.value)}
                />
                {errors.arrivalDate && <p className="error-msg">{errors.arrivalDate}</p>}
            </div>

            {/* TOTAL VOLUME */}
            <div>
                <label htmlFor="totalVolumeTm">
                    Kogus (tm) <span className="required">*</span>
                </label>
                <input
                    id="totalVolumeTm"
                    type="number"
                    min="0"
                    step="0.001"
                    name="totalVolumeTm"
                    value={form.totalVolumeTm}
                    onChange={(e) => setField("totalVolumeTm", e.target.value)}
                />
                {errors.totalVolumeTm && <p className="error-msg">{errors.totalVolumeTm}</p>}
            </div>

            {/* STATUS */}
            <div>
                <label htmlFor="deliveryStatus">
                    Tarne staatus <span className="required">*</span>
                </label>
                <select
                    id="deliveryStatus"
                    name="deliveryStatus"
                    value={form.deliveryStatus}
                    onChange={(e) => setField("deliveryStatus", e.target.value)}
                >
                    <option value="RECEIVED">Saabunud</option>
                    <option value="UNLOADED">Mahalaaditud</option>
                    <option value="IN_STOCK">Lattu lisatud</option>
                    <option value="REJECTED">Tagasi lükatud</option>
                </select>
            </div>

            {/* BUTTONS */}
            <div style={{ marginTop: "15px" }}>
                <button type="submit">
                    {mode === "create" ? "Salvesta tarne" : "Uuenda tarnet"}
                </button>

                {mode === "edit" && onCancelEdit && (
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        style={{ marginLeft: "10px" }}
                    >
                        Loobu
                    </button>
                )}
            </div>
        </form>
    );
}
