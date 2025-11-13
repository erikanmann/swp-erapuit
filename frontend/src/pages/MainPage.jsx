import React from "react";
import "../styles/delivery.css";
import "../styles/main.css";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
    const navigate = useNavigate();
    return (
        <div className="main-container">
            <div className="main-card">
                <h1>Erapuit lao- ja tootmissüsteem</h1>
                <p>Vali moodul:</p>
                <div className="main-buttons">
                    <button onClick={() => navigate("/home")}>Avaleht</button>
                    <button onClick={() => navigate("/register-delivery")}>
                        Tarne registreerimine
                    </button>
                    <button onClick={() => navigate("/warehouse")}>
                        Lao ülevaade ja jälgimine
                    </button>
                    <button onClick={() => navigate("/production-usage")}>
                        Tootmise materjalikasutus
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
