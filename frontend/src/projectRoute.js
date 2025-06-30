import { BrowserRouter, Routes, Route } from "react-router";
import AddDonor from './components/Register'
import FindDonor from './components/FindDonor'
import App from "./components/App";
import Home from "./components/Home";

const projectRoute = (

    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />}>
                <Route path="home" element={<Home />}/>
                <Route path="add-donor" element={<AddDonor />}/>
                <Route path="find-donor" element={<FindDonor />}/>
            </Route>
        </Routes>
    </BrowserRouter>

);

export default projectRoute;