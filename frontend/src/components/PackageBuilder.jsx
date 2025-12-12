import { useEffect, useState } from "react";
import { getAvailableProductionOutputs } from "../api/productionOutputApi";
import { createShipmentPackage } from "../api/shipmentPackageApi";

export default function PackageBuilder() {
    const [outputs, setOutputs] = useState([]);
    const [outputId, setOutputId] = useState("");
    const [count, setCount] = useState("");
    const [items, setItems] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // 🔹 lae valmis toodang (MITTE retseptid)
    useEffect(() => {
        getAvailableProductionOutputs()
            .then(setOutputs)
            .catch(() =>
                setError("Valmistoodangu laadimine ebaõnnestus")
            );
    }, []);

    // 🔹 lisa rida pakki (ainult frontend list)
    const addItem = (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const output = outputs.find(o => o.id === outputId);

        if (!output || Number(count) <= 0) {
            setError("Vali valmis toode ja korrektne kogus");
            return;
        }

        setItems(prev => [
            ...prev,
            {
                productionOutputId: output.id,
                name: output.productName,
                count: Number(count)
            }
        ]);

        setOutputId("");
        setCount("");
    };

    // 🔹 PÄRIS API KUTSE
    const createPackage = async () => {
        setError("");
        setSuccess("");

        if (items.length === 0) {
            setError("Pakk on tühi");
            return;
        }

        try {
            // praegu: 1 rida = 1 backend Package
            for (const item of items) {
                await createShipmentPackage({
                    productId: item.productionOutputId,
                    count: item.count,
                    volumeM3: null,      // backend arvutab ise
                    weightKg: null,
                    location: "Ladu A"
                });
            }

            setItems([]);
            setSuccess("Pakk edukalt valmistatud");

        } catch (err) {
            setError(err.message || "Paki loomine ebaõnnestus");
        }
    };

    return (
        <div className="form-section" style={{ marginTop: 40 }}>
            {/* --- LISAMINE --- */}
            <form className="form" onSubmit={addItem}>
                <h2>Paki koostamine</h2>

                <label>
                    <span>Valmis toode</span>
                    <select
                        value={outputId}
                        onChange={e => setOutputId(e.target.value)}
                    >
                        <option value="">-- vali valmis toode --</option>
                        {outputs.map(o => (
                            <option key={o.id} value={o.id}>
                                {o.productName}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    <span>Tükkide arv</span>
                    <input
                        type="number"
                        min="1"
                        value={count}
                        onChange={e => setCount(e.target.value)}
                    />
                </label>

                <button className="secondary-button">
                    Lisa ritta
                </button>
            </form>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            {/* --- 📦 PAKI SISU (ALATI NÄHTAV) --- */}
            <div className="success" style={{ marginTop: 20 }}>
                <strong>Paki sisu</strong>

                {items.length === 0 ? (
                    <p style={{ opacity: 0.7 }}>Pakk on hetkel tühi.</p>
                ) : (
                    <table style={{ width: "100%", marginTop: 10 }}>
                        <thead>
                        <tr>
                            <th align="left">Toode</th>
                            <th align="right">Kogus</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((i, idx) => (
                            <tr key={idx}>
                                <td>{i.name}</td>
                                <td align="right">{i.count} tk</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            <button
                className="main-button"
                style={{ marginTop: 20 }}
                onClick={createPackage}
            >
                Valmista pakk
            </button>
        </div>
    );
}
