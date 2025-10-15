import React from "react";
import "../styles/delivery.css";


const DeliveryList = ({ deliveries }) => {
    return (
        <div className="list">
            <h2>All Deliveries</h2>
            {deliveries.length === 0 ? (
                <p>No deliveries yet.</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>Driver</th>
                        <th>Truck No</th>
                        <th>Waybill</th>
                        <th>Supplier</th>
                        <th>Date</th>
                        <th>Volume (m³)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {deliveries.map((d) => (
                        <tr key={d.id}>
                            <td>{d.driver_name}</td>
                            <td>{d.truck_no}</td>
                            <td>{d.waybill_no}</td>
                            <td>{d.supplier_name}</td>
                            <td>{d.arrival_date}</td>
                            <td>{d.total_volume_m3}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DeliveryList;
