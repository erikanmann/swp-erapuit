import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    const [form, setForm] = useState({});
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

                setForm({
                    driverName: d.driverName,
                    truckNo: d.truckNo,
                    waybillNo: d.waybillNo,
                    supplierName: d.supplierName,
                    supplierAddress: d.supplierAddress ?? "",
                    woodType: d.woodType,
                    arrivalDate: d.arrivalDate?.split("T")[0],
                    totalVolumeTm: d.totalVolumeTm,
                    deliveryStatus: d.deliveryStatus,
                });

            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const saveEdit = async () => {
        const result = await updateDelivery(id, {
            ...form,
            arrivalDate: form.arrivalDate + "T00:00:00+02:00"
        });

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
        <div className="page">

            <button onClick={() => navigate("/register-delivery")}>
                ⬅ Tagasi nimekirja
            </button>

            <h2>Tarne detailid</h2>

            {!editMode ? (
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
            ) : (
                <>
                    {/* ---------- EDIT MODE FORM ---------- */}
                    <div className="card">
                        <h3>Muuda tarnet</h3>

                        <label>Juht *</label>
                        <input name="driverName" value={form.driverName} onChange={handleChange} />

                        <label>Veoki number *</label>
                        <input name="truckNo" value={form.truckNo} onChange={handleChange} />

                        <label>Veoselehe nr *</label>
                        <input name="waybillNo" value={form.waybillNo} onChange={handleChange} />

                        <label>Tarnija *</label>
                        <input name="supplierName" value={form.supplierName} onChange={handleChange} />

                        <label>Aadress</label>
                        <input name="supplierAddress" value={form.supplierAddress} onChange={handleChange} />

                        <label>Puiduliik *</label>
                        <input name="woodType" value={form.woodType} onChange={handleChange} />

                        <label>Saabumiskuupäev *</label>
                        <input type="date" name="arrivalDate" value={form.arrivalDate} onChange={handleChange} />

                        <label>Kogus (tm) *</label>
                        <input name="totalVolumeTm" type="number" step="0.001"
                               value={form.totalVolumeTm}
                               onChange={handleChange} />

                        <label>Staatus *</label>
                        <select name="deliveryStatus" value={form.deliveryStatus} onChange={handleChange}>
                            <option value="RECEIVED">Saabunud</option>
                            <option value="UNLOADED">Mahalaaditud</option>
                            <option value="IN_STOCK">Lattu lisatud</option>
                            <option value="REJECTED">Tagasi lükatud</option>
                        </select>

                        <div style={{ marginTop: "15px" }}>
                            <button onClick={saveEdit}>Salvesta</button>
                            <button onClick={() => setEditMode(false)} style={{ marginLeft: "10px" }}>
                                Loobu
                            </button>
                        </div>
                    </div>
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
    );
};

export default DeliveryDetailPage;
