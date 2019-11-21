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
                <Route exact path="/scan/:address" >
                    <Scan />
                </Route>
        </Router>
    );
}