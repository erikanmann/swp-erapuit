import { useEffect, useState } from "react";

export default function ProductRecipes() {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");
    const [error, setError] = useState("");

    const load = async () => {
        const res = await fetch("http://localhost:8080/api/products");
        setProducts(await res.json());
    };

    useEffect(() => {
        load();
    }, []);

    const create = async () => {
        setError("");
        if (!name || !species) {
            setError("Nimi ja puiduliik on kohustuslikud.");
            return;
        }

        const res = await fetch("http://localhost:8080/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, species })
        });

        if (!res.ok) {
            setError("Toote loomine ebaõnnestus.");
            return;
        }

        setName("");
        setSpecies("");
        load();
    };

    return (
        <div className="form" style={{ marginTop: 40 }}>
            <h2>Toodete / retseptide loomine</h2>

            <label>
                <span>Nimi *</span>
                <input value={name} onChange={e => setName(e.target.value)} />
            </label>

            <label>
                <span>Puiduliik *</span>
                <input value={species} onChange={e => setSpecies(e.target.value)} />
            </label>

            <button type="button" className="main-button" onClick={create}>
                Lisa retsept
            </button>

            {error && <div className="error">{error}</div>}

            <ul style={{ marginTop: 20 }}>
                {products.map(p => (
                    <li key={p.id}>{p.name} ({p.species})</li>
                ))}
            </ul>
        </div>
    );
}
