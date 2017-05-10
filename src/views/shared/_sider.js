import React from 'react';
import { Menu } from 'antd';
import auth from '../../models/auth';
import utils from '../../utils';

const sideMenuData = {
    feed: [
        {
            title: '动态', items: [
                { path: '/?scope=all', icon: 'fa fa-comment', text: '全部动态' },
                { path: '/?scope=my', icon: 'fa fa-comment-o', text: '我的动态' },
                { path: '/?scope=star', icon: 'fa fa-star-o', text: '星标动态' },
            ]
        }
    ],
    missive: [
        {
            title: '发文', items: [
                { path: '/missive/?status=1', icon: 'fa fa-envelope-open-o', text: '收件箱' },
                { path: '/missive/?status=2', icon: 'fa fa-send', text: '已办箱' },
                { path: '/missive/?status=0', icon: 'fa fa-envelope-o', text: '草稿箱' },
                { path: '/missive/?status=3', icon: 'fa fa-envelope', text: '完结箱' },
                { path: '/missive/?status=4', icon: 'fa fa-reply', text: '退回箱' },
            ]
        },
        {
            title: '收文', items: [
                { path: '/missive/receivelist', icon: 'fa fa-envelope-open-o', text: '收文查询' },
            ]
        }
    ],
    car: [
        {
            title: '申请', items: [
                { path: '/car/', icon: 'fa fa-car', text: '车辆查询' },
                { path: '/car/apply/{UserId}', icon: 'fa fa-inbox', text: '我的申请' }
            ]
        }, {
            title: '审批', role: 2, items: [
                { path: '/car/approvals', icon: 'fa fa-check', text: '申请审批' }
            ]
        }
    ],
    attendance: [
        {
            title: '考勤', items: [
                { path: '/attendance/index', icon: 'fa fa-calendar-check-o', text: '考勤记录' },
                { path: '/attendance/history', icon: 'fa fa-history', text: '我的请假记录' },
            ]
        },
        {
            title: '管理', role: 2, items: [
                { path: '/attendance/leaves', icon: 'fa fa-list', text: '请假审批', },
                { path: '/attendance/holidays', icon: 'fa fa-calendar', text: '节假日管理' }
            ]
        }
    ],
    system: [
        {
            title: '系统管理', role: 2, items: [
                { path: '/system/config', icon: 'fa fa-gear', text: '参数配置' },
                { path: '/user/list', icon: 'fa fa-user', text: '用户管理' },
                { path: '/flow/list', icon: 'fa fa-check-square-o', text: '流程管理' },
                { path: '/group/list', icon: 'fa fa-users', text: '群组管理' },
                { path: '/department/list', icon: 'fa fa-sitemap', text: '部门管理' },
                { path: '/jobtitle/list', icon: 'fa fa-vcard', text: '职称管理' },
                { path: '/category/list', icon: 'fa fa-list', text: '分类管理' },
            ]
        }
    ]
};

const getSideMenuData = (path) => {
    if (path === '/') {
        return sideMenuData['feed'];
    }
    for (var key in sideMenuData) {
        if (!sideMenuData.hasOwnProperty(key)) continue;
        var groups = sideMenuData[key];
        var selected = [];
        groups.map(group => group.items.map(item => {
            if (item.path.indexOf(path) === 0) {
                selected = groups;
            }
            return item;
        }));
        if (selected.length === 0) {
            if (path.replace('/', '').indexOf(key) === 0) {
                return groups;
            }
        }
        else {
            return selected;
        }
    }
    return [];
}

class Sider extends React.Component {

    handleMenuClick = (e, user) => {
        var item = e.item.props.item;
        if (this.props.pathname === item.path) {
            return false;
        }
        let path = item.path;
        path = item.path.replace('{UserId}', user.ID);

        utils.Redirect(path);
    };

    render() {
        const user = auth.getUser();
        const groups = getSideMenuData(this.props.pathname);
        const pathname = this.props.pathname;
        const search = this.props.search;
        const url = pathname + search;

        return groups.length > 0 ?
            <div id='sider'>
                <Menu onClick={e => this.handleMenuClick(e, user)} selectedKeys={[pathname, url]} >
                    {groups.map((group, key) => {
                        var show = true;// group.role && user.Role >= group.role;
                        return show ? <Menu.ItemGroup title={group.title || ''} key={key}>
                            {group.items.map((item, key) => {
                                var show = true//item.role && user.Role >= item.role;
                                return show ? <Menu.Item key={item.path} item={item}>
                                    <i className={item.icon} />&nbsp;{item.text}
                                </Menu.Item> : null
                            })}
                        </Menu.ItemGroup> : null
                    })}
                </Menu>
            </div>
            : <span></span>
    }
}

export default Sider