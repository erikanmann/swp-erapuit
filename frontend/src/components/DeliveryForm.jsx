import React, { useState } from "react";
import "../styles/delivery.css";

const DeliveryForm = ({ onSave }) => {
    const [form, setForm] = useState({
        driver_name: "",
        truck_no: "",
        waybill_no: "",
        supplier_name: "",
        supplier_address: "",
        wood_type: "",
        arrival_date: "",
        length_cm: "",
        diameter_cm: "",
        total_volume_m3: "",
    });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.driver_name || !form.truck_no) {
            return alert("Please fill in all required fields");
        }
        onSave(form);
        setForm({
            driver_name: "",
            truck_no: "",
            waybill_no: "",
            supplier_name: "",
            supplier_address: "",
            wood_type: "",
            arrival_date: "",
            length_cm: "",
            diameter_cm: "",
            total_volume_m3: "",
        });
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <h2>Register Incoming Delivery</h2>

            <div>
                <label>Driver name:</label>
                <input name="driver_name" value={form.driver_name} onChange={handleChange} required />
            </div>

            <div>
                <label>Truck number:</label>
                <input name="truck_no" value={form.truck_no} onChange={handleChange} required />
            </div>

            <div>
                <label>Waybill number:</label>
                <input name="waybill_no" value={form.waybill_no} onChange={handleChange} />
            </div>

            <div>
                <label>Supplier name:</label>
                <input name="supplier_name" value={form.supplier_name} onChange={handleChange} />
            </div>

            <div>
                <label>Supplier address / origin:</label>
                <input name="supplier_address" value={form.supplier_address} onChange={handleChange} />
            </div>

            <div>
                <label>Wood type:</label>
                <select name="wood_type" value={form.wood_type} onChange={handleChange} required>
                    <option value="">Select type</option>
                    <option value="Kuusk">Kuusk</option>
                    <option value="Mänd">Mänd</option>
                    <option value="Kask">Kask</option>
                </select>
            </div>

            <div>
                <label>Arrival date:</label>
                <input type="date" name="arrival_date" value={form.arrival_date} onChange={handleChange} required />
            </div>

            <div>
                <label>Log length (cm):</label>
                <input type="number" name="length_cm" value={form.length_cm} onChange={handleChange} />
            </div>

            <div>
                <label>Log diameter (cm):</label>
                <input type="number" name="diameter_cm" value={form.diameter_cm} onChange={handleChange} />
            </div>

            <div>
                <label>Total volume (m³):</label>
                <input type="number" name="total_volume_m3" value={form.total_volume_m3} onChange={handleChange} />
            </div>

            <button type="submit">Save</button>
        </form>
    );
};

export default DeliveryForm;
