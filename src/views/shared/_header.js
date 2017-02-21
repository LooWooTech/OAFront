import React from 'react';
import { Link } from 'react-router';
import auth from '../../models/auth';
import { Menu, Dropdown, Icon } from 'antd';
import utils from '../../utils';

const headerNavData = [
    { name: 'home', active: true, path: '/', icon: 'fa fa-commenting', text: '动态' },
    { name: 'document', icon: 'fa fa-file-o', text: '公文' },
    { name: 'calendar', icon: 'fa fa-calendar', text: '日程' },
    { name: 'task', icon: 'fa fa-clock-o', text: '任务' },
    { name: 'news', icon: 'fa fa-newspaper-o', text: '信息' },
    { name: 'attendace', icon: 'fa fa-calendar-check-o', text: '考勤' },
    { name: 'archive', icon: 'fa fa-tasks', text: '档案' },
    { name: 'meeting', icon: 'fa fa-television', text: '会议' },
    { name: 'car', icon: 'fa fa-car', text: '车辆' },
    { name: 'file', icon: 'fa fa-files-o', text: '文档' },
];

const NavItem = (item, key) =>
    <Menu.Item key={item.name}>
        <i className={item.icon} />&nbsp;{item.text}
    </Menu.Item>;

const userMenu = <Menu>
    <Menu.Item>个人资料</Menu.Item>
    <Menu.Item>修改密码</Menu.Item>
    <Menu.Divider />
    <Menu.Item>通讯录</Menu.Item>
    <Menu.Item>消息设置</Menu.Item>
    <Menu.Divider />
    <Menu.Item onClick={() => {
        auth.logout();
        utils.Redirect('/user/login');
    }}>退出登录</Menu.Item>
</Menu>;

export default class TopNav extends React.Component {
    state = { current: 'home' };
    handleClick(e) {
        console.log('click ', e);
        this.setState({ current: e.key });
    }
    render() {
        return (
            <Menu  mode="horizontal" selectedKeys={[this.state.current]} onClick={e => this.handleClick(e)}>
                {headerNavData.map((item, key) => NavItem(item, key))}
                <Menu.SubMenu refs="nav-right" title={<span><Icon type="user" />&nbsp;{auth.getUser().Username}</span>}>
                    <Menu.Item key="setting:1">Option 1</Menu.Item>
                    <Menu.Item key="setting:2">Option 2</Menu.Item>
                </Menu.SubMenu>
            </Menu>
        );
    }
}