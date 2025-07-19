import { BrowserRouter, Routes, Route } from "react-router-dom"; // <-- use react-router-dom here
import Register from "./components/Register";
import FindDonor from './components/FindDonor';
import Login from './components/Login';
import App from "./components/App";
import Home from "./components/Home";

const ProjectRoutes = () => (
  <BrowserRouter basename="/blood-donor-app">
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="register" element={<Register />} />
        <Route path="find-donor" element={<FindDonor />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default ProjectRoutes;