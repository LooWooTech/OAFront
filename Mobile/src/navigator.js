import { StackNavigator, TabNavigator, NavigationActions, StackRouter } from 'react-navigation'
import Welcome from './views/home/welcome'
import HomePage from './views/home/index'
import Search from './views/search/index'
import Settings from './views/home/settings'
import Messages from './views/message/index'
import MissvieList from './views/missive/index'
import MissiveDetail from './views/missive/detail'
import FilePreview from './views/file/preview'
import FreeFlowForm from './views/freeflow/form'
import FlowForm from './views/flow/form'
import SelectUser from './views/shared/SelectUser'

import TaskList from './views/task/index'
import TaskDetail from './views/task/detail'
import SubTaskDetail from './views/task/subTaskDetail'

import Attendance from './views/attendance/index'
import LeaveForm from './views/attendance/leave_form';

import MySalary from './views/salary/my';
import SalaryDetail from './views/salary/detail'

import Extend1List from './views/extend1/list'
import Extend1Check from './views/extend1/check_form'

import CarList from './views/car/index'
import CarApply from './views/car/apply'

import MeetingRoomList from './views/meetingroom/index'
import MeetingRoomApply from './views/meetingroom/apply'

import SealList from './views/seal/index'
import SealApply from './views/seal/apply'

import MailList from './views/mail/index'
import MailDetail from './views/mail/detail'
import MailForm from './views/mail/form'

export const RootNavigator = StackNavigator(
    {
        Welcome: { screen: Welcome },
        Index: { screen: HomePage },
        Messages: { screen: Messages },
        Settings: { screen: Settings },
        'Missive.List': { screen: MissvieList },
        'Missive.Detail': { screen: MissiveDetail },
        'File.Preview': { screen: FilePreview },
        'Flow.Form': { screen: FlowForm },
        'FreeFlow.Form': { screen: FreeFlowForm },
        'SelectUser': { screen: SelectUser },
        'Task.List': { screen: TaskList },
        'Task.Detail': { screen: TaskDetail },
        'SubTask.Detail': { screen: SubTaskDetail },
        'Attendance': { screen: Attendance },
        'Leave.Form': { screen: LeaveForm },
        'Extend1.List': { screen: Extend1List },
        'Extend1.Check': { screen: Extend1Check },
        'Salary.My': { screen: MySalary },
        'Salary.Detail': { screen: SalaryDetail },
        'Car.List': { screen: CarList },
        'Car.Apply': { screen: CarApply },
        'MeetingRoom.List': { screen: MeetingRoomList },
        'MeetingRoom.Apply': { screen: MeetingRoomApply },
        'Seal.List': { screen: SealList },
        'Seal.Apply': { screen: SealApply },
        'Mail.List': { screen: MailList },
        'Mail.Detail': { screen: MailDetail },
        'Mail.Form': { screen: MailForm },
    },
    {
        initialRouteName: 'Welcome',
        headerMode: 'none',
    }
)