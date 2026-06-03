import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Register from '../pages/Register';
import VerifyCode from '../pages/VerifyCode';
import TaxiRequest from '../pages/TaxiRequest';
import DeliveryRequest from '../pages/DeliveryRequest';

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/verify" element={<VerifyCode />} />
                <Route path="/home" element={<Home />} />
                <Route path="/taxi" element={<TaxiRequest />} />
                <Route path="/delivery" element={<DeliveryRequest />} />
            </Routes>
        </BrowserRouter>
    );
}