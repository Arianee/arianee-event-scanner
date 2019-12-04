import React, { Component } from 'react'
import PickAddress from './pages/PickAddress';
import Scan from './pages/Scan';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom";

export default function App() {
    return (
        <Router>
                <Route exact path="/">
                    <PickAddress />
                </Route>
                <Route exact path="/scan/:address/:network" >
                    <Scan />
                </Route>
            <div className='img-arianee'><img src="https://static1.squarespace.com/static/5c489ebf7c9327393b1ab84b/t/5dadd630218aa17443cf2f91/1556807778012/icon-arianee-white.png"/> </div>
        </Router>
    );
}
