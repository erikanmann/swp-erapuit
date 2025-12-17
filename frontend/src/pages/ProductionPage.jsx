import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "../styles/delivery.css";
import "../styles/main.css";
import "../styles/warehouse.css";

import Navbar from "../components/Navbar";
import SendToProduction from "../components/SendToProduction";
import ProductRecipes from "../components/ProductRecipes";
import PackageBuilder from "../components/PackageBuilder";
import { tokenStorage } from "../api/authApi";

export default function ProductionPage() {
    const navigate = useNavigate();

    const [recipes, setRecipes] = useState([]);

    // 🔹 LAE RETSEPTID
    const loadRecipes = async () => {
        const token = tokenStorage.getToken();
        const res = await fetch("http://localhost:8080/api/products", {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        setRecipes(await res.json());
    };

    useEffect(() => {
        loadRecipes();
    }, []);

    return (
        <>
            <Navbar />
            <div className="delivery-page">
                <div className="form-section">
                    <SendToProduction recipes={recipes} />
                    <ProductRecipes onCreated={loadRecipes} />
                    <PackageBuilder />
                </div>
            </div>
        </>
    );
}
