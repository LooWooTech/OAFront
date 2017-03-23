import React from 'react';
import { Link } from 'react-router';
//import auth from '../../models/auth';
//const currentUser = auth.getUser();
const sideMenuData = {
    feed: [
        { active: true, path: '/', icon: 'fa fa-comment', text: '全部动态' },
        { path: '?scope=my', icon: 'fa fa-comment-o', text: '我的动态' },
        { path: '?scope=star', icon: 'fa fa-star-o', text: '星标动态' },
    ],
    missive: [
        { active: true, path: '/missive/sendlist', icon: 'fa fa-send', text: '发文查询' },
        { path: '/missive/edit', icon: 'fa fa-pencil-square-o', text: '发文拟稿' },
        { path: '/missive/receivelist', icon: 'fa fa-envelope-open-o', text: '收文查询' },
    ],
    attendance: [
        { active: true, path: '/attendance/index', icon: 'fa fa-calendar-check-o', text: '考勤记录' },
        { path: '/attendance/history', icon: 'fa fa-history', text: '我的请假记录' },
        { path: '/attendance/leaves', icon: 'fa fa-list', text: '请假审批', role: 2 },
        { path: '/attendance/holidays', icon: 'fa fa-calendar', text: '节假日管理', role: 2 }
    ],
    system: [
        { active: true, path: '/system/config', icon: 'fa fa-gear', text: '参数配置' },
        { active: true, path: '/user/list', icon: 'fa fa-user', text: '用户管理' },
        { active: true, path: '/flow/list', icon: 'fa fa-flow', text: '流程管理' },
        { active: true, path: '/group/list', icon: 'fa fa-users', text: '群组管理' },
        { active: true, path: '/department/list', icon: 'fa fa-sitemap', text: '部门管理' },
        { active: true, path: '/category/list', icon: 'fa fa-list', text: '分类管理' },
    ]
};

const getSideMenuData = (path) => {
    for (var key in sideMenuData) {
        if (!sideMenuData.hasOwnProperty(key)) continue;
        var group = sideMenuData[key];
        for (var i = 0; i < group.length; i++) {
            var item = group[i];
            if (item.path.indexOf(path) === 0) {
                return sideMenuData[key];
            }
        }
    }
    return [];
}

const MenuItem = (menu, key) =>
    <Link key={key} onlyActiveOnIndex={menu.active} to={menu.path || menu.name} className='item' activeClassName='active'><i className={menu.icon} />&nbsp;{menu.text}</Link>

class Sider extends React.Component {

    render() {
        let menuData = getSideMenuData(this.props.pathname)
        return menuData.length > 0 ?
            <div id='sider' className='ui pointing secondary vertical menu'>
                {menuData.map((item, key) => MenuItem(item, key))}
            </div>
            : null
    }
}

export default Sider