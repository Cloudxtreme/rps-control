import React from 'react';
import { Router, Route } from 'react-router';

import Layout from './Layout.jsx';
import Home from './Home.jsx';

let Routes = React.createClass({
    render() {
        return(
            <Router>
                <Route component={Layout}>
                    <Route path="/" component={Home} />
                </Route>
            </Router>
        );
    }
});

module.exports = Routes;