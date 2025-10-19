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
                            <td>{d.driverName}</td>
                            <td>{d.truckNo}</td>
                            <td>{d.waybillNo}</td>
                            <td>{d.supplierName}</td>
                            <td>
                                {d.arrivalDate
                                    ? new Date(d.arrivalDate).toLocaleDateString("et-EE")
                                    : ""}
                            </td>
                            <td>{d.totalVolumeM3}</td>
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
