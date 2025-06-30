import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import projectRoute from './projectRoute';

// console.log(React);
// console.log(ReactDOM);

const root = ReactDOM.createRoot(document.getElementById('root'));

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr" crossorigin="anonymous"></link>





// console.log(root);

// root.render('Hemlo World');
// var userName  = 'Prathmesh';

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




root.render(

   projectRoute

);