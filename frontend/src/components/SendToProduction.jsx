import { useEffect, useState } from "react";
import { getStockItems } from "../api/stockApi";
import { createProductionOutput } from "../api/productionOutputApi";

export default function SendToProduction() {
    const [stockItems, setStockItems] = useState([]);
    const [recipes, setRecipes] = useState([]);

    const [selectedStock, setSelectedStock] = useState(null);
    const [recipeId, setRecipeId] = useState("");
    const [recipe, setRecipe] = useState(null);
    const [usageM3, setUsageM3] = useState("");

    /* ---- load stock ---- */
    useEffect(() => {
        getStockItems().then(setStockItems);
    }, []);

    /* ---- load recipes (products) ---- */
    useEffect(() => {
        fetch("http://localhost:8080/api/products")
            .then(res => res.json())
            .then(setRecipes);
    }, []);

    /* ---- update selected recipe ---- */
    useEffect(() => {
        const r = recipes.find(r => r.id === recipeId);
        setRecipe(r || null);
    }, [recipeId, recipes]);

    /* ---- calculations ---- */
    const unitVolume =
        recipe
            ? (recipe.thicknessMm / 1000) *
            (recipe.widthMm / 1000) *
            (recipe.lengthMm / 1000)
            : null;

    const calculatedCount =
        unitVolume && usageM3
            ? Math.floor(Number(usageM3) / unitVolume)
            : null;

    /* ---- submit ---- */
    const submit = async () => {
        if (!selectedStock || !recipe || !usageM3 || !calculatedCount) return;

        await createProductionOutput(selectedStock.deliveryPackageId, {
            productId: recipe.id,
            count: calculatedCount,
            volumeM3: Number(usageM3),
            location: "TOOTMINE"
        });

        // reset
        setRecipeId("");
        setRecipe(null);
        setUsageM3("");

        // reload stock
        getStockItems().then(setStockItems);
    };

    return (
        <div className="form">
            <h2>Materjali saatmine tootmisse</h2>

            {/* --- LAOPARTII --- */}
            <label>
                <span>Laopartii *</span>
                <select
                    value={selectedStock?.id || ""}
                    onChange={e => {
                        const s = stockItems.find(
                            i => String(i.id) === e.target.value
                        );
                        setSelectedStock(s || null);
                        setRecipeId("");
                        setUsageM3("");
                    }}
                >
                    <option value="">-- vali --</option>
                    {stockItems.map(s => (
                        <option key={s.id} value={s.id}>
                            {s.packageCode} – {s.woodType} – {s.usableVolume} m³
                        </option>
                    ))}
                </select>
            </label>

            {/* --- RETSEPT --- */}
            <label>
                <span>Retsept *</span>
                <select
                    value={recipeId}
                    disabled={!selectedStock}
                    onChange={e => setRecipeId(e.target.value)}
                >
                    <option value="">-- vali --</option>
                    {recipes
                        .filter(r => r.species === selectedStock?.woodType)
                        .map(r => (
                            <option key={r.id} value={r.id}>
                                {r.name}
                            </option>
                        ))}
                </select>
            </label>

            {/* --- KULU --- */}
            <label>
                <span>Kulu (m³) *</span>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={usageM3}
                    onChange={e => setUsageM3(e.target.value)}
                />
            </label>

            {/* --- PREVIEW --- */}
            {recipe && usageM3 && unitVolume && (
                <div className="success" style={{ marginTop: 10 }}>
                    <strong>Arvutus</strong>
                    <div>1 tüki maht: {unitVolume.toFixed(4)} m³</div>
                    <div>Valmib: <b>{calculatedCount} tk</b></div>
                </div>
            )}

            <button
                className="main-button"
                style={{ marginTop: 20 }}
                disabled={!selectedStock || !recipe || !usageM3}
                onClick={submit}
            >
                Saada tootmisse
            </button>
        </div>
    );
}
