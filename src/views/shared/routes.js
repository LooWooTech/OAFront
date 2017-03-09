import React from 'react'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import auth from '../../models/auth'
import Layout from './_layout'
import Home from '../home/index'
import Login from '../user/login'
import Logout from '../user/logout'
import MissiveSendList from '../missive/send_list'
import MissiveEdit from '../missive/edit'

import UserList from '../user/list'
import GroupList from '../group/list'
import DepartmentList from '../department/list'
import CategoryList from '../category/list'
import SystemConfig from '../system/config'
import FlowList from '../flow/list'

import AttendanceIndex from '../attendance/index'
import HolidayList from '../attendance/holidays'
import LeaveList from '../attendance/leave_list'
import LeaveHistory from '../attendance/leave_history'


const authorize = (nextState, replace) => {
    if (!auth.hasLogin()) {
        console.log("未登录");
        replace({
            pathname: '/user/login',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}

export default () =>
    <Router history={hashHistory}>
        <Route path='/' component={Layout} onEnter={authorize}>
            <IndexRoute component={Home} />
            <Route path='missive/sendlist' component={MissiveSendList} />
            <Route path='missive/edit' component={MissiveEdit} />

            <Route path="attendance/index" component={AttendanceIndex} />
            <Route path="attendance/holidays" component={HolidayList} />
            <Route path="attendance/leavelist" component={LeaveList} />
            <Route path="attendance/history" component={LeaveHistory} />

            <Route userRole={3}>
                <Route path='system/config' component={SystemConfig} />
                <Route path='user/list' component={UserList} />
                <Route path='group/list' component={GroupList} />
                <Route path='category/list' component={CategoryList} />
                <Route path='department/list' component={DepartmentList} />
                <Route path='flow/list' component={FlowList} />
            </Route>
        </Route>
        <Route path='/user'>
            <Route path='login' component={Login} />
            <Route path='logout' component={Logout} />
        </Route>
    </Router>