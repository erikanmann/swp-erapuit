import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "../styles/delivery.css";
import "../styles/main.css";
import "../styles/warehouse.css";

import SendToProduction from "../components/SendToProduction";
import ProductRecipes from "../components/ProductRecipes";
import PackageBuilder from "../components/PackageBuilder";

export default function ProductionPage() {
    const navigate = useNavigate();

    const [recipes, setRecipes] = useState([]);

    // 🔹 LAE RETSEPTID
    const loadRecipes = async () => {
        const res = await fetch("http://localhost:8080/api/products");
        setRecipes(await res.json());
    };

    useEffect(() => {
        loadRecipes();
    }, []);

    return (
        <div className="delivery-page">
            <div className="warehouse-tabs">
                <button onClick={() => navigate("/home")}>Avaleht</button>
                <button onClick={() => navigate("/register-delivery")}>
                    Tarne registreerimine
                </button>
                <button onClick={() => navigate("/warehouse")}>Lao ülevaade</button>
                <button className="active-tab">Tootmine</button>
                <button onClick={() => navigate("/outbound-shipping")}>
                    Väljaminev kaup
                </button>
            </div>

            <div className="form-section">
                <SendToProduction recipes={recipes} />
                <ProductRecipes onCreated={loadRecipes} />
                <PackageBuilder />
            </div>
        </div>
    );
}
