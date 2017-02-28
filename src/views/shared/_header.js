import React from 'react';
import auth from '../../models/auth';
import { Affix, Menu, Icon, Badge } from 'antd';
import utils from '../../utils';

const headerNavData = [
    { name: 'home', active: true, path: '/', icon: 'fa fa-commenting', text: '动态' },
    { name: 'missive', path: '/missive/sendlist', icon: 'fa fa-file-o', text: '公文' },
    { name: 'calendar', icon: 'fa fa-calendar', text: '日程' },
    { name: 'task', icon: 'fa fa-clock-o', text: '任务' },
    { name: 'news', icon: 'fa fa-newspaper-o', text: '信息' },
    { name: 'attendace', icon: 'fa fa-calendar-check-o', text: '考勤' },
    { name: 'archive', icon: 'fa fa-tasks', text: '档案' },
    { name: 'meeting', icon: 'fa fa-television', text: '会议' },
    { name: 'car', icon: 'fa fa-car', text: '车辆' },
    { name: 'file', icon: 'fa fa-files-o', text: '文档' },
    { name: 'system', path: '/system/config', icon: 'fa fa-gear', text: '系统设置', role: 3 }
];

const NavItem = (item, key) => {
    //if (item.role > 0 && auth.getUser().Role !== item.role) {
    //    return;
    //}
    return (
        <Menu.Item key={item.name}>
            <i className={item.icon} />&nbsp;{item.text}
        </Menu.Item>
    )
};

const getCurrentPathName = (path) => {
    var name = path.substring(1);
    if (name === '') return 'home';
    headerNavData.map(item => {
        if ((item.path || '').indexOf(path) === 0) {
            name = item.name;
            return item;
        }
    });
    return name;
}

export default class TopNav extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };

    state = { current: (getCurrentPathName(this.context.router.location.pathname) || 'home').replace('/', '') };
    handleLeftMenuClick = e => {
        if (this.state.current === e.key) {
            return false;
        }
        this.setState({ current: e.key });
        headerNavData.map(item => {
            if (item.name === e.key) {
                utils.Redirect(item.path || '/' + item.name);
            }
        })
    };

    handleRightMenuClick = e => {
        switch (e.key) {
            case 'logout':
                auth.logout();
                utils.Redirect('/user/login');
                break;
            default:
                break;
        }
    };

    render() {
        return (
            <Affix offsetTop={0}>
                <div className="navbar fixed">
                    <Menu theme="dark" mode="horizontal" selectedKeys={[this.state.current]} onClick={this.handleLeftMenuClick} className="left">
                        {headerNavData.map((item, key) => NavItem(item, key))}
                    </Menu>
                    <Menu theme="dark" mode="horizontal" className="right" onClick={this.handleRightMenuClick}>
                        <Menu.Item>
                            <Badge count={5}>
                                <i className="fa fa-bell-o"></i>
                            </Badge>
                        </Menu.Item>
                        <Menu.SubMenu title={<span><Icon type="user" /> {auth.getUser().Username || 'Administrator'} </span>}>
                            <Menu.Item>个人资料</Menu.Item>
                            <Menu.Item>修改密码</Menu.Item>
                            <Menu.Divider />
                            <Menu.Item>通讯录</Menu.Item>
                            <Menu.Item>消息设置</Menu.Item>
                            <Menu.Divider />
                            <Menu.Item key="logout">退出登录</Menu.Item>
                        </Menu.SubMenu>
                    </Menu>
                </div>
            </Affix>
        );
    }
}