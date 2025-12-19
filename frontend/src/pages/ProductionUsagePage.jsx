import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SendToProduction from "../components/SendToProduction";
import ProductRecipes from "../components/ProductRecipes";
import PackageBuilder from "../components/PackageBuilder";
import { tokenStorage } from "../api/authApi";

export default function ProductionUsagePage() {
    const [recipes, setRecipes] = useState([]);

    const loadRecipes = async () => {
        const token = tokenStorage.getToken();
        const res = await fetch("http://localhost:8080/api/products", {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
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
                    {/* ✅ TOOTMINE + SAAEKAVA */}
                    <SendToProduction recipes={recipes} />

                    {/* ✅ SAAEKAVA HALDUS */}
                    <ProductRecipes onCreated={loadRecipes} />

                    {/* ✅ PAKENDAMINE */}
                    <PackageBuilder />
                </div>
            </div>
        </>
    );
}
