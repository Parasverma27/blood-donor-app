import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Showcar() {

    var[apidata,setApidata] = useState([]);

    useEffect(()=>{
        console.log('component mounted');
        console.log('Api Call');
        axios.get('http://localhost:8080/api/donors')
        .then((result) =>{

            console.log(result);
            console.log(result.data);
            setApidata(result.data); //dispatcher function
        })
        .catch((err)=>{
            console.log(err);
        });
    },[]);


  return (
    <div className="container">
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Make</th>
                    <th scope="col">Model</th>
                    <th scope="col">Price</th>
                    <th scope="col">Year</th>
                </tr>
            </thead>
            <tbody>

                {
                    apidata && apidata.map(
                       value => 
                        <tr>
                            <td>{value.id}</td>
                            <td>{value.make}</td>
                            <td>{value.model}</td>
                            <td>{value.price}</td>
                            <td>{value.year}</td>
                        </tr>
                    )
                }
            </tbody>
        </table>
    </div>
  );
};
