import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import HomePage from './pages/HomePage';
import RegisterDeliveryPage from './pages/RegisterDeliveryPage';
import './styles/main.css';
import WarehouseDashboard from './pages/WarehouseDashboard';
import ProductionUsagePage from './pages/ProductionUsagePage';
import OutboundShippingPage from "./pages/OutboundShippingPage";
import DeliveryDetailPage from "./pages/DeliveryDetailPage";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/register-delivery" element={<RegisterDeliveryPage />} />
                    <Route path="/deliveries/:id" element={<DeliveryDetailPage />} />
                    <Route path="/warehouse" element={<WarehouseDashboard />} />
                    <Route path="/production-usage" element={<ProductionUsagePage />} />
                    <Route path="/outbound-shipping" element={<OutboundShippingPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
