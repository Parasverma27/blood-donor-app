import { BrowserRouter, Routes, Route } from "react-router";
import AddDonor from './components/Register';
import FindDonor from './components/FindDonor';
import App from "./components/App";
import Home from "./components/Home";

const projectRoute = (
 
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} /> {/* ✅ Added default route */}
        <Route path="home" element={<Home />} />
        <Route path="add-donor" element={<AddDonor />} />
        <Route path="find-donor" element={<FindDonor />} />
      </Route>
    </Routes>
);

export default projectRoute;
