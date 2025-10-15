import React, { useState } from "react";
import "../styles/delivery.css";


const DeliveryForm = ({ onSave }) => {
    const [form, setForm] = useState({
        driver_name: "",
        truck_no: "",
        waybill_no: "",
        supplier_name: "",
        arrival_date: "",
        total_volume_m3: "",
    });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.driver_name || !form.truck_no) return alert("Fill all fields");
        onSave(form);
        setForm({
            driver_name: "",
            truck_no: "",
            waybill_no: "",
            supplier_name: "",
            arrival_date: "",
            total_volume_m3: "",
        });
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <h2>Register Incoming Delivery</h2>
            {Object.keys(form).map((field) => (
                <div key={field}>
                    <label>{field.replace(/_/g, " ")}:</label>
                    <input
                        name={field}
                        value={form[field]}
                        onChange={handleChange}
                        required
                    />
                </div>
            ))}
            <button type="submit">Save</button>
        </form>
    );
};

export default DeliveryForm;
