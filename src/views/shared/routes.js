import React from 'react'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import auth from '../../models/auth'
import Layout from './layout'
import Home from '../home/index'
import Login from '../user/login'
import Logout from '../user/logout'
import DocumentLayout from '../document/layout'
import DocumentIndex from '../document/index'

const authorize = (nextState, replace) => {
    // if (!auth.hasLogin()) {
    //     replace({
    //         pathname: '/user/login',
    //         state: { nextPathname: nextState.location.pathname }
    //     })
    // }
}

export default () => {
    return (
        <Router history={hashHistory}>
            <Route path='/' component={Layout}>
                <IndexRoute component={Home} onEnter={authorize} />
                <Route path='/document' component={DocumentLayout}>
                    <Route path='index' component={DocumentIndex} />
                </Route>
            </Route>
            <Route path='/user/'>
                <Route path='login' component={Login} />
                <Route path='logout' component={Logout} />
            </Route>
        </Router>
    )
}