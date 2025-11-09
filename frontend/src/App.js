import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import RegisterDeliveryPage from "./pages/RegisterDeliveryPage";
import "./styles/main.css";
import WarehouseDashboard from "./pages/WarehouseDashboard";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/register-delivery" element={<RegisterDeliveryPage />} />
                    <Route path="/warehouse" element={<WarehouseDashboard />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
