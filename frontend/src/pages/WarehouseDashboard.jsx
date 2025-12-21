import React, { useState, useEffect, useCallback  } from "react";
import "../styles/delivery.css";
import "../styles/main.css";
import "../styles/warehouse.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import {
    getStockPaged,
    updateUsableVolume,
    sendMaterialToProduction,
} from "../api/stockApi";


import {
    getPackageById,
    getPackagesForDelivery
} from "../api/packageApi";

// BigDecimal → number
const toNum = (val) => {
    if (val === null || val === undefined) return 0;
    if (typeof val === "number") return val;
    return parseFloat(val);
};

// Kuupäev
const formatDate = (iso) => {
    if (!iso) return "-";
    try {
        return iso.split("T")[0];
    } catch {
        return iso;
    }
};

const WarehouseDashboard = () => {
    const navigate = useNavigate();// eslint-disable-line no-unused-vars

    const [pageData, setPageData] = useState(null);
    const [woodTypes, setWoodTypes] = useState([]);

    const [woodTypeFilter, setWoodTypeFilter] = useState("");
    const [supplierFilter, setSupplierFilter] = useState("");
    const [fromDateFilter, setFromDateFilter] = useState("");

    // tootmise modal
    const [showProductionModal, setShowProductionModal] = useState(false);
    const [selectedWoodType, setSelectedWoodType] = useState("");
    const [usage, setUsage] = useState("");

    // paki modal
    const [showPackageModal, setShowPackageModal] = useState(false);
    const [packageInfo, setPackageInfo] = useState(null);
    const [packageRows, setPackageRows] = useState([]);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // ------------------------------------------------------
    // STOCK LAADIMINE
    // ------------------------------------------------------


    const loadStock = useCallback(async (page = 0, size = 200) => {
        try {
            const data = await getStockPaged(page, size, {
                woodType: woodTypeFilter,
                supplier: supplierFilter,
                fromDate: fromDateFilter
            });

            const converted = data.content.map(i => ({
                ...i,
                totalVolume: toNum(i.totalVolume),
                usableVolume: toNum(i.usableVolume),
            }));

            setPageData({ ...data, content: converted });

            const types = Array.from(new Set(
                converted.map(i => i.woodType).filter(Boolean)
            ));
            setWoodTypes(types);

        } catch (err) {
            console.error("Stock load failed:", err);
        }
    }, [woodTypeFilter, supplierFilter, fromDateFilter]);


    // ------------------------------------------------------
    // FILTRID
    // ------------------------------------------------------
    useEffect(() => {
        loadStock(0);   // laeme page 0 koos aktiivsete filtritega
    }, [loadStock]);


    if (!pageData) return <p>Laadin...</p>;
    // ------------------------------------------------------
    // STATISTIKA
    // ------------------------------------------------------
    const totalStock = pageData.content.reduce((sum, s) => sum + toNum(s.totalVolume), 0);
    const usableStock = pageData.content.reduce((sum, s) => sum + toNum(s.usableVolume), 0);
    const usedPercent = totalStock > 0
        ? (((totalStock - usableStock) / totalStock) * 100).toFixed(1)
        : 0;


    // ------------------------------------------------------
    // USABLE VOLUME UPDATE
    // ------------------------------------------------------
    const handleUsableVolumeChange = async (id, newVal) => {
        try {
            await updateUsableVolume(id, parseFloat(newVal));

            // pärast uuendust laeme sama page uuesti backendist
            await loadStock(pageData.number);

            setMessage("Kasutatav kogus edukalt uuendatud.");
            setError("");
        } catch (err) {
            setError(err.message);
            setMessage("");
        }
    };


    // ------------------------------------------------------
    // PAKI MODAL AVAMINE
    // ------------------------------------------------------
    const openPackageView = async (deliveryPackageId, deliveryId) => {
        if (!deliveryPackageId || !deliveryId) {
            setError("Paki ID puudub.");
            return;
        }

        try {
            const pkg = await getPackageById(deliveryPackageId);
            const rows = await getPackagesForDelivery(deliveryId.toString());

            setPackageInfo(pkg);
            setPackageRows(rows);
            setShowPackageModal(true);
        } catch (err) {
            setError("Paki andmete laadimine ebaõnnestus.");
        }
    };

    // ------------------------------------------------------
    // TOOTMINE
    // ------------------------------------------------------
    const handleSendToProduction = async () => {
        setError("");
        setMessage("");

        try {
            const updated = await sendMaterialToProduction(
                selectedWoodType,
                parseFloat(usage)
            );

            setMessage(
                `Materjal uuendatud: alles ${toNum(updated.usableVolume).toFixed(
                    2
                )} m³.`
            );

            setShowProductionModal(false);
            loadStock();
        } catch (err) {
            setError(err.message);
        }
    };
    if (!pageData) return <p>Laadin...</p>;

    // ------------------------------------------------------
    // RENDER
    // ------------------------------------------------------
    return (
        <>
            <Navbar />
            <div className="delivery-page">

            <h2>Lao ülevaade ja jälgimine</h2>

            {/* FILTRID */}
            <div className="filter-bar">
                <label>Puiduliik:</label>
                <select
                    className="warehouse-select"
                    value={woodTypeFilter}
                    onChange={(e) => setWoodTypeFilter(e.target.value)}
                >
                    <option value="">Kõik</option>
                    {woodTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>

                <label>Tarnija:</label>
                <input
                    type="text"
                    placeholder="nt RMK"
                    value={supplierFilter}
                    onChange={(e) => setSupplierFilter(e.target.value)}
                />

                <label>Alates kuupäevast:</label>
                <input
                    type="date"
                    value={fromDateFilter}
                    onChange={(e) => setFromDateFilter(e.target.value)}
                />
            </div>

            {message && <div className="success">{message}</div>}
            {error && <div className="error">{error}</div>}

            {/* STATISTIKA */}
            <div className="warehouse-stats">
                <div className="stat-card">
                    <h4>Kogu maht</h4>
                    <p>{totalStock.toFixed(2)} m³</p>
                </div>
                <div className="stat-card">
                    <h4>Kasutatav maht</h4>
                    <p>{usableStock.toFixed(2)} m³</p>
                </div>
                <div className="stat-card">
                    <h4>Materjalikadu</h4>
                    <p>{usedPercent}%</p>
                </div>
            </div>

            {/* TABEL */}
            <div className="warehouse-section">
                <h3>Lao kirjed</h3>

                <table className="warehouse-table">
                    <thead>
                    <tr>
                        <th>Tarne ID</th>
                        <th>Paki kood</th>
                        <th>Tarnija</th>
                        <th>Puiduliik</th>
                        <th>Saabumiskuupäev</th>
                        <th>Kogukogus (m³)</th>
                        <th>Kasutatav (m³)</th>
                        <th>Lisainfo</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pageData.content.map((item) => (
                        <tr key={item.id}>
                            <td>{item.deliveryId}</td>
                            <td>{item.packageCode || "-"}</td>
                            <td>{item.supplier}</td>
                            <td>{item.woodType}</td>
                            <td>{formatDate(item.arrivalDate)}</td>
                            <td>{toNum(item.totalVolume).toFixed(2)}</td>

                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    defaultValue={toNum(item.usableVolume)}
                                    onBlur={(e) =>
                                        handleUsableVolumeChange(
                                            item.id,
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        width: "90px",
                                        textAlign: "right",
                                    }}
                                />
                            </td>

                            <td>
                                <button
                                    onClick={() =>
                                        openPackageView(
                                            item.deliveryPackageId,
                                            item.deliveryId
                                        )
                                    }
                                    style={{ padding: "5px 8px" }}
                                >
                                    Vaata paki sisu
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* --- PAKI MODAL --- */}
            {showPackageModal && (
                <div className="modal-bg">
                    <div className="modal-card large">
                        <h3>Paki sisu – {packageInfo?.finalCode}</h3>

                        {packageInfo && (
                            <div style={{ marginBottom: "1rem" }}>
                                <p>
                                    <b>Puiduliik:</b> {packageInfo.woodType}
                                </p>
                                <p>
                                    <b>Sortiment:</b> {packageInfo.assortment}
                                </p>
                                <p>
                                    <b>Maht:</b>{" "}
                                    {toNum(packageInfo.volumeTm).toFixed(3)} m³
                                </p>
                                <p>
                                    <b>Haagis:</b>{" "}
                                    {packageInfo.trailer ? "Jah" : "Ei"}
                                </p>
                            </div>
                        )}

                        <h4>Kõik pakid selles tarnes:</h4>

                        <table className="warehouse-table">
                            <thead>
                            <tr>
                                <th>Kood</th>
                                <th>Puiduliik</th>
                                <th>Sortiment</th>
                                <th>Maht (m³)</th>
                                <th>Haagis</th>
                            </tr>
                            </thead>
                            <tbody>
                            {packageRows.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.finalCode}</td>
                                    <td>{row.woodType}</td>
                                    <td>{row.assortment}</td>
                                    <td>
                                        {toNum(row.volumeTm).toFixed(3)}
                                    </td>
                                    <td>{row.trailer ? "Jah" : "Ei"}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <button
                            style={{
                                marginTop: "1rem",
                                background: "#ccc",
                                color: "#222",
                            }}
                            onClick={() => setShowPackageModal(false)}
                        >
                            Sulge
                        </button>
                    </div>
                </div>
            )}

            {/* Tootmise modal */}
            {showProductionModal && (
                <div className="modal-bg">
                    <div className="modal-card">
                        <h3>Kasuta materjali tootmises</h3>

                        <label>Puiduliik:</label>
                        <select
                            value={selectedWoodType}
                            onChange={(e) =>
                                setSelectedWoodType(e.target.value)
                            }
                            className="warehouse-select"
                        >
                            <option value="">-- vali puiduliik --</option>
                            {woodTypes.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>

                        <label>Kogus (m³):</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={usage}
                            onChange={(e) => setUsage(e.target.value)}
                        />

                        <button onClick={handleSendToProduction}>Kinnita</button>
                        <button
                            style={{ background: "#ccc", color: "#222" }}
                            onClick={() => setShowProductionModal(false)}
                        >
                            Sulge
                        </button>
                    </div>
                </div>
            )}

            <div className="pagination-controls">
                <button
                    disabled={pageData.number === 0}
                    onClick={() => loadStock(pageData.number - 1)}
                >
                    ⬅ Eelmine
                </button>

                <span>
                    Leht {pageData.number + 1} / {pageData.totalPages}
                </span>

                <button
                    disabled={pageData.number + 1 >= pageData.totalPages}
                    onClick={() => loadStock(pageData.number + 1)}
                >
                    Järgmine ➡
                </button>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
                <button onClick={() => setShowProductionModal(true)}>
                    Kasuta materjali tootmises
                </button>
            </div>
            </div>
        </>
    );
};

export default WarehouseDashboard;
