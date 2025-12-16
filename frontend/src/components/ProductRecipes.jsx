import { useEffect, useState } from "react";

export default function ProductRecipes({ onCreated }) {
    const [recipes, setRecipes] = useState([]);

    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");

    const [thickness, setThickness] = useState("");
    const [width, setWidth] = useState("");
    const [length, setLength] = useState("");

    const [error, setError] = useState("");

    /* -------- LOAD -------- */
    const load = async () => {
        const res = await fetch("http://localhost:8080/api/products");
        setRecipes(await res.json());
    };

    useEffect(() => {
        load();
    }, []);

    /* -------- CREATE -------- */
    const create = async () => {
        setError("");

        if (!name || !species || !thickness || !width || !length) {
            setError("Kõik väljad on kohustuslikud.");
            return;
        }

        const payload = {
            name,
            species,
            thicknessMm: Number(thickness),
            widthMm: Number(width),
            lengthMm: Number(length),
        };

        const res = await fetch("http://localhost:8080/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            setError("Saekava loomine ebaõnnestus.");
            return;
        }

        // reset
        setName("");
        setSpecies("");
        setThickness("");
        setWidth("");
        setLength("");

        load();
        onCreated?.(); // ⭐ oluline!
    };

    /* -------- CALC PREVIEW -------- */
    const pieceVolume =
        thickness && width && length
            ? (
                (thickness / 1000) *
                (width / 1000) *
                (length / 1000)
            ).toFixed(4)
            : null;

    const remove = async (id) => {
        if (!window.confirm("Kas oled kindel, et soovid saekava kustutada?")) {
            return;
        }

        const res = await fetch(`http://localhost:8080/api/products/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            setError("Saekava kustutamine ebaõnnestus.");
            return;
        }

        load();
        onCreated?.(); // uuendab ka SendToProductioni dropdowni
    };


    /* -------- UI -------- */
    return (
        <div className="form" style={{ marginTop: 40 }}>
            <h2>Saekava loomine</h2>

            <label>
                <span>Saekava nimi *</span>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="nt Lepp laud 69×222×6000"
                />
            </label>

            <label>
                <span>Puiduliik *</span>
                <input
                    value={species}
                    onChange={e => setSpecies(e.target.value)}
                    placeholder="nt lepp"
                />
            </label>

            <label>
                <span>Paksus (mm) *</span>
                <input
                    type="number"
                    value={thickness}
                    onChange={e => setThickness(e.target.value)}
                />
            </label>

            <label>
                <span>Laius (mm) *</span>
                <input
                    type="number"
                    value={width}
                    onChange={e => setWidth(e.target.value)}
                />
            </label>

            <label>
                <span>Pikkus (mm) *</span>
                <input
                    type="number"
                    value={length}
                    onChange={e => setLength(e.target.value)}
                />
            </label>

            {pieceVolume && (
                <div className="success" style={{ marginTop: 10 }}>
                    <strong>1 tüki maht:</strong> {pieceVolume} m³
                </div>
            )}

            {error && <div className="error">{error}</div>}

            <button type="button" className="main-button" onClick={create}>
                Salvesta saekava
            </button>

            {/* -------- LIST -------- */}
            <div style={{ marginTop: 30 }}>
                <h3>Olemasolevad saekavad</h3>

                <table style={{ width: "100%", marginTop: 10 }}>
                    <thead>
                    <tr>
                        <th align="left">Nimi</th>
                        <th>Puiduliik</th>
                        <th>Mõõdud (mm)</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {recipes.map(r => (
                        <tr key={r.id}>
                            <td>{r.name}</td>
                            <td align="center">{r.species}</td>
                            <td align="center">
                                {r.thicknessMm}×{r.widthMm}×{r.lengthMm}
                            </td>
                            <td align="right">
                                <button
                                    className="secondary-button"
                                    onClick={() => remove(r.id)}
                                >
                                    Kustuta
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
}
