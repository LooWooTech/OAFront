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
import MissiveRedTitle from '../missive/red_title'

import CarIndex from '../car/index'
import CarList from '../car/list'

import MeetingRoomIndex from '../meetingroom/index'
import MeetingRoomList from '../meetingroom/list'

import SealIndex from '../seal/index'
import SealList from '../seal/list'

import Extend1ApplyList from '../forminfo_extend1/apply_list'
import Extend1ApprovalList from '../forminfo_extend1/approval_list'

import AttendanceIndex from '../attendance/index'
import HolidayList from '../attendance/holidays'

import FeedIndex from '../feed/index'


import TaskIndex from '../task/list'
import TaskEdit from '../task/edit'

import SalaryIndex from '../salary/list'

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
                <Route path="missive">
                    <Route path="list/:formId" component={MissiveList} />
                    <Route path="edit/:formId" component={MissiveEdit} />
                    <Route path='redtitle' component={MissiveRedTitle} />
                </Route>
                <Route path="salary">
                    <IndexRoute component={SalaryIndex} />
                </Route>
                <Route path="car">
                    <IndexRoute component={CarIndex} />
                    <Route path="list" component={CarList} />
                </Route>
                <Route path="meetingroom">
                    <IndexRoute component={MeetingRoomIndex} />
                    <Route path="list" component={MeetingRoomList} />
                </Route>
                <Route path="seal">
                    <IndexRoute component={SealIndex} />
                    <Route path="list" component={SealList} />
                </Route>
                <Route path="extend1">
                    <Route path="approvals/:formId" component={Extend1ApprovalList} />
                    <Route path="requests/:formId" component={Extend1ApplyList} />
                </Route>
                <Route path="task">
                    <IndexRoute component={TaskIndex} />
                    <Route path="edit" component={TaskEdit} />
                </Route>

                <Route path="attendance">
                    <IndexRoute component={AttendanceIndex} />
                    <Route path="holidays" component={HolidayList} />
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