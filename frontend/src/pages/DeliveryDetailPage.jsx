import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DeliveryForm from "../components/DeliveryForm";
import Navbar from "../components/Navbar";
import {
    getDeliveryById,
    getDeliveryPackages,
    updateDelivery,
    updateDeliveryPackage
} from "../api/deliveryApi";

const DeliveryDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [delivery, setDelivery] = useState(null);
    const [packages, setPackages] = useState([]);

    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);

    // package edit
    const [editingPackageId, setEditingPackageId] = useState(null);
    const [packageForm, setPackageForm] = useState({});

    useEffect(() => {
        const load = async () => {
            try {
                const d = await getDeliveryById(id);
                const p = await getDeliveryPackages(id);

                setDelivery(d);
                setPackages(p);


            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const saveEdit = async (updatedData) => {
        const result = await updateDelivery(id, updatedData);
        setDelivery(result);
        setEditMode(false);
        alert("Tarne edukalt uuendatud!");
    };

    // --- SAVE PACKAGE EDIT ---
    const savePackageEdit = async (pId) => {
        await updateDeliveryPackage(pId, packageForm);
        alert("Pakk uuendatud.");

        const refreshed = await getDeliveryPackages(id);
        setPackages(refreshed);

        setEditingPackageId(null);
    };

    if (loading) return <p>Laen...</p>;
    if (!delivery) return <p>Tarne ei leitud.</p>;

    return (
        <>
            <Navbar />
            <div className="page">

            <button onClick={() => navigate("/register-delivery")}>
                ⬅ Tagasi nimekirja
            </button>

            <h2>Tarne detailid</h2>

            {editMode ? (
                <DeliveryForm
                    initialValues={delivery}
                    mode="edit"
                    onSave={saveEdit}
                    onCancelEdit={() => setEditMode(false)}
                />
            ) : (
                <>
                    {/* ---------- READ ONLY VIEW ---------- */}
                    <div className="card">
                        <p><strong>Veoselehe nr:</strong> {delivery.waybillNo}</p>
                        <p><strong>Juht:</strong> {delivery.driverName}</p>
                        <p><strong>Veok:</strong> {delivery.truckNo}</p>
                        <p><strong>Tarnija:</strong> {delivery.supplierName}</p>
                        <p><strong>Aadress:</strong> {delivery.supplierAddress ?? "-"}</p>
                        <p><strong>Puiduliik:</strong> {delivery.woodType}</p>
                        <p><strong>Saabumiskuupäev:</strong> {delivery.arrivalDate?.split("T")[0]}</p>
                        <p><strong>Kogus (tm):</strong> {delivery.totalVolumeTm}</p>
                        <p><strong>Staatus:</strong> {delivery.deliveryStatus}</p>
                    </div>

                    <button onClick={() => setEditMode(true)} style={{ marginTop: "15px" }}>
                        Muuda andmeid
                    </button>
                </>
            )}

            {/* ---------- PACKAGE TABLE ---------- */}
            <div className="card" style={{ marginTop: "30px" }}>
                <h3>Pakkide loetelu</h3>

                {packages.length === 0 ? (
                    <p>Pakke pole.</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Paki nr</th>
                            <th>Alamnr</th>
                            <th>Kood</th>
                            <th>Puiduliik</th>
                            <th>Maht (tm)</th>
                            <th>Haagis</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {packages.map((p) => (
                            <tr key={p.id}>
                                <td>{p.packageNo}</td>
                                <td>{p.subIndex}</td>
                                <td>{p.finalCode}</td>

                                {/* EDIT MODE */}
                                {editingPackageId === p.id ? (
                                    <>
                                        <td>
                                            <input
                                                value={packageForm.woodType}
                                                onChange={(e) =>
                                                    setPackageForm({ ...packageForm, woodType: e.target.value })
                                                }
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="number"
                                                step="0.001"
                                                value={packageForm.volumeTm}
                                                onChange={(e) =>
                                                    setPackageForm({ ...packageForm, volumeTm: parseFloat(e.target.value) })
                                                }
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={packageForm.trailer}
                                                onChange={(e) =>
                                                    setPackageForm({ ...packageForm, trailer: e.target.checked })
                                                }
                                            />
                                        </td>

                                        <td>
                                            <button onClick={() => savePackageEdit(p.id)}>Salvesta</button>
                                            <button onClick={() => setEditingPackageId(null)}
                                                    style={{ marginLeft: "10px" }}>
                                                Loobu
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{p.woodType}</td>
                                        <td>{p.volumeTm}</td>
                                        <td>{p.trailer ? "Jah" : "Ei"}</td>

                                        <td>
                                            <button
                                                onClick={() => {
                                                    setEditingPackageId(p.id);
                                                    setPackageForm({
                                                        woodType: p.woodType,
                                                        volumeTm: p.volumeTm,
                                                        trailer: p.trailer,
                                                    });
                                                }}
                                            >
                                                Muuda
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
            </div>
        </>
    );
};

export default DeliveryDetailPage;