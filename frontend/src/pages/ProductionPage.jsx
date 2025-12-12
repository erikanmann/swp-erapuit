import { useNavigate } from "react-router-dom";
import "../styles/delivery.css";
import "../styles/main.css";
import "../styles/warehouse.css";

import SendToProduction from "../components/SendToProduction";
import ProductRecipes from "../components/ProductRecipes";
import PackageBuilder from "../components/PackageBuilder";

export default function ProductionPage() {
    const navigate = useNavigate();

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
                <SendToProduction />
                <ProductRecipes />
                <PackageBuilder />
            </div>
        </div>
    );
}
