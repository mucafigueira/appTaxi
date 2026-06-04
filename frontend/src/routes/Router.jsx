import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Register from '../pages/Register';
import TaxiRequest from '../pages/TaxiRequest';
import DeliveryRequest from '../pages/DeliveryRequest';
import DriverRegister from '../pages/DriverRegister';
import DriverPanel from '../pages/DriverPanel';
import DriverLogin from '../pages/DriverLogin';

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/home" element={<Home />} />
                <Route path="/taxi" element={<TaxiRequest />} />
                <Route path="/delivery" element={<DeliveryRequest />} />
                <Route path="/driver/register" element={<DriverRegister />} />
                <Route path="/driver/login" element={<DriverLogin />} />
                <Route path="/driver/panel" element={<DriverPanel />} />
            </Routes>
        </BrowserRouter>
    );
}