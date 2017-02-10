import React from 'react'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import Layout from './layout.js'
import Home from '../home/index'
import Login from '../user/login'
import Logout from '../user/logout'
import auth from '../../models/auth'

const authorize = (nextState, replace) => {
    if (!auth.hasLogin()) {
        replace({
            pathname: '/login',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}

export default () => {
    return (
        <Router history={hashHistory}>
            <Route path='/' component={Layout}>
                <IndexRoute component={Home} onEnter={authorize} />
                <Route path='login' component={Login} />
                <Route path='logout' component={Logout} />
            </Route>
        </Router>
    )
}