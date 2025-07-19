import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import ProjectRoutes from './projectRoute';
import 'bootstrap/dist/css/bootstrap.min.css';


// console.log(React);
// console.log(ReactDOM);

const root = ReactDOM.createRoot(document.getElementById('root'));





// console.log(root);

// root.render('Hemlo World');
// var userName  = 'paras';

// const element = <h1>Hello, world! {userName}</h1>;

// root.render(
//     //these are known as React fragmentation
//     <> 

//     <h1>Hemllo {userName}</h1>
//     {/* element */}
//     <hr />
//     <h2>Hello</h2>

//     </>
// );




root.render(<ProjectRoutes />);