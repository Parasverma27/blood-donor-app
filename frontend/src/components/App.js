// component can be written in class or function.
// Component name should start with Captial Letter.
// components can be reused or can be isolated(standalone).
// component must return something.

// rfc --> shortcut for creating functional component

import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router";
import 'bootstrap/dist/css/bootstrap.min.css';

function App(){

    return (
        <>

            <Header />
            <Outlet />
            <Footer />

        </>
    );

};

export default App;