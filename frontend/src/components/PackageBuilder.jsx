import { useEffect, useState } from "react";
import { getAvailableProductionOutputs } from "../api/productionOutputApi";
import { createPackageWithItems } from "../api/shipmentPackageApi";


export default function PackageBuilder() {
    const [outputs, setOutputs] = useState([]);
    const [outputId, setOutputId] = useState("");
    const [count, setCount] = useState("");
    const [items, setItems] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        reloadOutputs();
    }, []);

    const reloadOutputs = () => {
        getAvailableProductionOutputs()
            .then(setOutputs)
            .catch(() =>
                setError("Valmistoodangu laadimine ebaõnnestus")
            );
    };

    const selectedOutput = outputs.find(o => o.id === outputId);

    const addItem = (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!selectedOutput) {
            setError("Vali valmis toode");
            return;
        }

        const qty = Number(count);
        if (qty <= 0) {
            setError("Kogus peab olema suurem kui 0");
            return;
        }

        if (qty > selectedOutput.availableCount) {
            setError(`Saadaval ainult ${selectedOutput.availableCount} tk`);
            return;
        }

        setItems(prev => [
            ...prev,
            {
                productionOutputId: selectedOutput.id,
                name: selectedOutput.productName,
                count: qty
            }
        ]);

        setOutputId("");
        setCount("");
    };

    const createPackage = async () => {
        setError("");
        setSuccess("");

        if (items.length === 0) {
            setError("Pakk on tühi");
            return;
        }

        try {
            await createPackageWithItems({
                location: "Ladu A",
                items: items.map(i => ({
                    productionOutputId: i.productionOutputId,
                    count: i.count
                }))
            });

            setItems([]);
            setSuccess("Pakk edukalt valmistatud");

        } catch (err) {
            setError(err.message || "Paki loomine ebaõnnestus");
        }
    };



    return (
        <div className="form-section" style={{ marginTop: 40 }}>
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
                                {o.productName} ({o.availableCount} tk)
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    <span>Tükkide arv</span>
                    <input
                        type="number"
                        min="1"
                        max={selectedOutput?.availableCount ?? undefined}
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

            <div className="success" style={{ marginTop: 20 }}>
                <strong>Paki sisu</strong>

                {items.length === 0 ? (
                    <p style={{ opacity: 0.7 }}>Pakk on hetkel tühi.</p>
                ) : (
                    <div className="table-scroll">
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
                    </div>
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
