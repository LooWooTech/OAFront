import React from 'react';
import auth from '../../models/auth';
import { Affix, Menu, Icon, Badge } from 'antd';
import utils from '../../utils';

const headerNavData = [
    { name: 'home', active: true, path: '/', icon: 'fa fa-commenting', text: '动态' },
    { name: 'missive', icon: 'fa fa-file-o', text: '公文' },
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

export default class TopNav extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };

    state = { current: (this.context.router.location.pathname || 'home').replace('/', '') };
    handleLeftMenuClick = e => {
        if (this.state.current === e.key) {
            return false;
        }
        this.setState({ current: e.key });

        if (e.key === 'home') {
            utils.Redirect('/');
        } else {
            utils.Redirect('/' + e.key);
        }
    }
    render() {
        return (
            <Affix offsetTop={0}>
                <div className="navbar fixed">
                    <Menu theme="dark" mode="horizontal" selectedKeys={[this.state.current]} onClick={this.handleLeftMenuClick} className="left">
                        {headerNavData.map((item, key) => NavItem(item, key))}
                    </Menu>
                    <Menu theme="dark"  mode="horizontal" className="right">
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
                            <Menu.Item onClick={() => {
                                auth.logout();
                                utils.Redirect('/user/login');
                            }}>退出登录</Menu.Item>
                        </Menu.SubMenu>
                    </Menu>
                </div>
            </Affix>
        );
    }
}