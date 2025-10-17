import React from "react";
import "../styles/delivery.css";

const DeliveryList = ({ deliveries, onDelete }) => {
    return (
        <div className="list">
            <h2>Registreeritud kaupade nimekiri</h2>
            {deliveries.length === 0 ? (
                <p>Veoselehti pole veel lisatud.</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>Juht</th>
                        <th>Veoki nr</th>
                        <th>Veoselehe nr</th>
                        <th>Tarnija</th>
                        <th>Kuupäev</th>
                        <th>Maht (m³)</th>
                        <th>Tegevus</th>
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
                            <td>
                                <button onClick={() => onDelete(d.id)}>Kustuta</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DeliveryList;
