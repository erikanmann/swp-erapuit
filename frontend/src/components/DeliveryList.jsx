import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/delivery.css";

const DeliveryList = ({ pageData, onPageChange, onDelete }) => {
    const navigate = useNavigate();
    const goToDetails = (id) => navigate(`/deliveries/${id}`);

    // Safe fallback values
    const content = pageData?.content ?? [];
    const number = pageData?.number ?? 0;
    const totalPages = pageData?.totalPages ?? 1;

    return (
        <div className="list">
            <h2>Registreeritud tarnete nimekiri</h2>

            {content.length === 0 ? (
                <p>Veoselehti pole veel lisatud.</p>
            ) : (
                <>
                    <table>
                        <thead>
                        <tr>
                            <th>Juht</th>
                            <th>Veoki reg-nr</th>
                            <th>Veoselehe nr</th>
                            <th>Tarnija</th>
                            <th>Saabumiskuupäev</th>
                            <th>Kogukogus (tm)</th>
                            <th>Tegevus</th>
                        </tr>
                        </thead>

                        <tbody>
                        {content.map((d) => (
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
                                <td>
                                    <button onClick={() => goToDetails(d.id)}>Vaata</button>
                                    <button onClick={() => onDelete(d.id)}>Kustuta</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="pagination-controls">
                        <button
                            disabled={number <= 0}
                            onClick={() => onPageChange(number - 1)}
                        >
                            ⬅ Eelmine
                        </button>

                        <span>
                            Leht {number + 1} / {totalPages}
                        </span>

                        <button
                            disabled={number + 1 >= totalPages}
                            onClick={() => onPageChange(number + 1)}
                        >
                            Järgmine ➡
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default DeliveryList;
