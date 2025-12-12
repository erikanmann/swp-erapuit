import { useEffect, useState } from "react";
import { getStockItems } from "../api/stockApi";

export default function SendToProduction() {
    const [stockItems, setStockItems] = useState([]);
    const [products, setProducts] = useState([]);

    const [deliveryId, setDeliveryId] = useState("");
    const [productId, setProductId] = useState("");
    const [usage, setUsage] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        getStockItems().then(setStockItems);
        fetch("http://localhost:8080/api/products")
            .then(r => r.json())
            .then(setProducts);
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!deliveryId || !productId || !usage) {
            setError("Kõik väljad on kohustuslikud.");
            return;
        }

        const res = await fetch(
            `http://localhost:8080/api/production/process/${deliveryId}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId,
                    count: 1,
                    volumeM3: Number(usage)
                })
            }
        );

        if (!res.ok) {
            setError("Tootmisse saatmine ebaõnnestus.");
            return;
        }

        setSuccess("Materjal saadeti tootmisse.");
        setUsage("");
        setProductId("");
        setDeliveryId("");
    };

    return (
        <form className="form" onSubmit={submit}>
            <h2>Materjali saatmine tootmisse</h2>

            <label>
                <span>Laopartii *</span>
                <select value={deliveryId} onChange={e => setDeliveryId(e.target.value)}>
                    <option value="">-- vali --</option>
                    {stockItems.map(i => (
                        <option key={i.deliveryPackageId} value={i.deliveryPackageId}>
                            {i.packageCode} – {i.woodType}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                <span>Retsept / toode *</span>
                <select value={productId} onChange={e => setProductId(e.target.value)}>
                    <option value="">-- vali --</option>
                    {products.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                <span>Kulu (m³) *</span>
                <input
                    type="number"
                    step="0.01"
                    value={usage}
                    onChange={e => setUsage(e.target.value)}
                />
            </label>

            <button className="main-button">Saada tootmisse</button>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
        </form>
    );
}
