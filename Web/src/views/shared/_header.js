import React from 'react'
import auth from '../../models/auth'
import { Menu, Icon, Popover } from 'antd'
import api from '../../models/api'
import utils from '../../utils'
import nav from '../shared/_nav'

import EditPasswordModal from '../user/editpassword'
import MessagePopover from '../message/_popover'

export default class TopNav extends React.Component {
    state = {
        current: '',
        headerNavData: nav.getHeaderNav(),
        currentUser: auth.getUser()
    };

    getNavItem = (item, key) => <Menu.Item key={item.name}>
        <i className={item.icon} />&nbsp;{item.text}
    </Menu.Item>

    getCurrentPathName = (path) => {
        var paths = path.substring(1).split('/');
        var name = paths[0];
        if (name === '') return ['feed'];

        return this.state.headerNavData.map(item => {
            if (item.name === name || (item.path || '').indexOf(path) === 0) {
                name = item.name;
                return item.name;
            }
            return null;
        });
    }

    handleMenuClick = e => {
        this.state.headerNavData.map(item => {
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
            <div><EditPasswordModal trigger={<a href="javascript:;"><Icon type="lock" /> 修改密码</a>} /></div>
            <div><a onClick={this.handleLogout}><Icon type="poweroff" /> 退出登录</a></div>
        </div>}
        trigger="hover">
        <span><Icon type="user" />{auth.getUser().RealName || 'Administrator'} </span>
    </Popover>

    render() {

        const names = this.getCurrentPathName(this.context.router.location.pathname);

        return <div className="navbar fixed">
            <Menu theme="dark" mode="horizontal" selectedKeys={names} onClick={this.handleMenuClick} className="left">
                {this.state.headerNavData.map((item, key) => this.getNavItem(item, key))}
            </Menu>
            <Menu theme="dark" mode="horizontal" className="right">
                <Menu.SubMenu title={<MessagePopover />} />
                <Menu.SubMenu title={this.getUserMenuRender()} />
            </Menu>
        </div>
    }
}

TopNav.contextTypes = {
    router: React.PropTypes.object,
}