import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import RegisterDeliveryPage from "./pages/RegisterDeliveryPage";
import "./styles/main.css";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/register-delivery" element={<RegisterDeliveryPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
