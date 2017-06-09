import React from 'react'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import auth from '../../models/auth'
import Layout from './_layout'
import Login from '../user/login'
import Logout from '../user/logout'

import UserList from '../user/list'
import GroupList from '../group/list'
import DepartmentList from '../department/list'
import JobTitleList from '../jobtitle/list'
import CategoryList from '../category/list'
import SystemConfig from '../system/config'
import FlowList from '../flow/list'

import MissiveList from '../missive/list'
import MissiveEdit from '../missive/edit'

import CarIndex from '../car/index'
import MyApplyList from '../car/my_apply_list'
import ApplyList from '../car/apply_list'

import AttendanceIndex from '../attendance/index'
import HolidayList from '../attendance/holidays'
import LeaveList from '../attendance/leave_list'
import LeaveHistory from '../attendance/leave_history'

import FeedIndex from '../feed/index'


import TaskIndex from '../task/index'
import TaskEdit from '../task/edit'

const authorize = (nextState, replace) => {
    if (!auth.hasLogin()) {
        replace({
            pathname: '/user/login',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}

export default class Routes extends React.Component {
    render() {
        return <Router history={hashHistory}>
            <Route path='/' component={Layout} onEnter={authorize}>
                <IndexRoute component={FeedIndex} />
                <Route path="missive/:formId">
                    <IndexRoute component={MissiveList} />
                    <Route path="edit" component={MissiveEdit} />
                </Route>
                <Route path="car">
                    <IndexRoute component={CarIndex} />
                    <Route path="my" component={MyApplyList}/>
                    <Route path="approvals(/:userId)" component={ApplyList} />
                </Route>

                <Route path="task">
                    <IndexRoute component={TaskIndex} />
                    <Route path="edit" component={TaskEdit} />
                </Route>

                <Route path="attendance">
                    <IndexRoute component={AttendanceIndex} />
                    <Route path="holidays" component={HolidayList} />
                    <Route path="leaves" component={LeaveList} />
                    <Route path="history" component={LeaveHistory} />
                </Route>

                <Route userRole={3}>
                    <Route path='system/config' component={SystemConfig} />
                    <Route path='user/list' component={UserList} />
                    <Route path='group/list' component={GroupList} />
                    <Route path='category/list' component={CategoryList} />
                    <Route path='department/list' component={DepartmentList} />
                    <Route path='jobtitle/list' component={JobTitleList} />
                    <Route path='flow/list' component={FlowList} />
                </Route>
            </Route>
            <Route path='/user'>
                <Route path='login' component={Login} />
                <Route path='logout' component={Logout} />
            </Route>
        </Router>;
    }
}