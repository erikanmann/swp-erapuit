import React from "react";
import "../styles/delivery.css";
import "../styles/main.css";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
    const navigate = useNavigate();

    return (
        <div className="main-container">
            <div className="main-card">
                <h1>Erapuit lao süsteem</h1>
                <p>Moodulid</p>

                <div className="main-buttons">
                    <button onClick={() => navigate("/register-delivery")}>
                        Sissetuleva kauba registreerimine
                    </button>
                    <button disabled>Lao ülevaade ja jälgimine</button>
                    <button disabled>Väljuva kauba registreerimine</button>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
