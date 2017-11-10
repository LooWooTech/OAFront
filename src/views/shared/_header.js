import React from 'react'
import auth from '../../models/auth'
import { Menu, Icon, Popover } from 'antd'
import api from '../../models/api'
import utils from '../../utils'

import EditPasswordModal from '../user/editpassword'
import MessagePopover from '../message/_popover'

const headerNavData = [
    { name: 'home', active: true, path: '/?scope=all', icon: 'fa fa-commenting', text: '动态' },
    { name: 'missive', path: `/missive/list/${api.Forms.Missive.ID}/?status=1`, icon: 'fa fa-file-o', text: '公文' },
    { name: 'attendance', icon: 'fa fa-calendar-check-o', text: '考勤' },
    { name: 'task', path: '/task/?status=1', icon: 'fa fa-clock-o', text: '任务' },
    { name: 'salary', path: '/salary', icon: 'fa fa-list', text: '工资单' },
    { name: 'salary', path: '/message', icon: 'fa fa-list', text: '消息' },
    { name: 'calendar', icon: 'fa fa-calendar', text: '日程' },
    { name: 'archive', icon: 'fa fa-tasks', text: '档案' },
    { name: 'meetingroom', icon: 'fa fa-television', text: '会议室' },
    { name: 'car', icon: 'fa fa-car', text: '车辆' },
    { name: 'seal', icon: 'fa fa-circle-o', text: '图章' },
    { name: 'system', path: '/user/list', icon: 'fa fa-gear', text: '系统设置', role: 3 }
];

const NavItem = (item, key) => {
    if (item.role > 0 && auth.getUser().Role !== item.role) {
        return;
    }
    return (
        <Menu.Item key={item.name}>
            <i className={item.icon} />&nbsp;{item.text}
        </Menu.Item>
    )
};

const getCurrentPathName = (path) => {
    var paths = path.substring(1).split('/');
    var name = paths[0];
    if (name === '') return ['home'];

    return headerNavData.map(item => {
        if (item.name === name || (item.path || '').indexOf(path) === 0) {
            name = item.name;
            return item.name;
        }
        return null;
    });
}

export default class TopNav extends React.Component {
    state = { current: '' };

    handleLeftMenuClick = e => {

        headerNavData.map(item => {
            if (item.name === e.key) {
                utils.Redirect(item.path || '/' + item.name);
                document.title = item.text
            }
            return null;
        })
    };

    handleLogout = () => {
        auth.logout();
        utils.Redirect('/user/login');
    };

    getUserMenuRender = () => <Popover
        content={<div className="user-menu">
            <div><EditPasswordModal trigger={<a href='#'><Icon type="lock" /> 修改密码</a>} /></div>
            <div><a onClick={this.handleLogout}><Icon type="poweroff" /> 退出登录</a></div>
        </div>}
        trigger="hover">
        <span><Icon type="user" />{auth.getUser().RealName || 'Administrator'} </span>
    </Popover>

    render() {

        const names = getCurrentPathName(this.context.router.location.pathname);

        return <div className="navbar fixed">
            <Menu theme="dark" mode="horizontal" selectedKeys={names} onClick={this.handleLeftMenuClick} className="left">
                {headerNavData.map((item, key) => NavItem(item, key))}
            </Menu>
            <Menu theme="dark" mode="horizontal" className="right" onClick={this.handleRightMenuClick}>
                <Menu.SubMenu title={<MessagePopover />} />
                <Menu.SubMenu title={this.getUserMenuRender()} />
            </Menu>
        </div>
    }
}

TopNav.contextTypes = {
    router: React.PropTypes.object,
}