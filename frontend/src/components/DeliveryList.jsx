import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/delivery.css";

const DeliveryList = ({ deliveries, onDelete, onEdit }) => {

    const navigate = useNavigate();

    const goToDetails = (id) => {
        navigate(`/deliveries/${id}`);
    };

    return (
        <div className="list">
            <h2>Registreeritud tarnete nimekiri</h2>

            {deliveries.length === 0 ? (
                <p>Veoselehti pole veel lisatud.</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>Juht</th>
                        <th>Veoki reg-nr</th>
                        <th>Veoselehe nr</th>
                        <th>Tarnija</th>
                        <th>Saabumiskuupäev</th>
                        <th>Kogukogus (tm)</th>
                        <th className="actions">Tegevus</th>
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
                            <td>{d.totalVolumeTm}</td>
                            <td className="actions">
                                <div className="action-buttons">
                                    <button onClick={() => goToDetails(d.id)}>Vaata</button>
                                    <button onClick={() => onDelete(d.id)}>Kustuta</button>
                                </div>
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
