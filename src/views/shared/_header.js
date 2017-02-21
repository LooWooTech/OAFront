import React from 'react';
import { Link } from 'react-router';
import auth from '../../models/auth';
import { Menu, Dropdown } from 'semantic-ui-react';
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
    <Link key={key} onlyActiveOnIndex={item.active} to={item.path || item.name} activeClassName="active" className="item">
        <i className={item.icon} />&nbsp;{item.text}
    </Link>;

const userName = <span><i className="fa fa-user" />&nbsp;{auth.getUser().Username}</span>

export default () =>
    <Menu id="header" fixed="top" inverted>
        {headerNavData.map((item, key) => NavItem(item, key))}
        <Menu.Menu position="right">
            <Dropdown trigger={userName} pointing className="link item">
                <Dropdown.Menu>
                    <Dropdown.Item>个人资料</Dropdown.Item>
                    <Dropdown.Item>修改密码</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item>通讯录</Dropdown.Item>
                    <Dropdown.Item>消息设置</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => {
                        auth.logout();
                        utils.Redirect('/user/login');
                    }}>退出登录</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </Menu.Menu>
    </Menu>;